import type {
  CatalogDetail,
  SongDetail,
  CollectionDetail,
  Availability,
  CollectionAppearance,
  PlaylistAppearance,
  AuditEvent,
} from '../types/catalogDetail';

// Datos mock para canciones
export const mockSongDetails: Record<string, SongDetail> = {
  '1': {
    id: '1',
    type: 'song',
    title: 'Bohemian Rhapsody',
    artists: [
      { id: 'a1', name: 'Queen' },
      { id: 'a2', name: 'Freddie Mercury' },
    ],
    collection: {
      id: 'col-1',
      title: 'A Night at the Opera',
      year: 1975,
    },
    trackNumber: 11,
    duration: 354, // 5:54
    explicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  '3': {
    id: '3',
    type: 'song',
    title: 'Imagine',
    artists: [{ id: 'a3', name: 'John Lennon' }],
    collection: {
      id: 'col-3',
      title: 'Imagine',
      year: 1971,
    },
    trackNumber: 1,
    duration: 183, // 3:03
    explicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },
  '5': {
    id: '5',
    type: 'song',
    title: 'Hotel California',
    artists: [{ id: 'a5', name: 'Eagles' }],
    collection: {
      id: 'col-5',
      title: 'Hotel California',
      year: 1976,
    },
    trackNumber: 1,
    duration: 391, // 6:31
    explicit: false,
    hasVideo: true,
    status: 'scheduled',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  '7': {
    id: '7',
    type: 'song',
    title: 'Smells Like Teen Spirit',
    artists: [{ id: 'a7', name: 'Nirvana' }],
    collection: {
      id: 'col-7',
      title: 'Nevermind',
      year: 1991,
    },
    trackNumber: 1,
    duration: 301, // 5:01
    explicit: true,
    hasVideo: true,
    status: 'blocked',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
  },
  '4': {
    id: '4',
    type: 'song',
    title: 'Stairway to Heaven',
    artists: [{ id: 'a4', name: 'Led Zeppelin' }],
    collection: {
      id: 'col-4',
      title: 'Led Zeppelin IV',
      year: 1971,
    },
    trackNumber: 4,
    duration: 482, // 8:02
    explicit: false,
    hasVideo: false,
    status: 'published',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  '8': {
    id: '8',
    type: 'song',
    title: 'Billie Jean',
    artists: [{ id: 'a8', name: 'Michael Jackson' }],
    collection: {
      id: 'col-8',
      title: 'Thriller',
      year: 1983,
    },
    trackNumber: 6,
    duration: 294, // 4:54
    explicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  '10': {
    id: '10',
    type: 'song',
    title: 'Sweet Child O Mine',
    artists: [{ id: 'a10', name: "Guns N' Roses" }],
    collection: {
      id: 'col-10',
      title: 'Appetite for Destruction',
      year: 1987,
    },
    trackNumber: 3,
    duration: 356, // 5:56
    explicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  '11': {
    id: '11',
    type: 'song',
    title: 'Rolling in the Deep',
    artists: [{ id: 'a11', name: 'Adele' }],
    collection: {
      id: 'col-11',
      title: '21',
      year: 2011,
    },
    trackNumber: 1,
    duration: 228, // 3:48
    explicit: false,
    hasVideo: true,
    status: 'scheduled',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
  },
  '12': {
    id: '12',
    type: 'song',
    title: 'Lose Yourself',
    artists: [{ id: 'a12', name: 'Eminem' }],
    collection: {
      id: 'col-12',
      title: '8 Mile Soundtrack',
      year: 2002,
    },
    trackNumber: 1,
    duration: 326, // 5:26
    explicit: true,
    hasVideo: false,
    status: 'published',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
};

// Datos mock para colecciones
export const mockCollectionDetails: Record<string, CollectionDetail> = {
  '2': {
    id: '2',
    type: 'collection',
    coverUrl: 'https://picsum.photos/300/300?random=2',
    title: 'Abbey Road',
    collectionType: 'album',
    year: 1969,
    tracks: [
      { position: 1, id: 's1', title: 'Come Together', duration: 259, explicit: false, hasVideo: true },
      { position: 2, id: 's2', title: 'Something', duration: 182, explicit: false, hasVideo: false },
      { position: 3, id: 's3', title: "Here Comes the Sun", duration: 185, explicit: false, hasVideo: true },
      { position: 4, id: 's4', title: 'Octopus\'s Garden', duration: 171, explicit: false, hasVideo: false },
    ],
    totalDuration: 797,
    hasExplicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  '6': {
    id: '6',
    type: 'collection',
    coverUrl: 'https://picsum.photos/300/300?random=6',
    title: 'The Dark Side of the Moon',
    collectionType: 'album',
    year: 1973,
    tracks: [
      { position: 1, id: 's10', title: 'Speak to Me', duration: 90, explicit: false, hasVideo: false },
      { position: 2, id: 's11', title: 'Breathe', duration: 163, explicit: false, hasVideo: true },
      { position: 3, id: 's12', title: 'On the Run', duration: 216, explicit: false, hasVideo: false },
      { position: 4, id: 's13', title: 'Time', duration: 413, explicit: false, hasVideo: true },
      { position: 5, id: 's14', title: 'Money', duration: 382, explicit: false, hasVideo: true },
    ],
    totalDuration: 1264,
    hasExplicit: false,
    hasVideo: true,
    status: 'blocked',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  'col-1': {
    id: 'col-1',
    type: 'collection',
    coverUrl: 'https://picsum.photos/300/300?random=1',
    title: 'A Night at the Opera',
    collectionType: 'album',
    year: 1975,
    tracks: [
      { position: 1, id: 's20', title: 'Death on Two Legs', duration: 223, explicit: false, hasVideo: false },
      { position: 11, id: '1', title: 'Bohemian Rhapsody', duration: 354, explicit: false, hasVideo: true },
    ],
    totalDuration: 577,
    hasExplicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  '9': {
    id: '9',
    type: 'collection',
    coverUrl: 'https://picsum.photos/300/300?random=9',
    title: 'Back in Black',
    collectionType: 'album',
    year: 1980,
    tracks: [
      { position: 1, id: 's30', title: 'Hells Bells', duration: 312, explicit: false, hasVideo: true },
      { position: 2, id: 's31', title: 'Shoot to Thrill', duration: 317, explicit: false, hasVideo: false },
      { position: 3, id: 's32', title: 'What Do You Do for Money Honey', duration: 215, explicit: false, hasVideo: false },
      { position: 4, id: 's33', title: 'Back in Black', duration: 255, explicit: false, hasVideo: true },
    ],
    totalDuration: 1099,
    hasExplicit: false,
    hasVideo: true,
    status: 'published',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
};

// Disponibilidad mock
export const mockAvailability: Record<string, Availability> = {
  '1': {
    effectiveStatus: 'published',
    regions: [],
  },
  '2': {
    effectiveStatus: 'published',
    regions: [],
  },
  '3': {
    effectiveStatus: 'published',
    regions: [],
  },
  '4': {
    effectiveStatus: 'published',
    regions: [],
  },
  '5': {
    effectiveStatus: 'scheduled',
    scheduledDate: '2025-12-01T00:00:00Z',
    regions: [],
  },
  '6': {
    effectiveStatus: 'blocked',
    blockedReason: 'Revisión de contenido pendiente',
    regions: [],
  },
  '7': {
    effectiveStatus: 'blocked',
    blockedReason: 'Solicitud de derechos de autor',
    regions: [],
  },
  '8': {
    effectiveStatus: 'published',
    regions: [],
  },
  '9': {
    effectiveStatus: 'published',
    regions: [],
  },
  '10': {
    effectiveStatus: 'published',
    regions: [],
  },
  '11': {
    effectiveStatus: 'scheduled',
    scheduledDate: '2025-11-15T00:00:00Z',
    regions: [],
  },
  '12': {
    effectiveStatus: 'published',
    regions: [],
  },
};

// Apariciones de canciones (en qué colecciones aparece)
export const mockSongAppearances: Record<string, CollectionAppearance[]> = {
  '1': [
    { id: 'col-1', type: 'album', title: 'A Night at the Opera', position: 11 },
    { id: 'pl-1', type: 'playlist', title: 'Rock Classics', position: 3, owner: 'Spotify' },
    { id: 'pl-2', type: 'playlist', title: 'Best of Queen', position: 1, owner: 'admin' },
  ],
  '3': [
    { id: 'col-3', type: 'album', title: 'Imagine', position: 1 },
    { id: 'pl-3', type: 'playlist', title: 'Peace & Love', position: 2, owner: 'user123' },
  ],
};

// Apariciones de colecciones (en qué playlists aparecen sus canciones)
export const mockCollectionAppearances: Record<string, PlaylistAppearance[]> = {
  '2': [
    { id: 'pl-4', title: 'Beatles Essentials', owner: 'Spotify', includedCount: 3, totalTracksInCollection: 4 },
    { id: 'pl-5', title: 'Classic Rock', owner: 'admin', includedCount: 2, totalTracksInCollection: 4 },
  ],
  'col-1': [
    { id: 'pl-1', title: 'Rock Classics', owner: 'Spotify', includedCount: 1, totalTracksInCollection: 2 },
    { id: 'pl-2', title: 'Best of Queen', owner: 'admin', includedCount: 1, totalTracksInCollection: 2 },
  ],
};

// Auditoría (solo para canciones)
export const mockAuditEvents: Record<string, AuditEvent[]> = {
  '7': [
    {
      id: 'e1',
      timestamp: '2024-11-05T10:30:00Z',
      user: 'admin@melodia.com',
      event: 'blocked',
      reason: 'Solicitud de derechos de autor pendiente',
    },
    {
      id: 'e2',
      timestamp: '2024-10-15T14:20:00Z',
      user: 'moderator@melodia.com',
      event: 'unblocked',
    },
    {
      id: 'e3',
      timestamp: '2024-10-10T09:15:00Z',
      user: 'admin@melodia.com',
      event: 'blocked',
      reason: 'Contenido reportado',
    },
  ],
  '1': [
    {
      id: 'e4',
      timestamp: '2024-09-01T12:00:00Z',
      user: 'admin@melodia.com',
      event: 'unblocked',
    },
  ],
};

// Función helper para obtener detalles
export function getCatalogDetail(id: string): CatalogDetail | null {
  return mockSongDetails[id] || mockCollectionDetails[id] || null;
}

export function getAvailability(id: string): Availability {
  return mockAvailability[id] || {
    effectiveStatus: 'published',
    regions: [],
  };
}

export function getSongAppearances(id: string): CollectionAppearance[] {
  return mockSongAppearances[id] || [];
}

export function getCollectionAppearances(id: string): PlaylistAppearance[] {
  return mockCollectionAppearances[id] || [];
}

export function getAuditEvents(id: string): AuditEvent[] {
  return mockAuditEvents[id] || [];
}
