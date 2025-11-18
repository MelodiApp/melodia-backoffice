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
}

interface BackendCollectionSong {
  title: string;
  position: number;
  duration: number;
}

interface BackendCollectionDetail {
  cover?: string;
  title: string;
  type: 'ALBUM' | 'EP' | 'SINGLE';
  year?: number;
  owner?: string;
  privacy?: string;
  songs: BackendCollectionSong[];
}

interface BackendDiscographyItem {
  id: number,
  type: 'song' | 'collection',
  title: string,
  artistName: string,
  collectionName: string | undefined,
  publishedAt: string,
  status: string;
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
    };
  }

  /**
   * Mapea una collection del backend al formato del frontend
   */
  private mapBackendCollectionToFrontend(collection: BackendDiscographyItem): CatalogItem {
    return {
      id: String(collection.id),
      type: collection.type,
      title: collection.title,
      mainArtist: collection.artistName || 'Unknown Artist',
      publishDate: collection.publishedAt,
      status: this.mapBackendStatus(collection.status),
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
    };
    return statusMap[status.toLowerCase()] || 'blocked';
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

    // Mapear items del backend al formato del frontend
    const allItems: CatalogItem[] = response.data.map((item) => {
      if (item.type === 'song') {
        return this.mapBackendSongToFrontend(item);
      } else {
        return this.mapBackendCollectionToFrontend(item);
      }
    });

    console.log('✅ CatalogService: Returning items:', allItems.length, 'total:', response.total);
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
    return song;
  }

  /**
   * GET /api/admin/artists/collections/:collection_id
   * Obtener una colección por ID (vista detallada)
   */
  async getCollectionById(collectionId: string): Promise<CollectionDetail> {
    const collection = await this.get<BackendCollectionDetail>(`${this.BASE_PATH}/collections/${collectionId}`);
    return collection;
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
  async updateSongStatus(songId: string, status: CatalogStatus, scheduledDate?: string): Promise<CatalogItem> {
    const action = this.mapFrontendStatusToAction(status);
    const body: { action: string; releaseDate?: string } = { action };
    if (status === 'scheduled' && scheduledDate) {
      body.releaseDate = scheduledDate;
    }
    const updatedSong = await this.put<BackendDiscographyItem, typeof body>(
      `${this.BASE_PATH}/songs/${songId}/status`,
      body
    );
    return this.mapBackendSongToFrontend(updatedSong);
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
  async updateCollectionStatus(collectionId: string, status: CatalogStatus, scheduledDate?: string): Promise<CatalogItem> {
    const action = this.mapFrontendStatusToAction(status);
    const body: { action: string; releaseDate?: string } = { action };
    if (status === 'scheduled' && scheduledDate) {
      body.releaseDate = scheduledDate;
    }
    console.log('🚀 CatalogService.updateCollectionStatus:', {
      collectionId,
      status,
      scheduledDate,
      action,
      body,
    });
    const updatedCollection = await this.put<BackendDiscographyItem, typeof body>(
      `${this.BASE_PATH}/collections/${collectionId}/status`,
      body
    );
    console.log('✅ CatalogService.updateCollectionStatus response:', updatedCollection);
    return this.mapBackendCollectionToFrontend(updatedCollection);
  }

  /**
   * Actualizar el estado de un item (song o collection)
   */
  async updateItemStatus(itemId: string, itemType: 'song' | 'collection', status: CatalogStatus, scheduledDate?: string): Promise<CatalogItem> {
    if (itemType === 'song') {
      return this.updateSongStatus(itemId, status);
    } else {
      return this.updateCollectionStatus(itemId, status, scheduledDate);
    }
  }
}

// Export singleton instance
export const catalogService = new CatalogService();
