import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Container, Typography, Box, Tabs, Tab } from '@mui/material'
import { People, MusicNote, Dashboard } from '@mui/icons-material'
import { UsersListSimple } from './components/admin/UsersListSimple'
import { CatalogList } from './components/admin/CatalogList'
import { MetricsDashboard } from './components/metrics/MetricsDashboard'
import { queryClient } from './hooks/queryClient'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954', // Spotify green
      light: '#1ed760',
      dark: '#169c46',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#121212', // Spotify dark background
      paper: '#181818', // Spotify card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    divider: '#282828',
  },
  typography: {
    fontFamily: '"Circular", "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 600,
      color: '#ffffff',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: '#1db954',
            height: 3,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#b3b3b3',
          '&.Mui-selected': {
            color: '#1db954',
          },
          '&:hover': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#2a2a2a',
            color: '#ffffff',
            fontWeight: 600,
            borderBottom: '1px solid #404040',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#282828',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#1db954',
          '&:hover': {
            backgroundColor: '#1ed760',
          },
        },
      },
    },
  },
})

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function App() {
  const [value, setValue] = React.useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh', 
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <Box sx={{ 
            backgroundColor: 'background.paper', 
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}>
            <Container maxWidth="xl">
              <Box sx={{ py: 2 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 900
                  }}
                >
                  Melodia Admin
                </Typography>
                <Tabs 
                  value={value} 
                  onChange={handleChange} 
                  aria-label="admin tabs"
                  sx={{
                    '& .MuiTab-root': {
                      minHeight: 48,
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                    }
                  }}
                >
                  <Tab icon={<People />} label="Usuarios" iconPosition="start" />
                  <Tab icon={<MusicNote />} label="Catálogo Musical" iconPosition="start" />
                  <Tab icon={<Dashboard />} label="Métricas Avanzadas" iconPosition="start" />
                </Tabs>
              </Box>
            </Container>
          </Box>

          {/* Content */}
          <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
            <TabPanel value={value} index={0}>
              <UsersListSimple />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CatalogList />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MetricsDashboard />
            </TabPanel>
          </Container>
        </Box>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
