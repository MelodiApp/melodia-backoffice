import {
  Edit,
  SimpleForm,
  SelectInput,
  required,
  useRecordContext,
  useNotify,
} from "react-admin";
import { useState, useEffect } from "react";

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
  
  console.log('🔍 StatusInput - Record:', record);
  
  if (!record) {
    console.log('⚠️ StatusInput - No record available');
    return null;
  }

  console.log('🔍 StatusInput - Record role:', record.role);
  console.log('🔍 StatusInput - Record status:', record.status);

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

export const UserEdit = () => {
  const notify = useNotify();
  const record = useRecordContext();
  const [initialStatus, setInitialStatus] = useState<string>();

  useEffect(() => {
    if (record?.status && !initialStatus) {
      console.log('🔄 Setting initial status:', record.status);
      setInitialStatus(record.status);
    }
  }, [record?.status, initialStatus]);

  console.log('🔍 UserEdit - Record:', record);
  console.log('🔍 UserEdit - Record ID:', record?.id);
  console.log('🔍 UserEdit - Initial status:', initialStatus);

  return (
    <Edit
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: (data) => {
          console.log('✅ UserEdit - Update success:', data);
          if (initialStatus && initialStatus !== data.status) {
            const statusLabel = data.status === 'active' ? 'Activo' : 'Bloqueado';
            notify(`Estado del usuario cambiado exitosamente a ${statusLabel}`, { type: 'success' });
          } else {
            notify('Usuario actualizado exitosamente', { type: 'success' });
          }
        },
        onError: (error) => {
          console.error('❌ UserEdit - Update error:', error);
          notify('Error al actualizar usuario', { type: 'error' });
        }
      }}
    >
      <SimpleForm>
        <RoleInput />
        <StatusInput />
      </SimpleForm>
    </Edit>
  );
};
