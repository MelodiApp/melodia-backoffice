import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Stack,
} from '@mui/material'
import {
  People,
  MusicNote,
  QueueMusic,
  Headset,
} from '@mui/icons-material'
import { useUsers } from '../../hooks'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Box
        sx={{
          p: 2,
          borderRadius: '50%',
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  </Paper>
)

export const Dashboard: React.FC = () => {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers({})

  if (usersError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar datos del dashboard: {usersError.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Bienvenido al Backoffice de Melodía. Aquí tienes una vista general de tu plataforma musical.
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <StatCard
          title="Usuarios Totales"
          value={usersData?.total || 0}
          icon={<People sx={{ fontSize: 32 }} />}
          color="primary"
          subtitle="Usuarios registrados"
        />
        
        <StatCard
          title="Catálogo Musical"
          value="Ver Catálogo"
          icon={<MusicNote sx={{ fontSize: 32 }} />}
          color="secondary"
          subtitle="Gestiona canciones y playlists"
        />
        
        <StatCard
          title="Playlists"
          value="Gestionar"
          icon={<QueueMusic sx={{ fontSize: 32 }} />}
          color="success"
          subtitle="Colecciones de música"
        />
        
        <StatCard
          title="Usuarios Activos"
          value={usersData?.users?.filter(u => u.isActive).length || 0}
          icon={<Headset sx={{ fontSize: 32 }} />}
          color="warning"
          subtitle="Usuarios activos"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Users by Role */}
        <Card sx={{ 
          height: '400px',
          backgroundColor: 'background.paper',
          borderRadius: 2
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              Usuarios por Rol
            </Typography>
            {usersData?.users && usersData.users.length > 0 ? (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {['admin', 'moderator', 'user'].map((role, index) => {
                  const count = usersData.users.filter(u => u.role === role).length
                  const percentage = usersData.total > 0 ? ((count / usersData.total) * 100).toFixed(1) : '0'
                  
                  return (
                    <Box
                      key={role}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      sx={{
                        bgcolor: index === 0 ? 'rgba(29, 185, 84, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 1,
                        border: index === 0 ? '1px solid #1db954' : '1px solid #404040',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6" sx={{ color: index === 0 ? '#1db954' : 'text.primary' }}>
                          #{index + 1}
                        </Typography>
                        <Box>
                          <Typography variant="body1" fontWeight="medium" sx={{ color: 'text.primary' }}>
                            {role === 'admin' ? 'Administradores' : role === 'moderator' ? 'Moderadores' : 'Usuarios'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {count} usuario{count !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={`${percentage}%`}
                        size="small"
                        sx={{
                          backgroundColor: index === 0 ? '#1db954' : '#404040',
                          color: index === 0 ? '#000000' : '#ffffff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  )
                })}
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No hay datos de usuarios disponibles
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card sx={{ 
          height: '400px',
          backgroundColor: 'background.paper',
          borderRadius: 2
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              Usuarios Recientes
            </Typography>
            {usersLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : usersData?.users && usersData.users.length > 0 ? (
              <List>
                {usersData.users.slice(0, 5).map((user) => (
                  <ListItem key={user.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ color: 'text.primary' }}>{user.name}</Typography>}
                      secondary={
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Chip
                            label={user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderador' : 'Usuario'}
                            size="small"
                            sx={{
                              backgroundColor: user.role === 'admin' ? '#1db954' : user.role === 'moderator' ? '#1ed760' : '#404040',
                              color: user.role === 'admin' || user.role === 'moderator' ? '#000000' : '#ffffff',
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label={user.isActive ? 'Activo' : 'Inactivo'}
                            size="small"
                            color={user.isActive ? 'success' : 'default'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No hay usuarios disponibles
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
            Acciones Rápidas
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Utiliza la navegación lateral para acceder a las diferentes secciones:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mt: 2 }}>
            <Paper sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid #404040',
            }}>
              <Avatar sx={{ bgcolor: '#1db954', color: '#000000' }}>
                <People />
              </Avatar>
              <Box flex={1}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.primary' }}>
                  Gestión de Usuarios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ver perfiles, bloquear y gestionar usuarios
                </Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid #404040',
            }}>
              <Avatar sx={{ bgcolor: '#1db954', color: '#000000' }}>
                <MusicNote />
              </Avatar>
              <Box flex={1}>
                <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.primary' }}>
                  Catálogo Musical
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explorar, buscar y gestionar contenido musical
                </Typography>
              </Box>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
