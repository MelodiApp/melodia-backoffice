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
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Album,
  Favorite,
  Share,
  Bookmark,
  Refresh,
  PlayArrow,
  CheckCircle,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useAlbumMetrics } from '../../hooks/useMetrics'
import { LineChartCard, AreaChartCard, MultiLineChart, BarChartCard } from '../charts/ChartComponents'
import type { MetricsFilters } from '../../services/musicService'

interface AlbumMetricsProps {
  albumId: string
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

// Completion rate card
const CompletionRateCard: React.FC<{ rate: number; data: any[] }> = ({ rate, data }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.grey[900],
        border: `1px solid ${theme.palette.grey[800]}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CheckCircle sx={{ color: '#1db954', fontSize: 20 }} />
          <Typography variant="body2" color="grey.400">
            Tasa de Finalización Promedio
          </Typography>
        </Box>
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          {rate.toFixed(1)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={rate}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[700],
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#1db954',
            },
          }}
        />
        <Typography variant="body2" color="grey.500" sx={{ mt: 1 }}>
          {rate >= 80 ? 'Excelente' : rate >= 60 ? 'Bueno' : 'Necesita mejora'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const AlbumMetrics: React.FC<AlbumMetricsProps> = ({ albumId }) => {
  const theme = useTheme()
  const [filters, setFilters] = useState<MetricsFilters>({ period: 'monthly' })
  const { data: metrics, isLoading, error, refetch } = useAlbumMetrics(albumId, filters)

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
        Error cargando métricas del álbum. Por favor intenta de nuevo.
      </Alert>
    )
  }

  if (!metrics) return null

  // Combine all history data for multi-line chart
  const combinedData = metrics.playsHistory.map((item, index) => ({
    date: item.date,
    reproducciones: item.value,
    completitud: metrics.completionRateHistory[index]?.value || 0,
  }))

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
            {metrics.title}
          </Typography>
          <Typography variant="h6" color="grey.400">
            por {metrics.artist}
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
            title="Reproducciones Totales"
            value={Math.round(metrics.totalPlays / 1000)}
            trend={metrics.playsTrend}
            icon={<PlayArrow />}
            color="#1db954"
            suffix="K"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Likes Totales"
            value={Math.round(metrics.totalLikes / 1000)}
            trend={metrics.likesTrend}
            icon={<Favorite />}
            color="#e91e63"
            suffix="K"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Compartidas"
            value={metrics.totalShares}
            trend={metrics.sharesTrend}
            icon={<Share />}
            color="#2196f3"
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

      {/* Completion rate card */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <CompletionRateCard 
            rate={metrics.averageCompletionRate} 
            data={metrics.completionRateHistory}
          />
        </Grid>
        <Grid item xs={12} md={8}>
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
                    <TableCell sx={{ color: 'grey.400', border: 'none' }} align="right">% del Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.topTracks.map((track, index) => (
                    <TableRow key={track.songId} sx={{ '&:hover': { backgroundColor: 'grey.800' } }}>
                      <TableCell sx={{ color: 'white', border: 'none' }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }}>{track.title}</TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }} align="right">
                        {(track.plays / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell sx={{ color: 'white', border: 'none' }} align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                          <Typography variant="body2">
                            {track.percentage.toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={track.percentage}
                            sx={{
                              width: 40,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[700],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1db954',
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
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
              { dataKey: 'reproducciones', stroke: '#1db954', name: 'Reproducciones Diarias' },
              { dataKey: 'completitud', stroke: '#ff9800', name: 'Tasa de Finalización (%)' },
            ]}
          />
        </Grid>

        {/* Individual charts */}
        <Grid item xs={12} md={6}>
          <AreaChartCard
            title="Reproducciones Diarias"
            data={metrics.playsHistory}
            dataKey="value"
            height={300}
            strokeColor="#1db954"
            gradientId="playsGradient"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LineChartCard
            title="Tasa de Finalización"
            data={metrics.completionRateHistory}
            dataKey="value"
            height={300}
            strokeColor="#ff9800"
            gradientId="completionGradient"
          />
        </Grid>

        {/* Top tracks breakdown */}
        <Grid item xs={12}>
          <BarChartCard
            title="Distribución de Reproducciones por Canción"
            data={metrics.topTracks}
            dataKey="plays"
            nameKey="title"
            height={350}
            fillColor="#1db954"
          />
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
