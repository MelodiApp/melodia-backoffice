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
} from '@mui/material';
import { MusicNote, Album, List } from '@mui/icons-material';
import type { CatalogDetail } from '../../../types/catalogDetail';
import {
  getSongAppearances,
  getCollectionAppearances,
} from '../../../providers/catalogDetailMockData';

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

function SongAppearances({ itemId }: { itemId: string }) {
  const appearances = getSongAppearances(itemId);

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: React.ReactElement; label: string; color: any }> = {
      album: { icon: <Album fontSize="small" />, label: 'Álbum', color: 'primary' },
      ep: { icon: <Album fontSize="small" />, label: 'EP', color: 'secondary' },
      single: { icon: <MusicNote fontSize="small" />, label: 'Single', color: 'info' },
      playlist: { icon: <List fontSize="small" />, label: 'Playlist', color: 'success' },
    };

    return configs[type] || configs.album;
  };

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
                {appearances.map((appearance) => {
                  const typeConfig = getTypeConfig(appearance.type);

                  return (
                    <TableRow key={appearance.id} hover>
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
                        <Chip label={`#${appearance.position}`} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          {appearance.owner || '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

function CollectionAppearances({ itemId }: { itemId: string }) {
  const appearances = getCollectionAppearances(itemId);

  return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
          Apariciones de la colección
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: '#b3b3b3' }}>
          Playlists que contienen canciones de esta colección
        </Typography>

        {appearances.length === 0 ? (
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
                {appearances.map((appearance) => (
                  <TableRow key={appearance.id} hover>
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
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
