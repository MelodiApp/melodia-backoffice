import { BaseApiService } from "./apiClient";
import type { CatalogItem, CatalogStatus, SongDetail, CollectionDetail } from "../types/catalog";

// Backend response types (from artists microservice)
// interface BackendSong {
//   id: number,
//   type: string,
//   title: string,
//   artistName: string,
//   collectionName: undefined, 
//   publishedAt: string,
//   status: string;
// }

// interface BackendCollection {
//   id: number;
//   type: string;
//   title: string;
//   artistName: string;
//   publishedAt: string;
//   status: string;
// }

// interface BackendDiscography {
//   returned_songs: BackendSong[];
//   returned_collections: BackendCollection[];
// }

// interface BackendDiscographiesResponse {
//   data: BackendDiscography;
//   total: number;
// }


// Backend response types for detailed views
interface BackendSongDetail {
  title: string;
  artists: string[];
  collection?: {
    id: number;
    title: string;
  };
  year?: number;
  position?: number;
  duration: number;
  status: 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED';
}

interface BackendCollectionSong {
  id?: number;
  title: string;
  position: number;
  duration: number;
  status: 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED';
}

interface BackendCollectionDetail {
  cover?: string;
  title: string;
  type: 'ALBUM' | 'EP' | 'SINGLE';
  year?: number;
  owner?: string;
  privacy?: string;
  songs: BackendCollectionSong[];
  status: 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED';
  isBlocked: boolean;
  releaseDate: string;
}

interface BackendDiscographyItem {
  id: number,
  type: 'song' | 'collection',
  title: string,
  artistName: string,
  collectionName: string | undefined,
  publishedAt: string,
  status: string;
  prevStatus?: string;
  prevReleaseDate?: string;
}

interface LibraryPlaylistDetail {
  id: number;
  name?: string;
  title?: string;
  user_id?: string | number;
  songs?: { id?: number; song_id?: number; order?: number; position?: number }[];
}
interface SearchBackendDiscographiesResponse {
  data: BackendDiscographyItem[];
  hasMore: boolean;
  total: number;
}

/**
 * Catalog Service - Conecta con los endpoints de artistas del gateway
 * Endpoints disponibles en /api/admin/artists/*
 */
export class CatalogService extends BaseApiService {
  private readonly BASE_PATH = "/admin/artists";

  /**
   * Mapea un song del backend al formato del frontend
   */
  private mapBackendSongToFrontend(song: BackendDiscographyItem): CatalogItem {
    return {
      id: String(song.id),
      type: 'song',
      title: song.title,
      mainArtist: song.artistName || 'Unknown Artist',
      collection: song.collectionName || undefined,
      publishDate: song.publishedAt,
      status: this.mapBackendStatus(song.status), // a chequear
      prevStatus: song.prevStatus ? this.mapBackendStatus(song.prevStatus) : undefined,
      prevPublishDate: song.prevReleaseDate || undefined,
    };
  }

  /**
   * Mapea una collection del backend al formato del frontend
   */
  private mapBackendCollectionToFrontend(collection: any): CatalogItem {
    // El backend ya calcula el status correctamente, solo mapearlo
    return {
      id: String(collection.id),
      type: collection.type,
      title: collection.title,
      mainArtist: collection.artist?.artisticName || collection.artistName || 'Unknown Artist',
      publishDate: collection.releaseDate || collection.publishedAt,
      status: this.mapBackendStatus(collection.status),
      prevStatus: collection.prevStatus ? this.mapBackendStatus(collection.prevStatus) : undefined,
      prevPublishDate: collection.prevReleaseDate || undefined,
    };
  }

  /**
   * Mapea el estado del backend al formato del frontend
   */
  private mapBackendStatus(status: string): CatalogStatus {
    const statusMap: Record<string, CatalogStatus> = {
      'published': 'published',
      'blocked': 'blocked',
      'programmed': 'scheduled',
      'scheduled': 'scheduled', // Por si ya viene en formato frontend
    };
    return statusMap[status?.toLowerCase()] || 'published';
  }

  /**
   * Mapea el estado del frontend a la action del backend
   */
  private mapFrontendStatusToAction(status: CatalogStatus): string {
    const actionMap: Record<CatalogStatus, string> = {
      'published': 'PUBLISHED',
      'blocked': 'BLOCKED',
      'scheduled': 'PROGRAMMED',
    };
    return actionMap[status] || 'BLOCKED';
  }

