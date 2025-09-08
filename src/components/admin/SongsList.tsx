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
  PlayArrow as PlayIcon,
  Visibility as VisibleIcon,
  VisibilityOff as HiddenIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material'
import { useSongs, useToggleSongVisibility, useToggleSongStatus, useDeleteSong, useGenres } from '../../hooks/useMusic'
import type { Genre, Song } from '../../types/song'

export const SongsList: React.FC = () => {
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: 'delete' | null
    song: Song | null
  }>({
    open: false,
    action: null,
    song: null,
  })

  // Query for songs and genres
  const { data: songsData, isLoading, error } = useSongs({
    search: search || undefined,
    genre: genreFilter || undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    isHidden: statusFilter === 'hidden' ? true : undefined,
  })
  
  const { data: genresData } = useGenres()

  // Mutations
  const toggleVisibilityMutation = useToggleSongVisibility()
  const toggleStatusMutation = useToggleSongStatus()
  const deleteSongMutation = useDeleteSong()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setSearchTerm(event.target.value)
  }

  const handleGenreFilter = (event: any) => {
    setGenreFilter(event.target.value)
  }

  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleToggleVisibility = (song: Song) => {
    toggleVisibilityMutation.mutate(song.id)
  }

  const handleToggleStatus = (song: Song) => {
    toggleStatusMutation.mutate(song.id)
  }

  const handleDeleteSong = () => {
    if (actionDialog.song) {
      deleteSongMutation.mutate(actionDialog.song.id)
      closeActionDialog()
    }
  }

  const openActionDialog = (action: 'delete', song: Song) => {
    setActionDialog({ open: true, action, song })
  }

  const closeActionDialog = () => {
    setActionDialog({ open: false, action: null, song: null })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getSongStatus = (song: Song) => {
    if (song.isHidden) {
      return { label: 'Hidden', color: 'error', icon: <HiddenIcon /> }
    }
    if (!song.isActive) {
      return { label: 'Inactive', color: 'default', icon: <InactiveIcon /> }
    }
    return { label: 'Active', color: 'success', icon: <ActiveIcon /> }
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
        Failed to load songs: {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
        Song Management
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
          placeholder="Search songs..."
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
          <InputLabel sx={{ color: '#b3b3b3' }}>Genre</InputLabel>
          <Select 
            value={genreFilter} 
            onChange={handleGenreFilter} 
            label="Genre"
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
            <MenuItem value="">All Genres</MenuItem>
            {genresData?.map((genre: Genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            <MenuItem value="hidden">Hidden</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Songs Table */}
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
              <TableCell>Song</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Album</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Plays</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songsData?.songs.map((song) => {
              const status = getSongStatus(song)
              return (
                <TableRow key={song.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={song.coverUrl} alt={song.title} variant="rounded">
                        <PlayIcon />
                      </Avatar>
                      <Typography variant="body2">{song.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{song.album}</TableCell>
                  <TableCell>
                    <Chip 
                      label={song.genre} 
                      size="small" 
                      variant="outlined"
                      sx={{
                        borderColor: '#1db954',
                        color: '#1db954',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatDuration(song.duration)}</TableCell>
                  <TableCell>{song.plays.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      icon={status.icon}
                      label={status.label}
                      color={status.color as any}
                      size="small"
                      variant="filled"
                      sx={{
                        backgroundColor: 
                          status.color === 'success' ? '#1db954' : 
                          status.color === 'error' ? '#e22134' : '#404040',
                        color: status.color === 'default' ? '#ffffff' : '#000000',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title={song.isHidden ? 'Show song' : 'Hide song'}>
                        <IconButton
                          onClick={() => handleToggleVisibility(song)}
                          color={song.isHidden ? 'success' : 'warning'}
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: song.isHidden ? '#1db954' : '#f57c00',
                              color: '#000000',
                            }
                          }}
                        >
                          {song.isHidden ? <VisibleIcon /> : <HiddenIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={song.isActive ? 'Deactivate song' : 'Activate song'}>
                        <IconButton
                          onClick={() => handleToggleStatus(song)}
                          color={song.isActive ? 'warning' : 'success'}
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: song.isActive ? '#f57c00' : '#1db954',
                              color: '#000000',
                            }
                          }}
                        >
                          {song.isActive ? <BlockIcon /> : <ActiveIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete song">
                        <IconButton
                          onClick={() => openActionDialog('delete', song)}
                          color="error"
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: '#e22134',
                              color: '#ffffff',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onClose={closeActionDialog}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }
        }}
      >
        <DialogTitle>Delete Song</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{actionDialog.song?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSong}
            color="error"
            variant="contained"
            sx={{
              backgroundColor: '#e22134',
              '&:hover': {
                backgroundColor: '#d32f2f',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
