import { useQuery } from '@tanstack/react-query'
import { musicService, type SongMetrics, type AlbumMetrics, type UserMetrics, type ArtistMetrics, type MetricsFilters } from '../services/musicService'

// Query keys for metrics
export const metricsKeys = {
  all: ['metrics'] as const,
  songs: () => [...metricsKeys.all, 'songs'] as const,
  song: (id: string, filters?: MetricsFilters) => [...metricsKeys.songs(), id, filters] as const,
  albums: () => [...metricsKeys.all, 'albums'] as const,
  album: (id: string, filters?: MetricsFilters) => [...metricsKeys.albums(), id, filters] as const,
  users: () => [...metricsKeys.all, 'users'] as const,
  user: (filters?: MetricsFilters) => [...metricsKeys.users(), filters] as const,
  artists: () => [...metricsKeys.all, 'artists'] as const,
  artist: (id: string, filters?: MetricsFilters) => [...metricsKeys.artists(), id, filters] as const,
}

// Song metrics hook
export function useSongMetrics(songId: string, filters?: MetricsFilters) {
  return useQuery({
    queryKey: metricsKeys.song(songId, filters),
    queryFn: () => musicService.getSongMetrics(songId, filters),
    enabled: !!songId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}

// Album metrics hook
export function useAlbumMetrics(albumId: string, filters?: MetricsFilters) {
  return useQuery({
    queryKey: metricsKeys.album(albumId, filters),
    queryFn: () => musicService.getAlbumMetrics(albumId, filters),
    enabled: !!albumId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}

// User metrics hook
export function useUserMetrics(filters?: MetricsFilters) {
  return useQuery({
    queryKey: metricsKeys.user(filters),
    queryFn: () => musicService.getUserMetrics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}

// Artist metrics hook
export function useArtistMetrics(artistId: string, filters?: MetricsFilters) {
  return useQuery({
    queryKey: metricsKeys.artist(artistId, filters),
    queryFn: () => musicService.getArtistMetrics(artistId, filters),
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  })
}