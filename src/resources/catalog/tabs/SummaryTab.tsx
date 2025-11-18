import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Edit,
  OpenInNew,
  MusicNote,
  Album,
  Explicit,
  AccessTime,
  Sync,
} from '@mui/icons-material';
import type { CatalogDetail, SongDetail, CollectionDetail } from '../../../types/catalogDetail';
import { ChangeStateDialog } from '../components/ChangeStateDialog';
import { EditMetadataDialog } from '../components/EditMetadataDialog';
import { STATE_LABELS, STATE_COLORS } from '../../../types/catalogStates';

interface SummaryTabProps {
  item: CatalogDetail;
  onRefresh?: () => void;
}

export function SummaryTab({ item, onRefresh }: SummaryTabProps) {
  const isSong = item.type === 'song';

  if (isSong) {
    return <SongSummary item={item as SongDetail} onRefresh={onRefresh} />;
  } else {
    return <CollectionSummary item={item as CollectionDetail} onRefresh={onRefresh} />;
  }
}

function SongSummary({ item, onRefresh }: { item: SongDetail; onRefresh?: () => void }) {
  const [stateDialogOpen, setStateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStateChange = () => {
    setStateDialogOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleMetadataChange = (newTitle: string) => {
    console.log('Título actualizado:', newTitle);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Información principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                Información de la canción
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Título
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ color: '#ffffff' }}>
                    {item.title}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Artista(s)
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {item.artists.map((a) => a.name).join(', ')}
                  </Typography>
                </Box>

                {item.collection && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      Colección
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      {item.collection.title}
                      {item.collection.year && ` (${item.collection.year})`}
                    </Typography>
                  </Box>
                )}

                {item.trackNumber && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      Posición en la lista
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>#{item.trackNumber}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    Duración
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" sx={{ color: '#b3b3b3' }} />
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      {formatDuration(item.duration)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                    Estado
                  </Typography>
                  <Chip
                    label={STATE_LABELS[item.status]}
                    color={STATE_COLORS[item.status]}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                    Características
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {item.explicit && (
                      <Chip
                        icon={<Explicit />}
                        label="Explícito"
                        size="small"
                        color="warning"
                      />
                    )}
                    
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                Acciones
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Sync />}
                  fullWidth
                  onClick={() => setStateDialogOpen(true)}
                >
                  Cambiar estado
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={() => setEditDialogOpen(true)}
                >
                  Editar metadatos
                </Button>

                {item.collection && (
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNew />}
                    fullWidth
                    onClick={() =>
                      (window.location.href = `/#/catalog/${item.collection?.id}/show`)
                    }
                  >
                    Abrir detalle de Colección
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ChangeStateDialog
        open={stateDialogOpen}
        onClose={() => setStateDialogOpen(false)}
        itemId={item.id}
        itemType="song"
        itemTitle={item.title}
        currentState={item.status}
        onSuccess={handleStateChange}
      />

      <EditMetadataDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        itemId={item.id}
        itemType="song"
        currentTitle={item.title}
        onSuccess={handleMetadataChange}
      />
    </Box>
  );
}

function CollectionSummary({ item, onRefresh }: { item: CollectionDetail; onRefresh?: () => void }) {
  const [stateDialogOpen, setStateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStateChange = () => {
    setStateDialogOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleMetadataChange = (newTitle: string) => {
    console.log('Título actualizado:', newTitle);
    if (onRefresh) {
      onRefresh();
    }
  };

  const getCollectionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      album: 'Álbum',
      ep: 'EP',
      single: 'Single',
      playlist: 'Playlist',
    };
    return labels[type] || type;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Cover y información principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Cover */}
                {item.coverUrl && (
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      flexShrink: 0,
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: '#282828',
                    }}
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                )}

                {/* Información */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                    Información de la colección
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        Título
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ color: '#ffffff' }}>
                        {item.title}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        Tipo
                      </Typography>
                      <Chip
                        icon={item.collectionType === 'playlist' ? <MusicNote /> : <Album />}
                        label={getCollectionTypeLabel(item.collectionType)}
                        size="small"
                        color="primary"
                      />
                    </Box>

                    {/* Mostrar artista para albums, eps y singles */}
                    {item.collectionType !== 'playlist' && item.owner && (
                      <Box>
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          Artista
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#ffffff' }}>{item.owner}</Typography>
                      </Box>
                    )}

                    {item.year && (
                      <Box>
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          Año
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#ffffff' }}>{item.year}</Typography>
                      </Box>
                    )}

                    {item.collectionType === 'playlist' && (
                      <>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Propietario
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#ffffff' }}>{item.owner || 'N/A'}</Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Privacidad
                          </Typography>
                          <Chip
                            label={item.isPrivate ? 'Privada' : 'Pública'}
                            size="small"
                            color={item.isPrivate ? 'default' : 'success'}
                          />
                        </Box>
                      </>
                    )}

                    <Box>
                      <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                        Estado
                      </Typography>
                      <Chip
                        label={STATE_LABELS[item.status]}
                        color={STATE_COLORS[item.status]}
                        size="small"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                        Características
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {item.hasExplicit && (
                          <Chip
                            icon={<Explicit />}
                            label="Contiene explícito"
                            size="small"
                            color="warning"
                          />
                        )}
                        
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Lista de canciones */}
          <Card sx={{ mt: 2, backgroundColor: '#181818' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                Lista de canciones ({item.tracks.length})
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, backgroundColor: '#121212' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={60} sx={{ color: '#ffffff', fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Título</TableCell>
                      <TableCell width={100} sx={{ color: '#ffffff', fontWeight: 600 }}>Duración</TableCell>
                      <TableCell width={80} align="center" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Características
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.tracks.map((track) => (
                      <TableRow key={track.id} hover>
                        <TableCell sx={{ color: '#ffffff' }}>{track.position}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{track.title}</TableCell>
                        <TableCell sx={{ color: '#ffffff' }}>{formatDuration(track.duration)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            {track.explicit && <Explicit fontSize="small" color="warning" />}
                            
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2, borderColor: '#404040' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  Duración total
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ color: '#ffffff' }}>
                  {formatDuration(item.totalDuration)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#181818' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                Acciones
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Sync />}
                  fullWidth
                  onClick={() => setStateDialogOpen(true)}
                >
                  Cambiar estado
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={() => setEditDialogOpen(true)}
                >
                  Editar metadatos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ChangeStateDialog
        open={stateDialogOpen}
        onClose={() => setStateDialogOpen(false)}
        itemId={item.id}
        itemType="collection"
        itemTitle={item.title}
        currentState={item.status}
        onSuccess={handleStateChange}
      />

      <EditMetadataDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        itemId={item.id}
        itemType="collection"
        currentTitle={item.title}
        onSuccess={handleMetadataChange}
      />
    </Box>
  );
}
