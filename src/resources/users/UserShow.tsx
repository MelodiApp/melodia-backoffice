import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  ChipField,
  FunctionField,
  useRecordContext,
} from "react-admin";
import type { User } from "../../types/user";

const DebugField = () => {
  const record = useRecordContext();
  console.log('📋 Record en UserShow:', record);
  return null;
};

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <DebugField />
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
              fontSize: "16px",
            }}
          >
            {record.status === "active" ? "Activo" : "Bloqueado"}
          </span>
        )}
      />
      <DateField source="createdAt" label="Fecha de Creación" showTime />
      <DateField source="lastLogin" label="Último Login" showTime />
    </SimpleShowLayout>
  </Show>
);