  /**
   * GET /api/admin/artists/discographies
   * Obtener todas las discografías de artistas
   */
  async getAllDiscographies(params: {
    offset: number;
    limit: number;
    q?: string;
    type?: 'song' | 'collection';
    status?: 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED';
    fromDate?: string;
    toDate?: string;
    sortBy?: 'title' | 'publishedAt' | 'artistName';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ items: CatalogItem[], hasMore: boolean, total: number }> {
    const queryParams = new URLSearchParams();

    // Parámetros de paginación
    queryParams.append("offset", params.offset.toString());
    queryParams.append("limit", params.limit.toString());
    
    // Parámetros de búsqueda y filtrado
    if (params.q) queryParams.append("q", params.q);
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);
    
    // Parámetros de ordenamiento
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${this.BASE_PATH}/discographies?${queryParams.toString()}`;
    console.log('🔍 CatalogService: Fetching discographies with URL:', url);
    
    const response = await this.get<SearchBackendDiscographiesResponse>(url);
    console.log('✅ CatalogService: Discographies response:', response);
    console.log('🔍 RAW backend items:', response.data);

    // Mapear items del backend al formato del frontend
    const allItems: CatalogItem[] = response.data.map((item) => {
      console.log(`🔧 Processing item "${item.title}":`, {
        id: item.id,
        type: item.type,
        status_BEFORE_mapping: item.status,
      });
      
      let mappedItem: CatalogItem;
      if (item.type === 'song') {
        mappedItem = this.mapBackendSongToFrontend(item);
      } else {
        mappedItem = this.mapBackendCollectionToFrontend(item);
      }
      
      console.log(`✅ Mapped item "${item.title}":`, {
        id: mappedItem.id,
        status_AFTER_mapping: mappedItem.status,
      });
      
      return mappedItem;
    });

    console.log('✅ CatalogService: Returning items:', allItems.length, 'total:', response.total);
    console.log('🔍 FINAL items being returned:', allItems);
    return {
      items: allItems,
      hasMore: response.hasMore,
      total: response.total,
    };
  }

  /**
   * GET /api/admin/artists/songs/:song_id
   * Obtener una canción por ID (vista detallada)
   */
  async getSongById(songId: string): Promise<SongDetail> {
    const song = await this.get<BackendSongDetail>(`${this.BASE_PATH}/songs/${songId}`);
    return {
      ...song,
      status: this.mapBackendStatus(song.status),
    };
  }

  /**
   * GET /api/admin/artists/collections/:collection_id
   * Obtener una colección por ID (vista detallada)
   */
  async getCollectionById(collectionId: string): Promise<CollectionDetail> {
    const collection = await this.get<BackendCollectionDetail>(`${this.BASE_PATH}/collections/${collectionId}`);
    return {
      cover: collection.cover,
      title: collection.title,
      type: collection.type,
      year: collection.year,
      owner: collection.owner,
      privacy: collection.privacy,
      songs: collection.songs.map(song => ({
        title: song.title,
        position: song.position,
        duration: song.duration,
        status: this.mapBackendStatus(song.status) as CatalogStatus,
      })),
      status: this.mapBackendStatus(collection.status),
      isBlocked: collection.isBlocked,
      releaseDate: collection.releaseDate,
    };
  }

  /**
   * PUT /api/admin/artists/songs/:song_id
   * Actualizar una canción
   */
  async updateSong(songId: string, data: Partial<CatalogItem>): Promise<CatalogItem> {
    const backendData: any = {};
    
    if (data.title !== undefined) backendData.title = data.title;
    if (data.duration !== undefined) backendData.duration = data.duration;
    if (data.explicit !== undefined) backendData.explicit = data.explicit;
    if (data.publishDate !== undefined) backendData.releaseDate = data.publishDate;
    
    const updatedSong = await this.put<BackendDiscographyItem, any>(
      `${this.BASE_PATH}/songs/${songId}`,
      backendData
    );
    return this.mapBackendSongToFrontend(updatedSong);
  }

  /**
   * PUT /api/admin/artists/songs/:song_id/status
   * Actualizar el estado de una canción
   */
  async updateSongStatus(songId: string, status: CatalogStatus, scheduledDate?: string, reason?: string): Promise<CatalogItem> {
    console.log('🚨 updateSongStatus - songId recibido:', songId, 'type:', typeof songId);

    const action = this.mapFrontendStatusToAction(status);
  const body: { action: string; releaseDate?: string; reason?: string } = { action };
    if (status === 'scheduled' && scheduledDate) {
      body.releaseDate = new Date(scheduledDate).toISOString();
    }
    if (reason) body.reason = reason;
    console.log('🚀 CatalogService.updateSongStatus:', {
      songId,
      status,
      scheduledDate,
      action,
      body,
      url: `${this.BASE_PATH}/songs/${songId}/status`,
    });
    const updatedSong = await this.put<any, typeof body>(
      `${this.BASE_PATH}/songs/${songId}/status`,
      body
    );
    console.log('✅ CatalogService.updateSongStatus response:', updatedSong);
    console.log('📊 Backend response details:', {
      id: updatedSong.id,
      title: updatedSong.title,
      isBlocked: updatedSong.isBlocked,
      releaseDate: updatedSong.releaseDate,
      releaseDate_type: typeof updatedSong.releaseDate,
    });

    // El backend devuelve un objeto Prisma Song, no un BackendDiscographyItem
    // Necesitamos calcular el status manualmente
    const now = new Date();
    const releaseDate = new Date(updatedSong.releaseDate);
    let calculatedStatus: 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED';

    console.log('🔍 Calculating status:', {
      now: now.toISOString(),
      releaseDate: releaseDate.toISOString(),
      isBlocked: updatedSong.isBlocked,
      comparison: releaseDate > now,
    });

    if (updatedSong.isBlocked) {
      calculatedStatus = 'BLOCKED';
    } else if (releaseDate > now) {
      calculatedStatus = 'PROGRAMMED';
    } else {
      calculatedStatus = 'PUBLISHED';
    }

    console.log('🎯 Status calculado:', {
      isBlocked: updatedSong.isBlocked,
      releaseDate: releaseDate,
      now: now,
      calculatedStatus: calculatedStatus
    });

    const mappedStatus = this.mapBackendStatus(calculatedStatus.toLowerCase());
    console.log('🎯 Status mapeado al frontend:', mappedStatus);

    // Devolver en el formato que espera el frontend
    return {
      id: String(updatedSong.id),
      type: 'song',
      title: updatedSong.title,
      mainArtist: 'Unknown Artist', // No viene en la respuesta del update
      collection: undefined, // No viene en la respuesta del update
      publishDate: updatedSong.releaseDate,
      status: mappedStatus,
    };
  }

  /**
   * PUT /api/admin/artists/collections/:collection_id
   * Actualizar una colección
   */
  async updateCollection(collectionId: string, data: Partial<CatalogItem>): Promise<CatalogItem> {
    const backendData: any = {};
    
    if (data.title !== undefined) backendData.title = data.title;
    if (data.publishDate !== undefined) backendData.releaseDate = data.publishDate;
    if (data.collectionType !== undefined) backendData.collectionType = data.collectionType;
    
    const updatedCollection = await this.put<BackendDiscographyItem, any>(
      `${this.BASE_PATH}/collections/${collectionId}`,
      backendData
    );
    return this.mapBackendCollectionToFrontend(updatedCollection);
  }

  /**
   * PUT /api/admin/artists/collections/:collection_id/status
   * Actualizar el estado de una colección
   */
  async updateCollectionStatus(collectionId: string, status: CatalogStatus, scheduledDate?: string, reason?: string): Promise<CatalogItem> {
    console.log('🚨 updateCollectionStatus - collectionId recibido:', collectionId, 'type:', typeof collectionId);
    
    const action = this.mapFrontendStatusToAction(status);
  const body: { action: string; releaseDate?: string; reason?: string } = { action };
    if (status === 'scheduled' && scheduledDate) {
      body.releaseDate = new Date(scheduledDate).toISOString();
    }
    if (reason) body.reason = reason;
    console.log('🚀 CatalogService.updateCollectionStatus:', {
      collectionId,
      status,
      scheduledDate,
      action,
      body,
      url: `${this.BASE_PATH}/collections/${collectionId}/status`,
    });
    const updatedCollection = await this.put<any, typeof body>(
      `${this.BASE_PATH}/collections/${collectionId}/status`,
      body
    );
    console.log('✅ CatalogService.updateCollectionStatus response:', updatedCollection);
    console.log('📊 Backend response details:', {
      id: updatedCollection.id,
      title: updatedCollection.title,
      isBlocked: updatedCollection.isBlocked,
      releaseDate: updatedCollection.releaseDate,
      releaseDate_type: typeof updatedCollection.releaseDate,
    });
    
    // El backend devuelve un objeto Prisma Collection, no un BackendDiscographyItem
    // Necesitamos calcular el status manualmente
    const now = new Date();
    const releaseDate = new Date(updatedCollection.releaseDate);
    let calculatedStatus: 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED';
    
    console.log('🔍 Calculating status:', {
      now: now.toISOString(),
      releaseDate: releaseDate.toISOString(),
      isBlocked: updatedCollection.isBlocked,
      comparison: releaseDate > now,
    });
    
    if (updatedCollection.isBlocked) {
      calculatedStatus = 'BLOCKED';
    } else if (releaseDate > now) {
      calculatedStatus = 'PROGRAMMED';
    } else {
      calculatedStatus = 'PUBLISHED';
    }
    
    console.log('🎯 Status calculado:', {
      isBlocked: updatedCollection.isBlocked,
      releaseDate: releaseDate,
      now: now,
      calculatedStatus: calculatedStatus
    });
    
    const mappedStatus = this.mapBackendStatus(calculatedStatus.toLowerCase());
    console.log('🎯 Status mapeado al frontend:', mappedStatus);
    
    // Devolver en el formato que espera el frontend
    return {
      id: String(updatedCollection.id),
      type: 'collection',
      title: updatedCollection.title,
      mainArtist: 'Unknown Artist', // No viene en la respuesta del update
      publishDate: updatedCollection.releaseDate,
      status: mappedStatus,
    };
  }

  /**
   * GET /api/admin/metrics/audit/song/:songId
   * Obtener auditoría de cambios de estado para una canción
   */
  async getSongAudits(songId: string): Promise<any[]> {
    // Use the admin proxy route on the gateway
    const url = `/admin/metrics/audit/song/${songId}`;
    console.log('📊 CatalogService.getSongAudits - requesting URL:', url);
    const audits = await this.get<any[]>(url);
    return audits;
  }

  /**
   * Actualizar el estado de un item (song o collection)
   */
  async updateItemStatus(itemId: string, itemType: 'song' | 'collection', status: CatalogStatus, scheduledDate?: string, reason?: string): Promise<CatalogItem> {
    if (itemType === 'song') {
      return this.updateSongStatus(itemId, status, scheduledDate, reason);
    } else {
      return this.updateCollectionStatus(itemId, status, scheduledDate, reason);
    }
  }

  /**
   * Obtener el estado detallado de una canción
   */
  async getSongStatus(songId: string): Promise<any> {
    console.log('🔍 [CatalogService] Getting song status for songId:', songId);
    const response = await this.client.get(`${this.BASE_PATH}/songs/${songId}/status`);
    console.log('✅ [CatalogService] Song status response:', response);
    return response.data;
  }

  /**
   * Obtener el estado detallado de una colección
   */
  async getCollectionStatus(collectionId: string): Promise<any> {
    console.log('🔍 [CatalogService] Getting collection status for collectionId:', collectionId);
    const response = await this.client.get(`${this.BASE_PATH}/collections/${collectionId}/status`);
    console.log('✅ [CatalogService] Collection status response:', response);
    return response.data;
  }

  /**
   * POST /libraries/playlists/appears-on
   * body: { songIds: number[] }
   * Returns an array of playlist objects that contain any of the provided songIds
   */
  async getPlaylistsAppearsOn(songIds: number[]): Promise<{ id: number; name?: string; title?: string }[]> {
    try {
      console.log('🔍 CatalogService.getPlaylistsAppearsOn - songIds:', songIds);
  const response = await this.client.post('/libraries/playlists/appears-on', { songIds });
      console.log('✅ CatalogService.getPlaylistsAppearsOn - response:', response.data);
  return response.data as { id: number; name?: string; title?: string }[];
    } catch (error) {
      console.error('❌ Error fetching playlists appears-on:', error);
      throw error;
    }
  }

  // New endpoints: songs/:id/appearances and collections/:id/appearances
  async getSongAppearances(songId: string): Promise<{ collections: any[]; playlists: any[] }> {
    const response = await this.get<any>(`${this.BASE_PATH}/songs/${songId}/appearances`);
    return response;
  }

  async getCollectionAppearances(collectionId: string): Promise<{ playlists: any[] }> {
    const response = await this.get<any>(`${this.BASE_PATH}/collections/${collectionId}/appearances`);
    return response;
  }

  /**
   * GET /libraries/playlists/:id
   * Returns detailed playlist metadata including songs (for computing included counts or owner).
   */
    async getLibraryPlaylistById(playlistId: string): Promise<LibraryPlaylistDetail> {
    try {
      console.log('🔍 CatalogService.getLibraryPlaylistById - id:', playlistId);
        const response = await this.client.get(`/libraries/playlists/id/${playlistId}`);
      console.log('✅ CatalogService.getLibraryPlaylistById - response:', response.data);
  // Normalize camelCase to snake_case if needed (userId -> user_id, songId -> song_id)
  const raw = response.data as any;
  const normalized = {
    ...raw,
    user_id: raw.user_id ?? raw.userId ?? raw.userId,
    songs: Array.isArray(raw.songs)
      ? raw.songs.map((s: any) => ({ ...s, song_id: s.song_id ?? s.songId ?? s.id }))
      : [],
  } as LibraryPlaylistDetail;
  return normalized;
    } catch (error) {
      console.error('❌ Error fetching playlist by id:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const catalogService = new CatalogService();
