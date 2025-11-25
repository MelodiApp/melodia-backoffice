import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ShowButton,
  FunctionField,
  SelectInput,
  Title,
  Pagination,
} from "react-admin";
import { useListContext } from "react-admin";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import type { User } from "../../types/user";
import { RestrictedEditButton, RestrictedDeleteButton } from "../../components/RestrictedButtons";

const userFilters = [
  <SelectInput
    source="role"
    label="Rol"
    choices={[
      { id: "admin", name: "Administrador" },
      { id: "listener", name: "Oyente" },
      { id: "artist", name: "Artista" },
    ]}
  />,
  <SelectInput
    source="status"
    label="Estado"
    choices={[
      { id: "active", name: "Activo" },
      { id: "blocked", name: "Bloqueado" },
    ]}
  />,
];

export const UserList = () => (
  <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
    <Title title="Gestión de Usuarios" />
    <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#1db954", mb: 3 }}>
      <People sx={{ mr: 1, verticalAlign: "middle" }} />
      Usuarios
    </Typography>
    <Typography variant="body1" sx={{ color: "#b3b3b3", mb: 3 }}>
      Explora y gestiona los usuarios
    </Typography>
    
    <List 
      filters={userFilters} 
      title={false} 
      exporter={false}
      perPage={10}
      pagination={<Pagination rowsPerPageOptions={[]} />}
      disableSyncWithLocation
    >
      <FriendlyUrlFilters />
      <Datagrid bulkActionButtons={false}>
        <TextField source="username" label="Nombre de Usuario" />
        <EmailField source="email" label="Correo Electrónico" />
        <FunctionField
          label="Rol"
          render={(record: User) => {
            const roleMap: Record<string, string> = {
              admin: "Administrador",
              listener: "Oyente",
              artist: "Artista",
            };
            return <span>{roleMap[record.role] || record.role}</span>;
          }}
        />
        <FunctionField
          label="Estado"
          render={(record: User) => (
            <span
              style={{
                color: record.status === "active" ? "#1db954" : "#f44336",
                fontWeight: "bold",
              }}
            >
              {record.status === "active" ? "Activo" : "Bloqueado"}
            </span>
          )}
        />
        <ShowButton />
        <RestrictedEditButton />
        <RestrictedDeleteButton />
      </Datagrid>
    </List>
  </Box>
);

// Syncroniza los filtros del List con una URL "amistosa" que use params
// planos en lugar de JSON (filter=...). Mantiene la funcionalidad intacta,
// solo reemplaza lo que se muestra en la barra de direcciones.
const FriendlyUrlFilters = () => {
  const { filterValues, setFilters, page, perPage, setPage, setPerPage, sort, setSort } = useListContext();
  const location = useLocation();
  const navigate = useNavigate();
  const inSyncRef = useRef(false);

  // Al montar: si en la URL hay filtros planos (status, role), aplicarlos
  useEffect(() => {
    try {
      const query = new URLSearchParams(location.search);
       const status = query.get("status");
       const typeParam = query.get("type") || query.get("user_type") || query.get("role");
       const role = typeParam;
       const qParam = query.get("q") || query.get("search");
  const pageParam = query.get('page');
  const perPageParam = query.get('perPage') || query.get('limit');
  const offsetParam = query.get('offset');
  const sortField = query.get('orderBy') || query.get('sort');
  const sortOrder = query.get('order');
      const hasFilterObj = query.get("filter") || query.get("displayedFilters");
      if (!hasFilterObj && (status || role)) {
        // Evitar loops: marcamos que estamos en sincronización externa
        inSyncRef.current = true;
         setFilters({ ...(status ? { status } : {}), ...(role ? { role } : {}), ...(qParam ? { q: qParam } : {}) });
        if (offsetParam) {
          const limitForOffset = perPageParam ? parseInt(perPageParam, 10) : (perPage || 10);
          const offsetVal = parseInt(offsetParam, 10);
          const calcPage = Math.floor(offsetVal / limitForOffset) + 1;
          if (setPage) setPage(calcPage);
        } else if (pageParam && setPage) {
          setPage(parseInt(pageParam, 10));
        }
        if (perPageParam && setPerPage) {
          setPerPage(parseInt(perPageParam, 10));
        }
  if (sortField && setSort) setSort({ field: sortField, order: (sortOrder || 'ASC') as any });
        inSyncRef.current = false;
      }
      // Si la URL contiene el filter JSON, lo parseamos y lo transformamos a params planos
      if (query.get("filter")) {
        try {
          const parsed = JSON.parse(query.get("filter") || "{}");
          const flat = new URLSearchParams(location.search);
          flat.delete("filter");
          flat.delete("displayedFilters");
          Object.keys(parsed).forEach((k) => {
            if (parsed[k] !== undefined) {
               flat.set(k, parsed[k]);
            }
          });
          // Aplicamos filtros parseados
          setFilters(parsed);
          // Reemplazamos la URL sin recargar, dejando el estado actual
          navigate({ search: flat.toString() ? `?${flat.toString()}` : "" }, { replace: true });
        } catch (err) {
          // ignore JSON parse failures
        }
      }
    } catch (err) {
      // no-op
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando el filtro cambia, actualizar la URL con params planos
  useEffect(() => {
  if (inSyncRef.current) return;
    try {
      const query = new URLSearchParams(location.search);
  // Eliminar claves de filtros JSON
      query.delete("filter");
      query.delete("displayedFilters");
      // Actualizar params planos a partir del objeto filter
      if (filterValues) {
      if (Object.keys(filterValues).length === 0) {
        query.delete("status");
        query.delete("role");
        // Also remove legacy/alternate param for the same filter
        query.delete("type");
        } else {
          if (filterValues.status) query.set("status", filterValues.status as string);
          else query.delete("status");
          // Show type in URL but keep role internally
          if (filterValues.role) query.set("type", filterValues.role as string);
          else { query.delete("role"); query.delete("type"); }
          if ((filterValues as any).q) query.set("q", (filterValues as any).q as string);
          else query.delete("q");
        }
      }
      // Añadir paginación y sort con estilo amigable (limit/offset/orderBy/order)
      if (typeof page === 'number' && typeof perPage === 'number') {
        const offset = (page - 1) * perPage;
        query.set('offset', String(offset));
        query.set('limit', String(perPage));
      }
      if (sort && sort.field) {
        query.set('orderBy', sort.field);
        query.set('order', (sort.order || 'ASC').toLowerCase());
      }

      inSyncRef.current = true;
  navigate({ search: query.toString() ? `?${query.toString()}` : "" }, { replace: true });
      setTimeout(() => { inSyncRef.current = false; }, 10);
    } catch (err) {
      // ignore
    }
  }, [filterValues, page, perPage, sort, location.search, navigate]);

  return null;
};
