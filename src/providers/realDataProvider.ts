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
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
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
        const response = await catalogService.getAllDiscographies({
          page,
          limit: perPage,
          search: filter.search || filter.q,
          status: filter.status !== 'all' ? filter.status : undefined,
        });
        console.log('✅ Catálogo obtenido:', response);

        let filteredData = response.items;
        console.log("filteredData inicial:", filteredData);
        console.log('🔍 Filtro aplicado:', filter);

        // Filtrar por tipo si es necesario
        if (filter.type && filter.type !== 'all') {
          filteredData = filteredData.filter((item) => item.type === filter.type);
        }

        // Filtrar localmente por otros criterios si es necesario
        if (filter.status && filter.status !== 'all') {
          filteredData = filteredData.filter((item) => item.status === filter.status);
        }

        return {
          data: filteredData as any[],
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
