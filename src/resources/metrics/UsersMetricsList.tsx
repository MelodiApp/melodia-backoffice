import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { metricsService } from '../../services/metricsService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1db954', '#f44336', '#2196f3'];

const UsersMetricsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'total';
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const doFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metricsService.getUsersList(type as any, from, to, 0, 1000);
      // The 'new' endpoint returns {from,to,users}
      if (type === 'new' && data && (data as any).users) {
        setUsers((data as any).users || []);
      } else {
        setUsers((data as any) || []);
      }
    } catch (e: any) {
      setError(e.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doFetch();
  }, [type, from, to]);

  const counts = users.reduce((acc: Record<string, number>, u: any) => {
    const t = String(u.type || 'listener');
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  // Ensure all roles are present and map them to Spanish labels for display
  const roles = ['admin', 'listener', 'artist'];
  const roleLabel: Record<string, string> = {
    admin: 'Administrador',
    listener: 'Oyente',
    artist: 'Artista',
  };
  const chartData = roles.map((r) => ({ name: roleLabel[r], value: counts[r] || 0 }));

  const navigate = useNavigate();
  const goBack = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    navigate(`/metrics/users${qs ? `?${qs}` : ''}`);
  };

  const typeLabels: Record<string, string> = {
    total: 'Total',
    active: 'Activos',
    new: 'Nuevos',
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={goBack}>
            Volver
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => doFetch()}>
            Actualizar
          </Button>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-start" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ color: 'success.main', textAlign: 'left' }} gutterBottom>
          Usuarios - Lista ({typeLabels[type] || type})
        </Typography>
      </Box>
      {loading && (
        <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Paper>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Distribución por rol</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}`} />
                  <Legend formatter={(value: string) => value} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default UsersMetricsList;
