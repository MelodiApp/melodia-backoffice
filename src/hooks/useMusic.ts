import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { musicService } from '../services/musicService'
import { queryKeys } from './queryClient'
import type { CatalogFilters, BlockRequest, AvailabilityPolicy } from '../services/musicService'
import type { Playlist, PlaylistsResponse, PlaylistFilters } from '../types/playlist'
import type { Song, SongsResponse, SongFilters, Genre } from '../types/song'

// Get catalog items with filters
export const useCatalog = (filters?: CatalogFilters) => {
  return useQuery({
    queryKey: queryKeys.music.songs.list(filters || {}),
    queryFn: () => musicService.getCatalog(filters),
  })
}

// Get catalog item detail
export const useCatalogDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.music.songs.detail(id),
    queryFn: () => musicService.getCatalogDetail(id),
    enabled: !!id,
  })
}

// Get available regions
export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => musicService.getRegions(),
    staleTime: 1000 * 60 * 60, // 1 hour (rarely changes)
  })
}

// Get reason codes for blocking
export const useReasonCodes = () => {
  return useQuery({
    queryKey: ['reason-codes'],
    queryFn: () => musicService.getReasonCodes(),
    staleTime: 1000 * 60 * 60, // 1 hour (rarely changes)
  })
}

// Block/unblock catalog item
export const useBlockCatalogItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: BlockRequest) => musicService.blockCatalogItem(request),
    onSuccess: () => {
      // Invalidate catalog queries to refetch data
      queryClient.invalidateQueries({ queryKey: queryKeys.music.songs.lists() })
    },
    onError: (error) => {
      console.error('Failed to block/unblock catalog item:', error)
    },
  })
}

// Update availability policy
export const useUpdateAvailabilityPolicy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, policy }: { itemId: string; policy: AvailabilityPolicy }) => 
      musicService.updateAvailabilityPolicy(itemId, policy),
    onSuccess: () => {
      // Invalidate catalog queries to refetch data
      queryClient.invalidateQueries({ queryKey: queryKeys.music.songs.lists() })
    },
    onError: (error) => {
      console.error('Failed to update availability policy:', error)
    },
  })
}

// Playlists hooks
export const usePlaylists = (filters?: PlaylistFilters) => {
  return useQuery<PlaylistsResponse>({
    queryKey: ['playlists', filters],
    queryFn: async (): Promise<PlaylistsResponse> => {
      const mockPlaylists: Playlist[] = [
        {
          id: '1',
          name: 'Top Weekly Hits',
          description: 'The most popular hits this week',
          type: 'weekly_top',
          coverUrl: 'https://example.com/covers/weekly-top.jpg',
          isActive: true,
          createdAt: '2024-06-01T12:00:00Z',
          updatedAt: '2024-06-01T12:00:00Z',
          songs: [
            {
              id: 'song1',
              title: 'Popular Song 1',
              artist: 'Artist 1',
              album: 'Album 1',
              duration: 180,
              coverUrl: 'https://example.com/covers/song1.jpg',
              addedAt: '2024-06-01T12:00:00Z'
            }
          ]
        },
        {
          id: '2',
          name: 'Monthly Charts',
          description: 'Top songs of the month',
          type: 'monthly_top',
          coverUrl: 'https://example.com/covers/monthly-top.jpg',
          isActive: false,
          createdAt: '2024-06-02T15:30:00Z',
          updatedAt: '2024-06-02T15:30:00Z',
          songs: []
        }
      ]

      const filteredPlaylists = mockPlaylists.filter(playlist => {
        if (filters?.type && playlist.type !== filters.type) return false
        if (filters?.isActive !== undefined && playlist.isActive !== filters.isActive) return false
        if (filters?.search && !playlist.name.toLowerCase().includes(filters.search.toLowerCase())) return false
        return true
      })

      return {
        playlists: filteredPlaylists,
        total: filteredPlaylists.length,
        page: filters?.page || 1,
        limit: filters?.limit || 20
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useTogglePlaylistStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (playlistId: string) => {
      // Mock implementation
      console.log('Toggling playlist status for:', playlistId)
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
    },
  })
}

// Songs hooks
export const useSongs = (filters?: SongFilters) => {
  return useQuery<SongsResponse>({
    queryKey: ['songs', filters],
    queryFn: async (): Promise<SongsResponse> => {
      const mockSongs: Song[] = [
        {
          id: '1',
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          album: 'A Night at the Opera',
          genre: 'Rock',
          duration: 354,
          coverUrl: 'https://example.com/covers/bohemian-rhapsody.jpg',
          isActive: true,
          isHidden: false,
          plays: 1250000,
          likes: 85000,
          createdAt: '2023-01-15T10:00:00Z',
          updatedAt: '2023-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Imagine',
          artist: 'John Lennon',
          album: 'Imagine',
          genre: 'Pop',
          duration: 183,
          coverUrl: 'https://example.com/covers/imagine.jpg',
          isActive: false,
          isHidden: true,
          plays: 980000,
          likes: 67000,
          createdAt: '2023-02-01T10:00:00Z',
          updatedAt: '2023-02-01T10:00:00Z'
        }
      ]

      const filteredSongs = mockSongs.filter(song => {
        if (filters?.search && !song.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !song.artist.toLowerCase().includes(filters.search.toLowerCase())) return false
        if (filters?.genre && song.genre !== filters.genre) return false
        if (filters?.isActive !== undefined && song.isActive !== filters.isActive) return false
        if (filters?.isHidden !== undefined && song.isHidden !== filters.isHidden) return false
        return true
      })

      return {
        songs: filteredSongs,
        total: filteredSongs.length,
        page: filters?.page || 1,
        limit: filters?.limit || 20
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: async (): Promise<Genre[]> => [
      { id: '1', name: 'Rock', description: 'Rock music genre' },
      { id: '2', name: 'Pop', description: 'Pop music genre' },
      { id: '3', name: 'Jazz', description: 'Jazz music genre' },
      { id: '4', name: 'Classical', description: 'Classical music genre' },
      { id: '5', name: 'Hip Hop', description: 'Hip Hop music genre' }
    ],
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useToggleSongVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (songId: string) => {
      console.log('Toggling song visibility for:', songId)
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
  })
}

export const useToggleSongStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (songId: string) => {
      console.log('Toggling song status for:', songId)
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
  })
}

export const useDeleteSong = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (songId: string) => {
      console.log('Deleting song:', songId)
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
    },
  })
}
