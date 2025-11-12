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
  searchInput: string;
  tempDateFrom: string;
  tempDateTo: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: Partial<CatalogFilters>) => void;
  onTempDateFromChange: (value: string) => void;
  onTempDateToChange: (value: string) => void;
  onApplyDateFilters: () => void;
  onClearDateFilters: () => void;
  resultCount: number;
}

export function CatalogFiltersBar({
  filters,
  searchInput,
  tempDateFrom,
  tempDateTo,
  onSearchChange,
  onFiltersChange,
  onTempDateFromChange,
  onTempDateToChange,
  onApplyDateFilters,
  onClearDateFilters,
  resultCount,
}: CatalogFiltersBarProps) {
  const handleReset = () => {
    onSearchChange('');
    onFiltersChange({
      search: '',
      type: 'all',
      status: 'all',
      publishDateFrom: undefined,
      publishDateTo: undefined,
    });
    onClearDateFilters();
  };

  const hasActiveFilters =
    searchInput ||
    (filters.type && filters.type !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    filters.publishDateFrom ||
    filters.publishDateTo;

  const hasPendingDateChanges =
    tempDateFrom !== (filters.publishDateFrom || '') ||
    tempDateTo !== (filters.publishDateTo || '');

  return (
    <Paper sx={{ p: 3, backgroundColor: '#181818' }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          label="Buscar"
          placeholder="Buscar por título, artista o colección..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          helperText="La búsqueda se aplica automáticamente después de dejar de escribir"
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
          <TextField
            fullWidth
            label="Desde (dd-mm-yyyy)"
            placeholder="dd-mm-yyyy"
            value={tempDateFrom}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números y guiones
              if (/^[\d-]*$/.test(value)) {
                onTempDateFromChange(value);
              }
            }}
            inputProps={{
              maxLength: 10,
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
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Hasta (dd-mm-yyyy)"
            placeholder="dd-mm-yyyy"
            value={tempDateTo}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números y guiones
              if (/^[\d-]*$/.test(value)) {
                onTempDateToChange(value);
              }
            }}
            inputProps={{
              maxLength: 10,
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
        </Grid>

        {/* Botones para aplicar filtros de fecha */}
        {hasPendingDateChanges && (
          <Grid item xs={12} sm={6} md={2.4}>
            <Box sx={{ display: 'flex', gap: 1, height: '56px', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={onApplyDateFilters}
                sx={{
                  backgroundColor: '#1db954',
                  '&:hover': { backgroundColor: '#1ed760' },
                  flex: 1,
                }}
              >
                Aplicar fechas
              </Button>
              <Button
                variant="outlined"
                onClick={onClearDateFilters}
                sx={{
                  borderColor: '#404040',
                  color: '#b3b3b3',
                  '&:hover': {
                    borderColor: '#1db954',
                    backgroundColor: 'transparent',
                  },
                  flex: 1,
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Typography variant="body2" sx={{ mt: 2, color: '#b3b3b3' }}>
        {resultCount} resultado{resultCount !== 1 ? 's' : ''} encontrado
        {resultCount !== 1 ? 's' : ''}
      </Typography>
    </Paper>
  );
}
