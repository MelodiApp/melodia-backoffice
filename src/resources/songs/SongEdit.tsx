import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  required,
} from "react-admin";

export const SongEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
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
      <BooleanInput source="isActive" label="Activo" />
      <BooleanInput source="isHidden" label="Oculto" />
      <NumberInput source="plays" label="Reproducciones" disabled />
      <NumberInput source="likes" label="Me gusta" disabled />
    </SimpleForm>
  </Edit>
);
