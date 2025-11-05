import { useState, useMemo } from 'react';
import { mockCatalogItems } from '../../providers/catalogMockData';
import type { CatalogFilters } from '../../types/catalog';
import { CatalogTable } from './CatalogTable';
import { CatalogFiltersBar } from './CatalogFiltersBar';
import { Card } from '@mui/material';

export default function CatalogContent() {
  // Inicializar filtros
  const [filters, setFilters] = useState<CatalogFilters>({
    search: '',
    type: 'all',
    status: 'all',
    hasVideo: 'all',
    publishDateFrom: undefined,
    publishDateTo: undefined,
    sortBy: 'title',
    sortOrder: 'asc',
  });

  // Actualizar filtros
  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Filtrar y ordenar datos
  const filteredItems = useMemo(() => {
    let items = [...mockCatalogItems];

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

    // Filtro por video
    if (filters.hasVideo !== undefined && filters.hasVideo !== 'all') {
      items = items.filter((item) => item.hasVideo === filters.hasVideo);
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
  }, [filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CatalogFiltersBar
        filters={filters}
        onFiltersChange={updateFilters}
        resultCount={filteredItems.length}
      />

      <Card>
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
