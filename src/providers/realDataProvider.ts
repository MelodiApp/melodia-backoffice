import type { DataProvider } from "react-admin";
import { adminService } from "../services/adminService";
import { catalogService } from "../services/catalogService";
import { artistsService } from "../services/artistsService";

console.log('🔧 realDataProvider loaded');

/**
 * Data Provider real que conecta React Admin con el gateway
 * 
 * Utiliza los endpoints:
 * - GET /api/admin/users
 * - GET /api/admin/users/:id
 * - PATCH /api/admin/users/:id
 * - DELETE /api/admin/users/:id
 * - GET /api/admin/artists/discographies
 * - GET /api/admin/artists/songs/:song_id
 * - PUT /api/admin/artists/songs/:song_id
 * - PUT /api/admin/artists/songs/:song_id/status
 * - GET /api/admin/artists/collections/:collection_id
 * - PUT /api/admin/artists/collections/:collection_id
 * - PUT /api/admin/artists/collections/:collection_id/status
 */
export const realDataProvider: DataProvider = {
  // GET /api/admin/users - Obtener lista de recursos
  // También GET /api/admin/artists/discographies para catálogo
  getList: async (resource, params) => {
    // Forzar perPage a 10 para users, songs y collections; respetar el valor de catalog para permitir páginas más grandes
    if (resource === "users" || resource === "songs" || resource === "collections") {
        params.pagination = { page: params.pagination?.page || 1, perPage: 10 };
      }
    
    const { page = 1, perPage = 10 } = params.pagination || {};
    const filter = params.filter || {};

    if (resource === "users") {
      try {
        console.log('🔍 [RealDataProvider] Getting users with params:', { page, perPage, filter });
        const response = await adminService.getUsers({
          page,
          limit: perPage,
          search: filter.q,
          role: filter.role || undefined,
          status: filter.status || undefined,
          sortBy: params.sort?.field,
          sortOrder: (params.sort?.order?.toLowerCase() as 'asc' | 'desc') || undefined,
        });
        console.log('✅ [RealDataProvider] Users response:', { 
          total: response.total, 
          usersCount: response.users.length,
          requestedPage: page,
          requestedLimit: perPage,
          hasMore: response.hasMore
        });

        return {
          data: response.users,
          total: response.total,
        };
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        throw error;
      }
    }

    // Artists resource (public list of platform artists)
    if (resource === "artists") {
      try {
        const { page = 1, perPage = 20 } = params.pagination || {};
        const artists = await artistsService.getPlatformArtists();

        // Simple pagination on the frontend
        const start = (page - 1) * perPage;
        const paged = artists.slice(start, start + perPage);

        return {
          data: paged.map((a) => ({ id: a.id, name: a.name, profile_picture: a.profile_picture, followersCount: a.followersCount })),
          total: artists.length,
        };
      } catch (error) {
        console.error("Error obteniendo artistas:", error);
        throw error;
      }
    }

    if (resource === "catalog" || resource === "songs" || resource === "collections") {
      try {
        console.log('🔍 RealDataProvider: Fetching catalog with params:', params);
        
        // Mapear el estado del frontend al formato del backend
        const mapStatusToBackend = (status: string | undefined): 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED' | undefined => {
          if (!status || status === 'all') return undefined;
          const statusMap: Record<string, 'PUBLISHED' | 'BLOCKED' | 'PROGRAMMED'> = {
            'published': 'PUBLISHED',
            'blocked': 'BLOCKED',
            'scheduled': 'PROGRAMMED',
            'programmed': 'PROGRAMMED',
          };
          return statusMap[status.toLowerCase()];
        };

        // Mapear sortBy del frontend al backend
        const mapSortByToBackend = (sortBy: string | undefined): 'title' | 'publishedAt' | 'artistName' | undefined => {
          if (!sortBy) return undefined;
          const sortByMap: Record<string, 'title' | 'publishedAt' | 'artistName'> = {
            'title': 'title',
            'publishDate': 'publishedAt',
            'publishedAt': 'publishedAt',
            'artistName': 'artistName',
            'mainArtist': 'artistName',
          };
          return sortByMap[sortBy] || undefined;
        };

        // Preparar parámetros para el backend
        const catalogParams = {
          offset: (page - 1) * perPage, // React Admin usa páginas base 1, el backend usa offset
          limit: perPage,
          q: filter.search || filter.q,
          type: (filter.type && filter.type !== 'all') ? filter.type as 'song' | 'collection' : undefined,
          status: mapStatusToBackend(filter.status),
          fromDate: filter.fromDate,
          toDate: filter.toDate,
          sortBy: mapSortByToBackend(params.sort?.field),
          sortOrder: params.sort?.order?.toLowerCase() as 'asc' | 'desc' | undefined,
        };

        console.log('📤 RealDataProvider: Sending params to backend:', catalogParams);
        const response = await catalogService.getAllDiscographies(catalogParams);
        console.log('✅ RealDataProvider: Catalog response:', response);

        // Los items ya vienen mapeados por catalogService, pero verificamos por si acaso
        const statusMapFromBackend: Record<string, 'published' | 'blocked' | 'scheduled'> = {
          'PUBLISHED': 'published',
          'BLOCKED': 'blocked',
          'PROGRAMMED': 'scheduled',
          'published': 'published',
          'blocked': 'blocked',
          'scheduled': 'scheduled',
        };

        const mappedItems = response.items.map((item: any) => {
          const mappedStatus = statusMapFromBackend[item.status] || 'published';
          console.log(`🔍 Mapeando item "${item.title}": status backend="${item.status}" -> frontend="${mappedStatus}"`);
          return {
            ...item,
            status: mappedStatus,
          };
        });

        console.log('🔄 Items mapeados con status:', mappedItems);
        
        // Log detallado de TODOS los items para debug
        console.log('📋 TODOS los items recibidos del backend:', 
          mappedItems.map(i => ({ 
            id: i.id, 
            type: i.type, 
            title: i.title,
            collection: (i as any).collection,
            status: i.status,
            publishDate: i.publishDate 
          }))
        );

        // Deduplicar items por ID + type para evitar duplicados en la tabla
        // Usamos una clave compuesta (id + type) para asegurar que solo se eliminen duplicados exactos
        const uniqueItems = Array.from(
          new Map(mappedItems.map(item => [`${item.type}-${item.id}`, item])).values()
        );

        if (uniqueItems.length < mappedItems.length) {
          console.warn(`⚠️ Se encontraron ${mappedItems.length - uniqueItems.length} items duplicados que fueron eliminados`);
          console.log('📋 Items DUPLICADOS eliminados:', 
            mappedItems.filter(item => 
              !uniqueItems.some(u => u.id === item.id && u.type === item.type)
            ).map(i => ({ id: i.id, type: i.type, title: i.title }))
          );
        }

        console.log('📊 Total de items únicos retornados:', uniqueItems.length);

        // El backend ya se encarga de toda la lógica de filtrado, búsqueda y paginación
        // No necesitamos filtrar localmente
        return {
          data: uniqueItems,
          total: response.total,
        };
      } catch (error) {
        console.error("Error obteniendo catálogo:", error);
        throw error;
      }
    }

    return { data: [], total: 0 };
  },

  // GET /api/admin/users/:id - Obtener un recurso por ID
  getOne: async (resource, params) => {
    console.log('🚀 getOne llamado para:', resource, 'con ID:', params.id);
    
    if (resource === "users") {
      try {
        console.log('🔍 Fetching user from adminService...');
        const user = await adminService.getUserById(String(params.id));
        console.log('✅ Usuario obtenido:', user);
        console.log('✅ lastLogin:', user.lastLogin);
        console.log('✅ createdAt:', user.createdAt);
        return { data: user as any };
      } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        throw error;
      }
    }

    // Manejar songs específicamente
    if (resource === "songs") {
      try {
        console.log('🎯 realDataProvider.getOne - SONG id:', params.id);
        const id = String(params.id);
        const song = await catalogService.getSongById(id);
        console.log('✅ Song obtenida del backend:', song);
        console.log('🔍 song.collection:', song.collection);
        console.log('🔍 song.collection?.id:', song.collection?.id);
        console.log('🔍 String(song.collection?.id):', String(song.collection?.id));
        
        // Adaptar al formato que espera el frontend
        const adaptedSong = {
          id: id,
          type: 'song' as const,
          title: song.title,
          artists: song.artists?.map((artistName: string) => ({
            id: artistName.toLowerCase().replace(/\s+/g, '-'),
            name: artistName
          })),
          collection: song.collection ? {
            id: String(song.collection.id), // Usar el ID real de la colección
            title: song.collection.title,
            year: song.year
          } : undefined,
          trackNumber: song.position,
          duration: song.duration,
          explicit: false,
          hasVideo: false,
          status: song.status ? (() => {
            const statusMap: Record<string, 'published' | 'blocked' | 'scheduled'> = {
              'PUBLISHED': 'published',
              'BLOCKED': 'blocked', 
              'PROGRAMMED': 'scheduled',
              'published': 'published',
              'blocked': 'blocked',
              'scheduled': 'scheduled'
            };
            return statusMap[song.status] || 'published';
          })() : 'published',
          prevStatus: song.prevStatus ? (() => {
            const statusMap: Record<string, 'published' | 'blocked' | 'scheduled'> = {
              'PUBLISHED': 'published',
              'BLOCKED': 'blocked', 
              'PROGRAMMED': 'scheduled',
              'published': 'published',
              'blocked': 'blocked',
              'scheduled': 'scheduled'
            };
            return statusMap[song.prevStatus] || undefined;
          })() : undefined,
          prevPublishDate: song.prevPublishDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Song adaptada para frontend:', adaptedSong);
        return { data: adaptedSong };
      } catch (error) {
        console.error("❌ Error obteniendo song:", error);
        throw error;
      }
    }

    // Manejar collections específicamente
    if (resource === "collections") {
      try {
        console.log('🎯 realDataProvider.getOne - COLLECTION id:', params.id);
        const id = String(params.id);
        const collection = await catalogService.getCollectionById(id);
        console.log('✅ Collection obtenida del backend:', collection);
        
        // Mapear el status del backend al frontend
        const statusMap: Record<string, 'published' | 'blocked' | 'scheduled'> = {
          'PUBLISHED': 'published',
          'BLOCKED': 'blocked',
          'PROGRAMMED': 'scheduled',
          'published': 'published',
          'blocked': 'blocked',
          'scheduled': 'scheduled',
        };
        
        // El backend devuelve el status ya mapeado por catalogService
        const backendCollection = collection as any;
        
        // Adaptar al formato que espera el frontend
        const adaptedCollection = {
          id: id,
          type: 'collection' as const,
          coverUrl: collection.cover,
          title: collection.title,
          collectionType: collection.type.toLowerCase() as 'album' | 'ep' | 'single',
          year: collection.year,
          owner: collection.owner, // Nombre del artista propietario
          tracks: collection.songs.map((song) => ({
            position: song.position,
            id: `${id}-${song.position}`,
            title: song.title,
            duration: song.duration,
            explicit: false,
            hasVideo: false,
            status: song.status // Ya está mapeado por catalogService.getCollectionById
          })),
          totalDuration: collection.songs.reduce((sum, song) => sum + song.duration, 0),
          hasExplicit: false,
          hasVideo: false,
          status: statusMap[backendCollection.status] || backendCollection.status || 'published',
          prevStatus: collection.prevStatus ? (() => {
            const statusMap: Record<string, 'published' | 'blocked' | 'scheduled'> = {
              'PUBLISHED': 'published',
              'BLOCKED': 'blocked', 
              'PROGRAMMED': 'scheduled',
              'published': 'published',
              'blocked': 'blocked',
              'scheduled': 'scheduled'
            };
            return statusMap[collection.prevStatus] || undefined;
          })() : undefined,
          prevReleaseDate: collection.prevReleaseDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Collection adaptada para frontend:', adaptedCollection);
        return { data: adaptedCollection };
      } catch (error) {
        console.error("❌ Error obteniendo collection:", error);
        throw error;
      }
    }

    // Mantener el manejo legacy de "catalog" por si acaso
    if (resource === "catalog") {
      try {
        console.log('🎯 realDataProvider.getOne - resource:', resource, 'id:', params.id);
        // Necesitamos saber si es song o collection
        // Intentamos primero obtener como song, si falla intentamos como collection
        const id = String(params.id);
        
        try {
          const song = await catalogService.getSongById(id);
          console.log('✅ Song obtenida del backend:', song);
          
          // Adaptar al formato que espera el frontend
          const adaptedSong = {
            id: id,
            type: 'song' as const,
            title: song.title,
            artists: song.artists.map((artistName: string) => ({
              id: artistName.toLowerCase().replace(/\s+/g, '-'),
              name: artistName
            })),
            collection: song.collection ? {
              id: '0', // No tenemos el ID de la colección en la respuesta
              title: song.collection,
              year: song.year
            } : undefined,
            trackNumber: song.position,
            duration: song.duration,
            explicit: false, // No viene del backend
            hasVideo: false, // No viene del backend
            status: 'published' as const, // No viene del backend
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          console.log('✅ Song adaptada para frontend:', adaptedSong);
          return { data: adaptedSong };
        } catch (songError) {
          console.log('⚠️ Error obteniendo song, intentando collection:', songError);
          // Si falla, intentamos como collection
          const collection = await catalogService.getCollectionById(id);
          console.log('✅ Collection obtenida del backend:', collection);
          
          // Adaptar al formato que espera el frontend
          const adaptedCollection = {
            id: id,
            type: 'collection' as const,
            coverUrl: collection.cover,
            title: collection.title,
            collectionType: collection.type.toLowerCase() as 'album' | 'ep' | 'single',
            year: collection.year,
            tracks: collection.songs.map((song) => ({
              position: song.position,
              id: `${id}-${song.position}`,
              title: song.title,
              duration: song.duration,
              explicit: false,
              hasVideo: false
            })),
            totalDuration: collection.songs.reduce((sum, song) => sum + song.duration, 0),
            hasExplicit: false,
            hasVideo: false,
            status: 'published' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          console.log('✅ Collection adaptada para frontend:', adaptedCollection);
          return { data: adaptedCollection };
        }
      } catch (error) {
        console.error("❌ Error obteniendo item del catálogo:", error);
        throw error;
      }
    }

    if (resource === "artists") {
      try {
        const artist = await artistsService.getArtistProfile(String(params.id));
        // adapt to simple object for the React Admin show view
        const adapted = {
          id: String(artist.id),
          bannerUrl: artist.bannerUrl,
          name: artist.name ?? artist.artisticName,
          bio: artist.bio,
          followers_count: artist.followers_count,
        };
        return { data: adapted };
      } catch (error) {
        console.error("Error obteniendo artista:", error);
        throw error;
      }
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Obtener múltiples recursos por IDs
  getMany: async (resource, params) => {
    if (resource === "users") {
      try {
        const userPromises = params.ids.map((id) =>
          adminService.getUserById(String(id))
        );
        const users = await Promise.all(userPromises);
        return { data: users as any[] };
      } catch (error) {
        console.error("Error obteniendo múltiples usuarios:", error);
        return { data: [] };
      }
    }

    return { data: [] };
  },

  // No se usa en este caso
  getManyReference: async () => {
    return { data: [], total: 0 };
  },

  // Crear no está implementado en el backend
  create: async (resource) => {
    if (resource === "users") {
      console.warn("Creación de usuarios no implementada en el backend");
      throw new Error("Creación de usuarios no disponible");
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // PATCH /api/admin/users/:id - Actualizar un recurso
  update: async (resource, params) => {
    console.warn('🚀 UPDATE FUNCTION CALLED - resource:', resource, 'id:', params.id);
    if (resource === "users") {
      console.warn('📤 UPDATE - users resource detected');
      try {
        console.warn('📤 UPDATE - calling adminService');
        const result = await adminService.updateUser(
          String(params.id),
          params.data
        );
        console.warn('✅ UPDATE - success');
        return { data: result as any };
      } catch (error) {
        console.error("❌ UPDATE ERROR:", error);
        throw error;
      }
    }

    if (resource === "catalog" || resource === "songs" || resource === "collections") {
      try {
        const id = String(params.id);
        const itemType = params.data.type || params.previousData?.type;
        
        // Si se está actualizando solo el estado
        if (params.data.status && Object.keys(params.data).length === 1) {
          const reason = params.data.reason as string | undefined;
          if (!reason) {
            throw new Error('Se requiere una razón para cambiar el estado');
          }
          const updatedItem = await catalogService.updateItemStatus(
            id,
            itemType,
            params.data.status,
            undefined,
            reason,
          );
          return { data: updatedItem as any };
        }
        
        // Actualizar datos completos
        let updatedItem;
        if (itemType === 'song') {
          updatedItem = await catalogService.updateSong(id, params.data);
        } else {
          updatedItem = await catalogService.updateCollection(id, params.data);
        }
        
        return { data: updatedItem as any };
      } catch (error) {
        console.error("Error actualizando item del catálogo:", error);
        throw error;
      }
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Actualizar múltiples recursos
  updateMany: async (resource, params) => {
    if (resource === "users") {
      try {
        const updatePromises = params.ids.map((id) =>
          adminService.updateUser(String(id), params.data)
        );
        await Promise.all(updatePromises);
        return { data: params.ids };
      } catch (error) {
        console.error("Error actualizando múltiples usuarios:", error);
        throw error;
      }
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // DELETE /api/admin/users/:id - Eliminar un recurso
  delete: async (resource, params) => {
    if (resource === "users") {
      try {
        await adminService.deleteUser(String(params.id));
        return { data: { id: params.id } as any };
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        throw error;
      }
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Eliminar múltiples recursos
  deleteMany: async (resource, params) => {
    if (resource === "users") {
      try {
        const deletePromises = params.ids.map((id) =>
          adminService.deleteUser(String(id))
        );
        await Promise.all(deletePromises);
        return { data: params.ids };
      } catch (error) {
        console.error("Error eliminando múltiples usuarios:", error);
        throw error;
      }
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },
};
