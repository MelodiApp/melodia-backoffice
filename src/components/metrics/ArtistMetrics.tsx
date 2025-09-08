import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Person,
  Favorite,
  Share,
  Bookmark,
  Refresh,
  MusicNote,
  Public,
  PlaylistPlay,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useArtistMetrics } from '../../hooks/useMetrics'
import { LineChartCard, AreaChartCard, MultiLineChart, BarChartCard } from '../charts/ChartComponents'
import type { MetricsFilters } from '../../services/musicService'

interface ArtistMetricsProps {
  artistId: string
}

// Metric card component
interface MetricCardProps {
  title: string
  value: number
  trend: number
  icon: React.ReactNode
  color: string
  suffix?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, color, suffix = '' }) => {
  const theme = useTheme()
  const isPositive = trend >= 0

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.grey[900],
        border: `1px solid ${theme.palette.grey[800]}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 32px rgba(29, 185, 84, 0.2)`,
          border: `1px solid ${color}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ color, fontSize: 20 }}>{icon}</Box>
            <Typography variant="body2" color="grey.400">
              {title}
            </Typography>
          </Box>
          <Chip
            size="small"
            icon={isPositive ? <TrendingUp /> : <TrendingDown />}
            label={`${isPositive ? '+' : ''}${trend.toFixed(1)}%`}
            sx={{
              backgroundColor: isPositive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
              color: isPositive ? '#4caf50' : '#f44336',
              '& .MuiChip-icon': {
                color: isPositive ? '#4caf50' : '#f44336',
              },
            }}
          />
        </Box>
        <Typography variant="h4" color="white" fontWeight="bold">
          {value.toLocaleString()}{suffix}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const ArtistMetrics: React.FC<ArtistMetricsProps> = ({ artistId }) => {
  const theme = useTheme()
  const [filters, setFilters] = useState<MetricsFilters>({ period: 'monthly' })
  const { data: metrics, isLoading, error, refetch } = useArtistMetrics(artistId, filters)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress sx={{ color: '#1db954' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error cargando métricas del artista. Por favor intenta de nuevo.
      </Alert>
    )
  }

  if (!metrics) return null

  // Combine all history data for multi-line chart
  const combinedData = metrics.listenersHistory.map((item, index) => ({
    date: item.date,
    oyentes: item.value,
    seguidores: metrics.followersHistory[index]?.value || 0,
    reproducciones: Math.round((metrics.playsHistory[index]?.value || 0) / 1000), // Scale down for better visualization
  }))

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
            {metrics.artistName}
          </Typography>
          <Typography variant="h6" color="grey.400">
            Métricas del Artista
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'grey.400' }}>Período</InputLabel>
            <Select
              value={filters.period}
              label="Período"
              onChange={(e) => setFilters({ ...filters, period: e.target.value as any })}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'grey.700',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1db954',
                },
              }}
            >
              <MenuItem value="daily">Diario</MenuItem>
              <MenuItem value="weekly">Semanal</MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={() => refetch()}
            sx={{
              color: '#1db954',
              backgroundColor: 'rgba(29, 185, 84, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(29, 185, 84, 0.2)',
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Metric cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Oyentes Mensuales"
            value={metrics.monthlyListeners}
            trend={metrics.monthlyListenersTrend}
            icon={<Person />}
            color="#1db954"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Seguidores"
            value={metrics.followers}
            trend={metrics.followersTrend}
            icon={<Favorite />}
            color="#e91e63"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Reproducciones"
            value={Math.round(metrics.totalPlays / 1000000)}
            trend={metrics.playsTrend}
            icon={<MusicNote />}
            color="#2196f3"
            suffix="M"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Guardadas"
            value={Math.round(metrics.totalSaves / 1000)}
            trend={metrics.savesTrend}
            icon={<Bookmark />}
            color="#ff9800"
            suffix="K"
          />
        </Grid>
      </Grid>

      {/* Charts section */}
      <Grid container spacing={3}>
        {/* Multi-line overview chart */}
        <Grid item xs={12}>
          <MultiLineChart
            title="Evolución de Métricas - Últimos 30 días"
            data={combinedData}
            height={400}
            lines={[
              { dataKey: 'oyentes', stroke: '#1db954', name: 'Oyentes Mensuales' },
              { dataKey: 'seguidores', stroke: '#e91e63', name: 'Seguidores' },
              { dataKey: 'reproducciones', stroke: '#2196f3', name: 'Reproducciones (Miles)' },
            ]}
          />
        </Grid>

        {/* Individual charts */}
        <Grid item xs={12} md={6}>
          <AreaChartCard
            title="Oyentes Mensuales"
            data={metrics.listenersHistory}
            dataKey="value"
            height={300}
            strokeColor="#1db954"
            gradientId="listenersGradient"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LineChartCard
            title="Seguidores"
            data={metrics.followersHistory}
            dataKey="value"
            height={300}
            strokeColor="#e91e63"
            gradientId="followersGradient"
          />
        </Grid>

        {/* Top songs table */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: theme.palette.grey[900],
              borderRadius: 2,
              border: `1px solid ${theme.palette.grey[800]}`,
            }}
          >
            <Typography variant="h6" color="white" gutterBottom>
              Canciones Más Populares
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }}>#</TableCell>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }}>Canción</TableCell>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }} align="right">Reproducciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.topSongs.map((song, index) => (
                    <TableRow key={song.songId} sx={{ '&:hover': { backgroundColor: 'grey.800' } }}>
                      <TableCell sx={{ color: 'white', border: 'none' }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }}>{song.title}</TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }} align="right">
                        {(song.plays / 1000000).toFixed(1)}M
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top markets */}
        <Grid item xs={12} md={6}>
          <BarChartCard
            title="Principales Mercados"
            data={metrics.topMarkets}
            dataKey="plays"
            nameKey="countryName"
            height={300}
            fillColor="#1db954"
          />
        </Grid>

        {/* Top playlists table */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: theme.palette.grey[900],
              borderRadius: 2,
              border: `1px solid ${theme.palette.grey[800]}`,
            }}
          >
            <Typography variant="h6" color="white" gutterBottom>
              Playlists Principales
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PlaylistPlay />
                        Playlist
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }}>Propietario</TableCell>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }} align="right">Inclusiones</TableCell>
                    <TableCell sx={{ color: 'grey.400', border: 'none' }} align="right">Reproducciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.topPlaylists.map((playlist) => (
                    <TableRow key={playlist.playlistId} sx={{ '&:hover': { backgroundColor: 'grey.800' } }}>
                      <TableCell sx={{ color: 'white', border: 'none' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {playlist.playlistName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'grey.400', border: 'none' }}>
                        {playlist.playlistOwner}
                      </TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }} align="right">
                        {playlist.inclusions}
                      </TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }} align="right">
                        {(playlist.totalPlays / 1000000).toFixed(1)}M
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Last updated */}
      <Box mt={3} textAlign="center">
        <Typography variant="body2" color="grey.500">
          Última actualización: {new Date(metrics.lastUpdated).toLocaleString('es')}
        </Typography>
      </Box>
    </Box>
  )
}
