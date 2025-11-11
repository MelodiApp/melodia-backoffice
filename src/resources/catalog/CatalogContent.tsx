import { useState, useMemo } from 'react';
import { useGetList } from 'react-admin';
import { mockCatalogItems } from '../../providers/catalogMockData';
import type { CatalogFilters, CatalogItem } from '../../types/catalog';
import { CatalogTable } from './CatalogTable';
import { CatalogFiltersBar } from './CatalogFiltersBar';
import { Card, CircularProgress, Box, Alert } from '@mui/material';

export default function CatalogContent() {
  // Inicializar filtros
  const [filters, setFilters] = useState<CatalogFilters>({
    search: '',
    type: 'all',
    status: 'all',
    publishDateFrom: undefined,
    publishDateTo: undefined,
    sortBy: 'title',
    sortOrder: 'asc',
  });

  // Obtener datos del backend usando React Admin
  const { data: catalogData, isLoading, error } = useGetList<CatalogItem>(
    'catalog',
    {
      pagination: { page: 1, perPage: 1000 }, // Obtener todos los items
      filter: {
        search: filters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        type: filters.type !== 'all' ? filters.type : undefined,
      },
    }
  );

  // Actualizar filtros
  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Usar datos reales o mock como fallback
  const items = catalogData || mockCatalogItems;

  // Filtrar y ordenar datos localmente
  const filteredItems = useMemo(() => {
    let itemsList = [...items];

    // Filtro por rango de fechas (filtrado local adicional)
    if (filters.publishDateFrom) {
      itemsList = itemsList.filter(
        (item) => item.publishDate && item.publishDate >= filters.publishDateFrom!
      );
    }
    if (filters.publishDateTo) {
      itemsList = itemsList.filter(
        (item) => item.publishDate && item.publishDate <= filters.publishDateTo!
      );
    }

    // Ordenar
    if (filters.sortBy) {
      itemsList.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'publishDate':
            aValue = a.publishDate || '';
            bValue = b.publishDate || '';
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return itemsList;
  }, [items, filters]);

  // Mostrar loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar el catálogo. Usando datos de ejemplo.
      </Alert>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CatalogFiltersBar
        filters={filters}
        onFiltersChange={updateFilters}
        resultCount={filteredItems.length}
      />

      <Card sx={{ backgroundColor: '#181818' }}>
        <CatalogTable
          items={filteredItems}
          searchTerm={filters.search || ''}
          onSort={(sortBy: 'title' | 'publishDate' | 'status') => {
            const sortOrder =
              filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
            updateFilters({ sortBy, sortOrder });
          }}
          currentSort={filters.sortBy}
          sortOrder={filters.sortOrder}
        />
      </Card>
    </div>
  );
}
