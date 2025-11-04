import {
  Edit,
  SimpleForm,
  SelectInput,
  required,
  useRecordContext,
} from "react-admin";

const RoleInput = () => {
  const record = useRecordContext();
  
  if (!record) return null;
  
  // Definir las opciones según el rol actual
  const getRoleChoices = () => {
    switch (record.role) {
      case "listener":
        // Listener no puede cambiar de rol
        return [
          { id: "listener", name: "Oyente" },
        ];
      case "artist":
        // Artist solo puede cambiar a listener
        return [
          { id: "listener", name: "Oyente" },
          { id: "artist", name: "Artista" },
        ];
      case "admin":
        // Admin solo puede cambiar a listener
        return [
          { id: "listener", name: "Oyente" },
          { id: "admin", name: "Administrador" },
        ];
      default:
        return [
          { id: "listener", name: "Oyente" },
        ];
    }
  };

  return (
    <SelectInput
      source="role"
      choices={getRoleChoices()}
      validate={required()}
      disabled={record.role === "listener"}
    />
  );
};

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <RoleInput />
      <SelectInput
        source="status"
        label="Estado"
        choices={[
          { id: "active", name: "Activo" },
          { id: "blocked", name: "Bloqueado" },
        ]}
        validate={required()}
      />
    </SimpleForm>
  </Edit>
);
