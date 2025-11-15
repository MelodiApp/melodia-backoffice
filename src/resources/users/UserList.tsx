import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ShowButton,
  FunctionField,
  SelectInput,
  Title,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import type { User } from "../../types/user";
import { RestrictedEditButton, RestrictedDeleteButton } from "../../components/RestrictedButtons";

const userFilters = [
  <SelectInput
    source="role"
    label="Rol"
    choices={[
      { id: "admin", name: "Administrador" },
      { id: "listener", name: "Oyente" },
      { id: "artist", name: "Artista" },
    ]}
    alwaysOn
  />,
  <SelectInput
    source="status"
    label="Estado"
    choices={[
      { id: "active", name: "Activo" },
      { id: "blocked", name: "Bloqueado" },
    ]}
    alwaysOn
  />,
];

export const UserList = () => (
  <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
    <Title title="Gestión de Usuarios" />
    <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#1db954", mb: 3 }}>
      <People sx={{ mr: 1, verticalAlign: "middle" }} />
      Usuarios
    </Typography>
    <Typography variant="body1" sx={{ color: "#b3b3b3", mb: 3 }}>
      Explora y gestiona los usuarios
    </Typography>
    
    <List filters={userFilters} title={false}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="username" label="Nombre de Usuario" />
        <EmailField source="email" label="Correo Electrónico" />
        <FunctionField
          label="Rol"
          render={(record: User) => {
            const roleMap: Record<string, string> = {
              admin: "Administrador",
              listener: "Oyente",
              artist: "Artista",
            };
            return <span>{roleMap[record.role] || record.role}</span>;
          }}
        />
        <FunctionField
          label="Estado"
          render={(record: User) => (
            <span
              style={{
                color: record.status === "active" ? "#1db954" : "#f44336",
                fontWeight: "bold",
              }}
            >
              {record.status === "active" ? "Activo" : "Bloqueado"}
            </span>
          )}
        />
        <ShowButton />
        <RestrictedEditButton />
        <RestrictedDeleteButton />
      </Datagrid>
    </List>
  </Box>
);
