import { BaseApiService } from "./apiClient";
import type { CatalogItem, CatalogStatus } from "../types/catalog";

// Backend response types (from artists microservice)
interface BackendSong {
  id: number;
  title: string;
  duration: number;
  status: string;
  explicit: boolean;
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
  artistId: number;
  collectionId?: number;
  artist?: {
    id: number;
    name: string;
  };
  collection?: {
    id: number;
    title: string;
  };
}

interface BackendCollection {
  id: number;
  title: string;
  releaseDate?: string;
  status: string;
  collectionType: string;
  createdAt: string;
  updatedAt: string;
  artistId: number;
  artist?: {
    id: number;
    name: string;
  };
}

interface BackendDiscography {
  artistId: number;
  artistName: string;
  songs: BackendSong[];
  collections: BackendCollection[];
}

interface BackendDiscographiesResponse {
  discographies: BackendDiscography[];
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
      mainArtist: song.artist?.name || 'Unknown Artist',
      collection: song.collection?.title,
      collectionId: song.collectionId ? String(song.collectionId) : undefined,
      publishDate: song.releaseDate,
      status: this.mapBackendStatus(song.status),
      hasVideo: false, // El backend no proporciona esta info aún
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      duration: song.duration,
      explicit: song.explicit,
      artistId: song.artistId,
    };
  }

  /**
   * Mapea una collection del backend al formato del frontend
   */
  private mapBackendCollectionToFrontend(collection: BackendCollection): CatalogItem {
    return {
      id: String(collection.id),
      type: 'collection',
      title: collection.title,
      mainArtist: collection.artist?.name || 'Unknown Artist',
      publishDate: collection.releaseDate,
      status: this.mapBackendStatus(collection.status),
      hasVideo: false, // El backend no proporciona esta info aún
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      collectionType: collection.collectionType,
      artistId: collection.artistId,
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
   * Mapea el estado del frontend al formato del backend
   */
  private mapFrontendStatus(status: CatalogStatus): string {
    const statusMap: Record<CatalogStatus, string> = {
      'published': 'published',
      'blocked': 'blocked',
      'scheduled': 'scheduled',
    };
    return statusMap[status] || 'blocked';
  }

  /**
   * GET /api/admin/artists/discographies
   * Obtener todas las discografías de artistas
   */
  async getAllDiscographies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ items: CatalogItem[]; total: number }> {
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
    
    response.forEach((discography) => {
      // Agregar canciones
      discography.songs.forEach((song) => {
        allItems.push(this.mapBackendSongToFrontend(song));
      });
      
      // Agregar colecciones
      discography.collections.forEach((collection) => {
        allItems.push(this.mapBackendCollectionToFrontend(collection));
      });
    });

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
  async updateSongStatus(songId: string, status: CatalogStatus): Promise<CatalogItem> {
    const backendStatus = this.mapFrontendStatus(status);
    const updatedSong = await this.put<BackendSong, { status: string }>(
      `${this.BASE_PATH}/songs/${songId}/status`,
      { status: backendStatus }
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
  async updateCollectionStatus(collectionId: string, status: CatalogStatus): Promise<CatalogItem> {
    const backendStatus = this.mapFrontendStatus(status);
    const updatedCollection = await this.put<BackendCollection, { status: string }>(
      `${this.BASE_PATH}/collections/${collectionId}/status`,
      { status: backendStatus }
    );
    return this.mapBackendCollectionToFrontend(updatedCollection);
  }

  /**
   * Actualizar el estado de un item (song o collection)
   */
  async updateItemStatus(itemId: string, itemType: 'song' | 'collection', status: CatalogStatus): Promise<CatalogItem> {
    if (itemType === 'song') {
      return this.updateSongStatus(itemId, status);
    } else {
      return this.updateCollectionStatus(itemId, status);
    }
  }
}

// Export singleton instance
export const catalogService = new CatalogService();
