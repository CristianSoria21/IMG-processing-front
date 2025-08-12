# Img Processing — Frontend

App **frontend** (Next.js + React + TypeScript + MUI) para **subir**, **procesar** (escala de grises, resize, rotación), **editar** y **eliminar** imágenes. Incluye **login/register** y rutas protegidas.

---

## Requisitos

- **Node 18+** (recomendado 20)
- **npm** / **pnpm** / **yarn**
- Backend disponible (URL base de la API)

---

## Cómo levantar el proyecto

```bash
# 1) Instalar dependencias
npm install

# 2) Crear variables de entorno
cp .env.example .env.local
# Edita .env.local con la URL de tu backend
# NEXT_PUBLIC_API_URL=http://localhost:4000/api

# 3) Modo desarrollo
npm run dev
# Abre http://localhost:3000

# 4) Build y producción
npm run build
npm start
```

> Alternativa: con proxy (rewrites) en `next.config.mjs`, usa `baseURL: "/api"` en `axios` y apunta el proxy a tu backend.

---

## Scripts

- `dev` → servidor de desarrollo
- `build` → compila para producción
- `start` → sirve el build de producción
- `lint` → corre el linter

---

## Estructura de carpetas (mínima)

```
src/
  app/
    login/page.tsx            # Login
    register/page.tsx         # Registro
    (protected)/dashboard/
      page.tsx                # Listado + subir/editar/eliminar
      UploadDialog.tsx        # Subir con opciones
      EditImageDialog.tsx     # Editar (original/procesada/preview)
    layout.tsx                # Theme + AuthProvider
  components/
    Navbar.tsx
    ImageCard.tsx
    UploadDropzone.tsx
  hooks/
    useAuth.ts                # login/register + estado
    useImages.ts              # GET/PUT/DELETE de imágenes
    useUpload.ts              # POST de imágenes
  services/
    axios.ts                  # cliente HTTP (token + baseURL)
    api.ts                    # endpoints (opcional)
    imageOps.ts               # buildOperations(options) → Operation[]
  types/
    index.ts                  # tipos (ImageItem, Operation, AuthUser, etc.)
  theme/
    theme.ts                  # MUI tema oscuro
```

---

## Resumen del proyecto

Interfaz para gestionar imágenes:

- **Subir** una imagen y enviar **operaciones** (grayscale, resize, rotate).
- **Ver** original y procesada; **previsualizar** antes de aplicar cambios.
- **Editar** una imagen existente (PUT con `{ "options": [...] }`).
- **Eliminar** imágenes.
- **Autenticación** simple con token y rutas protegidas.

---

## Notas rápidas

- El cliente HTTP (`axiosService`) agrega el token desde `localStorage` (Authorization: Bearer).
- Si ves errores de CORS en desarrollo, considera usar **rewrites** en Next o habilitar CORS en el backend.
