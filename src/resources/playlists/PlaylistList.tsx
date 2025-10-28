import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  TextInput,
  BooleanInput,
  SelectInput,
  ImageField,
  ChipField,
} from 'react-admin';

const playlistFilters = [
  <TextInput label="Buscar" source="q" alwaysOn />,
  <SelectInput
    label="Tipo"
    source="type"
    choices={[
      { id: 'weekly_top', name: 'Top Semanal' },
      { id: 'monthly_top', name: 'Top Mensual' },
      { id: 'trending', name: 'Tendencias' },
      { id: 'custom', name: 'Personalizada' },
    ]}
  />,
  <BooleanInput label="Activo" source="isActive" />,
];

export const PlaylistList = () => (
  <List filters={playlistFilters} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid>
      <ImageField source="coverUrl" label="Cover" />
      <TextField source="name" label="Nombre" />
      <TextField source="description" label="Descripción" />
      <ChipField source="type" label="Tipo" />
      <BooleanField source="isActive" label="Activo" />
      <DateField source="createdAt" label="Creado" />
      <DateField source="updatedAt" label="Actualizado" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
