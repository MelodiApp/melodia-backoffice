import {
  Edit,
  SimpleForm,
  BooleanInput,
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
      <BooleanInput source="isActive" label="Activo" />
    </SimpleForm>
  </Edit>
);
