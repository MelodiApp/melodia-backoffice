# 🚀 Guía de Testing End-to-End

## Endpoints Conectados

El Melodia Backoffice está conectado a los siguientes endpoints del gateway:

### Autenticación (sin auth requerido)
- ✅ `POST /api/admin/login` - Login de administrador
- ✅ `POST /api/admin/refresh-token` - Renovar token

### Gestión de Usuarios (requiere auth + rol admin)
- ✅ `GET /api/admin/users` - Listar usuarios
- ✅ `GET /api/admin/users/:id` - Ver detalle de usuario
- ✅ `PUT /api/admin/users/:id` - Actualizar usuario (role, isActive)
- ✅ `DELETE /api/admin/users/:id` - Eliminar usuario

## 📋 Pasos para Probar

### 1. Levantar Servicios

```bash
# Terminal 1 - Users Microservice (puerto 8092)
cd users-microservice
python -m uvicorn app.main:app --reload --port 8092

# Terminal 2 - Gateway (puerto 3000)
cd gateway
npm run dev

# Terminal 3 - Melodia Backoffice (puerto 5173)
cd melodia-backoffice
npm run dev
```

### 2. Verificar Variables de Entorno

**Gateway (.env)**
```bash
PORT=3000
USERS_URL=http://localhost:8092
ARTISTS_URL=http://localhost:8093
LIBRARIES_URL=http://localhost:8094
DISABLE_AUTH=false
```

**Melodia Backoffice (.env)**
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

### 3. Crear Usuario Admin (si no existe)

Desde el microservicio de usuarios o la base de datos, asegúrate de tener un usuario con:
- `type: "admin"`
- `status: "active"`

### 4. Probar en el Navegador

1. Abre `http://localhost:5173`
2. **Login**: Ingresa email y password de un admin
3. **Ver usuarios**: Deberías ver la lista de usuarios
4. **Ver detalle**: Click en 👁️ Show
5. **Editar**: Click en ✏️ Edit (puedes cambiar role e isActive)
6. **Eliminar**: Click en 🗑️ Delete

## 🔍 Debug

### Ver peticiones HTTP
Abre DevTools (F12) → Network → Filter: Fetch/XHR

Deberías ver peticiones a:
- `POST /api/admin/login`
- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`

### Ver logs en consola
El navegador mostrará:
- 🚀 Peticiones salientes
- ✅ Respuestas exitosas
- ❌ Errores

### Ver tokens guardados
DevTools → Application → Local Storage → http://localhost:5173
- `auth`: Objeto con user y tokens
- `auth_token`: Access token JWT

## ⚠️ Posibles Errores

### Error: Network Error
- ✅ Verifica que el gateway esté corriendo en puerto 3000
- ✅ Verifica la URL en `.env` del backoffice

### Error: 401 Unauthorized
- ✅ Verifica que el usuario sea admin
- ✅ Intenta hacer logout y login nuevamente

### Error: 403 Forbidden
- ✅ El usuario no tiene rol de admin
- ✅ Verifica `type: "admin"` en la base de datos

### No se ven usuarios
- ✅ Verifica que el microservicio de usuarios esté corriendo
- ✅ Verifica que haya usuarios en la base de datos
- ✅ Revisa la consola del gateway para ver errores

## 📊 Mapeo de Datos

El backend usa nombres diferentes a React Admin:

| Backend | Frontend |
|---------|----------|
| `id` (number) | `id` (string) |
| `type` | `role` |
| `status` ("active"/"blocked") | `isActive` (boolean) |
| `created_at` | `createdAt` |
| `last_login` | `updatedAt` |

El `adminService` se encarga automáticamente de este mapeo.

## ✅ Checklist de Testing

- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas (debe fallar)
- [ ] Ver lista de usuarios
- [ ] Buscar usuarios (filtro)
- [ ] Ver detalle de un usuario
- [ ] Editar rol de usuario
- [ ] Cambiar estado activo/inactivo
- [ ] Eliminar usuario
- [ ] Logout
- [ ] Intentar acceder sin login (debe redirigir a login)

## 🎯 Archivos Modificados

Solo se modificaron archivos en `melodia-backoffice`:

1. `src/services/adminService.ts` - Cliente HTTP para endpoints del gateway
2. `src/providers/authProvider.ts` - Autenticación real con JWT
3. `src/providers/realDataProvider.ts` - Conexión con API real
4. `src/providers/index.ts` - Exporta realDataProvider
5. `src/App.tsx` - Usa realDataProvider en lugar de mock

**No se modificó nada en gateway ni en el backend.**

## 🔐 Seguridad

- Los tokens se almacenan en localStorage
- Todas las peticiones incluyen `Authorization: Bearer {token}`
- Si el token expira (401), se intenta renovar automáticamente
- Solo usuarios con `type: "admin"` pueden acceder

---

**¡Listo para probar!** Levanta los servicios y abre http://localhost:5173
