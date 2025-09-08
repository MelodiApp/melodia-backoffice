import React, { useState } from 'react'
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
} from '@mui/material'
import {
  Dashboard,
  MusicNote,
  Album,
  Person,
  People,
  Search,
  Refresh,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { SongMetrics } from './SongMetrics'
import { AlbumMetrics } from './AlbumMetrics'
import { ArtistMetrics } from './ArtistMetrics'
import { UserMetrics } from './UserMetrics'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`metrics-tabpanel-${index}`}
      aria-labelledby={`metrics-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

// Quick stats card component
interface QuickStatsCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick 
}) => {
  const theme = useTheme()

  return (
    <Card
      onClick={onClick}
      sx={{
        backgroundColor: theme.palette.grey[900],
        border: `1px solid ${theme.palette.grey[800]}`,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 32px rgba(29, 185, 84, 0.2)`,
          border: `1px solid ${color}`,
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ color, fontSize: 40, mb: 2 }}>{icon}</Box>
        <Typography variant="h6" color="white" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="grey.400">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const MetricsDashboard: React.FC = () => {
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState(0)
  const [songId, setSongId] = useState('1') // Default song ID
  const [albumId, setAlbumId] = useState('1') // Default album ID
  const [artistId, setArtistId] = useState('1') // Default artist ID
  const [searchValues, setSearchValues] = useState({
    song: '1',
    album: '1',
    artist: '1'
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  const handleSearch = (type: 'song' | 'album' | 'artist') => {
    switch (type) {
      case 'song':
        setSongId(searchValues.song)
        setCurrentTab(1)
        break
      case 'album':
        setAlbumId(searchValues.album)
        setCurrentTab(2)
        break
      case 'artist':
        setArtistId(searchValues.artist)
        setCurrentTab(3)
        break
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          Dashboard de Métricas
        </Typography>
        <Typography variant="h6" color="grey.400" gutterBottom>
          Análisis completo de rendimiento de Melodia
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'grey.800', mx: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'grey.400',
              '&.Mui-selected': {
                color: '#1db954',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1db954',
            },
          }}
        >
          <Tab
            icon={<Dashboard />}
            label="Overview"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<MusicNote />}
            label="Canciones"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<Album />}
            label="Álbumes"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<Person />}
            label="Artistas"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<People />}
            label="Usuarios"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
        </Tabs>
      </Box>

      {/* Tab content */}
      <TabPanel value={currentTab} index={0}>
        <Box sx={{ p: 3 }}>
          {/* Quick access cards */}
          <Typography variant="h5" color="white" fontWeight="bold" gutterBottom>
            Acceso Rápido a Métricas
          </Typography>
          <Typography variant="body1" color="grey.400" sx={{ mb: 4 }}>
            Selecciona el tipo de métrica que deseas analizar
          </Typography>
          
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatsCard
                title="Métricas de Usuarios"
                description="Análisis de la base de usuarios, actividad y demografía"
                icon={<People />}
                color="#1db954"
                onClick={() => setCurrentTab(4)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatsCard
                title="Análisis de Canciones"
                description="Rendimiento detallado de canciones individuales"
                icon={<MusicNote />}
                color="#e91e63"
                onClick={() => setCurrentTab(1)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatsCard
                title="Métricas de Álbumes"
                description="Análisis de álbumes y tasas de completitud"
                icon={<Album />}
                color="#2196f3"
                onClick={() => setCurrentTab(2)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatsCard
                title="Estadísticas de Artistas"
                description="Rendimiento de artistas y tendencias"
                icon={<Person />}
                color="#ff9800"
                onClick={() => setCurrentTab(3)}
              />
            </Grid>
          </Grid>

          {/* Search sections */}
          <Typography variant="h5" color="white" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
            Búsqueda Específica
          </Typography>
          
          <Grid container spacing={3}>
            {/* Song search */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: theme.palette.grey[900],
                  border: `1px solid ${theme.palette.grey[800]}`,
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <MusicNote sx={{ color: '#e91e63' }} />
                  <Typography variant="h6" color="white">
                    Buscar Canción
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="ID de canción"
                    value={searchValues.song}
                    onChange={(e) => setSearchValues(prev => ({ ...prev, song: e.target.value }))}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'grey.700',
                        },
                        '&:hover fieldset': {
                          borderColor: '#e91e63',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleSearch('song')}
                    sx={{
                      backgroundColor: '#e91e63',
                      '&:hover': {
                        backgroundColor: '#c2185b',
                      },
                    }}
                  >
                    <Search />
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Album search */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: theme.palette.grey[900],
                  border: `1px solid ${theme.palette.grey[800]}`,
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Album sx={{ color: '#2196f3' }} />
                  <Typography variant="h6" color="white">
                    Buscar Álbum
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="ID de álbum"
                    value={searchValues.album}
                    onChange={(e) => setSearchValues(prev => ({ ...prev, album: e.target.value }))}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'grey.700',
                        },
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleSearch('album')}
                    sx={{
                      backgroundColor: '#2196f3',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                      },
                    }}
                  >
                    <Search />
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Artist search */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: theme.palette.grey[900],
                  border: `1px solid ${theme.palette.grey[800]}`,
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Person sx={{ color: '#ff9800' }} />
                  <Typography variant="h6" color="white">
                    Buscar Artista
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="ID de artista"
                    value={searchValues.artist}
                    onChange={(e) => setSearchValues(prev => ({ ...prev, artist: e.target.value }))}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'grey.700',
                        },
                        '&:hover fieldset': {
                          borderColor: '#ff9800',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleSearch('artist')}
                    sx={{
                      backgroundColor: '#ff9800',
                      '&:hover': {
                        backgroundColor: '#f57700',
                      },
                    }}
                  >
                    <Search />
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Usage info */}
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3,
              backgroundColor: 'rgba(29, 185, 84, 0.1)',
              border: '1px solid rgba(29, 185, 84, 0.2)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: '#1db954',
              },
            }}
          >
            <Typography variant="body2">
              <strong>Tip:</strong> Puedes usar los IDs de ejemplo: Canción "1", Álbum "1", Artista "1" para ver datos de demostración.
              Los gráficos se actualizan automáticamente cada 10 minutos.
            </Typography>
          </Alert>
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <SongMetrics songId={songId} />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <AlbumMetrics albumId={albumId} />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <ArtistMetrics artistId={artistId} />
      </TabPanel>

      <TabPanel value={currentTab} index={4}>
        <UserMetrics />
      </TabPanel>
    </Box>
  )
}
