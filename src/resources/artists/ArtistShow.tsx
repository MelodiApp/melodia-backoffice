import React from 'react';
import { useGetOne, Title } from 'react-admin';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Avatar, Divider, Grid, TextField, MenuItem, Stack, Button, IconButton } from '@mui/material';
import { Download } from '@mui/icons-material';
import { artistsService } from '../../services/artistsService';
import { useArtistMonthlyListeners, useArtistPlaysCount, useArtistSavedCollectionsCount, useArtistTopPlaylists, useArtistTopSongs } from '../../hooks/useMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../services/apiClient';

export default function ArtistShow() {
  const { id } = useParams();
  // Using react-admin data provider for resource 'artists'
  const { data: artist, isLoading: isArtistLoading } = useGetOne('artists', { id: String(id) }) as any;

  // Filter state for charts
  const [fromDate, setFromDate] = React.useState<string | undefined>(undefined);
  const [toDate, setToDate] = React.useState<string | undefined>(undefined);
  const [timeSlice, setTimeSlice] = React.useState<'hour' | 'day' | 'week' | 'month' | 'year'>('day');

  // Hook params
  const playsParams = { fromDate, toDate, timeSlice };
  const savedParams = { fromDate, toDate, timeSlice };
  const [monthlyYear, setMonthlyYear] = React.useState<number | undefined>(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = React.useState<number | undefined>(new Date().getMonth() + 1);

  // Hooks for metrics
  const { data: monthlyListenersData, loading: loadingMonthly, refetch: refetchMonthly, error: monthlyError } = useArtistMonthlyListeners(String(id), { year: monthlyYear, month: monthlyMonth });
  const { data: playsData, loading: loadingPlays, refetch: refetchPlays, error: playsError } = useArtistPlaysCount(String(id), playsParams);
  const { data: savedCounts, loading: loadingSaved, refetch: refetchSaved, error: savedError } = useArtistSavedCollectionsCount(String(id), savedParams);
  const { data: topPlaylists, loading: loadingPlaylists, refetch: refetchPlaylists, error: topPlaylistsError } = useArtistTopPlaylists(String(id), { limit: 10 });
  const { data: topSongs, loading: loadingTopSongs, refetch: refetchTopSongs, error: topSongsError } = useArtistTopSongs(String(id), { limit: 10 });

  // Normalize arrays for lists
  const playlistsArray: any[] = Array.isArray(topPlaylists) ? topPlaylists : (topPlaylists?.playlists ?? topPlaylists?.data ?? []);
  const topSongsArray: any[] = Array.isArray(topSongs) ? topSongs : (topSongs?.topSongs ?? topSongs?.data ?? []);

  // Debug logs for development to see what arrives from hooks
  if (import.meta.env.DEV) {
    console.debug('ArtistShow data debug:', {
      id,
      monthlyListenersData,
      playsData,
      savedCounts,
      playlistsArray,
      topSongsArray,
    });
  }

  let playlistsRendered: React.ReactNode;
  if (loadingPlaylists) playlistsRendered = <Typography>Loading...</Typography>;
  else if (topPlaylistsError) playlistsRendered = <Typography color="error">Error cargando playlists: {String(topPlaylistsError)}</Typography>;
  else if (!playlistsArray || playlistsArray.length === 0) playlistsRendered = <Typography>No data</Typography>;
  else playlistsRendered = playlistsArray.map((pl: any) => (
    <Box key={pl.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
      <Typography>{pl.title ?? pl.name}</Typography>
      <Typography>{pl.total_songs ?? pl.saves_count ?? pl.saves ?? '-'}</Typography>
    </Box>
  ));
  let topSongsRendered: React.ReactNode;
  if (loadingTopSongs) topSongsRendered = <Typography>Loading...</Typography>;
  else if (topSongsError) topSongsRendered = <Typography color="error">Error cargando top songs: {String(topSongsError)}</Typography>;
  else if (!topSongsArray || topSongsArray.length === 0) topSongsRendered = <Typography>No data</Typography>;
  else {
    const getPlays = (s: any) => Number(s.plays ?? s.playCount ?? s.count ?? s.plays_count ?? 0);
    const sorted = [...topSongsArray].sort((a: any, b: any) => getPlays(b) - getPlays(a));
    topSongsRendered = sorted.map((s: any) => (
      <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Box>
          <Typography>{s.title ?? s.name ?? s.songId ?? s.id}</Typography>
          <Typography sx={{ color: '#b3b3b3', fontSize: '0.8rem' }}>
            {Array.isArray(s.artists) ? s.artists.join(', ') : s.artists}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>{getPlays(s) || '-'}</Typography>
          <Typography sx={{ color: '#b3b3b3', fontSize: '0.8rem' }}>
            {typeof s.duration === 'number' ? `${Math.floor(s.duration/60)}:${String(Math.floor(s.duration%60)).padStart(2,'0')}` : s.duration ?? ''}
          </Typography>
        </Box>
      </Box>
    ));
  }

  // Fetch followers from admin endpoint via apiClient
  const [followersCount, setFollowersCount] = React.useState<number | null>(null);
  React.useEffect(() => {
    let mounted = true;
    async function fetchFollowers() {
      try {
        const res = await apiClient.get(`/admin/users/${id}/profile`);
        if (mounted) setFollowersCount(res.data?.followersCount ?? null);
      } catch (e) {
        console.error('Failed to fetch followers for', id, e);
        if (mounted) setFollowersCount(null);
      }
    }
    if (id) fetchFollowers();
    return () => { mounted = false };
  }, [id]);

  const normalizeSeries = (seriesInput: any) => {
    if (!seriesInput) return [];
    // Already an array (counts, monthlyListeners, plain array)
    if (Array.isArray(seriesInput)) return seriesInput;
    // Known shapes
    if (Array.isArray(seriesInput.counts)) return seriesInput.counts;
    if (Array.isArray(seriesInput.monthlyListeners)) return seriesInput.monthlyListeners;
    // If returned a single total
    if (typeof seriesInput.totalPlays === 'number') return [{ periodStart: 'total', count: seriesInput.totalPlays }];
    // If returned a single numeric value
    if (typeof seriesInput.value === 'number') return [{ periodStart: 'total', count: seriesInput.value }];
    // Fallback: try to find array property
    for (const key of Object.keys(seriesInput)) {
      if (Array.isArray(seriesInput[key])) return seriesInput[key];
    }
    return [];
  };

  // CSV Download Functions
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    if (!data || data.length === 0) {
      alert('No data available to download');
      return;
    }
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || row[header.toLowerCase()] || '-';
        // Escape commas and quotes
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTopSongsCSV = () => {
    const getPlays = (s: any) => Number(s.plays ?? s.playCount ?? s.count ?? s.plays_count ?? 0);
    const csvData = topSongsArray.map((song: any) => ({
      Title: song.title ?? song.name ?? song.songId ?? song.id,
      Artists: Array.isArray(song.artists) ? song.artists.join('; ') : song.artists,
      Plays: getPlays(song) || 0,
      Duration: typeof song.duration === 'number' 
        ? `${Math.floor(song.duration/60)}:${String(Math.floor(song.duration%60)).padStart(2,'0')}` 
        : song.duration ?? '',
    }));
    downloadCSV(csvData, `artist-${id}-top-songs.csv`, ['Title', 'Artists', 'Plays', 'Duration']);
  };

  const downloadTopPlaylistsCSV = () => {
    const csvData = playlistsArray.map((playlist: any) => ({
      Name: playlist.title ?? playlist.name,
      'Total Songs': playlist.total_songs ?? playlist.saves_count ?? playlist.saves ?? 0,
    }));
    downloadCSV(csvData, `artist-${id}-top-playlists.csv`, ['Name', 'Total Songs']);
  };

  const downloadPlaysDataCSV = () => {
    const normalized = normalizeSeries(playsData);
    const csvData = normalized.map((item: any) => ({
      Period: item.periodStart || `${item.year}-${String(item.month).padStart(2, '0')}` || item.date || item.label,
      Count: item.count || item.unique_listeners || item.uniqueListeners || item.value || item.total || 0,
    }));
    downloadCSV(csvData, `artist-${id}-plays-data.csv`, ['Period', 'Count']);
  };

  const renderLineChart = (series: any) => {
    const normalized = normalizeSeries(series);
    if (!normalized || normalized.length === 0) return <Typography>No data</Typography>;
    const dataForChart = normalized.map((s: any) => ({ x: s.periodStart || `${s.year}-${String(s.month).padStart(2, '0')}` || s.date || s.label, y: s.count || s.unique_listeners || s.uniqueListeners || s.value || s.total }));
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dataForChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#1db954" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Title title={artist?.name || 'Artist'} />
      <Card sx={{ mb: 3, backgroundColor: '#181818' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar src={artist?.profile_picture} sx={{ width: 80, height: 80 }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" sx={{ color: '#1db954' }}>{artist?.name}</Typography>
              <Typography sx={{ color: '#b3b3b3' }}>{artist?.bio}</Typography>
            </Grid>
            <Grid item sx={{ ml: 'auto' }}>
              <Typography sx={{ color: '#b3b3b3' }}>Followers</Typography>
              <Typography variant="h6" sx={{ color: '#fff' }}>{followersCount ?? '-'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters section */}
      <Card sx={{ mb: 3, backgroundColor: '#181818' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Desde"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate ?? ''}
              onChange={(e) => setFromDate(e.target.value || undefined)}
              sx={{ maxWidth: 200 }}
            />
            <TextField
              label="Hasta"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate ?? ''}
              onChange={(e) => setToDate(e.target.value || undefined)}
              sx={{ maxWidth: 200 }}
            />
            <TextField
              label="Time Slice"
              select
              value={timeSlice}
              onChange={(e) => setTimeSlice(e.target.value as any)}
              sx={{ maxWidth: 200 }}
            >
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </TextField>
            <TextField
              label="Year"
              type="number"
              value={monthlyYear ?? ''}
              onChange={(e) => setMonthlyYear(e.target.value ? Number(e.target.value) : undefined)}
              sx={{ width: 120 }}
            />
            <TextField
              label="Month"
              select
              value={monthlyMonth ?? ''}
              onChange={(e) => setMonthlyMonth(e.target.value ? Number(e.target.value) : undefined)}
              sx={{ width: 140 }}
            >
              <MenuItem value="">All</MenuItem>
              {[...Array(12)].map((_v, i) => (
                <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={() => { refetchPlays(); refetchSaved(); refetchMonthly(); refetchPlaylists(); refetchTopSongs(); }}>
              Aplicar
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => { setFromDate(undefined); setToDate(undefined); setTimeSlice('day'); setMonthlyYear(new Date().getFullYear()); setMonthlyMonth(new Date().getMonth() + 1); }}>
              Limpiar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#181818', minHeight: 200 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1db954' }}>Monthly Listeners</Typography>
              {loadingMonthly ? (
                <Typography>Loading...</Typography>
              ) : monthlyError ? (
                <Typography color="error">Error loading monthly listeners: {String(monthlyError)}</Typography>
              ) : (
                <Box>
                  <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                    {(() => {
                      if (!monthlyListenersData) return '-';
                      // The response structure is: { artistId, year, month, monthlyListeners: [{ year, month, uniqueListeners }] }
                      if (monthlyListenersData.monthlyListeners && Array.isArray(monthlyListenersData.monthlyListeners)) {
                        const total = monthlyListenersData.monthlyListeners.reduce((sum: number, item: any) => sum + (item.uniqueListeners || item.unique_listeners || 0), 0);
                        return total > 0 ? total : '-';
                      }
                      return '-';
                    })()}
                  </Typography>
                  <Typography sx={{ color: '#b3b3b3' }}>
                    {monthlyMonth ? `${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}` : `Year ${monthlyYear}`}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1db954' }}>Plays (per period)</Typography>
                {!loadingPlays && playsData && (
                  <IconButton 
                    onClick={downloadPlaysDataCSV}
                    size="small" 
                    sx={{ color: '#1db954' }}
                    title="Download CSV"
                  >
                    <Download />
                  </IconButton>
                )}
              </Box>
              {loadingPlays ? <Typography>Loading...</Typography> : renderLineChart(playsData)}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#181818', minHeight: 200 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1db954' }}>Saved Collections</Typography>
              {loadingSaved ? (
                <Typography>Loading...</Typography>
              ) : savedError ? (
                <Typography color="error">Error cargando saved collections: {String(savedError)}</Typography>
              ) : (
                <Typography variant="h4">{
                  savedCounts?.total ??
                  (Array.isArray(savedCounts?.counts) ? savedCounts.counts.reduce((acc: number, cur: any) => acc + (cur.count || 0), 0) : undefined) ??
                  savedCounts?.totalSaves ??
                  '-'
                }</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1db954' }}>Top Playlists</Typography>
                {!loadingPlaylists && playlistsArray && playlistsArray.length > 0 && (
                  <IconButton 
                    onClick={downloadTopPlaylistsCSV}
                    size="small" 
                    sx={{ color: '#1db954' }}
                    title="Download CSV"
                  >
                    <Download />
                  </IconButton>
                )}
              </Box>
              {playlistsRendered}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1db954' }}>Top Songs</Typography>
                {!loadingTopSongs && topSongsArray && topSongsArray.length > 0 && (
                  <IconButton 
                    onClick={downloadTopSongsCSV}
                    size="small" 
                    sx={{ color: '#1db954' }}
                    title="Download CSV"
                  >
                    <Download />
                  </IconButton>
                )}
              </Box>
              {topSongsRendered}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
