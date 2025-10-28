import { BaseApiService } from "./apiClient";

// User interface - información básica requerida
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  isBlocked: boolean;
}

// API response interfaces
export interface UsersResponse {
  users: User[];
  total: number;
}

export interface UserDetailResponse {
  user: User;
}

export interface BlockUserResponse {
  user: User;
  message: string;
}

// User service con solo las funcionalidades requeridas
export class UserService extends BaseApiService {
  // Mock data para demostración
  private mockUsers: User[] = [
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@melodia.com",
      role: "admin",
      avatar: "https://i.pravatar.cc/150?img=1",
      createdAt: "2024-01-15T10:30:00Z",
      lastLogin: "2024-09-07T08:45:00Z",
      isActive: true,
      isBlocked: false,
    },
    {
      id: "2",
      name: "María González",
      email: "maria.gonzalez@melodia.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?img=2",
      createdAt: "2024-02-20T14:15:00Z",
      lastLogin: "2024-09-06T20:30:00Z",
      isActive: true,
      isBlocked: false,
    },
    {
      id: "3",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@melodia.com",
      role: "moderator",
      avatar: "https://i.pravatar.cc/150?img=3",
      createdAt: "2024-03-10T09:00:00Z",
      lastLogin: "2024-08-15T16:20:00Z",
      isActive: true,
      isBlocked: true,
    },
    {
      id: "4",
      name: "Ana Martínez",
      email: "ana.martinez@melodia.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?img=4",
      createdAt: "2024-04-05T11:45:00Z",
      lastLogin: "2024-07-20T12:10:00Z",
      isActive: false,
      isBlocked: false,
    },
    {
      id: "5",
      name: "Luis Torres",
      email: "luis.torres@melodia.com",
      role: "user",
      avatar: "https://i.pravatar.cc/150?img=5",
      createdAt: "2024-05-12T16:30:00Z",
      lastLogin: "2024-09-07T07:15:00Z",
      isActive: true,
      isBlocked: false,
    },
  ];

  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // CA 1 & CA 2: Listar usuarios del sistema con información básica
  async getUsers(params?: { search?: string }): Promise<UsersResponse> {
    await this.delay();

    let filteredUsers = [...this.mockUsers];

    // CA 3: Filtrar por búsqueda en nombre o email
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      );
    }

    return {
      users: filteredUsers,
      total: filteredUsers.length,
    };
  }

  // CA 1 & CA 2 (Visualizar perfil): Obtener perfil detallado de un usuario
  async getUserById(id: string): Promise<UserDetailResponse> {
    await this.delay();

    const user = this.mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return { user };
  }

  // CA 1, CA 2, CA 3 & CA 4 (Bloquear usuario): Bloquear/desbloquear usuario
  async toggleUserBlock(id: string): Promise<BlockUserResponse> {
    await this.delay();

    const userIndex = this.mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }

    const updatedUser = {
      ...this.mockUsers[userIndex],
      isBlocked: !this.mockUsers[userIndex].isBlocked,
    };

    this.mockUsers[userIndex] = updatedUser;

    const action = updatedUser.isBlocked ? "bloqueado" : "desbloqueado";

    return {
      user: updatedUser,
      message: `Usuario ${action} exitosamente`,
    };
  }
}

// Export singleton instance
export const userService = new UserService();
