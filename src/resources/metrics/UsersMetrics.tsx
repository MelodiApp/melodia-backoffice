import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField } from '@mui/material';
import { People } from '@mui/icons-material';
import { metricsService } from '../../services/metricsService';
import { SaveAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: number; icon?: React.ReactNode; color?: 'primary'|'secondary'|'success'|'warning'|'error' }> = ({ title, value, icon, color = 'primary' }) => (
  <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      {icon && (
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5,
            width: 56,
            height: 56,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h4" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);

export const UsersMetrics: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [overview, setOverview] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  const navigate = useNavigate();

  const fetchOverview = async () => {
    try {
      const data = await metricsService.getUsersOverview(from || undefined, to || undefined);
      setOverview(data);
    } catch (e) {
      console.error('Error fetching overview', e);
    }
  };

  const fetchTimeline = async () => {
    if (!from || !to) return;
    try {
      const data: any = await metricsService.getUsersDetail(from, to);
      setTimeline(data.timeline || []);
    } catch (e) {
      console.error('Error fetching timeline', e);
    }
  };

  const handleExport = async () => {
    try {
      const resp = await metricsService.exportUsersCsv(from || undefined, to || undefined);
      const blob = new Blob([resp.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_metrics.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting csv', e);
    }
  };

  useEffect(() => { fetchOverview(); }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <People sx={{ color: 'success.main', fontSize: 36 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'success.main' }}>
          Usuarios - Métricas
        </Typography>
      </Box>

  <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Desde" type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Hasta" type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center', height: '100%' }}>
            <Button variant="contained" onClick={fetchOverview}>Actualizar</Button>
            <Button variant="outlined" startIcon={<SaveAlt />} onClick={handleExport}>Exportar CSV</Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total" value={overview?.total || 0} icon={<People sx={{ fontSize: 24 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Activos" value={overview?.active || 0} icon={<People sx={{ fontSize: 24 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Nuevos (rango)" value={overview?.new || 0} icon={<People sx={{ fontSize: 24 }} />} color="success" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Timeline (nuevos usuarios por día)</Typography>
        {timeline.length === 0 && <Typography>No hay datos</Typography>}
        {timeline.length > 0 && (
          <Box>
            {timeline.map((t) => (
              <Box key={t.date} display="flex" justifyContent="space-between" sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                <Typography>{t.date}</Typography>
                <Typography>{t.new}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UsersMetrics;
