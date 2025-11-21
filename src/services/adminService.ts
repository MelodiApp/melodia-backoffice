import { BaseApiService } from "./apiClient";

// Backend response types (from users microservice)
interface BackendUser {
  id: number;
  username: string;
  email: string;
  type: "admin" | "listener" | "artist";
  status: string;
  createdAt?: string;
  lastLogin?: string;
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
    accessToken: string;
    refreshToken: string;
    ipToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  skip?: number;
  limit?: number;
  hasMore?: boolean;
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
    console.log('🔍 Backend user data:', backendUser);
    console.log('🔍 lastLogin:', backendUser.lastLogin);
    console.log('🔍 createdAt:', backendUser.createdAt);
    return {
      id: String(backendUser.id),
      username: backendUser.username,
      email: backendUser.email,
      fullName: backendUser.username,
      role: backendUser.type,
      status: backendUser.status,
      createdAt: backendUser.createdAt || now,
      lastLogin: backendUser.lastLogin,
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
      { refreshToken }
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
    console.log('🔍 [AdminService] getUsers called with params:', params);
    const queryParams = new URLSearchParams();
    
    const limit = params?.limit || 10;
    console.log('🔢 [AdminService] Using limit:', limit);
    if (params?.page !== undefined) {
      const skip = (params.page - 1) * limit;
      console.log(`🔢 [AdminService] Page ${params.page} with limit ${limit} = skip ${skip}`);
      queryParams.append("skip", skip.toString());
    }
    queryParams.append("limit", limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("type", params.role);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${this.BASE_PATH}/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    console.log('🔍 [AdminService] Final URL:', url);
    const response = await this.get<{
      users: BackendUser[];
      total: number;
      skip: number;
      limit: number;
      hasMore: boolean;
    }>(url);
    console.log('✅ [AdminService] Users response:', response);

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
    console.log('🚀 ADMIN SERVICE - updateUser START - id:', id, 'data:', data);
    const backendData = this.mapFrontendUserToBackend(data);
    console.log('📤 ADMIN SERVICE - backend data:', backendData);
    const updatedUser = await this.patch<BackendUser, any>(
      `${this.BASE_PATH}/users/${id}`,
      backendData
    );
    console.log('✅ ADMIN SERVICE - updateUser SUCCESS');
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
