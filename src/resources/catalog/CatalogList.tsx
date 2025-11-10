import { Box, Typography } from '@mui/material';
import { Title } from 'react-admin';
import CatalogContent from './CatalogContent';

export default function CatalogList() {
  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Title title="Gestión de Contenidos" />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
          Catálogo
        </Typography>
        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
          Explora y gestiona el contenido del catálogo
        </Typography>
      </Box>

      <CatalogContent />
    </Box>
  );
}
