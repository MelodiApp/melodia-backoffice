import { Box, Typography } from '@mui/material';
import { LibraryMusic } from '@mui/icons-material';
import { Title } from 'react-admin';
import CatalogContent from './CatalogContent';

export default function CatalogList() {
  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Title title="Gestión de Contenidos" />
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1db954', mb: 3 }}>
        <LibraryMusic sx={{ mr: 1, verticalAlign: 'middle' }} />
        Catálogo
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 3 }}>
        Explora y gestiona el contenido del catálogo
      </Typography>

      <CatalogContent />
    </Box>
  );
}
