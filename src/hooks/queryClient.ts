import { QueryClient } from '@tanstack/react-query'

// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: import.meta.env.PROD,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})

// Query keys factory for consistency
export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  
  // Music
  music: {
    all: ['music'] as const,
    songs: {
      all: ['music', 'songs'] as const,
      lists: () => [...queryKeys.music.songs.all, 'list'] as const,
      list: (filters: Record<string, any>) => [...queryKeys.music.songs.lists(), filters] as const,
      details: () => [...queryKeys.music.songs.all, 'detail'] as const,
      detail: (id: string) => [...queryKeys.music.songs.details(), id] as const,
    },
    playlists: {
      all: ['music', 'playlists'] as const,
      lists: () => [...queryKeys.music.playlists.all, 'list'] as const,
      list: (filters: Record<string, any>) => [...queryKeys.music.playlists.lists(), filters] as const,
      details: () => [...queryKeys.music.playlists.all, 'detail'] as const,
      detail: (id: string) => [...queryKeys.music.playlists.details(), id] as const,
    },
    artists: {
      all: ['music', 'artists'] as const,
      lists: () => [...queryKeys.music.artists.all, 'list'] as const,
      list: (filters: Record<string, any>) => [...queryKeys.music.artists.lists(), filters] as const,
    },
    genres: ['music', 'genres'] as const,
    stats: ['music', 'stats'] as const,
  },
} as const
