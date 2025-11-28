import React from "react";
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from "@mui/material";
import {
  Dashboard,
  People,
  Analytics,
  MusicNote,
} from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  width?: number;
}

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Usuarios", icon: <People />, path: "/users" },
  { text: "Catálogo", icon: <MusicNote />, path: "/music" },
  // Map Analytics to Users metrics for now
  { text: "Métricas (Usuarios)", icon: <Analytics />, path: "/metrics/users" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  width = 240,
}) => {
  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => {
                if (onClose) onClose();
              }}
              sx={{ '&.active': { background: 'rgba(0,0,0,0.08)' } }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
