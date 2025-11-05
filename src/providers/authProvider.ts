import type { AuthProvider } from "react-admin";
import { adminService } from "../services/adminService";

/**
 * AuthProvider para React Admin - Conectado con el gateway
 * 
 * Utiliza los endpoints:
 * - POST /api/admin/login
 * - POST /api/admin/refresh-token
 */

interface AuthData {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    type: string;
  };
}

export const authProvider: AuthProvider = {
  // Método llamado cuando el usuario intenta iniciar sesión
  login: async ({ username, password }) => {
    try {
      // Llamar al endpoint POST /admin/login (el backend espera 'username')
      const response = await adminService.login({
        username, // El backend de admin espera 'username', no 'email'
        password,
      });

      // Guardar tokens y datos del usuario en localStorage
      const authData: AuthData = {
        access_token: response.tokens.access_token,
        refresh_token: response.tokens.refresh_token,
        user: response.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      localStorage.setItem("auth_token", response.tokens.access_token);

      // Debug: verificar que se guardó correctamente
      console.log("🔐 LOGIN SUCCESS - Token saved:", {
        hasAuth: !!localStorage.getItem("auth"),
        hasToken: !!localStorage.getItem("auth_token"),
        tokenLength: response.tokens.access_token.length,
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error en login:", error);
      return Promise.reject(
        new Error("Error de autenticación. Verifica tus credenciales.")
      );
    }
  },

  // Método llamado cuando el usuario hace clic en logout
  logout: async () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("auth_token");
    return Promise.resolve();
  },

  // Método llamado cuando la API retorna un error de autenticación
  checkError: async ({ status }) => {
    if (status === 401 || status === 403) {
      // Intentar renovar el token si tenemos un refresh_token
      const authStr = localStorage.getItem("auth");
      if (authStr) {
        try {
          const auth: AuthData = JSON.parse(authStr);
          const response = await adminService.refreshToken(auth.refresh_token);

          // Actualizar tokens (respuesta tiene la misma estructura que login)
          const newAuthData: AuthData = {
            access_token: response.tokens.access_token,
            refresh_token: response.tokens.refresh_token,
            user: response.user,
          };

          localStorage.setItem("auth", JSON.stringify(newAuthData));
          localStorage.setItem("auth_token", response.tokens.access_token);

          return Promise.resolve();
        } catch (refreshError) {
          // Si falla el refresh, hacer logout silenciosamente
          localStorage.removeItem("auth");
          localStorage.removeItem("auth_token");
          return Promise.reject({ message: false }); // false suprime la notificación
        }
      }

      // Si no hay refresh token, hacer logout silenciosamente
      localStorage.removeItem("auth");
      localStorage.removeItem("auth_token");
      return Promise.reject({ message: false }); // false suprime la notificación
    }
    return Promise.resolve();
  },

  // Método llamado cuando el usuario navega a una nueva ubicación
  checkAuth: async () => {
    const auth = localStorage.getItem("auth");
    return auth ? Promise.resolve() : Promise.reject({ message: false, logoutUser: false });
  },

  // Método llamado para obtener la identidad del usuario
  getIdentity: async () => {
    const authStr = localStorage.getItem("auth");
    if (!authStr) {
      return Promise.reject();
    }

    const auth: AuthData = JSON.parse(authStr);
    return Promise.resolve({
      id: String(auth.user.id),
      fullName: auth.user.username || auth.user.email,
      avatar: undefined,
    });
  },

  // Método llamado para obtener los permisos del usuario
  getPermissions: async () => {
    const authStr = localStorage.getItem("auth");
    if (!authStr) {
      return Promise.reject();
    }

    const auth: AuthData = JSON.parse(authStr);
    return Promise.resolve(auth.user.type);
  },
};
