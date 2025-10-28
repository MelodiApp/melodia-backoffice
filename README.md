# 🎵 Melodia Backoffice

Panel de administración para Melodia construido con **React Admin**.

## 🚀 Stack

- **React Admin** - Framework completo para backoffice
- **ra-data-json-server** - Data provider para APIs REST
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI** - Componentes UI
- **Vite** - Build tool

## ✨ Características

- ✅ CRUD completo para Usuarios, Canciones y Playlists
- ✅ Autenticación con login/logout
- ✅ Tema personalizado estilo Spotify
- ✅ Filtros y búsqueda en listas
- ✅ Validación de formularios
- ✅ Dashboard personalizado
- ✅ TypeScript en todo el proyecto

## 📋 Requisitos Previos

- **Node.js v20+** (importante!)
- npm o yarn

### Verificar versión de Node

```bash
node -v
```

Si tienes una versión menor a v20, actualiza:

```bash
# Con nvm (recomendado)
nvm install 20
nvm use 20

# O descarga desde https://nodejs.org/
```

## 🛠️ Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

El archivo `.env` ya está configurado:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

Ajusta `VITE_API_BASE_URL` según tu backend.

## 🚀 Ejecutar el Proyecto

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

## 🔐 Login

Para desarrollo, el login acepta cualquier credencial:

- Usuario: `admin` (o cualquier otro)
- Contraseña: `admin` (o cualquier otra)

## � Estructura del Proyecto

```
src/
├── providers/          # AuthProvider y DataProvider
├── resources/          # CRUD de cada recurso (users, songs, playlists)
├── theme/             # Tema personalizado
├── types/             # Tipos TypeScript
├── components/        # Dashboard y componentes reutilizables
└── App.tsx           # Configuración principal de React Admin
```

## 🎯 Recursos Disponibles

- **� Usuarios** - Gestión completa de usuarios
- **🎵 Canciones** - Catálogo de música
- **📝 Playlists** - Listas de reproducción

Cada recurso tiene:
- Lista con filtros y búsqueda
- Crear nuevo
- Editar existente
- Ver detalles
- Eliminar

## ⚙️ Configuración del Backend

Tu API debe responder en estos endpoints:

```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/songs
GET    /api/songs/:id
POST   /api/songs
PUT    /api/songs/:id
DELETE /api/songs/:id

GET    /api/playlists
GET    /api/playlists/:id
POST   /api/playlists
PUT    /api/playlists/:id
DELETE /api/playlists/:id
```

**Importante:** Las respuestas de listas deben incluir el header:
```
Content-Range: users 0-9/100
```

## � Tema

El tema usa la paleta de Spotify:
- Verde primario: `#1db954`
- Fondo oscuro: `#121212`
- Modo oscuro por defecto

Personaliza en: `src/theme/adminTheme.ts`

## � Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Error: Node.js version

```
You are using Node.js 18.x. Vite requires Node.js version 20.19+
```

**Solución:** Actualiza Node.js a v20 o superior.

### Error: CORS

Si ves errores de CORS, configura tu backend para aceptar peticiones desde `http://localhost:5173`.

### Error: 401 Unauthorized

Verifica que tu backend esté corriendo y la URL en `.env` sea correcta.

## 🚀 ¡Listo!

1. Actualiza Node.js a v20+
2. Ejecuta `npm install`
3. Ejecuta `npm run dev`
4. Abre http://localhost:5173
5. Haz login con cualquier credencial
6. ¡Comienza a usar el backoffice!
