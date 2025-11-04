import { BaseApiService } from "./apiClient";

// Backend response types (from users microservice)
interface BackendUser {
  id: number;
  username: string;
  email: string;
  type: "admin" | "listener" | "artist";
  status: string;
  created_at?: string;
  last_login?: string;
}

// Frontend types (React Admin compatible)
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: "admin" | "listener" | "artist";
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: BackendUser;
  tokens: {
    access_token: string;
    refresh_token: string;
    ip_token: string;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
}

/**
 * Admin Service - Conecta con los endpoints del gateway
 * Endpoints disponibles en /api/admin/*
 */
export class AdminService extends BaseApiService {
  private readonly BASE_PATH = "/admin";

  /**
   * Mapea usuario del backend al formato del frontend
   */
  private mapBackendUserToFrontend(backendUser: BackendUser): User {
    const now = new Date().toISOString();
    return {
      id: String(backendUser.id),
      username: backendUser.username,
      email: backendUser.email,
      fullName: backendUser.username,
      role: backendUser.type,
      status: backendUser.status,
      createdAt: backendUser.created_at || now,
      lastLogin: backendUser.last_login,
    };
  }

  /**
   * Mapea datos del frontend al formato del backend para updates
   */
  private mapFrontendUserToBackend(user: Partial<User>): any {
    const backendData: any = {};
    
    if (user.role !== undefined) {
      backendData.type = user.role;
    }
    
    if (user.status !== undefined) {
      backendData.status = user.status;
    }
    
    return backendData;
  }

  /**
   * POST /api/admin/login
   * Login de administrador
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return await this.post<LoginResponse, LoginRequest>(
      `${this.BASE_PATH}/login`,
      credentials
    );
  }

  /**
   * POST /api/admin/refresh-token
   * Refrescar token de autenticación
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return await this.post<LoginResponse, RefreshTokenRequest>(
      `${this.BASE_PATH}/refresh-token`,
      { refresh_token: refreshToken }
    );
  }

  /**
   * GET /api/admin/users
   * Obtener lista de usuarios
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("type", params.role);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${this.BASE_PATH}/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.get<{ users: BackendUser[]; total: number }>(url);

    return {
      users: response.users.map(user => this.mapBackendUserToFrontend(user)),
      total: response.total,
    };
  }

  /**
   * GET /api/admin/users/:id
   * Obtener un usuario por ID
   */
  async getUserById(id: string): Promise<User> {
    const backendUser = await this.get<BackendUser>(`${this.BASE_PATH}/users/${id}`);
    return this.mapBackendUserToFrontend(backendUser);
  }

  /**
   * PATCH /api/admin/users/:id
   * Actualizar un usuario
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const backendData = this.mapFrontendUserToBackend(data);
    const updatedUser = await this.patch<BackendUser, any>(
      `${this.BASE_PATH}/users/${id}`,
      backendData
    );
    return this.mapBackendUserToFrontend(updatedUser);
  }

  /**
   * DELETE /api/admin/users/:id
   * Eliminar un usuario
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    return await this.delete<{ message: string }>(
      `${this.BASE_PATH}/users/${id}`
    );
  }
}

// Export singleton instance
export const adminService = new AdminService();
