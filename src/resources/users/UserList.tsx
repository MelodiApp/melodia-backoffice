import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  ShowButton,
  DeleteButton,
  ChipField,
  FunctionField,
} from "react-admin";
import type { User } from "../../types/user";

export const UserList = () => (
  <List actions={false} title="Gestión de Usuarios">
    <Datagrid bulkActionButtons={false}>
      <TextField source="username" label="Nombre de Usuario" />
      <EmailField source="email" label="Correo Electrónico" />
      <ChipField source="role" label="Rol" />
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
