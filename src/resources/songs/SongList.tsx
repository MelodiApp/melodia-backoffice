import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  NumberField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  TextInput,
  BooleanInput,
  ImageField,
} from 'react-admin';

const songFilters = [
  <TextInput label="Buscar" source="q" alwaysOn />,
  <TextInput label="Género" source="genre" />,
  <BooleanInput label="Activo" source="isActive" />,
  <BooleanInput label="Oculto" source="isHidden" />,
];

export const SongList = () => (
  <List filters={songFilters} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid>
      <ImageField source="coverUrl" label="Cover" />
      <TextField source="title" label="Título" />
      <TextField source="artist" label="Artista" />
      <TextField source="album" label="Álbum" />
      <TextField source="genre" label="Género" />
      <NumberField source="duration" label="Duración (s)" />
      <NumberField source="plays" label="Reproducciones" />
      <NumberField source="likes" label="Me gusta" />
      <BooleanField source="isActive" label="Activo" />
      <BooleanField source="isHidden" label="Oculto" />
      <DateField source="createdAt" label="Creado" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
