import React from "react";
import { Typography, Box, Paper, Grid } from "@mui/material";
import {
  People,
  Person,
  MusicNote,
  AdminPanelSettings,
} from "@mui/icons-material";
import { mockUsers } from "../../providers/mockData";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "warning" | "error";
}

const StatCard: React.FC<StatCardProps & { onClick?: () => void }> = ({ title, value, icon, color, onClick }) => (
  <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Box
        sx={{
          p: 2,
          borderRadius: "50%",
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Paper>
);

export const Dashboard: React.FC = () => {
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === 'active').length;
  const adminUsers = mockUsers.filter((u) => u.role === "admin").length;
  const listenerUsers = mockUsers.filter((u) => u.role === "listener").length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bienvenido al panel de administración de Melodia
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Usuarios"
            value={totalUsers}
            icon={<People sx={{ fontSize: 32 }} />}
            color="primary"
            onClick={() => window.location.href = '/metrics/users'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios Activos"
            value={activeUsers}
            icon={<Person sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Administradores"
            value={adminUsers}
            icon={<AdminPanelSettings sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Oyentes"
            value={listenerUsers}
            icon={<MusicNote sx={{ fontSize: 32 }} />}
            color="secondary"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
