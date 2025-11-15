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
        // Admin no puede cambiar de rol
        return [
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
      label="Rol"
      choices={getRoleChoices()}
      validate={required()}
      disabled={record.role === "listener" || record.role === "admin"}
      sx={record.role === "admin" ? { 
        "& .MuiInputBase-input": { 
          color: "#666", 
          backgroundColor: "#f5f5f5" 
        } 
      } : {}}
    />
  );
};

const StatusInput = () => {
  const record = useRecordContext();
  
  if (!record) return null;

  return (
    <SelectInput
      source="status"
      label="Estado"
      choices={[
        { id: "active", name: "Activo" },
        { id: "blocked", name: "Bloqueado" },
      ]}
      validate={required()}
      disabled={record.role === "admin"}
      sx={record.role === "admin" ? { 
        "& .MuiInputBase-input": { 
          color: "#666", 
          backgroundColor: "#f5f5f5" 
        } 
      } : {}}
    />
  );
};

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <RoleInput />
      <StatusInput />
    </SimpleForm>
  </Edit>
);
