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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material'
import {
  PlaylistPlay as PlaylistIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
  Visibility as ViewIcon,
  Settings as ManageIcon,
} from '@mui/icons-material'
import { usePlaylists, useTogglePlaylistStatus } from '../../hooks/useMusic'
import type { Playlist, PlaylistFilters } from '../../types/playlist'

export const PlaylistsList: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [viewDialog, setViewDialog] = useState(false)

  // Query for playlists
  const { data: playlistsData, isLoading, error } = usePlaylists({
    type: typeFilter ? (typeFilter as PlaylistFilters['type']) : undefined,
  })

  // Mutations
  const toggleStatusMutation = useTogglePlaylistStatus()

  const handleTypeFilter = (event: any) => {
    setTypeFilter(event.target.value)
  }

  const handleToggleStatus = (playlist: Playlist) => {
    toggleStatusMutation.mutate(playlist.id)
  }

  const handleViewPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setViewDialog(true)
  }

  const closeViewDialog = () => {
    setViewDialog(false)
    setSelectedPlaylist(null)
  }

  const getPlaylistTypeColor = (type: string) => {
    switch (type) {
      case 'weekly_top':
        return 'primary'
      case 'monthly_top':
        return 'secondary'
      case 'trending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatPlaylistType = (type: string) => {
    switch (type) {
      case 'weekly_top':
        return 'Weekly Top'
      case 'monthly_top':
        return 'Monthly Top'
      case 'trending':
        return 'Trending'
      case 'custom':
        return 'Custom'
      default:
        return type
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
        Failed to load playlists: {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
        Playlist Management
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
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: '#b3b3b3' }}>Playlist Type</InputLabel>
          <Select 
            value={typeFilter} 
            onChange={handleTypeFilter} 
            label="Playlist Type"
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
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="weekly_top">Weekly Top</MenuItem>
            <MenuItem value="monthly_top">Monthly Top</MenuItem>
            <MenuItem value="trending">Trending</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Playlists Table */}
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
              <TableCell>Playlist</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Songs Count</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playlistsData?.playlists.map((playlist) => (
              <TableRow key={playlist.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={playlist.coverUrl} alt={playlist.name} variant="rounded">
                      <PlaylistIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {playlist.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {playlist.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatPlaylistType(playlist.type)}
                    color={getPlaylistTypeColor(playlist.type) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{playlist.songs.length} songs</TableCell>
                <TableCell>
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={playlist.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    label={playlist.isActive ? 'Active' : 'Inactive'}
                    color={playlist.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="View songs">
                      <IconButton
                        onClick={() => handleViewPlaylist(playlist)}
                        color="primary"
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={playlist.isActive ? 'Deactivate playlist' : 'Activate playlist'}>
                      <IconButton
                        onClick={() => handleToggleStatus(playlist)}
                        color={playlist.isActive ? 'warning' : 'success'}
                        size="small"
                      >
                        {playlist.isActive ? <InactiveIcon /> : <ActiveIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage playlist">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => console.log('Manage playlist', playlist.id)}
                      >
                        <ManageIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Playlist Dialog */}
      <Dialog open={viewDialog} onClose={closeViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPlaylist?.name}
        </DialogTitle>
        <DialogContent>
          {selectedPlaylist && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedPlaylist.description}
              </Typography>
              
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Songs ({selectedPlaylist.songs.length})
                  </Typography>
                  <List dense>
                    {selectedPlaylist.songs.map((song, index) => (
                      <ListItem key={song.id}>
                        <ListItemAvatar>
                          <Avatar src={song.coverUrl} alt={song.title} variant="rounded" sx={{ width: 32, height: 32 }}>
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={song.title}
                          secondary={`${song.artist} • ${song.album}`}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
