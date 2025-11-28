import React, { useState, useEffect } from 'react';
import { useGetList, Title, useRecordContext } from 'react-admin';
import { Box, Card, CardContent, Typography, Avatar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';

export default function ArtistsList() {
  const [page] = useState(1);
  const [perPage] = useState(20);
  const [followersData, setFollowersData] = useState<Record<string, number>>({});
  const { data, total, isLoading, error, refetch } = useGetList('artists', {
    pagination: { page, perPage },
    sort: { field: 'name', order: 'ASC' },
    filter: {},
  });

  // Fetch followers count for all artists
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const fetchFollowers = async () => {
      const followersMap: Record<string, number> = {};
      
      // Fetch followers for each artist
      await Promise.all(
        data.map(async (artist: any) => {
          try {
            const res = await apiClient.get(`/admin/users/${artist.id}/profile`);
            followersMap[artist.id] = res.data?.followersCount ?? 0;
          } catch (e) {
            console.error(`Failed to fetch followers for artist ${artist.id}:`, e);
            followersMap[artist.id] = 0;
          }
        })
      );
      
      setFollowersData(followersMap);
    };

    fetchFollowers();
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress sx={{ color: '#1db954' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error al cargar artistas: {String(error)}</Typography>
        {String(error).includes('404') && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: '#b3b3b3' }}>Ruta esperada: <code>/artists/</code> (GET)</Typography>
            <Typography sx={{ color: '#b3b3b3' }}>Asegúrate de que el gateway tenga una ruta pública para <code>/artists</code> o que el servicio de artists esté disponible y correctamente configurado en el gateway.</Typography>
            <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={() => refetch()}>Reintentar</Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Title title="Gestión de Artistas" />
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1db954', mb: 3 }}>
        Artistas
      </Typography>
      <Card sx={{ backgroundColor: '#181818' }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ backgroundColor: '#181818' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Artista</TableCell>
                  <TableCell>Followers</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((artist: any, index: number) => (
                  <TableRow key={artist.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={artist.profile_picture} alt={artist.name} />
                      <Typography>{artist.name}</Typography>
                    </TableCell>
                    <TableCell>{followersData[artist.id] ?? '-'}</TableCell>
                    <TableCell>
                      <IconButton component={Link} to={`/artists/${artist.id}/show`} size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
