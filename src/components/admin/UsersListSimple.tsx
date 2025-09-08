import React, { useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { useUsers, useUserDetail, useToggleUserBlock } from '../../hooks/useUsers'
import type { User } from '../../services/userService'

export const UsersListSimple: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [profileDialog, setProfileDialog] = useState(false)
  const [blockConfirmDialog, setBlockConfirmDialog] = useState<{
    open: boolean
    user: User | null
  }>({
    open: false,
    user: null,
  })

  // Queries
  const { data: usersData, isLoading, error } = useUsers({
    search: searchTerm || undefined,
  })

  const { data: userDetailData } = useUserDetail(selectedUserId || '')

  // Mutations
  const toggleBlockMutation = useToggleUserBlock()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // CA 2 (Visualizar perfil): Ver perfil detallado
  const handleViewProfile = (user: User) => {
    setSelectedUserId(user.id)
    setProfileDialog(true)
  }

  const closeProfileDialog = () => {
    setProfileDialog(false)
    setSelectedUserId(null)
  }

  // CA 1, CA 2, CA 3 (Bloquear usuario): Confirmar bloqueo/desbloqueo
  const handleBlockConfirmation = (user: User) => {
    setBlockConfirmDialog({ open: true, user })
  }

  const handleConfirmBlock = () => {
    if (blockConfirmDialog.user) {
      toggleBlockMutation.mutate(blockConfirmDialog.user.id)
      setBlockConfirmDialog({ open: false, user: null })
    }
  }

  const closeBlockConfirmDialog = () => {
    setBlockConfirmDialog({ open: false, user: null })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#1db954'
      case 'moderator':
        return '#1ed760'
      default:
        return '#404040'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar usuarios: {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
        Gestión de Usuarios
      </Typography>

      {/* Búsqueda */}
      <Box sx={{ 
        mb: 3, 
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}>
        <TextField
          size="small"
          placeholder="Buscar usuarios por nombre o email..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ 
            minWidth: 350,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#2a2a2a',
              '& fieldset': {
                borderColor: '#404040',
              },
              '&:hover fieldset': {
                borderColor: '#1db954',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1db954',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#b3b3b3',
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* CA 3 (Visualizar perfil): Manejar ausencia de usuarios */}
      {usersData?.users.length === 0 ? (
        <Card sx={{ backgroundColor: 'background.paper', textAlign: 'center', py: 4 }}>
          <CardContent>
            <PersonIcon sx={{ fontSize: 64, color: '#404040', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay usuarios disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados en el sistema.'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        // CA 1 & CA 2: Lista de usuarios con información básica
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      size="small"
                      variant="filled"
                      sx={{
                        backgroundColor: getRoleColor(user.role),
                        color: '#000000',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={user.isBlocked ? <LockIcon /> : user.isActive ? <ActiveIcon /> : <InactiveIcon />}
                        label={user.isBlocked ? 'Bloqueado' : user.isActive ? 'Activo' : 'Inactivo'}
                        color={user.isBlocked ? 'error' : user.isActive ? 'success' : 'default'}
                        size="small"
                        variant="filled"
                        sx={{
                          backgroundColor: 
                            user.isBlocked ? '#e22134' : 
                            user.isActive ? '#1db954' : '#404040',
                          color: user.isBlocked || user.isActive ? '#000000' : '#ffffff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {/* CA 2 (Visualizar perfil): Ver perfil detallado */}
                      <Tooltip title="Ver perfil completo">
                        <IconButton
                          onClick={() => handleViewProfile(user)}
                          color="primary"
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: '#1db954',
                              color: '#000000',
                            }
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {/* CA 1, CA 2, CA 3 (Bloquear usuario): Acción de bloqueo */}
                      <Tooltip title={user.isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}>
                        <IconButton
                          onClick={() => handleBlockConfirmation(user)}
                          color={user.isBlocked ? 'success' : 'error'}
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: user.isBlocked ? '#1db954' : '#e22134',
                              color: '#000000',
                            }
                          }}
                        >
                          {user.isBlocked ? <UnlockIcon /> : <LockIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CA 2 (Visualizar perfil): Diálogo de perfil detallado */}
      <Dialog 
        open={profileDialog} 
        onClose={closeProfileDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div">
            Perfil de Usuario
          </Typography>
        </DialogTitle>
        <DialogContent>
          {userDetailData && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar 
                      src={userDetailData.user.avatar} 
                      alt={userDetailData.user.name}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    >
                      {userDetailData.user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {userDetailData.user.name}
                    </Typography>
                    <Chip
                      label={userDetailData.user.role.charAt(0).toUpperCase() + userDetailData.user.role.slice(1)}
                      sx={{
                        backgroundColor: getRoleColor(userDetailData.user.role),
                        color: '#000000',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EmailIcon sx={{ color: '#1db954' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Correo electrónico
                        </Typography>
                        <Typography variant="body1">
                          {userDetailData.user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarIcon sx={{ color: '#1db954' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Fecha de registro
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(userDetailData.user.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    {userDetailData.user.lastLogin && (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <ScheduleIcon sx={{ color: '#1db954' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Última conexión
                            </Typography>
                            <Typography variant="body1">
                              {formatDateTime(userDetailData.user.lastLogin)}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider />
                      </>
                    )}

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Estado actual
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          icon={userDetailData.user.isBlocked ? <LockIcon /> : userDetailData.user.isActive ? <ActiveIcon /> : <InactiveIcon />}
                          label={userDetailData.user.isBlocked ? 'Bloqueado' : userDetailData.user.isActive ? 'Activo' : 'Inactivo'}
                          color={userDetailData.user.isBlocked ? 'error' : userDetailData.user.isActive ? 'success' : 'default'}
                          sx={{
                            backgroundColor: 
                              userDetailData.user.isBlocked ? '#e22134' : 
                              userDetailData.user.isActive ? '#1db954' : '#404040',
                            color: userDetailData.user.isBlocked || userDetailData.user.isActive ? '#000000' : '#ffffff',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProfileDialog} sx={{ color: 'text.secondary' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* CA 3 (Bloquear usuario): Diálogo de confirmación */}
      <Dialog 
        open={blockConfirmDialog.open} 
        onClose={closeBlockConfirmDialog}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }
        }}
      >
        <DialogTitle>
          {blockConfirmDialog.user?.isBlocked ? 'Desbloquear Usuario' : 'Bloquear Usuario'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea {blockConfirmDialog.user?.isBlocked ? 'desbloquear' : 'bloquear'} al usuario{' '}
            <strong>"{blockConfirmDialog.user?.name}"</strong>?
          </Typography>
          {!blockConfirmDialog.user?.isBlocked && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              El usuario no podrá iniciar sesión ni realizar acciones en la aplicación.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBlockConfirmDialog} sx={{ color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmBlock}
            color={blockConfirmDialog.user?.isBlocked ? 'success' : 'error'}
            variant="contained"
            sx={{
              backgroundColor: blockConfirmDialog.user?.isBlocked ? '#1db954' : '#e22134',
              '&:hover': {
                backgroundColor: blockConfirmDialog.user?.isBlocked ? '#169c46' : '#d32f2f',
              }
            }}
          >
            {blockConfirmDialog.user?.isBlocked ? 'Desbloquear' : 'Bloquear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
