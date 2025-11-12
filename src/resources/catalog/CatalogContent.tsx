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
      sortBy: (searchParams.get('sortBy') as CatalogFilters['sortBy']) || 'publishDate',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };
  };

  const [page, setPage] = useState(getInitialPage);
  const [filters, setFilters] = useState<CatalogFilters>(getInitialFilters);
  
  // Estado para búsqueda con debounce
  const [searchInput, setSearchInput] = useState(filters.search || '');
  
  // Estado temporal para las fechas (antes de confirmar)
  const [tempDateFrom, setTempDateFrom] = useState(filters.publishDateFrom || '');
  const [tempDateTo, setTempDateTo] = useState(filters.publishDateTo || '');

  // Key para forzar re-render cuando cambia la página o filtros
  const [queryKey, setQueryKey] = useState(0);

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
        _queryKey: queryKey, // Forzar nueva query
      },
    },
    {
      // Configuración de React Query para evitar caché
      retry: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
    }
  );

  // Calcular número total de páginas
  const totalPages = total ? Math.ceil(total / perPage) : 0;

  // Debounce para la búsqueda (espera 800ms después de dejar de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        console.log('🔍 Applying debounced search:', searchInput);
        setFilters((prev) => ({ ...prev, search: searchInput }));
        setPage(1);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

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
    if (filters.sortBy && filters.sortBy !== 'publishDate') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

    // Actualizar URL sin recargar la página
    setSearchParams(params, { replace: true });
  }, [page, filters, setSearchParams]);

  // Actualizar filtros y resetear a la primera página
  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    console.log('🔄 Updating filters:', newFilters);
    
    // Si se actualiza la búsqueda, actualizar el input (el debounce aplicará el filtro)
    if ('search' in newFilters && newFilters.search !== undefined) {
      setSearchInput(newFilters.search);
      // No actualizar filters.search aquí, el useEffect con debounce lo hará
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { search: _search, ...otherFilters } = newFilters;
      if (Object.keys(otherFilters).length > 0) {
        setFilters((prev) => ({ ...prev, ...otherFilters }));
      }
    } else {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
    
    setPage(1); // Volver a la primera página cuando cambian los filtros
  };

  // Aplicar filtros de fecha (con confirmación)
  const applyDateFilters = () => {
    console.log('📅 Applying date filters:', { from: tempDateFrom, to: tempDateTo });
    setFilters((prev) => ({
      ...prev,
      publishDateFrom: tempDateFrom || undefined,
      publishDateTo: tempDateTo || undefined,
    }));
    setPage(1);
  };

  // Limpiar filtros de fecha
  const clearDateFilters = () => {
    setTempDateFrom('');
    setTempDateTo('');
    setFilters((prev) => ({
      ...prev,
      publishDateFrom: undefined,
      publishDateTo: undefined,
    }));
    setPage(1);
  };

  // Manejar cambio de página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    console.log('📄 Changing to page:', value);
    setPage(value);
    setQueryKey(prev => prev + 1); // Incrementar para forzar nueva query
  };

  // Incrementar queryKey cuando cambian los filtros
  useEffect(() => {
    console.log('🔄 Filters changed, incrementing queryKey');
    setQueryKey(prev => prev + 1);
  }, [filters.search, filters.type, filters.status, filters.publishDateFrom, filters.publishDateTo, filters.sortBy, filters.sortOrder]);

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
        searchInput={searchInput}
        tempDateFrom={tempDateFrom}
        tempDateTo={tempDateTo}
        onSearchChange={setSearchInput}
        onFiltersChange={updateFilters}
        onTempDateFromChange={setTempDateFrom}
        onTempDateToChange={setTempDateTo}
        onApplyDateFilters={applyDateFilters}
        onClearDateFilters={clearDateFilters}
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
            setQueryKey(prev => prev + 1);
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
