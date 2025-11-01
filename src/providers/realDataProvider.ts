import type { DataProvider } from "react-admin";
import { adminService } from "../services/adminService";

/**
 * Data Provider real que conecta React Admin con el gateway
 * 
 * Utiliza los endpoints:
 * - GET /api/admin/users
 * - GET /api/admin/users/:id
 * - PUT /api/admin/users/:id
 * - DELETE /api/admin/users/:id
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

    return { data: [], total: 0 };
  },

  // GET /api/admin/users/:id - Obtener un recurso por ID
  getOne: async (resource, params) => {
    if (resource === "users") {
      try {
        const user = await adminService.getUserById(String(params.id));
        return { data: user as any };
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
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

  // PUT /api/admin/users/:id - Actualizar un recurso
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
