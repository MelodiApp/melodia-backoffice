import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  InputAdornment,
  Paper,
  Grid,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import type { CatalogFilters } from '../../types/catalog';

interface CatalogFiltersBarProps {
  filters: CatalogFilters;
  onFiltersChange: (filters: Partial<CatalogFilters>) => void;
  resultCount: number;
}

export function CatalogFiltersBar({
  filters,
  onFiltersChange,
  resultCount,
}: CatalogFiltersBarProps) {
  const handleReset = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      status: 'all',
      hasVideo: 'all',
      publishDateFrom: undefined,
      publishDateTo: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    (filters.type && filters.type !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.hasVideo !== undefined && filters.hasVideo !== 'all') ||
    filters.publishDateFrom ||
    filters.publishDateTo;

  return (
    <Paper sx={{ p: 3, backgroundColor: '#181818' }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          label="Buscar"
          placeholder="Buscar por título, artista o colección..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputLabel-root': { color: '#b3b3b3' },
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              '& fieldset': { borderColor: '#404040' },
              '&:hover fieldset': { borderColor: '#1db954' },
              '&.Mui-focused fieldset': { borderColor: '#1db954' },
            },
          }}
        />

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleReset}
            sx={{ minWidth: '150px' }}
          >
            Limpiar filtros
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#b3b3b3' }}>Tipo</InputLabel>
            <Select
              value={filters.type || 'all'}
              label="Tipo"
              onChange={(e) => onFiltersChange({ type: e.target.value as any })}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#282828',
                    '& .MuiMenuItem-root': {
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#404040',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#1db954',
                        '&:hover': {
                          backgroundColor: '#1ed760',
                        },
                      },
                    },
                  },
                },
              }}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
                '& .MuiSvgIcon-root': { color: '#b3b3b3' },
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="song">Canción</MenuItem>
              <MenuItem value="collection">Colección</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#b3b3b3' }}>Estado</InputLabel>
            <Select
              value={filters.status || 'all'}
              label="Estado"
              onChange={(e) => onFiltersChange({ status: e.target.value as any })}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#282828',
                    '& .MuiMenuItem-root': {
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#404040',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#1db954',
                        '&:hover': {
                          backgroundColor: '#1ed760',
                        },
                      },
                    },
                  },
                },
              }}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
                '& .MuiSvgIcon-root': { color: '#b3b3b3' },
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="published">Publicado</MenuItem>
              <MenuItem value="scheduled">Programado</MenuItem>
              <MenuItem value="blocked">Bloqueado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#b3b3b3' }}>Tiene video</InputLabel>
            <Select
              value={String(filters.hasVideo)}
              label="Tiene video"
              onChange={(e) =>
                onFiltersChange({
                  hasVideo: e.target.value === 'all' ? 'all' : e.target.value === 'true',
                })
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#282828',
                    '& .MuiMenuItem-root': {
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#404040',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#1db954',
                        '&:hover': {
                          backgroundColor: '#1ed760',
                        },
                      },
                    },
                  },
                },
              }}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
                '& .MuiSvgIcon-root': { color: '#b3b3b3' },
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Desde"
            type="date"
            value={filters.publishDateFrom || ''}
            onChange={(e) => onFiltersChange({ publishDateFrom: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputLabel-root': { color: '#b3b3b3' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#1db954' },
                '&.Mui-focused fieldset': { borderColor: '#1db954' },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Hasta"
            type="date"
            value={filters.publishDateTo || ''}
            onChange={(e) => onFiltersChange({ publishDateTo: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputLabel-root': { color: '#b3b3b3' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#1db954' },
                '&.Mui-focused fieldset': { borderColor: '#1db954' },
              },
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mt: 2, color: '#b3b3b3' }}>
        {resultCount} resultado{resultCount !== 1 ? 's' : ''} encontrado
        {resultCount !== 1 ? 's' : ''}
      </Typography>
    </Paper>
  );
}
