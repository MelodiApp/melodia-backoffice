import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  ImageField,
  ArrayField,
  Datagrid,
  NumberField,
} from "react-admin";

export const PlaylistShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ImageField source="coverUrl" label="Portada" />
      <TextField source="name" label="Nombre" />
      <TextField source="description" label="Descripción" />
      <TextField source="type" label="Tipo" />
      <BooleanField source="isActive" label="Activo" />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />

      {/* Lista de canciones en la playlist */}
      <ArrayField source="songs" label="Canciones">
        <Datagrid bulkActionButtons={false}>
          <ImageField source="coverUrl" label="Cover" />
          <TextField source="title" label="Título" />
          <TextField source="artist" label="Artista" />
          <TextField source="album" label="Álbum" />
          <NumberField source="duration" label="Duración (s)" />
          <DateField source="addedAt" label="Agregado" showTime />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
