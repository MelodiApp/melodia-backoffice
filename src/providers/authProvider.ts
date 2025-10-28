import type { AuthProvider } from "react-admin";

/**
 * AuthProvider para React Admin
 *
 * IMPORTANTE: Esta es una implementación básica para desarrollo.
 * En producción, debes implementar autenticación real con JWT, OAuth, etc.
 *
 * Buenas prácticas:
 * - Almacenar tokens en localStorage de forma segura
 * - Implementar refresh tokens
 * - Validar tokens en cada request
 * - Manejar expiración de sesiones
 */
export const authProvider: AuthProvider = {
  // Método llamado cuando el usuario intenta iniciar sesión
  login: async ({ username, password }) => {
    // TODO: Implementar llamada real a tu API de autenticación
    // Por ahora, acepta cualquier credencial para desarrollo

    if (username && password) {
      // Simular un token de autenticación
      localStorage.setItem(
        "auth",
        JSON.stringify({ username, token: "fake-jwt-token" }),
      );
      return Promise.resolve();
    }

    return Promise.reject(new Error("Usuario o contraseña inválidos"));
  },

  // Método llamado cuando el usuario hace clic en logout
  logout: async () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },

  // Método llamado cuando la API retorna un error de autenticación
  checkError: async ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Método llamado cuando el usuario navega a una nueva ubicación
  // para verificar si la sesión sigue activa
  checkAuth: async () => {
    const auth = localStorage.getItem("auth");
    return auth ? Promise.resolve() : Promise.reject();
  },

  // Método llamado para obtener la identidad del usuario
  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      return Promise.reject();
    }

    const { username } = JSON.parse(auth);
    return Promise.resolve({
      id: username,
      fullName: username,
      avatar: undefined,
    });
  },

  // Método llamado para obtener los permisos del usuario
  getPermissions: async () => {
    // TODO: Implementar lógica de permisos según tu backend
    // Por ahora, retorna 'admin' para todos
    return Promise.resolve("admin");
  },
};
