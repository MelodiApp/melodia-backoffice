import {
  Edit,
  SimpleForm,
  SelectInput,
  required,
} from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput
        source="role"
        choices={[
          { id: "admin", name: "Administrador" },
          { id: "listener", name: "Oyente" },
          { id: "artist", name: "Artista" },
        ]}
        validate={required()}
      />
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
