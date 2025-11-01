import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  ShowButton,
  DeleteButton,
  FunctionField,
  SelectInput,
} from "react-admin";
import type { User } from "../../types/user";

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
  <List filters={userFilters} title="Gestión de Usuarios">
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
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
