# 🚀 Guía de Despliegue - Melodia Backoffice

## Configuración Completada ✅

El proyecto está ahora configurado para despliegue en las siguientes plataformas:

### 📁 Archivos de Configuración Creados

- `netlify.toml` - Configuración para Netlify
- `vercel.json` - Configuración para Vercel  
- `.env.production` - Variables de entorno para producción
- `build.sh` - Script de construcción local

### 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build:prod

# Preview local del build
npm run preview

# Construcción con script personalizado
./build.sh

# Linting y corrección
npm run lint
npm run lint:fix
```

## 🌐 Opciones de Despliegue

### 1. Netlify (Recomendado)

1. Conecta tu repositorio en [Netlify](https://netlify.com)
2. Configuración automática detectada por `netlify.toml`
3. Build command: `npm run build:prod`
4. Publish directory: `dist`

### 2. Vercel

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configuración automática detectada por `vercel.json`
3. Framework: Detectado automáticamente (Vite)

### 3. GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar script en package.json
"deploy": "gh-pages -d dist"

# Desplegar
npm run build:prod && npm run deploy
```

## 🔐 Variables de Entorno

### Producción
- `VITE_API_BASE_URL=https://api-gateway-melodia-d17999a051b6.herokuapp.com`
- `VITE_NODE_ENV=production`

### Desarrollo Local
- `VITE_API_BASE_URL=http://192.168.1.9:8091`
- `VITE_NODE_ENV=development`

## 🛠 Construcción Local

```bash
# Construcción rápida
npm run build:prod

# Construcción con validaciones completas
./build.sh

# Preview del resultado
npm run preview
```

## 📊 Optimizaciones Aplicadas

- ✅ Code splitting por chunks (vendor, admin, mui)
- ✅ Caché optimizado para assets
- ✅ Headers de seguridad
- ✅ Sourcemaps deshabilitados en producción
- ✅ Bundle size optimizado

## 🚀 Pasos para Desplegar

1. **Hacer commit de los cambios:**
```bash
git add .
git commit -m "feat: configuración de despliegue"
git push origin users-logic
```

2. **Elegir plataforma de despliegue:**
   - Netlify (más fácil)
   - Vercel (más rápido)
   - GitHub Pages (gratis)

3. **Conectar repositorio y desplegar**

## ⚡ Test Local Antes de Desplegar

```bash
./build.sh && npm run preview
```

¡El backoffice estará disponible en `http://localhost:3000`!