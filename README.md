# Melodia Backoffice

Panel de administración para Melodia construido con **React Admin**.

## Stack

- **React Admin** - Framework completo para backoffice
- **ra-data-json-server** - Data provider para APIs REST
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI** - Componentes UI
- **Vite** - Build tool

## Características

- CRUD completo para Usuarios y Contenido
- Autenticación con login/logout

## Requisitos Previos

- Node.js v20+
- npm o yarn

### Verificar versión de Node

```bash
node -v
```

Si se cuenta con una versión menor a v20, actualiza:

```bash
# Con nvm (recomendado)
nvm install 20
nvm use 20

# O descarga desde https://nodejs.org/
```

## Instalación

1. **Instalar dependencias:**

```bash
npm install
```

## Ejecutar el Proyecto

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5175**

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── providers/          
├── resources/          
├── theme/            
├── types/             
├── components/       
└── App.tsx           
```

## Comandos Útiles

```bash

# Formatter
npm prettier --write .

# Lint
npm run lint
```
