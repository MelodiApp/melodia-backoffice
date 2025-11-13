import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  required,
} from "react-admin";

export const SongCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Título" validate={required()} />
      <TextInput source="artist" label="Artista" validate={required()} />
      <TextInput source="album" label="Álbum" validate={required()} />
      <TextInput source="genre" label="Género" validate={required()} />
      <NumberInput
        source="duration"
        label="Duración (segundos)"
        validate={required()}
      />
      <TextInput source="coverUrl" label="URL de Portada" fullWidth />
      <BooleanInput source="isActive" label="Activo" defaultValue={true} />
      <BooleanInput source="isHidden" label="Oculto" defaultValue={false} />
    </SimpleForm>
  </Create>
);
