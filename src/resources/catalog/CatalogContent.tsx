import { useState, useEffect } from 'react';
import { useGetList } from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import type { CatalogFilters } from '../../types/catalog';
import type { CatalogItem } from '../../types/catalog';
import { CatalogTable } from './CatalogTable';
import { CatalogFiltersBar } from './CatalogFiltersBar';
import { Card, CircularProgress, Box, Typography, Pagination } from '@mui/material';

export default function CatalogContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [perPage] = useState(20);
  
  // Inicializar desde URL o valores por defecto
  const getInitialPage = () => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  };

  const getInitialFilters = (): CatalogFilters => {
    return {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || 'all',
      status: (searchParams.get('status') as CatalogFilters['status']) || 'all',
      publishDateFrom: searchParams.get('fromDate') || undefined,
      publishDateTo: searchParams.get('toDate') || undefined,
      sortBy: (searchParams.get('sortBy') as CatalogFilters['sortBy']) || 'title',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };
  };

  const [page, setPage] = useState(getInitialPage);
  const [filters, setFilters] = useState<CatalogFilters>(getInitialFilters);

  // Obtener datos del realDataProvider
  // useGetList se vuelve a ejecutar automáticamente cuando cambian los parámetros
  const { data, total, isLoading, error, refetch } = useGetList<CatalogItem>(
    'catalog',
    {
      pagination: { page, perPage },
      sort: { 
        field: filters.sortBy || 'title', 
        order: filters.sortOrder?.toUpperCase() as 'ASC' | 'DESC' || 'DESC' 
      },
      filter: {
        q: filters.search,
        type: filters.type,
        status: filters.status,
        fromDate: filters.publishDateFrom,
        toDate: filters.publishDateTo,
      },
    }
  );

  // Calcular número total de páginas
  const totalPages = total ? Math.ceil(total / perPage) : 0;

  // Sincronizar estado con URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Agregar página
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    // Agregar filtros solo si no son valores por defecto
    if (filters.search) params.set('search', filters.search);
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.publishDateFrom) params.set('fromDate', filters.publishDateFrom);
    if (filters.publishDateTo) params.set('toDate', filters.publishDateTo);
    if (filters.sortBy && filters.sortBy !== 'title') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

    // Actualizar URL sin recargar la página
    setSearchParams(params, { replace: true });
  }, [page, filters, setSearchParams]);

  // Actualizar filtros y resetear a la primera página
  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    console.log('🔄 Updating filters:', newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Volver a la primera página cuando cambian los filtros
  };

  // Manejar cambio de página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    console.log('📄 Changing to page:', value);
    setPage(value);
  };

  // Manejar cambio de ordenamiento
  const handleSort = (sortBy: 'title' | 'publishDate' | 'status') => {
    const sortOrder =
      filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    console.log('🔀 Sorting by:', sortBy, sortOrder);
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setPage(1); // Volver a la primera página cuando cambia el ordenamiento
  };

  // Log cuando cambian los datos
  useEffect(() => {
    console.log('📊 Data updated:', {
      itemsCount: data?.length || 0,
      total,
      page,
      totalPages,
    });
  }, [data, total, page, totalPages]);

  // Mostrar loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#1db954' }} />
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
        resultCount={total || 0}
      />

      <Card sx={{ backgroundColor: '#181818' }}>
        <CatalogTable
          items={data || []}
          searchTerm={filters.search || ''}
          onSort={handleSort}
          currentSort={filters.sortBy}
          sortOrder={filters.sortOrder}
          onRefresh={() => {
            console.log('🔄 Refreshing catalog data...');
            refetch();
          }}
        />
        
        {/* Paginación */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 3,
              borderTop: '1px solid #404040',
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#404040',
                  },
                },
                '& .Mui-selected': {
                  backgroundColor: '#1db954 !important',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1ed760 !important',
                  },
                },
              }}
            />
            <Typography sx={{ ml: 3, color: '#b3b3b3' }}>
              Mostrando {((page - 1) * perPage) + 1}-{Math.min(page * perPage, total || 0)} de {total || 0} resultados
            </Typography>
          </Box>
        )}
      </Card>
    </div>
  );
}
