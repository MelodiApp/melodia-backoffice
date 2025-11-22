export interface Artist {
  id: string;
  name: string;
}

export interface SongDetail {
  id: string;
  type: 'song';
  title: string;
  artists: Artist[];
  collection?: {
    id: string;
    title: string;
    year?: number;
  };
  trackNumber?: number;
  duration: number; // en segundos
  explicit: boolean;
  hasVideo: boolean;
  status: 'scheduled' | 'published' | 'blocked';
  prevStatus?: 'scheduled' | 'published' | 'blocked';
  prevPublishDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Track {
  position: number;
  id: string;
  title: string;
  duration: number;
  explicit: boolean;
  hasVideo: boolean;
}

export interface CollectionDetail {
  id: string;
  type: 'collection';
  coverUrl?: string;
  title: string;
  collectionType: 'album' | 'ep' | 'single' | 'playlist';
  year?: number;
  owner?: string; // para playlists
  isPrivate?: boolean; // para playlists
  tracks: Track[];
  totalDuration: number;
  hasExplicit: boolean;
  hasVideo: boolean;
  status: 'scheduled' | 'published' | 'blocked';
  prevStatus?: 'scheduled' | 'published' | 'blocked';
  prevReleaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type CatalogDetail = SongDetail | CollectionDetail;

// Disponibilidad
export interface RegionAvailability {
  region: string;
  available: boolean;
  reason?: string;
}

export interface Availability {
  effectiveStatus: 'blocked' | 'scheduled' | 'published';
  scheduledDate?: string;
  regions: RegionAvailability[];
  blockedReason?: string;
}

// Apariciones
export interface CollectionAppearance {
  id: string;
  type: 'album' | 'ep' | 'single' | 'playlist';
  title: string;
  position: number;
  owner?: string; // para playlists
}

export interface PlaylistAppearance {
  id: string;
  title: string;
  owner: string;
  includedCount: number;
  totalTracksInCollection: number;
}

// Auditoría
export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  event: 'blocked' | 'unblocked';
  reason?: string;
}
