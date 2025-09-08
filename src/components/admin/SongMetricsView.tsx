import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
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
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  PlayArrow,
  Favorite,
  Share,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh
} from '@mui/icons-material'
import { useSongMetrics } from '../../hooks/useMetrics'
import type { MetricsFilters } from '../../services/musicService'

interface SongMetricsViewProps {
  songId: string
  songTitle?: string
}

const MetricCard: React.FC<{
  title: string
  value: number
  trend: number
  icon: React.ReactNode
  color: string
  formatter?: (value: number) => string
}> = ({ title, value, trend, icon, color, formatter = (v) => v.toLocaleString() }) => (
  <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box sx={{ color, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          {trend > 0 ? (
            <TrendingUp sx={{ color: '#1db954', fontSize: 16 }} />
          ) : trend < 0 ? (
            <TrendingDown sx={{ color: '#f44336', fontSize: 16 }} />
          ) : null}
          <Typography
            variant="caption"
            sx={{
              color: trend > 0 ? '#1db954' : trend < 0 ? '#f44336' : '#b3b3b3',
              fontWeight: 600
            }}
          >
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="bold" color="#fff">
        {formatter(value)}
      </Typography>
      <Typography variant="body2" color="#b3b3b3">
        {title}
      </Typography>
    </CardContent>
  </Card>
)

export const SongMetricsView: React.FC<SongMetricsViewProps> = ({ songId, songTitle }) => {
  const [filters, setFilters] = useState<MetricsFilters>({
    period: 'monthly'
  })

  const { data: metrics, isLoading, refetch } = useSongMetrics(songId, filters)

  const handleFilterChange = (field: keyof MetricsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleExport = () => {
    if (!metrics) return
    
    const data = {
      song: {
        title: metrics.title,
        artist: metrics.artist,
        album: metrics.album
      },
      metrics: {
        plays: metrics.plays,
        likes: metrics.likes,
        shares: metrics.shares,
        saves: metrics.saves
      },
      topMarkets: metrics.topMarkets,
      demographics: metrics.demographics,
      lastUpdated: metrics.lastUpdated
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${metrics.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_metrics.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom color="#fff">
          Cargando métricas...
        </Typography>
        <LinearProgress sx={{ backgroundColor: '#404040', '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' } }} />
      </Box>
    )
  }

  if (!metrics) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="#f44336">
          Error al cargar métricas
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
            Métricas de Canción
          </Typography>
          <Typography variant="h6" color="#b3b3b3">
            {metrics.title} - {metrics.artist}
          </Typography>
          {metrics.album && (
            <Typography variant="body2" color="#888">
              Álbum: {metrics.album}
            </Typography>
          )}
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualizar métricas">
            <IconButton onClick={() => refetch()} sx={{ color: '#1db954' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar datos">
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
                <MenuItem value="US">Estados Unidos</MenuItem>
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

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Reproducciones"
            value={metrics.plays}
            trend={metrics.playsTrend}
            icon={<PlayArrow sx={{ fontSize: 24 }} />}
            color="#1db954"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Me Gusta"
            value={metrics.likes}
            trend={metrics.likesTrend}
            icon={<Favorite sx={{ fontSize: 24 }} />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Compartidas"
            value={metrics.shares}
            trend={metrics.sharesTrend}
            icon={<Share sx={{ fontSize: 24 }} />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Guardadas"
            value={metrics.saves}
            trend={metrics.savesTrend}
            icon={<Bookmark sx={{ fontSize: 24 }} />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Markets */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#fff" fontWeight="600">
                Principales Mercados
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#b3b3b3', border: 'none' }}>País</TableCell>
                      <TableCell align="right" sx={{ color: '#b3b3b3', border: 'none' }}>Reproducciones</TableCell>
                      <TableCell align="right" sx={{ color: '#b3b3b3', border: 'none' }}>%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.topMarkets.map((market, index) => (
                      <TableRow key={market.country}>
                        <TableCell sx={{ color: '#fff', border: 'none' }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {market.countryName}
                            </Typography>
                            {index === 0 && (
                              <Chip label="TOP" size="small" sx={{ backgroundColor: '#1db954', color: '#000', fontSize: '10px' }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff', border: 'none' }}>
                          {market.plays.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff', border: 'none' }}>
                          <Box display="flex" alignItems="center" gap={1} justifyContent="flex-end">
                            <LinearProgress
                              variant="determinate"
                              value={market.percentage}
                              sx={{
                                width: 40,
                                backgroundColor: '#404040',
                                '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                              }}
                            />
                            <Typography variant="body2" color="#b3b3b3" minWidth="40px">
                              {market.percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#fff" fontWeight="600">
                Demografía de Oyentes
              </Typography>
              
              <Box mb={3}>
                <Typography variant="subtitle2" color="#b3b3b3" mb={1}>
                  Por Edad
                </Typography>
                {metrics.demographics.ageGroups.map((group) => (
                  <Box key={group.range} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="#fff">
                      {group.range} años
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} width="120px">
                      <LinearProgress
                        variant="determinate"
                        value={group.percentage}
                        sx={{
                          flex: 1,
                          backgroundColor: '#404040',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                        }}
                      />
                      <Typography variant="body2" color="#b3b3b3" minWidth="40px">
                        {group.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ backgroundColor: '#404040', my: 2 }} />

              <Box>
                <Typography variant="subtitle2" color="#b3b3b3" mb={1}>
                  Por Género
                </Typography>
                {metrics.demographics.genderSplit.map((gender) => (
                  <Box key={gender.gender} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="#fff">
                      {gender.gender}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} width="120px">
                      <LinearProgress
                        variant="determinate"
                        value={gender.percentage}
                        sx={{
                          flex: 1,
                          backgroundColor: '#404040',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                        }}
                      />
                      <Typography variant="body2" color="#b3b3b3" minWidth="40px">
                        {gender.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
