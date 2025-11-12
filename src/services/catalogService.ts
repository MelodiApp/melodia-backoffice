import { BaseApiService } from "./apiClient";
import type { CatalogItem, CatalogStatus } from "../types/catalog";

// Backend response types (from artists microservice)
interface BackendSong {
    id: number,
    type: string,
    title: string,
    artistName: string,
    collectionName: undefined, 
    publishedAt: string,
    status: string;

}

interface BackendCollection {
  id: number;
  type: string;
  title: string;
  artistName: string;
  publishedAt: string;
  status: string;
}

interface BackendDiscography {
  returned_songs: BackendSong[];
  returned_collections: BackendCollection[];
}

interface BackendDiscographiesResponse {
  data: BackendDiscography;
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
  private mapBackendSongToFrontend(song: BackendSong): CatalogItem {
    return {
      id: String(song.id),
      type: 'song',
      title: song.title,
      mainArtist: song.artistName || 'Unknown Artist',
      collection: song.collectionName|| undefined,
      status: this.mapBackendStatus(song.status),
      publishDate: song.publishedAt,
    };
  }

  /**
   * Mapea una collection del backend al formato del frontend
   */
  private mapBackendCollectionToFrontend(collection: BackendCollection): CatalogItem {
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
      'scheduled': 'scheduled',
      'draft': 'blocked', // Mapear draft a blocked temporalmente
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
  async getAllDiscographies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: CatalogStatus;
  }): Promise<{ items: CatalogItem[]; total: number }> {
    console.log('🔍 CatalogService: getAllDiscographies called with params:', params);
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${this.BASE_PATH}/discographies${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.get<BackendDiscographiesResponse>(url);

    console.log('✅ AAAAAAAAAAAAAAAAAAAAAAAAAAACatálogo obtenido:', response);
    // Aplanar todas las canciones y colecciones en un solo array
    const allItems: CatalogItem[] = [];
          // Agregar canciones
      response.data.returned_songs.forEach((song) => {
        allItems.push(this.mapBackendSongToFrontend(song));
      });
      // Agregar colecciones
      response.data.returned_collections.forEach((collection) => {
        allItems.push(this.mapBackendCollectionToFrontend(collection));
      });

    console.log('✅ CatalogService: Returning items:', allItems.length, 'total:', response.total);
    return {
      items: allItems,
      total: response.total,
    };
  }

  /**
   * GET /api/admin/artists/songs/:song_id
   * Obtener una canción por ID
   */
  async getSongById(songId: string): Promise<CatalogItem> {
    const song = await this.get<BackendSong>(`${this.BASE_PATH}/songs/${songId}`);
    return this.mapBackendSongToFrontend(song);
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
    
    const updatedSong = await this.put<BackendSong, any>(
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
    const updatedSong = await this.put<BackendSong, typeof body>(
      `${this.BASE_PATH}/songs/${songId}/status`,
      body
    );
    return this.mapBackendSongToFrontend(updatedSong);
  }

  /**
   * GET /api/admin/artists/collections/:collection_id
   * Obtener una colección por ID
   */
  async getCollectionById(collectionId: string): Promise<CatalogItem> {
    const collection = await this.get<BackendCollection>(
      `${this.BASE_PATH}/collections/${collectionId}`
    );
    return this.mapBackendCollectionToFrontend(collection);
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
    
    const updatedCollection = await this.put<BackendCollection, any>(
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
    const updatedCollection = await this.put<BackendCollection, typeof body>(
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
