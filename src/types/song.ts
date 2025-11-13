export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  coverUrl?: string;
  isActive: boolean;
  isHidden: boolean;
  plays: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface SongsResponse {
  songs: Song[];
  total: number;
  page: number;
  limit: number;
}

export interface SongFilters {
  search?: string;
  genre?: string;
  isActive?: boolean;
  isHidden?: boolean;
  page?: number;
  limit?: number;
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
}
