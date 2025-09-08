import React, { useState } from 'react'
import {
  Box,
  Grid,
  Paper,
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
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  PlayArrow,
  Favorite,
  Share,
  Bookmark,
  Refresh,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useSongMetrics } from '../../hooks/useMetrics'
import { LineChartCard, AreaChartCard, MultiLineChart, BarChartCard, PieChartCard } from '../charts/ChartComponents'
import type { MetricsFilters } from '../../services/musicService'

interface SongMetricsProps {
  songId: string
}

// Metric card component
interface MetricCardProps {
  title: string
  value: number
  trend: number
  icon: React.ReactNode
  color: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, color }) => {
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
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const SongMetrics: React.FC<SongMetricsProps> = ({ songId }) => {
  const theme = useTheme()
  const [filters, setFilters] = useState<MetricsFilters>({ period: 'monthly' })
  const { data: metrics, isLoading, error, refetch } = useSongMetrics(songId, filters)

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
        Error cargando métricas de la canción. Por favor intenta de nuevo.
      </Alert>
    )
  }

  if (!metrics) return null

  // Combine all history data for multi-line chart
  const combinedData = metrics.playsHistory.map((item, index) => ({
    date: item.date,
    reproducciones: item.value,
    likes: metrics.likesHistory[index]?.value || 0,
    compartidas: metrics.sharesHistory[index]?.value || 0,
    guardadas: metrics.savesHistory[index]?.value || 0,
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
            por {metrics.artist} • {metrics.album}
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
            title="Reproducciones"
            value={metrics.plays}
            trend={metrics.playsTrend}
            icon={<PlayArrow />}
            color="#1db954"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Likes"
            value={metrics.likes}
            trend={metrics.likesTrend}
            icon={<Favorite />}
            color="#e91e63"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Compartidas"
            value={metrics.shares}
            trend={metrics.sharesTrend}
            icon={<Share />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Guardadas"
            value={metrics.saves}
            trend={metrics.savesTrend}
            icon={<Bookmark />}
            color="#ff9800"
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
              { dataKey: 'reproducciones', stroke: '#1db954', name: 'Reproducciones' },
              { dataKey: 'likes', stroke: '#e91e63', name: 'Likes' },
              { dataKey: 'compartidas', stroke: '#2196f3', name: 'Compartidas' },
              { dataKey: 'guardadas', stroke: '#ff9800', name: 'Guardadas' },
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
            title="Likes Diarios"
            data={metrics.likesHistory}
            dataKey="value"
            height={300}
            strokeColor="#e91e63"
            gradientId="likesGradient"
          />
        </Grid>

        {/* Demographics charts */}
        <Grid item xs={12} md={6}>
          <PieChartCard
            title="Distribución por Edad"
            data={metrics.demographics.ageGroups}
            dataKey="percentage"
            nameKey="range"
            height={300}
            colors={['#1db954', '#1ed760', '#a0d911', '#52c41a']}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartCard
            title="Distribución por Género"
            data={metrics.demographics.genderSplit}
            dataKey="percentage"
            nameKey="gender"
            height={300}
            colors={['#2196f3', '#e91e63', '#ff9800']}
          />
        </Grid>

        {/* Top markets */}
        <Grid item xs={12}>
          <BarChartCard
            title="Principales Mercados"
            data={metrics.topMarkets}
            dataKey="plays"
            nameKey="countryName"
            height={300}
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
