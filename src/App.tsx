import { Admin, Resource } from "react-admin";
import { People } from "@mui/icons-material";

// Providers
import { authProvider, dataProvider } from "./providers";
import { i18nProvider } from "./providers/i18nProvider";

// Tema
import { spotifyTheme } from "./theme/adminTheme";

// Dashboard
import { Dashboard } from "./components/Dashboard";

// Recursos - Solo Usuarios por ahora
import { UserList, UserEdit, UserCreate, UserShow } from "./resources/users";

/**
 * Aplicación principal de React Admin
 *
 * CONFIGURACIÓN:
 * - authProvider: Maneja la autenticación (login/logout)
 * - dataProvider: Datos mockeados para desarrollo
 * - theme: Tema personalizado con estilo Spotify
 *
 * ROLES DISPONIBLES:
 * - admin: Administrador con acceso completo
 * - listener: Usuario oyente
 * - artist: Usuario artista
 */
function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      theme={spotifyTheme}
      dashboard={Dashboard}
      title="Melodia Backoffice"
      disableTelemetry
    >
      {/* Recurso de Usuarios */}
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        show={UserShow}
        icon={People}
        options={{ label: "Usuarios" }}
      />
    </Admin>
  );
}

export default App;
