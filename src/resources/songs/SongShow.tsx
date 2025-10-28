import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  NumberField,
  DateField,
  ImageField,
} from 'react-admin';

export const SongShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ImageField source="coverUrl" label="Portada" />
      <TextField source="title" label="Título" />
      <TextField source="artist" label="Artista" />
      <TextField source="album" label="Álbum" />
      <TextField source="genre" label="Género" />
      <NumberField source="duration" label="Duración (segundos)" />
      <NumberField source="plays" label="Reproducciones" />
      <NumberField source="likes" label="Me gusta" />
      <BooleanField source="isActive" label="Activo" />
      <BooleanField source="isHidden" label="Oculto" />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
);
