import type { DataProvider } from "react-admin";
import { adminService } from "../services/adminService";
import { catalogService } from "../services/catalogService";

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
    const { page = 0, perPage = 20 } = params.pagination || {};
    const filter = params.filter || {};

    if (resource === "users") {
      try {
        const response = await adminService.getUsers({
          page,
          limit: perPage,
          search: filter.q,
        });

        let filteredData = response.users as any[];

        if (filter.role) {
          filteredData = filteredData.filter((user) => user.role === filter.role);
        }

        if (filter.status) {
          filteredData = filteredData.filter((user) => user.status === filter.status);
        }

        return {
          data: filteredData,
          total: response.total,
        };
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
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

        // El backend ya se encarga de toda la lógica de filtrado, búsqueda y paginación
        // No necesitamos filtrar localmente
        return {
          data: response.items as any[],
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
        const user = await adminService.getUserById(String(params.id));
        console.log('✅ Usuario obtenido:', user);
        console.log('✅ lastLogin:', user.lastLogin);
        console.log('✅ createdAt:', user.createdAt);
        return { data: user as any };
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
        throw error;
      }
    }

    if (resource === "catalog" || resource === "songs" || resource === "collections") {
      try {
        // Necesitamos saber si es song o collection
        // Intentamos primero obtener como song, si falla intentamos como collection
        const id = String(params.id);
        
        try {
          const song = await catalogService.getSongById(id);
          console.log('✅ Song obtenida:', song);
          return { data: song as any };
        } catch {
          // Si falla, intentamos como collection
          const collection = await catalogService.getCollectionById(id);
          console.log('✅ Collection obtenida:', collection);
          return { data: collection as any };
        }
      } catch (error) {
        console.error("Error obteniendo item del catálogo:", error);
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
    if (resource === "users") {
      try {
        const updatedUser = await adminService.updateUser(
          String(params.id),
          params.data
        );
        return { data: updatedUser as any };
      } catch (error) {
        console.error("Error actualizando usuario:", error);
        throw error;
      }
    }

    if (resource === "catalog" || resource === "songs" || resource === "collections") {
      try {
        const id = String(params.id);
        const itemType = params.data.type || params.previousData?.type;
        
        // Si se está actualizando solo el estado
        if (params.data.status && Object.keys(params.data).length === 1) {
          const updatedItem = await catalogService.updateItemStatus(
            id,
            itemType,
            params.data.status
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
