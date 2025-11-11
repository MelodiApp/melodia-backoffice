export type CatalogItemType = 'song' | 'collection';

export type CatalogStatus = 'scheduled' | 'published' | 'blocked';

export interface CatalogItem {
  id: string;
  type: CatalogItemType;
  title: string;
  mainArtist: string;
  collection?: string;
  collectionId?: string;
  publishDate?: string;
  status: CatalogStatus;
  hasVideo: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos adicionales para songs
  duration?: number;
  explicit?: boolean;
  artistId?: number;
  // Campos adicionales para collections
  collectionType?: string;
}

export interface CatalogFilters {
  search?: string;
  type?: CatalogItemType | 'all';
  status?: CatalogStatus | 'all';
  hasVideo?: boolean | 'all';
  publishDateFrom?: string;
  publishDateTo?: string;
  sortBy?: 'title' | 'publishDate' | 'status';
  sortOrder?: 'asc' | 'desc';
}
