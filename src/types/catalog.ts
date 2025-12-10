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
  prevStatus?: CatalogStatus;
  prevPublishDate?: string;
  hasVideo?: boolean;
  duration?: number;
  explicit?: boolean;
  artistId?: number;
  // Campos adicionales para collections
  collectionType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Detailed view types
export interface SongDetail {
  title: string;
  artists: string[];
  collection?: {
    id: number;
    title: string;
  };
  year?: number;
  position?: number;
  duration: number;
  status: CatalogStatus;
  prevStatus?: CatalogStatus;
  prevPublishDate?: string;
}

export interface CollectionSong {
  title: string;
  position: number;
  duration: number;
  status: CatalogStatus;
}

export interface CollectionDetail {
  cover?: string;
  title: string;
  type: 'ALBUM' | 'EP' | 'SINGLE';
  year?: number;
  owner?: string;
  privacy?: string;
  songs: CollectionSong[];
  status: CatalogStatus;
  isBlocked: boolean;
  releaseDate: string;
  prevStatus?: CatalogStatus;
  prevReleaseDate?: string;
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
