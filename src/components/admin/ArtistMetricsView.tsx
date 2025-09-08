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
  Chip,
  Button
} from '@mui/material'
import {
  People,
  PlayArrow,
  Bookmark,
  Share,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh,
  QueueMusic,
} from '@mui/icons-material'
import { useArtistMetrics } from '../../hooks/useMetrics'
import type { MetricsFilters } from '../../services/musicService'

interface ArtistMetricsViewProps {
  artistId: string
  artistName?: string
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

export const ArtistMetricsView: React.FC<ArtistMetricsViewProps> = ({ artistId, artistName: _ }) => {
  const [filters, setFilters] = useState<MetricsFilters>({
    period: 'monthly'
  })

  const { data: metrics, isLoading, refetch } = useArtistMetrics(artistId, filters)

  const handleFilterChange = (field: keyof MetricsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleExport = (section: 'all' | 'songs' | 'markets' | 'playlists') => {
    if (!metrics) return
    
    let csvData: string[][] = []
    let filename = ''
    
    switch (section) {
      case 'songs':
        csvData = [
          ['Top Canciones - ' + metrics.artistName],
          ['Título', 'Reproducciones', 'Guardadas', 'Porcentaje'],
          ...metrics.topSongs.map(song => [
            song.title,
            song.plays.toString(),
            song.saves.toString(),
            `${song.percentage}%`
          ])
        ]
        filename = `${metrics.artistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_top_songs.csv`
        break
        
      case 'markets':
        csvData = [
          ['Top Mercados - ' + metrics.artistName],
          ['País', 'Reproducciones', 'Oyentes', 'Porcentaje'],
          ...metrics.topMarkets.map(market => [
            market.countryName,
            market.plays.toString(),
            market.listeners.toString(),
            `${market.percentage}%`
          ])
        ]
        filename = `${metrics.artistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_top_markets.csv`
        break
        
      case 'playlists':
        csvData = [
          ['Top Playlists - ' + metrics.artistName],
          ['Playlist', 'Propietario', 'Inclusiones', 'Reproducciones Totales'],
          ...metrics.topPlaylists.map(playlist => [
            playlist.playlistName,
            playlist.playlistOwner,
            playlist.inclusions.toString(),
            playlist.totalPlays.toString()
          ])
        ]
        filename = `${metrics.artistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_top_playlists.csv`
        break
        
      default:
        csvData = [
          ['Métricas del Artista - ' + metrics.artistName],
          ['Métrica', 'Valor', 'Tendencia'],
          ['Oyentes Mensuales', metrics.monthlyListeners.toString(), `${metrics.monthlyListenersTrend > 0 ? '+' : ''}${metrics.monthlyListenersTrend}%`],
          ['Seguidores', metrics.followers.toString(), `${metrics.followersTrend > 0 ? '+' : ''}${metrics.followersTrend}%`],
          ['Reproducciones Totales', metrics.totalPlays.toString(), `${metrics.playsTrend > 0 ? '+' : ''}${metrics.playsTrend}%`],
          ['Guardadas Totales', metrics.totalSaves.toString(), `${metrics.savesTrend > 0 ? '+' : ''}${metrics.savesTrend}%`],
          ['Compartidas Totales', metrics.totalShares.toString(), `${metrics.sharesTrend > 0 ? '+' : ''}${metrics.sharesTrend}%`]
        ]
        filename = `${metrics.artistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_metrics.csv`
    }
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom color="#fff">
          Cargando métricas del artista...
        </Typography>
        <LinearProgress sx={{ backgroundColor: '#404040', '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' } }} />
      </Box>
    )
  }

