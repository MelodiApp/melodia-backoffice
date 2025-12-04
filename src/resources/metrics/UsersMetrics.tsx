import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button, TextField } from '@mui/material';
import { People } from '@mui/icons-material';
import { metricsService } from '../../services/metricsService';
import { SaveAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: number; icon?: React.ReactNode; color?: 'primary'|'secondary'|'success'|'warning'|'error'; onClick?: () => void }> = ({ title, value, icon, color = 'primary', onClick }) => (
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [overview, setOverview] = useState<any>(null);

  const navigate = useNavigate();

  const fetchOverview = async (f?: string, t?: string) => {
    try {
      const fromArg = f ?? from;
      const toArg = t ?? to;
      const data = await metricsService.getUsersOverview(fromArg || undefined, toArg || undefined);
      setOverview(data);
    } catch (e) {
      console.error('Error fetching overview', e);
    }
  };


  const handleExport = async () => {
    try {
      const resp = await metricsService.exportUsersCsv(from || undefined, to || undefined);
      const blob = new Blob([resp.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Try to get filename from Content-Disposition response header
      const disposition = resp.headers && (resp.headers['content-disposition'] || resp.headers['Content-Disposition']);
      if (disposition) {
        const match = disposition.match(/filename=\"?([^\";]+)\"?/);
        if (match && match[1]) {
          a.download = match[1];
        } else {
          a.download = 'users_metrics.csv';
        }
      } else {
        // If backend didn't provide a filename, compute a readable fallback from selected dates
        const fmt = (d?: string) => {
          if (!d) return undefined;
          try {
            const t = new Date(d);
            if (isNaN(t.getTime())) return d.replace(/[:\s]/g, '-');
            const pad = (n: number) => n.toString().padStart(2, '0');
            const date = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
            if (t.getHours() === 0 && t.getMinutes() === 0 && t.getSeconds() === 0) return date;
            return `${date}T${pad(t.getHours())}-${pad(t.getMinutes())}`;
          } catch {
            return d.replace(/[:\s]/g, '-');
          }
        };
        const f = fmt(from);
        const t = fmt(to);
        let filename = 'users_metrics';
        if (f && t) filename = `users_metrics_from-${f}_to-${t}`;
        else if (f) filename = `users_metrics_from-${f}`;
        else if (t) filename = `users_metrics_to-${t}`;
        filename = `${filename}.csv`;
        a.download = filename;
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting csv', e);
    }
  };

  // Initialize from/to from query params if present
  useEffect(() => {
    const f = searchParams.get('from');
    const t = searchParams.get('to');
    if (f) setFrom(f);
    if (t) setTo(t);
    // fetch with provided params if present
    fetchOverview(f ?? undefined, t ?? undefined);
    // timeline was removed; only fetch overview
  }, []);

  const handleApplyFilters = async () => {
    // update URL query params based on current from/to
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    setSearchParams(params);
    // fetch overview with current filters
    await fetchOverview(from || undefined, to || undefined);
    // timeline was removed
  };

  const isDateRangeValid = (f?: string, t?: string) => {
    if (!f || !t) return true;
    const fd = new Date(f);
    const td = new Date(t);
    return fd.getTime() <= td.getTime();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <People sx={{ color: 'success.main', fontSize: 36 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'success.main' }}>
          Usuarios - Métricas
        </Typography>
      </Box>

  <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
    <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid item xs={12} sm={4} md={4}>
          <TextField
            fullWidth
            label="Desde"
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ '& .MuiInputBase-input': { minHeight: 34 }, fontSize: '0.9rem' }}
            inputProps={{ max: to || undefined }}
            error={Boolean(from && to && !isDateRangeValid(from, to))}
              helperText={from && to && !isDateRangeValid(from, to) ? 'La fecha "Desde" no puede ser posterior a la fecha "Hasta"' : ''}
            />
          </Grid>
  <Grid item xs={12} sm={4} md={4}>
          <TextField
            fullWidth
            label="Hasta"
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ '& .MuiInputBase-input': { minHeight: 34 }, fontSize: '0.9rem' }}
            inputProps={{ min: from || undefined }}
            error={Boolean(from && to && !isDateRangeValid(from, to))}
              helperText={from && to && !isDateRangeValid(from, to) ? 'La fecha "Hasta" no puede ser anterior a la fecha "Desde"' : ''}
            />
          </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Box sx={{ display: 'flex', gap: 2.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center', height: '100%' }}>
            <Button size="medium" variant="contained" onClick={() => handleApplyFilters()} disabled={!isDateRangeValid(from, to)} sx={{ minWidth: 170, px: 2.5 }}>Actualizar</Button>
            <Button size="medium" variant="outlined" startIcon={<SaveAlt />} onClick={handleExport} disabled={!isDateRangeValid(from, to)} sx={{ minWidth: 170, px: 2.5 }}>Exportar CSV</Button>
          </Box>
        </Grid>
    </Grid>
  </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => {
            const params = new URLSearchParams();
            if (from) params.set('from', from);
            if (to) params.set('to', to);
            navigate(`/metrics/users/list?type=total${params.toString() ? `&${params.toString()}` : ''}`);
          }}>
            <StatCard title="Total" value={overview?.total || 0} icon={<People sx={{ fontSize: 24 }} />} color="success" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => {
            const params = new URLSearchParams();
            if (from) params.set('from', from);
            if (to) params.set('to', to);
            navigate(`/metrics/users/list?type=active${params.toString() ? `&${params.toString()}` : ''}`);
          }}>
            <StatCard title="Activos" value={overview?.active || 0} icon={<People sx={{ fontSize: 24 }} />} color="success" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => {
            const params = new URLSearchParams();
            if (from) params.set('from', from);
            if (to) params.set('to', to);
            navigate(`/metrics/users/list?type=new${params.toString() ? `&${params.toString()}` : ''}`);
          }}>
            <StatCard title="Nuevos (rango)" value={overview?.new || 0} icon={<People sx={{ fontSize: 24 }} />} color="success" />
          </Box>
        </Grid>
      </Grid>

      {/* Timeline has been intentionally removed per requirements */}
    </Box>
  );
};

export default UsersMetrics;
