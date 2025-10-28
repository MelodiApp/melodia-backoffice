export interface Playlist {
  id: string;
  name: string;
  description: string;
  type: "weekly_top" | "monthly_top" | "trending" | "custom";
  coverUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  songs: PlaylistSong[];
}

export interface PlaylistSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl?: string;
  addedAt: string;
}

export interface PlaylistsResponse {
  playlists: Playlist[];
  total: number;
  page: number;
  limit: number;
}

export interface PlaylistFilters {
  type?: "weekly_top" | "monthly_top" | "trending" | "custom";
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
