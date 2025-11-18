import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Lock,
  LockOpen,
  MusicNote,
  Album,
  
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CatalogItem } from '../../types/catalog';

interface CatalogTableProps {
  items: CatalogItem[];
  searchTerm: string;
  onSort: (field: 'title' | 'publishDate' | 'status') => void;
  currentSort?: string;
  sortOrder?: 'asc' | 'desc';
  onRefresh?: () => void;
}

export function CatalogTable({
  items,
  searchTerm,
  onSort,
  currentSort,
  sortOrder,
  onRefresh,
}: CatalogTableProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: CatalogItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleAction = (action: string) => {
    if (!selectedItem) return;
    
    console.log('🎯 handleAction - action:', action, 'selectedItem:', selectedItem);
    
    if (action === 'view') {
      // React Admin espera rutas en formato: /{resource}/{id}/show
      // Usamos el resource correcto basado en el tipo
      const resource = selectedItem.type === 'song' ? 'songs' : 'collections';
      const targetUrl = `/${resource}/${selectedItem.id}/show`;
      console.log('🚀 Navegando a:', targetUrl);
      navigate(targetUrl);
    } else {
      console.log(`Action: ${action}`, selectedItem);
    }
    
    handleMenuClose();
  };

  const highlightText = (text: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark
              key={i}
              style={{ backgroundColor: '#fff59d', padding: '0 2px', borderRadius: '2px' }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getStatusChip = (status: string) => {
    const statusConfig: Record<string, { color: any; label: string }> = {
      published: { color: 'success', label: 'Publicado' },
      scheduled: { color: 'info', label: 'Programado' },
      blocked: { color: 'error', label: 'Bloqueado' },
    };

    const config = statusConfig[status] || statusConfig.published;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Tipo</TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSort === 'title'}
                  direction={currentSort === 'title' ? sortOrder : 'asc'}
                  onClick={() => onSort('title')}
                  sx={{ 
                    color: '#ffffff !important',
                    '& .MuiTableSortLabel-icon': { color: '#ffffff !important' }
                  }}
                >
                  Título
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Artista principal</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Colección</TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSort === 'publishDate'}
                  direction={currentSort === 'publishDate' ? sortOrder : 'asc'}
                  onClick={() => onSort('publishDate')}
                  sx={{ 
                    color: '#ffffff !important',
                    '& .MuiTableSortLabel-icon': { color: '#ffffff !important' }
                  }}
                >
                  Fecha de publicación
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSort === 'status'}
                  direction={currentSort === 'status' ? sortOrder : 'asc'}
                  onClick={() => onSort('status')}
                  sx={{ 
                    color: '#ffffff !important',
                    '& .MuiTableSortLabel-icon': { color: '#ffffff !important' }
                  }}
                >
                  Estado
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography sx={{ color: '#b3b3b3' }}>
                      No se encontraron resultados
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.type === 'song' ? (
                        <MusicNote fontSize="small" sx={{ color: '#b3b3b3' }} />
                      ) : (
                        <Album fontSize="small" sx={{ color: '#b3b3b3' }} />
                      )}
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>
                        {item.type === 'song' ? 'Canción' : 'Colección'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium" sx={{ color: '#ffffff' }}>
                      {highlightText(item.title)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {highlightText(item.mainArtist)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {item.collection ? highlightText(item.collection) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {formatDate(item.publishDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, item)}
                      sx={{ color: '#b3b3b3' }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#282828',
            color: '#ffffff',
          }
        }}
      >
        <MenuItem 
          onClick={() => handleAction('view')}
          sx={{
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#404040',
            }
          }}
        >
          <Visibility fontSize="small" sx={{ mr: 1, color: '#b3b3b3' }} />
          Ver detalle
        </MenuItem>
        <MenuItem 
          onClick={() => handleAction('edit')}
          sx={{
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#404040',
            }
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1, color: '#b3b3b3' }} />
          Editar metadatos
        </MenuItem>
        <MenuItem divider />
        {selectedItem?.status === 'blocked' ? (
          <MenuItem 
            onClick={() => handleAction('unblock')} 
            sx={{ 
              color: '#1db954',
              '&:hover': {
                backgroundColor: '#404040',
              }
            }}
          >
            <LockOpen fontSize="small" sx={{ mr: 1 }} />
            Desbloquear
          </MenuItem>
        ) : (
          <MenuItem 
            onClick={() => handleAction('block')} 
            sx={{ 
              color: '#f44336',
              '&:hover': {
                backgroundColor: '#404040',
              }
            }}
          >
            <Lock fontSize="small" sx={{ mr: 1 }} />
            Bloquear
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
