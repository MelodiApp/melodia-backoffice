import React from 'react';
import { Menu, MenuItemLink, Layout } from 'react-admin';
import { People, Analytics, Dashboard as DashboardIcon, LibraryMusic } from '@mui/icons-material';

export const CustomMenu = (props: any) => (
  <Menu {...props}>
    <MenuItemLink to="/" primaryText="Dashboard" leftIcon={<DashboardIcon />} />
    <MenuItemLink to="/users" primaryText="Usuarios" leftIcon={<People />} />
    <MenuItemLink to="/catalog" primaryText="Catálogo" leftIcon={<LibraryMusic />} />
    <MenuItemLink to="/artists" primaryText="Artistas" leftIcon={<People />} />
    <MenuItemLink to="/metrics/users" primaryText="Métricas (Usuarios)" leftIcon={<Analytics />} />
  {/* Settings menu removed per request */}
  </Menu>
);

export default CustomMenu;

export const CustomLayout = (props: any) => <Layout {...props} menu={CustomMenu} />;
