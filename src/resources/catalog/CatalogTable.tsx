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
  Videocam,
  VideocamOff,
} from '@mui/icons-material';
import { useState } from 'react';
import type { CatalogItem } from '../../types/catalog';

interface CatalogTableProps {
  items: CatalogItem[];
  searchTerm: string;
  onSort: (field: 'title' | 'publishDate' | 'status') => void;
  currentSort?: string;
  sortOrder?: 'asc' | 'desc';
}

export function CatalogTable({
  items,
  searchTerm,
  onSort,
  currentSort,
  sortOrder,
}: CatalogTableProps) {
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
    
    if (action === 'view') {
      window.location.href = `/#/catalog/${selectedItem.id}/show`;
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
              <TableCell>Tipo</TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSort === 'title'}
                  direction={currentSort === 'title' ? sortOrder : 'asc'}
                  onClick={() => onSort('title')}
                >
                  Título
                </TableSortLabel>
              </TableCell>
              <TableCell>Artista principal</TableCell>
              <TableCell>Colección</TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSort === 'publishDate'}
                  direction={currentSort === 'publishDate' ? sortOrder : 'asc'}
                  onClick={() => onSort('publishDate')}
                >
                  Fecha de publicación
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSort === 'status'}
                  direction={currentSort === 'status' ? sortOrder : 'asc'}
                  onClick={() => onSort('status')}
                >
                  Estado
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Video</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography color="text.secondary">
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
                        <MusicNote fontSize="small" color="action" />
                      ) : (
                        <Album fontSize="small" color="action" />
                      )}
                      <Typography variant="body2">
                        {item.type === 'song' ? 'Canción' : 'Colección'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {highlightText(item.title)}
                    </Typography>
                  </TableCell>
                  <TableCell>{highlightText(item.mainArtist)}</TableCell>
                  <TableCell>
                    {item.collection ? highlightText(item.collection) : '—'}
                  </TableCell>
                  <TableCell>{formatDate(item.publishDate)}</TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  <TableCell align="center">
                    {item.hasVideo ? (
                      <Videocam fontSize="small" color="success" />
                    ) : (
                      <VideocamOff fontSize="small" color="disabled" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, item)}
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAction('view')}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Ver detalle
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar metadatos
        </MenuItem>
        <MenuItem divider />
        {selectedItem?.status === 'blocked' ? (
          <MenuItem onClick={() => handleAction('unblock')} sx={{ color: 'success.main' }}>
            <LockOpen fontSize="small" sx={{ mr: 1 }} />
            Desbloquear
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('block')} sx={{ color: 'error.main' }}>
            <Lock fontSize="small" sx={{ mr: 1 }} />
            Bloquear
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
