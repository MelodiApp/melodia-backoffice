export type CatalogStatus = 'scheduled' | 'published' | 'blocked';

export interface CatalogItem {
  id: string;
  type: string;
  title: string;
  mainArtist: string;
  collection?: string;
  collectionId?: string;
  publishDate?: string;
  status: CatalogStatus;
  // Campos adicionales para songs
  duration?: number;
  explicit?: boolean;
  artistId?: number;
  // Campos adicionales para collections
  collectionType?: string;
}

// Detailed view types
export interface SongDetail {
  title: string;
  artists: string[];
  collection?: string;
  year?: number;
  position?: number;
  duration: number;
}

export interface CollectionSong {
  title: string;
  position: number;
  duration: number;
}

export interface CollectionDetail {
  cover?: string;
  title: string;
  type: 'ALBUM' | 'EP' | 'SINGLE';
  year?: number;
  owner?: string;
  privacy?: string;
  songs: CollectionSong[];
}

export interface CatalogFilters {
  search?: string;
  type?: string;
  status?: CatalogStatus | 'all';
  hasVideo?: boolean | 'all';
  publishDateFrom?: string;
  publishDateTo?: string;
  sortBy?: 'title' | 'publishDate' | 'status';
  sortOrder?: 'asc' | 'desc';
}
