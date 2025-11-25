import type { DataProvider } from "react-admin";
import { mockUsers } from "./mockData";

console.log('🟡 Mock dataProvider loaded');

/**
 * Data Provider con datos mockeados para desarrollo
 *
 * Simula una API REST con datos en memoria.
 * Cuando conectes tu backend real, puedes reemplazar esto con:
 * import jsonServerProvider from 'ra-data-json-server';
 * export const dataProvider = jsonServerProvider(apiUrl);
 */

// Estado en memoria para simular persistencia
const users = [...mockUsers];

export const dataProvider: DataProvider = {
  // Obtener lista de recursos
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = "id", order = "ASC" } = params.sort || {};
    const filter = params.filter || {};

    if (resource === "users") {
      // Filtrar
      let filteredUsers = [...users];

      if (filter.q) {
        const searchTerm = filter.q.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.fullName.toLowerCase().includes(searchTerm),
        );
      }

      if (filter.role) {
        filteredUsers = filteredUsers.filter(
          (user) => user.role === filter.role,
        );
      }

      if (filter.status) {
        filteredUsers = filteredUsers.filter(
          (user) => user.status === filter.status,
        );
      }

      // Ordenar
      filteredUsers.sort((a, b) => {
        const aValue = a[field as keyof typeof a];
        const bValue = b[field as keyof typeof b];

        if (!aValue || !bValue) return 0;
        if (aValue < bValue) return order === "ASC" ? -1 : 1;
        if (aValue > bValue) return order === "ASC" ? 1 : -1;
        return 0;
      });

      // Paginar
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedUsers = filteredUsers.slice(start, end);

      return {
        data: paginatedUsers,
        total: filteredUsers.length,
      };
    }

    return { data: [], total: 0 };
  },

  // Obtener un recurso por ID
  getOne: async (resource, params) => {
    if (resource === "users") {
      const user = users.find((u) => u.id === params.id);
      if (!user) {
        throw new Error(`Usuario con id ${params.id} no encontrado`);
      }
      return { data: user };
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Obtener múltiples recursos por IDs
  getMany: async (resource, params) => {
    if (resource === "users") {
      const foundUsers = users.filter((user) => params.ids.includes(user.id));
      return { data: foundUsers };
    }

    return { data: [] };
  },

  // Obtener múltiples referencias
  getManyReference: async () => {
    // No se usa en este caso
    return { data: [], total: 0 };
  },

  // Crear un recurso
  create: async (resource, params) => {
    if (resource === "users") {
      const newUser = {
        ...params.data,
        id: String(users.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      return { data: newUser };
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Actualizar un recurso
  update: async (resource, params) => {
    console.log('🟡 MOCK UPDATE called for resource:', resource, 'id:', params.id);
    if (resource === "users") {
      const index = users.findIndex((u) => u.id === params.id);
      if (index === -1) {
        throw new Error(`Usuario con id ${params.id} no encontrado`);
      }

      const updatedUser = {
        ...users[index],
        ...params.data,
        updatedAt: new Date().toISOString(),
      };
      users[index] = updatedUser;

      return { data: updatedUser };
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Actualizar múltiples recursos
  updateMany: async (resource, params) => {
    if (resource === "users") {
      const updatedIds: string[] = [];

      params.ids.forEach((id) => {
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
          users[index] = {
            ...users[index],
            ...params.data,
            updatedAt: new Date().toISOString(),
          };
          updatedIds.push(String(id));
        }
      });

      return { data: updatedIds };
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Eliminar un recurso
  delete: async (resource, params) => {
    console.log("DataProvider delete: Iniciando eliminación");
    console.log("DataProvider delete: Recurso:", resource);
    console.log("DataProvider delete: ID a eliminar:", params.id);

    if (resource === "users") {
      const index = users.findIndex((u) => u.id === params.id);
      if (index === -1) {
        console.error(
          "DataProvider delete: Usuario no encontrado con id:",
          params.id,
        );
        throw new Error(`Usuario con id ${params.id} no encontrado`);
      }

      const deletedUser = users[index];
      console.log(
        "DataProvider delete: Usuario encontrado:",
        deletedUser.username,
      );
      users.splice(index, 1);
      console.log("DataProvider delete: Usuario eliminado exitosamente");
      console.log(
        "DataProvider delete: Total usuarios restantes:",
        users.length,
      );

      return { data: deletedUser };
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },

  // Eliminar múltiples recursos
  deleteMany: async (resource, params) => {
    if (resource === "users") {
      const deletedIds: string[] = [];

      params.ids.forEach((id) => {
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
          users.splice(index, 1);
          deletedIds.push(String(id));
        }
      });

      return { data: deletedIds };
    }

    throw new Error(`Recurso ${resource} no soportado`);
  },
};
