import React from "react";
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
  Settings,
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
  { text: "Users", icon: <People />, path: "/users" },
  { text: "Music", icon: <MusicNote />, path: "/music" },
  { text: "Analytics", icon: <Analytics />, path: "/analytics" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
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
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
