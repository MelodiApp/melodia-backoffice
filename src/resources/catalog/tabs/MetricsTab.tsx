import React, { useMemo, useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, ToggleButton, ToggleButtonGroup, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useSongPlaysCount, useCollectionPlaysCount, useSongLikesCount, useCollectionLikesCount } from '../../../hooks';
import type { TimeSlice } from '../../../hooks';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export function MetricsTab({ item }: { item?: any }) {
  const [mode, setMode] = useState<'song' | 'collection'>(item?.type === 'collection' ? 'collection' : 'song');
  const [id, setId] = useState<string>(item?.id || item?.song_id || item?.collection_id || '');
  const defaultTo = new Date();
  const defaultFrom = new Date(defaultTo.getTime() - 1000 * 60 * 60 * 24 * 30);
  const [fromDate, setFromDate] = useState<string>(defaultFrom.toISOString().slice(0, 10));
  const [toDate, setToDate] = useState<string>(defaultTo.toISOString().slice(0, 10));
  const [timeSlice, setTimeSlice] = useState<TimeSlice>('day');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box sx={{ p: 2 }}>
      {!item && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)}>
            <ToggleButton value="song">Song</ToggleButton>
            <ToggleButton value="collection">Collection</ToggleButton>
          </ToggleButtonGroup>

          <TextField placeholder={mode === 'song' ? 'Song ID' : 'Collection ID'} value={id} onChange={(e) => setId(e.target.value)} size="small" />

          <TextField type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} size="small" />
          <TextField type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} size="small" />

          <FormControl size="small">
            <InputLabel id="timeslice-label">Time Slice</InputLabel>
            <Select labelId="timeslice-label" value={timeSlice} label="Time Slice" onChange={(e) => setTimeSlice(e.target.value as TimeSlice)}>
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => setRefreshKey((k) => k + 1)}>Fetch</Button>
        </Box>
      )}

      {item ? (
        item.type === 'song' ? (
          <SongMetrics itemId={String(item.id || item.song_id)} defaultFrom={fromDate} defaultTo={toDate} defaultTimeSlice={timeSlice} readOnlyId refreshKey={refreshKey} />
        ) : (
          <CollectionMetrics itemId={String(item.id || item.collection_id)} defaultFrom={fromDate} defaultTo={toDate} defaultTimeSlice={timeSlice} readOnlyId refreshKey={refreshKey} />
        )
      ) : (
        mode === 'song' ? (
          <SongMetrics itemId={id} defaultFrom={fromDate} defaultTo={toDate} defaultTimeSlice={timeSlice} readOnlyId={false} refreshKey={refreshKey} />
        ) : (
          <CollectionMetrics itemId={id} defaultFrom={fromDate} defaultTo={toDate} defaultTimeSlice={timeSlice} readOnlyId={false} refreshKey={refreshKey} />
        )
      )}
    </Box>
  );
}

export default MetricsTab;

// Small helpers to compute totals and normalize arrays
const countsTotal = (input: any) => {
  if (!input) return undefined;
  if (typeof input.count === 'number') return input.count;
  const arr = Array.isArray(input) ? input : (input.counts || []);
  return arr.reduce((acc: number, cur: any) => acc + (cur.count || cur.value || 0), 0);
};

function SongMetrics({ itemId, defaultFrom, defaultTo, defaultTimeSlice, readOnlyId, refreshKey }: { itemId?: string | null; defaultFrom: string; defaultTo: string; defaultTimeSlice: TimeSlice; readOnlyId?: boolean; refreshKey?: number; }) {
  const [fromDate, setFromDate] = useState<string>(defaultFrom);
  const [toDate, setToDate] = useState<string>(defaultTo);
  const [timeSlice, setTimeSlice] = useState<TimeSlice>(defaultTimeSlice);
  const [localId, setLocalId] = useState<string>(itemId || '');
  useEffect(() => { setLocalId(itemId || ''); }, [itemId]);

  const { data: playsData, loading: playsLoading, error: playsError, refetch: refetchPlays } = useSongPlaysCount(localId || null, { fromDate, toDate, timeSlice });
  const { data: likesData, loading: likesLoading, error: likesError, refetch: refetchLikes } = useSongLikesCount(localId || null, { fromDate, toDate, timeSlice });
  useEffect(() => { if (refreshKey !== undefined && localId) { refetchPlays(); refetchLikes(); } }, [refreshKey]);

  const timeseries = useMemo(() => {
    const playsArr = Array.isArray(playsData) ? playsData : (playsData?.counts || []);
    const likesArr = Array.isArray(likesData) ? likesData : (likesData?.counts || []);
    const map: Record<string, { plays?: number; likes?: number }> = {};
    playsArr.forEach((p: any) => {
      const t = p.periodStart || p.period || p.date || p.from;
      map[t] = map[t] || {};
      map[t].plays = (map[t].plays || 0) + (p.count || p.value || p.playCount || 0);
    });
    likesArr.forEach((p: any) => {
      const t = p.periodStart || p.period || p.date || p.from;
      map[t] = map[t] || {};
      map[t].likes = (map[t].likes || 0) + (p.count || p.value || 0);
    });
    return Object.keys(map).sort().map((k) => ({ time: k, plays: map[k].plays || 0, likes: map[k].likes || 0 }));
  }, [playsData, likesData, fromDate, toDate]);

  const totalPlays = useMemo(() => countsTotal(playsData), [playsData]);
  const totalLikes = useMemo(() => countsTotal(likesData), [likesData]);
  const loading = playsLoading || likesLoading;
  const error = (playsError || likesError) as string | null;

  return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Song Metrics</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#b3b3b3' }}>Plays for song ID {itemId || '—'}</Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <TextField placeholder="Song ID" value={localId} onChange={(e) => setLocalId(e.target.value)} disabled={!!readOnlyId} size="small" />
          <TextField type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} size="small" />
          <TextField type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} size="small" />
          <FormControl size="small">
            <InputLabel id="song-timeslice-label">Time Slice</InputLabel>
            <Select labelId="song-timeslice-label" value={timeSlice} label="Time Slice" onChange={(e) => setTimeSlice(e.target.value as TimeSlice)}>
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => { refetchPlays(); refetchLikes(); }}>Fetch</Button>
        </Box>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress sx={{ color: '#1db954' }} /></Box>}
        {error && <Alert severity="error">Error loading metrics: {error}</Alert>}

        {typeof totalPlays === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Total plays</Typography>
            <Typography variant="h6">{totalPlays}</Typography>
          </Box>
        )}
        {typeof totalLikes === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Total likes</Typography>
            <Typography variant="h6">{totalLikes}</Typography>
          </Box>
        )}

        <Box sx={{ height: 300 }}>
          {timeseries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="plays" stroke="#8884d8" name="Plays" />
                <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            !loading && <Typography>No timeseries data available</Typography>
          )}
        </Box>
       
      </CardContent>
    </Card>
  );
}

