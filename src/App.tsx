import { Admin, Resource } from "react-admin";
import { People, LibraryMusic } from "@mui/icons-material";

// Providers
import { authProvider, realDataProvider } from "./providers";
import { i18nProvider } from "./providers/i18nProvider";

// Tema
import { spotifyTheme } from "./theme/adminTheme";

// Dashboard
import { Dashboard } from "./components/Dashboard";

// Recursos - Usuarios y Catálogo
import { UserList, UserEdit, UserShow } from "./resources/users";
import { CatalogList, CatalogShow } from "./resources/catalog";

/**
 * Aplicación principal de React Admin
 *
 * CONFIGURACIÓN:
 * - authProvider: Conectado con POST /api/admin/login
 * - dataProvider: Conectado con endpoints /api/admin/users
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
      dataProvider={realDataProvider}
      i18nProvider={i18nProvider}
      theme={spotifyTheme}
      dashboard={Dashboard}
      title="Melodia Backoffice"
      disableTelemetry
    >
      {/* Recurso de Usuarios - Sin create (no implementado en backend) */}
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        show={UserShow}
        icon={People}
        options={{ label: "Usuarios" }}
      />

      {/* Recurso de Catálogo - Gestión de contenido */}
      <Resource
        name="catalog"
        list={CatalogList}
        show={CatalogShow}
        icon={LibraryMusic}
        options={{ label: "Catálogo" }}
      />

      {/* Recursos internos para songs y collections (no aparecen en menú) */}
      <Resource
        name="songs"
        show={CatalogShow}
      />
      <Resource
        name="collections"
        show={CatalogShow}
      />
    </Admin>
  );
}

export default App;
