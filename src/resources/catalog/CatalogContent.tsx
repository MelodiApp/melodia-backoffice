import { useState, useMemo, useEffect } from 'react';
import { useGetList, useRefresh } from 'react-admin';
import type { CatalogFilters } from '../../types/catalog';
import type { CatalogItem } from '../../types/catalog';
import { CatalogTable } from './CatalogTable';
import { CatalogFiltersBar } from './CatalogFiltersBar';
import { Card, CircularProgress, Box, Typography } from '@mui/material';

export default function CatalogContent() {
  const refresh = useRefresh();
  
  // Refrescar cada vez que el componente se monta (cuando vuelves a la lista)
  useEffect(() => {
    console.log('📋 CatalogContent mounted, refreshing data...');
  }, []);
  
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

  // Obtener datos del realDataProvider
  const { data, isLoading, error, refetch } = useGetList<CatalogItem>(
    'catalog',
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: filters.sortBy || 'title', order: filters.sortOrder?.toUpperCase() as 'ASC' | 'DESC' || 'ASC' },
      filter: {
        search: filters.search,
        type: filters.type,
        status: filters.status,
      },
    }
  );

  // Actualizar filtros
  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Filtrar y ordenar datos localmente (filtros adicionales)
  const filteredItems = useMemo(() => {
    if (!data) return [];
    let items = [...data];

    // Búsqueda
    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.mainArtist.toLowerCase().includes(search) ||
          item.collection?.toLowerCase().includes(search)
      );
    }

    // Filtro por tipo
    if (filters.type && filters.type !== 'all') {
      items = items.filter((item) => item.type === filters.type);
    }

    // Filtro por estado
    if (filters.status && filters.status !== 'all') {
      items = items.filter((item) => item.status === filters.status);
    }

    

    // Filtro por rango de fechas
    if (filters.publishDateFrom) {
      items = items.filter(
        (item) => item.publishDate && item.publishDate >= filters.publishDateFrom!
      );
    }
    if (filters.publishDateTo) {
      items = items.filter(
        (item) => item.publishDate && item.publishDate <= filters.publishDateTo!
      );
    }

    // Ordenar
    if (filters.sortBy) {
      items.sort((a, b) => {
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

    return items;
  }, [data, filters]);

  // Mostrar loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography color="error">Error al cargar el catálogo: {String(error)}</Typography>
      </Box>
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
          onRefresh={() => {
            console.log('🔄 Refreshing catalog data...');
            refetch();
          }}
        />
      </Card>
    </div>
  );
}
