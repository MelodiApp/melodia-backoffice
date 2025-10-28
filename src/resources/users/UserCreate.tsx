import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  PasswordInput,
  required,
  email,
} from "react-admin";

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" validate={[required(), email()]} />
      <TextInput source="username" validate={required()} />
      <TextInput
        source="fullName"
        label="Nombre Completo"
        validate={required()}
      />
      <PasswordInput source="password" validate={required()} />
      <SelectInput
        source="role"
        choices={[
          { id: "admin", name: "Administrador" },
          { id: "listener", name: "Oyente" },
          { id: "artist", name: "Artista" },
        ]}
        defaultValue="listener"
        validate={required()}
      />
      <BooleanInput source="isActive" label="Activo" defaultValue={true} />
      <TextInput source="avatar" label="URL del Avatar" />
    </SimpleForm>
  </Create>
);
