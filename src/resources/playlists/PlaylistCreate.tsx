import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  required,
} from "react-admin";

export const PlaylistCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nombre" validate={required()} fullWidth />
      <TextInput
        source="description"
        label="Descripción"
        multiline
        rows={3}
        fullWidth
      />
      <SelectInput
        source="type"
        label="Tipo"
        choices={[
          { id: "weekly_top", name: "Top Semanal" },
          { id: "monthly_top", name: "Top Mensual" },
          { id: "trending", name: "Tendencias" },
          { id: "custom", name: "Personalizada" },
        ]}
        defaultValue="custom"
        validate={required()}
      />
      <TextInput source="coverUrl" label="URL de Portada" fullWidth />
      <BooleanInput source="isActive" label="Activo" defaultValue={true} />
    </SimpleForm>
  </Create>
);
