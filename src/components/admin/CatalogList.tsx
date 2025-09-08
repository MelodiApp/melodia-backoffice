import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import {
  Search,
  Block,
  CheckCircle,
  Schedule,
  LocationOff,
  Info,
  PlayArrow,
  QueueMusic
} from '@mui/icons-material'
import { useCatalog, useCatalogDetail, useBlockCatalogItem } from '../../hooks/useMusic'
import type { CatalogFilters } from '../../services/musicService'

// Status badges configuration
const statusConfig = {
  'programado': { label: 'Programado', color: 'warning', icon: <Schedule fontSize="small" /> },
  'publicado': { label: 'Publicado', color: 'success', icon: <CheckCircle fontSize="small" /> },
  'no-disponible-region': { label: 'No disponible', color: 'info', icon: <LocationOff fontSize="small" /> },
  'bloqueado-admin': { label: 'Bloqueado', color: 'error', icon: <Block fontSize="small" /> }
}

// Type badges configuration - Updated to match the API
const typeConfig = {
  'song': { label: 'Canción', icon: <PlayArrow fontSize="small" /> },
  'collection': { label: 'Colección', icon: <QueueMusic fontSize="small" /> }
}

export const CatalogList: React.FC = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filters, setFilters] = useState<CatalogFilters>({})
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Queries
  const { data: catalogData, isLoading } = useCatalog({
    ...filters,
    page: page + 1,
    limit: rowsPerPage
  })
  const { data: itemDetail } = useCatalogDetail(selectedItemId || '')
  
  // Mutations
  const blockMutation = useBlockCatalogItem()

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterChange = (field: keyof CatalogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPage(0)
  }

  const handleViewDetail = (itemId: string) => {
    setSelectedItemId(itemId)
  }

  const handleBlockItem = (itemId: string) => {
    blockMutation.mutate({
      itemId,
      scope: 'global',
      reasonCode: 'admin_block'
    })
  }

  const handleUnblock = (itemId: string) => {
    blockMutation.mutate({
      itemId,
      scope: 'global',
      reasonCode: 'admin_unblock'
    })
  }

  const items = catalogData?.items || []
  const total = catalogData?.total || 0

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
        Catálogo Musical
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e1e1e' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar por título, artista..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: '#b3b3b3', mr: 1 }} />
            }}
            sx={{ minWidth: 300 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="song">Canciones</MenuItem>
              <MenuItem value="collection">Colecciones</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="programado">Programado</MenuItem>
              <MenuItem value="publicado">Publicado</MenuItem>
              <MenuItem value="no-disponible-region">No disponible</MenuItem>
              <MenuItem value="bloqueado-admin">Bloqueado</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { backgroundColor: '#2a2a2a' } }}>
              <TableCell>Tipo</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Artista</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Regiones</TableCell>
              <TableCell>Fecha Publicación</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron elementos
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Chip
                      icon={typeConfig[item.type].icon}
                      label={typeConfig[item.type].label}
                      size="small"
                      variant="outlined"
                      sx={{ color: '#1db954', borderColor: '#1db954' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.artist}</TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig[item.effectiveStatus].icon}
                      label={statusConfig[item.effectiveStatus].label}
                      size="small"
                      color={statusConfig[item.effectiveStatus].color as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.regions.join(', ')}>
                      <Typography variant="body2">
                        {item.regions.length} región{item.regions.length !== 1 ? 'es' : ''}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalle">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDetail(item.id)}
                        sx={{ color: '#1db954' }}
                      >
                        <Info />
                      </IconButton>
                    </Tooltip>
                    {item.effectiveStatus === 'bloqueado-admin' ? (
                      <Tooltip title="Desbloquear">
                        <IconButton 
                          size="small" 
                          onClick={() => handleUnblock(item.id)}
                          sx={{ color: '#1db954' }}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Bloquear">
                        <IconButton 
                          size="small" 
                          onClick={() => handleBlockItem(item.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Block />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: '#1e1e1e', color: '#fff' }
        }}
      >
        <DialogTitle>
          Detalle del {itemDetail?.type === 'song' ? 'Tema' : 'Colección'}
        </DialogTitle>
        <DialogContent>
          {itemDetail && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>Información General</Typography>
              <Typography><strong>Título:</strong> {itemDetail.title}</Typography>
              <Typography><strong>Artista:</strong> {itemDetail.artist}</Typography>
              <Typography><strong>Tipo:</strong> {typeConfig[itemDetail.type].label}</Typography>
              <Typography><strong>Estado:</strong> 
                <Chip
                  icon={statusConfig[itemDetail.effectiveStatus].icon}
                  label={statusConfig[itemDetail.effectiveStatus].label}
                  size="small"
                  color={statusConfig[itemDetail.effectiveStatus].color as any}
                  sx={{ ml: 1 }}
                />
              </Typography>
              {itemDetail.publishDate && (
                <Typography><strong>Fecha de Publicación:</strong> {new Date(itemDetail.publishDate).toLocaleString()}</Typography>
              )}
              {itemDetail.duration && (
                <Typography><strong>Duración:</strong> {Math.floor(itemDetail.duration / 60)}:{(itemDetail.duration % 60).toString().padStart(2, '0')}</Typography>
              )}
              <Typography><strong>Regiones:</strong> {itemDetail.regions.join(', ')}</Typography>
              {itemDetail.blockReason && (
                <Typography><strong>Motivo de bloqueo:</strong> {itemDetail.blockReason}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItemId(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