  if (!metrics) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="#f44336">
          Error al cargar métricas del artista
        </Typography>
      </Box>
    )
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            Métricas del Artista
          </Typography>
          <Typography variant="h6" color="#b3b3b3">
            {metrics.artistName}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualizar métricas">
            <IconButton onClick={() => refetch()} sx={{ color: '#1db954' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar todo">
            <IconButton onClick={() => handleExport('all')} sx={{ color: '#1db954' }}>
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
                <MenuItem value="US">Estados Unidos</MenuItem>
                <MenuItem value="GB">Reino Unido</MenuItem>
                <MenuItem value="BR">Brasil</MenuItem>
                <MenuItem value="AR">Argentina</MenuItem>
                <MenuItem value="MX">México</MenuItem>
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

      {/* KPIs Principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Oyentes Mensuales"
            value={metrics.monthlyListeners}
            trend={metrics.monthlyListenersTrend}
            icon={<People sx={{ fontSize: 24 }} />}
            color="#1db954"
            formatter={formatLargeNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Seguidores"
            value={metrics.followers}
            trend={metrics.followersTrend}
            icon={<People sx={{ fontSize: 24 }} />}
            color="#2196f3"
            formatter={formatLargeNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Reproducciones"
            value={metrics.totalPlays}
            trend={metrics.playsTrend}
            icon={<PlayArrow sx={{ fontSize: 24 }} />}
            color="#ff9800"
            formatter={formatLargeNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Guardadas"
            value={metrics.totalSaves}
            trend={metrics.savesTrend}
            icon={<Bookmark sx={{ fontSize: 24 }} />}
            color="#9c27b0"
            formatter={formatLargeNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Compartidas"
            value={metrics.totalShares}
            trend={metrics.sharesTrend}
            icon={<Share sx={{ fontSize: 24 }} />}
            color="#f44336"
            formatter={formatLargeNumber}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Canciones */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="#fff" fontWeight="600">
                  Top Canciones
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleExport('songs')}
                  sx={{ color: '#1db954', minWidth: 'auto', p: 0.5 }}
                >
                  <Download fontSize="small" />
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#b3b3b3', border: 'none', p: 1 }}>#</TableCell>
                      <TableCell sx={{ color: '#b3b3b3', border: 'none', p: 1 }}>Canción</TableCell>
                      <TableCell align="right" sx={{ color: '#b3b3b3', border: 'none', p: 1 }}>Reproducciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.topSongs.map((song, index) => (
                      <TableRow key={song.songId} hover>
                        <TableCell sx={{ color: '#fff', border: 'none', p: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#fff', border: 'none', p: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {song.title}
                          </Typography>
                          <Typography variant="caption" color="#b3b3b3">
                            {formatLargeNumber(song.saves)} guardadas
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff', border: 'none', p: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {formatLargeNumber(song.plays)}
                          </Typography>
                          <Typography variant="caption" color="#1db954">
                            {song.percentage}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Mercados */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="#fff" fontWeight="600">
                  Top Mercados
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleExport('markets')}
                  sx={{ color: '#1db954', minWidth: 'auto', p: 0.5 }}
                >
                  <Download fontSize="small" />
                </Button>
              </Box>
              {metrics.topMarkets.map((market, index) => (
                <Box key={market.country} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="#fff" fontWeight="medium">
                        {market.countryName}
                      </Typography>
                      {index === 0 && (
                        <Chip label="TOP" size="small" sx={{ backgroundColor: '#1db954', color: '#000', fontSize: '10px' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="#1db954">
                      {market.percentage}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption" color="#b3b3b3">
                      {formatLargeNumber(market.plays)} reproducciones
                    </Typography>
                    <Typography variant="caption" color="#b3b3b3">
                      {formatLargeNumber(market.listeners)} oyentes
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={market.percentage}
                    sx={{
                      backgroundColor: '#404040',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#1db954' }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Playlists */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="#fff" fontWeight="600">
                  Top Playlists
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleExport('playlists')}
                  sx={{ color: '#1db954', minWidth: 'auto', p: 0.5 }}
                >
                  <Download fontSize="small" />
                </Button>
              </Box>
              {metrics.topPlaylists.map((playlist, index) => (
                <Box key={playlist.playlistId} mb={2} p={2} sx={{ backgroundColor: '#2a2a2a', borderRadius: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <QueueMusic sx={{ color: '#1db954', fontSize: 16 }} />
                    <Typography variant="body2" color="#fff" fontWeight="medium">
                      {playlist.playlistName}
                    </Typography>
                    {index === 0 && (
                      <Chip label="TOP" size="small" sx={{ backgroundColor: '#1db954', color: '#000', fontSize: '10px' }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="#b3b3b3" display="block">
                    Por {playlist.playlistOwner}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption" color="#b3b3b3">
                      {playlist.inclusions} canciones incluidas
                    </Typography>
                    <Typography variant="caption" color="#1db954">
                      {formatLargeNumber(playlist.totalPlays)} reproducciones
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
