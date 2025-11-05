import { Box, Typography } from '@mui/material';
import CatalogContent from './CatalogContent';

export default function CatalogList() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Catálogo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explora y gestiona el contenido del catálogo
        </Typography>
      </Box>

      <CatalogContent />
    </Box>
  );
}
