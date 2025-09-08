import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material'
import {
  People,
  PersonAdd,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh,
  Schedule
} from '@mui/icons-material'
import { useUserMetrics } from '../../hooks/useMetrics'
import type { MetricsFilters } from '../../services/musicService'

const MetricCard: React.FC<{
  title: string
  value: number
  subtitle?: string
  icon: React.ReactNode
  color: string
  formatter?: (value: number) => string
}> = ({ title, value, subtitle, icon, color, formatter = (v) => v.toLocaleString() }) => (
  <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box sx={{ color, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="bold" color="#fff">
        {formatter(value)}
      </Typography>
      <Typography variant="body2" color="#b3b3b3">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="#888">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
)

const RetentionCard: React.FC<{
  title: string
  value: number
  period: string
  color: string
}> = ({ title, value, period, color }) => (
  <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
        <Schedule sx={{ color, fontSize: 20 }} />
        <Chip 
          label={period} 
          size="small" 
          sx={{ 
            backgroundColor: color, 
            color: '#000', 
            fontWeight: 600,
            ml: 'auto'
          }} 
        />
      </Box>
      <Typography variant="h4" fontWeight="bold" color="#fff">
        {value.toFixed(1)}%
      </Typography>
      <Typography variant="body2" color="#b3b3b3">
        {title}
      </Typography>
    </CardContent>
  </Card>
)

export const UserMetricsView: React.FC = () => {
  const [filters, setFilters] = useState<MetricsFilters>({
    period: 'monthly'
  })

  const { data: metrics, isLoading, refetch } = useUserMetrics(filters)

  const handleFilterChange = (field: keyof MetricsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleExport = () => {
    if (!metrics) return
    
    // Convert to CSV format
    const csvData = [
      ['Métrica', 'Valor'],
      ['Usuarios Totales', metrics.totalUsers.toString()],
      ['Usuarios Activos Diarios', metrics.activeUsers.daily.toString()],
      ['Usuarios Activos Semanales', metrics.activeUsers.weekly.toString()],
      ['Usuarios Activos Mensuales', metrics.activeUsers.monthly.toString()],
      ['Nuevos Registros Hoy', metrics.newRegistrations.today.toString()],
      ['Nuevos Registros Esta Semana', metrics.newRegistrations.thisWeek.toString()],
      ['Nuevos Registros Este Mes', metrics.newRegistrations.thisMonth.toString()],
      ['Retención Día 1', `${metrics.retention.day1}%`],
      ['Retención Día 7', `${metrics.retention.day7}%`],
      ['Retención Día 30', `${metrics.retention.day30}%`],
      [''],
      ['Demografía por Edad'],
      ['Rango de Edad', 'Cantidad', 'Porcentaje'],
      ...metrics.demographics.ageGroups.map(group => [group.range, group.count.toString(), `${group.percentage}%`]),
      [''],
      ['Demografía por País'],
      ['País', 'Cantidad', 'Porcentaje'],
      ...metrics.demographics.countries.map(country => [country.countryName, country.count.toString(), `${country.percentage}%`])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user_metrics_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom color="#fff">
          Cargando métricas de usuario...
        </Typography>
        <LinearProgress sx={{ backgroundColor: '#404040', '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' } }} />
      </Box>
    )
  }

  if (!metrics) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="#f44336">
          Error al cargar métricas de usuario
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            Métricas de Usuario
          </Typography>
          <Typography variant="body1" color="#b3b3b3">
            Análisis de uso, crecimiento y retención de usuarios
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualizar métricas">
            <IconButton onClick={() => refetch()} sx={{ color: '#1db954' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar a CSV">
            <IconButton onClick={handleExport} sx={{ color: '#1db954' }}>
              <Download />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e1e1e' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={filters.period || 'monthly'}
                onChange={(e) => handleFilterChange('period', e.target.value)}
              >
                <MenuItem value="daily">Diario</MenuItem>
                <MenuItem value="weekly">Semanal</MenuItem>
                <MenuItem value="monthly">Mensual</MenuItem>
                <MenuItem value="custom">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Región</InputLabel>
              <Select
                value={filters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <MenuItem value="">Todas las regiones</MenuItem>
                <MenuItem value="AR">Argentina</MenuItem>
                <MenuItem value="BR">Brasil</MenuItem>
                <MenuItem value="MX">México</MenuItem>
                <MenuItem value="CO">Colombia</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="#b3b3b3">
              Última actualización: {new Date(metrics.lastUpdated).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Usuarios Totales"
            value={metrics.totalUsers}
            icon={<People sx={{ fontSize: 24 }} />}
            color="#1db954"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Activos Mensuales"
            value={metrics.activeUsers.monthly}
            subtitle="Usuarios únicos este mes"
            icon={<People sx={{ fontSize: 24 }} />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Activos Semanales"
            value={metrics.activeUsers.weekly}
            subtitle="Usuarios únicos esta semana"
            icon={<People sx={{ fontSize: 24 }} />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Activos Diarios"
            value={metrics.activeUsers.daily}
            subtitle="Usuarios únicos hoy"
            icon={<People sx={{ fontSize: 24 }} />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* New Registrations */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Nuevos Hoy"
            value={metrics.newRegistrations.today}
            icon={<PersonAdd sx={{ fontSize: 24 }} />}
            color="#1db954"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Nuevos Esta Semana"
            value={metrics.newRegistrations.thisWeek}
            icon={<PersonAdd sx={{ fontSize: 24 }} />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Nuevos Este Mes"
            value={metrics.newRegistrations.thisMonth}
            icon={<PersonAdd sx={{ fontSize: 24 }} />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Retention Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <RetentionCard
            title="Retención"
            value={metrics.retention.day1}
            period="Día 1"
            color="#1db954"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <RetentionCard
            title="Retención"
            value={metrics.retention.day7}
            period="Día 7"
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <RetentionCard
            title="Retención"
            value={metrics.retention.day30}
            period="Día 30"
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Demographics by Age */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#fff" fontWeight="600">
                Usuarios por Edad
              </Typography>
              {metrics.demographics.ageGroups.map((group) => (
                <Box key={group.range} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" color="#fff">
                    {group.range}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} width="180px">
                    <LinearProgress
                      variant="determinate"
                      value={group.percentage}
                      sx={{
                        flex: 1,
                        backgroundColor: '#404040',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                      }}
                    />
                    <Typography variant="body2" color="#b3b3b3" minWidth="80px">
                      {group.count.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="#b3b3b3" minWidth="40px">
                      {group.percentage}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics by Country */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#fff" fontWeight="600">
                Usuarios por País
              </Typography>
              {metrics.demographics.countries.map((country, index) => (
                <Box key={country.country} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="#fff">
                      {country.countryName}
                    </Typography>
                    {index === 0 && (
                      <Chip label="TOP" size="small" sx={{ backgroundColor: '#1db954', color: '#000', fontSize: '10px' }} />
                    )}
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} width="180px">
                    <LinearProgress
                      variant="determinate"
                      value={country.percentage}
                      sx={{
                        flex: 1,
                        backgroundColor: '#404040',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                      }}
                    />
                    <Typography variant="body2" color="#b3b3b3" minWidth="80px">
                      {country.count.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="#b3b3b3" minWidth="40px">
                      {country.percentage}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics by Gender */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#fff" fontWeight="600">
                Usuarios por Género
              </Typography>
              {metrics.demographics.genderSplit.map((gender) => (
                <Box key={gender.gender} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" color="#fff">
                    {gender.gender}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} width="180px">
                    <LinearProgress
                      variant="determinate"
                      value={gender.percentage}
                      sx={{
                        flex: 1,
                        backgroundColor: '#404040',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                      }}
                    />
                    <Typography variant="body2" color="#b3b3b3" minWidth="80px">
                      {gender.count.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="#b3b3b3" minWidth="40px">
                      {gender.percentage}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
