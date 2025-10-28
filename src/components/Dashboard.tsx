import { Card, CardContent, CardHeader } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
} from '@mui/icons-material';

/**
 * Dashboard personalizado para React Admin
 * 
 * Este componente se mostrará en la página principal del backoffice
 */
export const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: '#1db954' }}>
        <DashboardIcon style={{ marginRight: '10px', verticalAlign: 'middle' }} />
        Panel de Control - Melodia Backoffice
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card>
          <CardHeader
            avatar={<People style={{ color: '#1db954' }} />}
            title="Usuarios"
            subheader="Gestión de usuarios"
          />
          <CardContent>
            <p>Administra usuarios del sistema</p>
            <p style={{ marginTop: '10px', color: '#b3b3b3', fontSize: '14px' }}>
              Roles disponibles: Admin, Oyente, Artista
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Bienvenido al Backoffice de Melodia" />
        <CardContent>
          <p>Selecciona "Usuarios" del menú lateral para comenzar a administrar el contenido.</p>
          <p style={{ marginTop: '10px', color: '#b3b3b3' }}>
            Desde aquí podrás gestionar usuarios, cambiar sus roles, activar/desactivar cuentas y más.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
