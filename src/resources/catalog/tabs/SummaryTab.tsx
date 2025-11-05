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
  Videocam,
  AccessTime,
} from '@mui/icons-material';
import type { CatalogDetail, SongDetail, CollectionDetail } from '../../../types/catalogDetail';

interface SummaryTabProps {
  item: CatalogDetail;
}

export function SummaryTab({ item }: SummaryTabProps) {
  const isSong = item.type === 'song';

  if (isSong) {
    return <SongSummary item={item as SongDetail} />;
  } else {
    return <CollectionSummary item={item as CollectionDetail} />;
  }
}

function SongSummary({ item }: { item: SongDetail }) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Información principal */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de la canción
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Título
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {item.title}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Artista(s)
                  </Typography>
                  <Typography variant="body1">
                    {item.artists.map((a) => a.name).join(', ')}
                  </Typography>
                </Box>

                {item.collection && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Colección
                    </Typography>
                    <Typography variant="body1">
                      {item.collection.title}
                      {item.collection.year && ` (${item.collection.year})`}
                    </Typography>
                  </Box>
                )}

                {item.trackNumber && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Posición en la lista
                    </Typography>
                    <Typography variant="body1">#{item.trackNumber}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Duración
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body1">
                      {formatDuration(item.duration)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                    {item.hasVideo && (
                      <Chip
                        icon={<Videocam />}
                        label="Con video"
                        size="small"
                        color="success"
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
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={() => console.log('Editar metadatos')}
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
    </Box>
  );
}

function CollectionSummary({ item }: { item: CollectionDetail }) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
          <Card>
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
                      bgcolor: 'grey.200',
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
                  <Typography variant="h6" gutterBottom>
                    Información de la colección
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Título
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {item.title}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tipo
                      </Typography>
                      <Chip
                        icon={item.collectionType === 'playlist' ? <MusicNote /> : <Album />}
                        label={getCollectionTypeLabel(item.collectionType)}
                        size="small"
                        color="primary"
                      />
                    </Box>

                    {item.year && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Año
                        </Typography>
                        <Typography variant="body1">{item.year}</Typography>
                      </Box>
                    )}

                    {item.collectionType === 'playlist' && (
                      <>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Propietario
                          </Typography>
                          <Typography variant="body1">{item.owner || 'N/A'}</Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
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
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                        {item.hasVideo && (
                          <Chip
                            icon={<Videocam />}
                            label="Contiene videos"
                            size="small"
                            color="success"
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
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lista de canciones ({item.tracks.length})
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={60}>#</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell width={100}>Duración</TableCell>
                      <TableCell width={80} align="center">
                        Características
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.tracks.map((track) => (
                      <TableRow key={track.id} hover>
                        <TableCell>{track.position}</TableCell>
                        <TableCell>{track.title}</TableCell>
                        <TableCell>{formatDuration(track.duration)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            {track.explicit && <Explicit fontSize="small" color="warning" />}
                            {track.hasVideo && <Videocam fontSize="small" color="success" />}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Duración total
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatDuration(item.totalDuration)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={() => console.log('Editar metadatos')}
                >
                  Editar metadatos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
