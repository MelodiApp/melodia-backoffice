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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
} from '@mui/icons-material'
import { useUsers, useToggleUserBlock, useToggleUserStatus, useUpdateUserRole, useDeleteUser } from '../../hooks/useUsers'
import type { User } from '../../services/userService'

export const UsersList: React.FC = () => {
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: 'delete' | 'role' | null
    user: User | null
  }>({
    open: false,
    action: null,
    user: null,
  })
  const [newRole, setNewRole] = useState('')

  // Query for users
  const { data: usersData, isLoading, error } = useUsers({
    search: search || undefined,
    role: roleFilter || undefined,
  })

  // Mutations
  const toggleBlockMutation = useToggleUserBlock()
  const toggleStatusMutation = useToggleUserStatus()
  const updateRoleMutation = useUpdateUserRole()
  const deleteUserMutation = useDeleteUser()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setSearchTerm(event.target.value)
  }

  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleRoleFilter = (event: any) => {
    setRoleFilter(event.target.value)
  }

  const handleToggleBlock = (user: User) => {
    toggleBlockMutation.mutate(user.id)
  }

  const handleToggleStatus = (user: User) => {
    toggleStatusMutation.mutate(user.id)
  }

  const handleUpdateRole = () => {
    if (actionDialog.user) {
      updateRoleMutation.mutate({ 
        id: actionDialog.user.id, 
        role: newRole as 'user' | 'admin' | 'moderator' 
      })
      closeActionDialog()
    }
  }

  const handleDeleteUser = () => {
    if (actionDialog.user) {
      deleteUserMutation.mutate(actionDialog.user.id)
      closeActionDialog()
    }
  }

  const openActionDialog = (action: 'delete' | 'role', user: User) => {
    setActionDialog({ open: true, action, user })
    if (action === 'role') {
      setNewRole(user.role)
    }
  }

  const closeActionDialog = () => {
    setActionDialog({ open: false, action: null, user: null })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'moderator':
        return 'warning'
      default:
        return 'primary'
    }
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
        Failed to load users: {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
        User Management
      </Typography>

      {/* Filters */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}>
        <TextField
          size="small"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ 
            minWidth: 250,
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
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: '#b3b3b3' }}>Status</InputLabel>
          <Select 
            value={statusFilter} 
            onChange={handleStatusFilter} 
            label="Status"
            sx={{
              backgroundColor: '#2a2a2a',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#404040',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1db954',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1db954',
              },
              '& .MuiSvgIcon-root': {
                color: '#b3b3b3',
              },
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Users Table */}
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
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar} alt={user.name}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user.isBlocked ? (
                      <Chip
                        icon={<BlockIcon />}
                        label="Blocked"
                        color="error"
                        size="small"
                      />
                    ) : user.isActive ? (
                      <Chip
                        icon={<ActiveIcon />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<InactiveIcon />}
                        label="Inactive"
                        color="default"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title={user.isBlocked ? 'Unblock user' : 'Block user'}>
                      <IconButton
                        onClick={() => handleToggleBlock(user)}
                        color={user.isBlocked ? 'success' : 'error'}
                        size="small"
                      >
                        {user.isBlocked ? <UnlockIcon /> : <LockIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.isActive ? 'Deactivate user' : 'Activate user'}>
                      <IconButton
                        onClick={() => handleToggleStatus(user)}
                        color={user.isActive ? 'warning' : 'success'}
                        size="small"
                      >
                        {user.isActive ? <InactiveIcon /> : <ActiveIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Change role">
                      <IconButton
                        onClick={() => openActionDialog('role', user)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete user">
                      <IconButton
                        onClick={() => openActionDialog('delete', user)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Dialogs */}
      <Dialog open={actionDialog.open} onClose={closeActionDialog}>
        <DialogTitle>
          {actionDialog.action === 'delete' && 'Delete User'}
          {actionDialog.action === 'role' && 'Change User Role'}
        </DialogTitle>
        <DialogContent>
          {actionDialog.action === 'delete' && (
            <Typography>
              Are you sure you want to delete {actionDialog.user?.name}? This action cannot be undone.
            </Typography>
          )}
          {actionDialog.action === 'role' && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>Cancel</Button>
          {actionDialog.action === 'delete' && (
            <Button
              onClick={handleDeleteUser}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          )}
          {actionDialog.action === 'role' && (
            <Button
              onClick={handleUpdateRole}
              color="primary"
              variant="contained"
            >
              Update Role
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
