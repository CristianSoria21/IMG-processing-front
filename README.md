# Img Processing — Frontend (Next.js + MUI)

Interfaz web para subir imágenes, aplicar transformaciones (escala de grises, **resize**, **rotación**), **editar** transformaciones, visualizar **original / procesada / vista previa**, y **eliminar** imágenes. Incluye autenticación (login/register), rutas protegidas y tema oscuro moderno con MUI.

---

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Material UI (MUI)** (tema **dark** personalizado)
- **Axios** (servicios HTTP con interceptor para token)
- **AuthContext** (token + usuario en `localStorage`)
- Arquitectura por capas: `components/`, `hooks/`, `services/`, `types/`, `app/`

---

## Requisitos

- **Node.js** 18+ (recomendado 20.x)
- **npm** o **pnpm**/yarn
- **Backend** corriendo con estos endpoints:
  - `POST /auth/login` → `{ token, user }`
  - `POST /auth/register` → `{ token, user }`
  - `GET /images` → `ImageItem[]`
  - `POST /images` (multipart) → campos: `file`, `operations` (**string JSON**)
  - `PUT /images/:id` → body: `{ options: Operation[] }`
  - `DELETE /images/:id`

### Ejemplo de `ImageItem`

```json
{
	"id": 18,
	"originalUrl": "http://localhost:8000/static/original/xxx.jpeg",
	"processedUrl": "http://localhost:8000/static/processed/xxx.jpg",
	"createdAt": "2025-08-11T04:11:51.160Z"
}
```

### Ejemplo de **operaciones**

```json
[
	{ "type": "GREYSCALE" },
	{ "type": "RESIZE", "width": 800, "height": 600 },
	{ "type": "ROTATE", "deg": 90 }
]
```

> Al **subir** se envía en `FormData` el campo **`operations`** como string JSON.  
> Al **editar** se envía en el body `{ "options": Operation[] }`.

---

## Inicio rápido

```bash
# 1) Instalar dependencias
npm install

# 2) Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local según tu backend

# 3) Levantar en modo desarrollo
npm run dev
# abre http://localhost:3000

# 4) Build y producción
npm run build
npm start
```

### `.env.example`

```env
# Opción A: llamar directo al backend (recomendado)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> Si prefieres **proxy con Next** (evitar CORS en dev), usa la **Opción B** en “Configuración de red”.

---

## Configuración de red

### Opción A — Directo al backend

- `.env.local` define `NEXT_PUBLIC_API_URL` (p. ej. `http://localhost:4000/api`)
- El backend debe permitir CORS desde `http://localhost:3000`

```ts
// src/services/axios.ts
import axios from "axios";
export const axiosService = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});
axiosService.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const t = localStorage.getItem("token");
		if (t) config.headers.Authorization = `Bearer ${t}`;
	}
	return config;
});
```

### Opción B — Proxy (rewrites) con Next

- En `next.config.mjs`:

```js
export default {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/api/:path*",
			},
		];
	},
};
```

- Y en `axios.ts` usar `baseURL: "/api"`.

> Tras editar `.env.local` o `next.config.mjs`, **reinicia** `npm run dev`.

---

## Scripts útiles

```bash
npm run dev       # desarrollo
npm run build     # build prod
npm start         # servir build
npm run lint      # lint
```

---

## Estructura de carpetas (resumen)

```
src/
  app/
    (protected)/
      dashboard/
        page.tsx              # listado, subir, editar, eliminar
        UploadDialog.tsx      # subir + transformaciones
        EditImageDialog.tsx   # editar con Original/Procesada/Preview (responsive)
    login/page.tsx            # login
    register/page.tsx         # registro
    layout.tsx                # AuthProvider y ThemeProvider
  components/
    Navbar.tsx
    ImageCard.tsx
    UploadDropzone.tsx
  hooks/
    useAuth.ts
    useImages.ts              # listar, eliminar (DELETE), actualizar (PUT)
    useUpload.ts              # subir (POST) con operations
  services/
    axios.ts                  # baseURL + token
    api.ts                    # endpoints (get/post/put/delete)
    imageOps.ts               # buildOperations(options) → Operation[]
  types/
    index.ts                  # ImageItem, Operation, AuthUser, UserRegister, etc.
  theme/
    theme.ts                  # MUI dark theme
```

---

## Flujo principal

### Autenticación

- `AuthContext` guarda `{ token, user }` en `localStorage` y expone `isAuthenticated` e `isReady`.
- Las rutas protegidas esperan `isReady` antes de redirigir a `/login`.

### Listado de imágenes

- `useImages()` obtiene `GET /images` y filtra en cliente.
- `ImageCard` muestra miniaturas y **acciones**: **Editar** (abre diálogo), **Eliminar** (DELETE).

### Subir imagen

- `UploadDialog` valida **PNG/JPG**, ofrece **grayscale**, **width/height**, **rotation** con **preview**.
- Envía `multipart/form-data` con `file` + `operations` (string JSON).

### Editar imagen

- `EditImageDialog` (responsivo):
  - **móvil** → tabs: Original / Procesada / Vista previa
  - **desktop** → 3 paneles lado a lado
- Envío **PUT** `/images/:id` con body `{ "options": Operation[] }`.

---

## Personalización de UI

- **Tema dark** (`src/theme/theme.ts`): primario violeta, secundario cyan, fondos profundos, blur sutil.
- `Navbar` con bienvenida (usuario) y logout.
- Cards con borde sutil, diálogo de visor/grande fijo y diálogos de upload/edición **responsivos**.

---

## Buenas prácticas incluidas

- Hooks enfocados (`useImages`, `useUpload`, `useAuth`).
- Servicios HTTP aislados (`axiosService`) con interceptor de Authorization.
- Tipos claros (separar `AuthUser` de `UserRegister` y `Operation`).
- UI responsiva (tabs en móvil, 3 columnas en desktop).
- Validación de archivos (solo **PNG/JPG**) con **Snackbar**.

---

## Solución de problemas

**La petición va a `http://localhost:3000/...`**  
Configura `baseURL` (Opción A) o `rewrites` (Opción B).

**CORS al llamar directo al backend**  
Habilita CORS en el backend para `origin: http://localhost:3000` (y `credentials` si usas cookies).

**Redirige al login aunque hay token**  
El guard debe esperar `isReady` del `AuthContext` antes de decidir.

---

## Seguridad

En dev el token va en `localStorage` por simplicidad. En producción considera **cookies httpOnly** y protección CSRF / SameSite según tu estrategia.

---

## Licencia

MIT (o la que aplique en tu proyecto).
