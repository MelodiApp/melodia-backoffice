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
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  People,
  PersonAdd,
  Timeline,
  Refresh,
  Public,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useUserMetrics } from '../../hooks/useMetrics'
import { LineChartCard, AreaChartCard, MultiLineChart, BarChartCard, PieChartCard } from '../charts/ChartComponents'
import type { MetricsFilters } from '../../services/musicService'

// Metric card component
interface MetricCardProps {
  title: string
  value: number
  trend?: number
  icon: React.ReactNode
  color: string
  suffix?: string
  showTrend?: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend = 0, 
  icon, 
  color, 
  suffix = '',
  showTrend = true 
}) => {
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
          {showTrend && (
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
          )}
        </Box>
        <Typography variant="h4" color="white" fontWeight="bold">
          {value.toLocaleString()}{suffix}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Retention card component
const RetentionCard: React.FC<{ title: string; value: number; color: string }> = ({ 
  title, 
  value, 
  color 
}) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.grey[900],
        border: `1px solid ${theme.palette.grey[800]}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          border: `1px solid ${color}`,
        },
      }}
    >
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="grey.400" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" color={color} fontWeight="bold">
          {value.toFixed(1)}%
        </Typography>
      </CardContent>
    </Card>
  )
}

export const UserMetrics: React.FC = () => {
  const theme = useTheme()
  const [filters, setFilters] = useState<MetricsFilters>({ period: 'monthly' })
  const { data: metrics, isLoading, error, refetch } = useUserMetrics(filters)

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
        Error cargando métricas de usuarios. Por favor intenta de nuevo.
      </Alert>
    )
  }

  if (!metrics) return null

  // Prepare chart data
  const activityData = metrics.activityTrend.map(item => ({
    date: item.date,
    usuariosActivos: item.activeUsers,
    nuevosUsuarios: item.newUsers,
  }))

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
            Métricas de Usuarios
          </Typography>
          <Typography variant="h6" color="grey.400">
            Análisis de la base de usuarios de Melodia
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

      {/* Main metric cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total de Usuarios"
            value={Math.round(metrics.totalUsers / 1000)}
            icon={<People />}
            color="#1db954"
            suffix="K"
            showTrend={false}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <MetricCard
                title="Usuarios Activos Diarios"
                value={Math.round(metrics.activeUsers.daily / 1000)}
                icon={<Timeline />}
                color="#2196f3"
                suffix="K"
                showTrend={false}
              />
            </Grid>
            <Grid item xs={4}>
              <MetricCard
                title="Usuarios Activos Semanales"
                value={Math.round(metrics.activeUsers.weekly / 1000)}
                icon={<Timeline />}
                color="#ff9800"
                suffix="K"
                showTrend={false}
              />
            </Grid>
            <Grid item xs={4}>
              <MetricCard
                title="Usuarios Activos Mensuales"
                value={Math.round(metrics.activeUsers.monthly / 1000)}
                icon={<Timeline />}
                color="#e91e63"
                suffix="K"
                showTrend={false}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* New registrations */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Nuevos Usuarios Hoy"
            value={metrics.newRegistrations.today}
            icon={<PersonAdd />}
            color="#4caf50"
            showTrend={false}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Esta Semana"
            value={metrics.newRegistrations.thisWeek}
            icon={<PersonAdd />}
            color="#ff9800"
            showTrend={false}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Este Mes"
            value={metrics.newRegistrations.thisMonth}
            icon={<PersonAdd />}
            color="#e91e63"
            showTrend={false}
          />
        </Grid>
      </Grid>

      {/* Retention rates */}
      <Box mb={4}>
        <Typography variant="h6" color="white" gutterBottom sx={{ mb: 2 }}>
          Tasas de Retención
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <RetentionCard title="Día 1" value={metrics.retention.day1} color="#1db954" />
          </Grid>
          <Grid item xs={12} md={4}>
            <RetentionCard title="Día 7" value={metrics.retention.day7} color="#ff9800" />
          </Grid>
          <Grid item xs={12} md={4}>
            <RetentionCard title="Día 30" value={metrics.retention.day30} color="#e91e63" />
          </Grid>
        </Grid>
      </Box>

      {/* Charts section */}
      <Grid container spacing={3}>
        {/* Activity trend */}
        <Grid item xs={12}>
          <MultiLineChart
            title="Tendencia de Actividad - Últimos 30 días"
            data={activityData}
            height={400}
            lines={[
              { dataKey: 'usuariosActivos', stroke: '#1db954', name: 'Usuarios Activos' },
              { dataKey: 'nuevosUsuarios', stroke: '#2196f3', name: 'Nuevos Usuarios' },
            ]}
          />
        </Grid>

        {/* Demographics charts */}
        <Grid item xs={12} md={4}>
          <PieChartCard
            title="Distribución por Edad"
            data={metrics.demographics.ageGroups}
            dataKey="percentage"
            nameKey="range"
            height={300}
            colors={['#1db954', '#1ed760', '#a0d911', '#52c41a']}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PieChartCard
            title="Distribución por Género"
            data={metrics.demographics.genderSplit}
            dataKey="percentage"
            nameKey="gender"
            height={300}
            colors={['#e91e63', '#2196f3', '#ff9800']}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <BarChartCard
            title="Usuarios por País"
            data={metrics.demographics.countries.slice(0, 5)} // Top 5 countries
            dataKey="percentage"
            nameKey="countryName"
            height={300}
            fillColor="#1db954"
          />
        </Grid>

        {/* Detailed country breakdown */}
        <Grid item xs={12}>
          <BarChartCard
            title="Distribución Geográfica Completa"
            data={metrics.demographics.countries}
            dataKey="count"
            nameKey="countryName"
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
