# Integración de Endpoints de Catálogo

Este documento describe cómo están conectados los endpoints del gateway con el backoffice de Melodia para la gestión del catálogo (canciones y colecciones).

## Arquitectura

```
Backoffice (React) -> catalogService.ts -> Gateway -> Artists Microservice
```

## Endpoints Conectados

### 1. Obtener todas las discografías
- **Endpoint del Gateway**: `GET /api/admin/artists/discographies`
- **Endpoint del Microservicio**: `GET /admin/artists/discographies`
- **Servicio**: `catalogService.getAllDiscographies()`
- **Usado en**: `CatalogContent.tsx` (lista de catálogo)

### 2. Obtener canción por ID
- **Endpoint del Gateway**: `GET /api/admin/artists/songs/:song_id`
- **Endpoint del Microservicio**: `GET /admin/artists/songs/:song_id`
- **Servicio**: `catalogService.getSongById()`
- **Usado en**: `CatalogShow.tsx` (detalle de canción)

### 3. Actualizar canción
- **Endpoint del Gateway**: `PUT /api/admin/artists/songs/:song_id`
- **Endpoint del Microservicio**: `PUT /admin/artists/songs/:song_id`
- **Servicio**: `catalogService.updateSong()`
- **Usado en**: `SummaryTab.tsx` (editar información de canción)

### 4. Actualizar estado de canción
- **Endpoint del Gateway**: `PUT /api/admin/artists/songs/:song_id/status`
- **Endpoint del Microservicio**: `PUT /admin/artists/songs/:song_id/status`
- **Servicio**: `catalogService.updateSongStatus()`
- **Usado en**: `catalogStateService.changeItemState()` (cambiar estado)

### 5. Obtener colección por ID
- **Endpoint del Gateway**: `GET /api/admin/artists/collections/:collection_id`
- **Endpoint del Microservicio**: `GET /admin/artists/collections/:collection_id`
- **Servicio**: `catalogService.getCollectionById()`
- **Usado en**: `CatalogShow.tsx` (detalle de colección)

### 6. Actualizar colección
- **Endpoint del Gateway**: `PUT /api/admin/artists/collections/:collection_id`
- **Endpoint del Microservicio**: `PUT /admin/artists/collections/:collection_id`
- **Servicio**: `catalogService.updateCollection()`
- **Usado en**: `SummaryTab.tsx` (editar información de colección)

### 7. Actualizar estado de colección
- **Endpoint del Gateway**: `PUT /api/admin/artists/collections/:collection_id/status`
- **Endpoint del Microservicio**: `PUT /admin/artists/collections/:collection_id/status`
- **Servicio**: `catalogService.updateCollectionStatus()`
- **Usado en**: `catalogStateService.changeItemState()` (cambiar estado)

## Archivos Modificados

### Backend (Gateway)
- `gateway/src/controllers/admin.controller.ts`: Controlador que conecta con el microservicio de artistas

### Frontend (Backoffice)

#### Servicios
- `src/services/catalogService.ts`: **NUEVO** - Servicio que maneja la comunicación con el gateway para endpoints de catálogo
- `src/services/catalogStateService.ts`: Actualizado para usar el servicio real en lugar de mock
- `src/services/index.ts`: Actualizado para exportar el nuevo servicio

#### Tipos
- `src/types/catalog.ts`: Actualizado con campos adicionales (`duration`, `explicit`, `artistId`, `collectionType`)

#### Providers
- `src/providers/realDataProvider.ts`: Actualizado para soportar los recursos `catalog`, `songs` y `collections`

#### Componentes
- `src/resources/catalog/CatalogContent.tsx`: Actualizado para usar `useGetList` de React Admin
- `src/resources/catalog/CatalogShow.tsx`: Actualizado para usar `useGetOne` de React Admin

## Flujo de Datos

### Listar Catálogo
1. Usuario visita `/catalog`
2. `CatalogContent` usa `useGetList('catalog', ...)`
3. `realDataProvider.getList()` llama a `catalogService.getAllDiscographies()`
4. `catalogService` hace request a `GET /api/admin/artists/discographies`
5. Gateway redirige a `GET /admin/artists/discographies` del microservicio
6. Datos se mapean de formato backend a frontend
7. Se muestran en `CatalogTable`

### Ver Detalle
1. Usuario hace clic en un item
2. `CatalogShow` usa `useGetOne('catalog', { id })`
3. `realDataProvider.getOne()` intenta primero `catalogService.getSongById()`
4. Si falla, intenta `catalogService.getCollectionById()`
5. Gateway redirige al endpoint apropiado del microservicio
6. Datos se muestran en las diferentes tabs

### Cambiar Estado
1. Usuario cambia estado en `SummaryTab`
2. `catalogStateService.changeItemState()` se llama
3. Se usa `catalogService.updateItemStatus()` que llama al endpoint apropiado
4. Gateway actualiza el estado en el microservicio
5. Se agrega un evento de auditoría local
6. UI se actualiza automáticamente

## Mapeo de Datos

### Backend → Frontend

#### Song
```typescript
{
  id: number → string,
  title: string,
  duration: number,
  explicit: boolean,
  releaseDate: string → publishDate,
  status: string → CatalogStatus,
  artist.name → mainArtist,
  collection.title → collection,
  ...
}
```

#### Collection
```typescript
{
  id: number → string,
  title: string,
  releaseDate: string → publishDate,
  status: string → CatalogStatus,
  collectionType: string,
  artist.name → mainArtist,
  ...
}
```

### Estados
- Backend: `"published" | "blocked" | "scheduled" | "draft"`
- Frontend: `"published" | "blocked" | "scheduled"`
- Nota: `"draft"` del backend se mapea a `"blocked"` en el frontend

## Configuración

Asegúrate de que las variables de entorno estén configuradas correctamente:

### Gateway
```env
ARTISTS_SERVICE_URL=http://localhost:3001
```

### Backoffice
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing

Para probar la integración:

1. Inicia el microservicio de artistas
2. Inicia el gateway
3. Inicia el backoffice
4. Navega a `/catalog` en el backoffice
5. Verifica que se carguen los datos del backend
6. Prueba ver el detalle de un item
7. Prueba cambiar el estado de un item

## Notas

- Los datos mock siguen disponibles como fallback en caso de error
- El sistema maneja errores de red de forma graceful
- Los eventos de auditoría se almacenan localmente (pendiente de integración con backend)
- La búsqueda y filtrado se hace mayormente en el backend, con algunos filtros adicionales en el frontend