function CollectionMetrics({ itemId, defaultFrom, defaultTo, defaultTimeSlice, readOnlyId, refreshKey }: { itemId?: string | null; defaultFrom: string; defaultTo: string; defaultTimeSlice: TimeSlice; readOnlyId?: boolean; refreshKey?: number; }) {
  const [fromDate, setFromDate] = useState<string>(defaultFrom);
  const [toDate, setToDate] = useState<string>(defaultTo);
  const [timeSlice, setTimeSlice] = useState<TimeSlice>(defaultTimeSlice);
  const [localId, setLocalId] = useState<string>(itemId || '');
  useEffect(() => { setLocalId(itemId || ''); }, [itemId]);

  const { data: playsData, loading: playsLoading, error: playsError, refetch: refetchPlays } = useCollectionPlaysCount(localId || null, { fromDate, toDate, timeSlice });
  const { data: likesData, loading: likesLoading, error: likesError, refetch: refetchLikes } = useCollectionLikesCount(localId || null, { fromDate, toDate, timeSlice });
  useEffect(() => { if (refreshKey !== undefined && localId) { refetchPlays(); refetchLikes(); } }, [refreshKey]);

  const timeseries = useMemo(() => {
    const playsArr = Array.isArray(playsData) ? playsData : (playsData?.counts || []);
    const likesArr = Array.isArray(likesData) ? likesData : (likesData?.counts || []);
    const map: Record<string, { plays?: number; likes?: number }> = {};
    playsArr.forEach((p: any) => {
      const t = p.periodStart || p.period || p.date || p.from;
      map[t] = map[t] || {};
      map[t].plays = (map[t].plays || 0) + (p.count || p.value || p.playCount || 0);
    });
    likesArr.forEach((p: any) => {
      const t = p.periodStart || p.period || p.date || p.from;
      map[t] = map[t] || {};
      map[t].likes = (map[t].likes || 0) + (p.count || p.value || 0);
    });
    return Object.keys(map).sort().map((k) => ({ time: k, plays: map[k].plays || 0, likes: map[k].likes || 0 }));
  }, [playsData, likesData, fromDate, toDate]);

  const totalPlays = useMemo(() => countsTotal(playsData), [playsData]);
  const totalLikes = useMemo(() => countsTotal(likesData), [likesData]);
  const loading = playsLoading || likesLoading;
  const error = (playsError || likesError) as string | null;

  return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Collection Metrics</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#b3b3b3' }}>Plays for collection ID {itemId || '—'}</Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <TextField placeholder="Collection ID" value={localId} onChange={(e) => setLocalId(e.target.value)} disabled={!!readOnlyId} size="small" />
          <TextField type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} size="small" />
          <TextField type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} size="small" />
          <FormControl size="small">
            <InputLabel id="collection-timeslice-label">Time Slice</InputLabel>
            <Select labelId="collection-timeslice-label" value={timeSlice} label="Time Slice" onChange={(e) => setTimeSlice(e.target.value as TimeSlice)}>
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => { refetchPlays(); refetchLikes(); }}>Fetch</Button>
        </Box>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress sx={{ color: '#1db954' }} /></Box>}
        {error && <Alert severity="error">Error loading metrics: {error}</Alert>}

        {typeof totalPlays === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Total plays</Typography>
            <Typography variant="h6">{totalPlays}</Typography>
          </Box>
        )}
        {typeof totalLikes === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Total likes</Typography>
            <Typography variant="h6">{totalLikes}</Typography>
          </Box>
        )}

        <Box sx={{ height: 300 }}>
          {timeseries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="plays" stroke="#8884d8" name="Plays" />
                <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            !loading && <Typography>No timeseries data available</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
    );
  }
