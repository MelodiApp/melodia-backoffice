import {
  Typography,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { MusicNote, Album, List } from '@mui/icons-material';
import { catalogService } from '../../../services/catalogService';
import { userService } from '../../../services/userService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CatalogDetail, CollectionAppearance, PlaylistAppearance } from '../../../types/catalogDetail';

interface AppearancesTabProps {
  item: CatalogDetail;
}

export function AppearancesTab({ item }: AppearancesTabProps) {
  const isSong = item.type === 'song';

  if (isSong) {
    return <SongAppearances itemId={item.id} />;
  } else {
    return <CollectionAppearances itemId={item.id} />;
  }
}

// Playlist detail shape (if needed in future)

function SongAppearances({ itemId }: { itemId: string }) {
  const [appearances, setAppearances] = useState<(CollectionAppearance | PlaylistAppearance)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistAppearance | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
    const items: CollectionAppearance[] = [];
    const resp = await catalogService.getSongAppearances(itemId);
    const song = await catalogService.getSongById(itemId);
  // Add parent collection (if any)
  if (song.collection) {
          // We might need collection type -> fetch collection detail
          try {
            const collDetail = await catalogService.getCollectionById(String(song.collection.id as number));
            items.push({
              id: String(song.collection.id),
              type: (collDetail.type?.toLowerCase() as 'album' | 'ep' | 'single') || 'album',
              title: collDetail.title || song.collection.title,
              position: song.position || 0,
              owner: collDetail.owner || undefined,
            });
          } catch (err: unknown) {
            console.error('Failed fetching collection detail for song in SongAppearances:', err);
            // fallback: push the collection with default type
            items.push({
              id: String(song.collection.id),
              type: 'album',
              title: song.collection.title,
              position: song.position || 0,
              owner: undefined,
            } as CollectionAppearance);
          }
        }
        // Fetch aggregated appearances from artists endpoint
        const detailedPlaylists: PlaylistAppearance[] = resp.playlists || [];

        // Resolve owner IDs to names if they are numeric IDs
        const detailedWithOwners = await Promise.all(( [...items, ...detailedPlaylists] as (CollectionAppearance | PlaylistAppearance)[] ).map(async (app) => {
          const ownerValRaw = (app as PlaylistAppearance).owner;
          const ownerVal = ownerValRaw ? String(ownerValRaw) : undefined;
          if (ownerVal && /^\d+$/.test(ownerVal)) {
            try {
              const ownerResp = await userService.getUserById(ownerVal);
              const name = (ownerResp.user as any)?.artistic_name || ownerResp.user?.name || (ownerResp.user as any)?.username;
              (app as PlaylistAppearance | CollectionAppearance).owner = name || ownerVal;
            } catch (err) {
              // Keep owner as ID if fetch fails
            }
          }
          return app;
        }));
        if (mounted) setAppearances(detailedWithOwners as (CollectionAppearance | PlaylistAppearance)[]);
      } catch (err: unknown) {
        console.error('Error loading song appearances:', err);
        if (mounted) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          setError(errorMsg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [itemId]);

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: React.ReactElement; label: string; color: any }> = {
      album: { icon: <Album fontSize="small" />, label: 'Álbum', color: 'primary' },
      ep: { icon: <Album fontSize="small" />, label: 'EP', color: 'secondary' },
      single: { icon: <MusicNote fontSize="small" />, label: 'Single', color: 'info' },
      playlist: { icon: <List fontSize="small" />, label: 'Playlist', color: 'success' },
    };

    return configs[type] || configs.album;
  };

  if (loading) return (
    <Card sx={{ backgroundColor: '#181818', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#1db954' }} />
      </Box>
    </Card>
  );

  if (error) return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Alert severity="error">Error al cargar apariciones: {error}</Alert>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
          Apariciones de la canción
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: '#b3b3b3' }}>
          Colecciones (Álbumes, EPs, Singles y Playlists públicas) que incluyen esta canción
        </Typography>

        {appearances.length === 0 ? (
          <Alert severity="info">
            Esta canción no aparece en ninguna colección
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: '#121212' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Título</TableCell>
                  <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 600 }}>Posición</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Propietario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {appearances.map((appearance: CollectionAppearance | PlaylistAppearance) => {
                  const typeConfig = getTypeConfig((appearance as CollectionAppearance).type || (appearance as PlaylistAppearance).type || 'album');

                  return (
                    <TableRow key={appearance.id} hover sx={{ cursor: 'pointer' }} onClick={() => {
                      if ((appearance as PlaylistAppearance).type === 'playlist') {
                        // Open playlist dialog
                        setSelectedPlaylist(appearance as PlaylistAppearance);
                        setPlaylistDialogOpen(true);
                      } else {
                        // Navigate to collection detail
                        navigate(`/collections/${appearance.id}/show`);
                      }
                    }}>
                      <TableCell>
                        <Chip
                          icon={typeConfig.icon}
                          label={typeConfig.label}
                          size="small"
                          color={typeConfig.color}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: '#ffffff' }}>
                          {appearance.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {('position' in appearance) ? (
                          <Chip label={`#${(appearance as CollectionAppearance).position}`} size="small" variant="outlined" />
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          {appearance.owner || '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <PlaylistDetailDialog open={playlistDialogOpen} playlistId={selectedPlaylist?.id || null} onClose={() => { setPlaylistDialogOpen(false); setSelectedPlaylist(null); }} />
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

function CollectionAppearances({ itemId }: { itemId: string }) {
  const [appearances, setAppearances] = useState<PlaylistAppearance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistAppearance | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
  // No need to fetch full collection here: artists endpoint gives us playlist counts.
        const resp = await catalogService.getCollectionAppearances(itemId);
        const detailed = resp.playlists || [];
        // If owner is numeric id, fetch display name
        const detailedWithOwners = await Promise.all(detailed.map(async (app: PlaylistAppearance) => {
          const ownerValRaw = app.owner;
          const ownerVal = ownerValRaw ? String(ownerValRaw) : undefined;
          if (ownerVal && /^\d+$/.test(ownerVal)) {
            try {
              const ownerResp = await userService.getUserById(String(ownerVal));
              const name = (ownerResp.user as any)?.artistic_name || ownerResp.user?.name || (ownerResp.user as any)?.username;
              app.owner = name || ownerVal;
            } catch (err) {
              // noop
            }
          }
          return app;
        }));
        if (mounted) setAppearances(detailedWithOwners as PlaylistAppearance[]);
      } catch (err: any) {
        console.error('Error loading collection appearances:', err);
        if (mounted) setError(String(err?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [itemId]);

  return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
          Apariciones de la colección
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: '#b3b3b3' }}>
          Playlists que contienen canciones de esta colección
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: '#1db954' }} />
          </Box>
        ) : appearances.length === 0 ? (
          <Alert severity="info">
            Las canciones de esta colección no aparecen en ninguna playlist
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: '#121212' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Título</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Propietario</TableCell>
                  <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 600 }}>Canciones incluidas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
           {appearances.map((appearance: PlaylistAppearance) => (
             <TableRow key={appearance.id} hover sx={{ cursor: 'pointer' }} onClick={() => {
              setSelectedPlaylist(appearance);
              setPlaylistDialogOpen(true);
             }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: '#ffffff' }}>
                        {appearance.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        {appearance.owner}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${appearance.includedCount} de ${appearance.totalTracksInCollection}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              <PlaylistDetailDialog open={playlistDialogOpen} playlistId={selectedPlaylist?.id || null} onClose={() => { setPlaylistDialogOpen(false); setSelectedPlaylist(null); }} />
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

// Small Playlist details dialog
function PlaylistDetailDialog({ open, playlistId, onClose }: { open: boolean; playlistId?: string | null; onClose: () => void; }) {
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!playlistId) return;
      setLoading(true);
      try {
        const pl = await catalogService.getLibraryPlaylistById(String(playlistId));
        let ownerName: string | undefined = undefined;
        if (pl && pl.user_id) {
          try {
            const ownerResp = await userService.getUserById(String(pl.user_id));
            ownerName = ownerResp.user?.name || String(pl.user_id);
          } catch (err: unknown) {
            ownerName = String(pl.user_id);
          }
        }
        if (mounted) setPlaylist({ ...pl, ownerName });
      } catch (err) {
        console.error('Error loading playlist detail:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [playlistId]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalle de Playlist</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: '#1db954' }} />
          </Box>
        ) : playlist ? (
          <Box>
            <Typography>{playlist.name}</Typography>
            <Typography variant="body2">Owner: {playlist.ownerName || playlist.user_id || '—'}</Typography>
            <Typography variant="body2">Total canciones: {playlist.songs?.length || '—'}</Typography>
          </Box>
        ) : (
          <Typography>No hay detalles</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
