import { Card, CardContent, CardHeader } from "@mui/material";
import { Dashboard as DashboardIcon, People, LibraryMusic } from "@mui/icons-material";

/**
 * Dashboard personalizado para React Admin
 *
 * Este componente se mostrará en la página principal del backoffice
 */
export const Dashboard = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#121212", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px", color: "#1db954" }}>
        <DashboardIcon
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        Panel de Control - Melodia Backoffice
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <Card sx={{ backgroundColor: "#181818", color: "#ffffff" }}>
          <CardHeader
            avatar={<People style={{ color: "#1db954" }} />}
            title="Usuarios"
            subheader="Gestión de usuarios"
            sx={{ 
              "& .MuiCardHeader-title": { color: "#ffffff" },
              "& .MuiCardHeader-subheader": { color: "#b3b3b3" }
            }}
          />
          <CardContent>
            <p style={{ color: "#ffffff" }}>Administra usuarios del sistema</p>
            <p
              style={{ marginTop: "10px", color: "#b3b3b3", fontSize: "14px" }}
            >
              Roles disponibles: Admin, Oyente, Artista
            </p>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: "#181818", color: "#ffffff" }}>
          <CardHeader
            avatar={<LibraryMusic style={{ color: "#1db954" }} />}
            title="Catálogo"
            subheader="Gestión de contenidos"
            sx={{ 
              "& .MuiCardHeader-title": { color: "#ffffff" },
              "& .MuiCardHeader-subheader": { color: "#b3b3b3" }
            }}
          />
          <CardContent>
            <p style={{ color: "#ffffff" }}>Explora y gestiona el contenido del catálogo</p>
            <p
              style={{ marginTop: "10px", color: "#b3b3b3", fontSize: "14px" }}
            >
              Canciones, álbumes, playlists y más
            </p>
          </CardContent>
        </Card>
      </div>

      <Card sx={{ backgroundColor: "#181818", color: "#ffffff" }}>
        <CardHeader 
          title="Bienvenido al Backoffice de Melodia" 
          sx={{ 
            "& .MuiCardHeader-title": { color: "#ffffff" }
          }}
        />
        <CardContent>
          <p style={{ color: "#ffffff" }}>
            Selecciona "Usuarios" o "Catálogo" del menú lateral para comenzar a administrar
            el contenido.
          </p>
          <p style={{ marginTop: "10px", color: "#b3b3b3" }}>
            Desde aquí podrás gestionar usuarios, cambiar sus roles,
            activar/desactivar cuentas, administrar contenido del catálogo y más.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
