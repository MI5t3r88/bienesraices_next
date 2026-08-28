# Bienes Raices (Next.js)

Migracion a Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma
del sitio estatico original en `bienesraices_PHP/`. Agrega lo que ese
proyecto no tenia: base de datos, panel de administracion con login y
formulario de contacto funcional.

## Arranque en local

```bash
npm install
npx prisma migrate dev   # crea prisma/dev.db y aplica el esquema
npx prisma db seed       # carga propiedades, entradas de blog y el admin
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Copia `.env.example` a `.env` antes de instalar si vas a cambiar algun
valor (usuario admin, claves, etc.). El repo ya trae un `.env` de
desarrollo funcional con datos de prueba.

### Usuario administrador (seed)

- URL: `/admin/login`
- Correo: valor de `ADMIN_EMAIL` en `.env` (por defecto `admin@bienesraices.test`)
- Contraseña: valor de `ADMIN_PASSWORD` en `.env` (por defecto `bienesraices123`)

Cambia `ADMIN_PASSWORD` antes de correr el seed en cualquier entorno que
no sea tu maquina local.

## Scripts

| Comando | Que hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Sirve el build de produccion |
| `npm run lint` | ESLint |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | `prisma db seed` |
| `npm run db:studio` | Explorador visual de la base de datos |

## Variables de entorno

Ver `.env.example` para la lista completa. Las relevantes para produccion:

- `DATABASE_URL` — cambiar de SQLite a Postgres (u otro motor soportado
  por Prisma) agregando el adapter correspondiente en `lib/prisma.ts`.
- `AUTH_SECRET` — generar una nueva con `npx auth secret` para cada
  entorno; nunca reusar la de desarrollo.
- `RESEND_API_KEY` / `CONTACTO_EMAIL_DESTINO` — opcionales. Sin
  `RESEND_API_KEY`, el formulario de contacto sigue funcionando: el
  mensaje se guarda en la base de datos y solo se omite el correo.
- `SITE_URL` — usada por `app/sitemap.ts` y `app/robots.ts`.

## Aviso para despliegue en Vercel

`lib/almacenamiento.ts` guarda las imagenes que se suben desde el panel
en `public/uploads/`. Eso funciona en desarrollo local, pero el
filesystem de Vercel es de solo lectura en produccion: las imagenes
subidas ahi **no persistirian**. Antes de desplegar, reemplazar el
contenido de esa funcion por una subida a Vercel Blob (u otro
almacenamiento de objetos), manteniendo la misma firma
`guardarImagen(archivo: File): Promise<string>` para no tocar quien la
llama.

## Estructura

- `app/(site)/` — paginas publicas (inicio, nosotros, anuncios, blog, contacto).
- `app/(admin)/admin/` — `login/` (publica) y `(panel)/` (protegida por `middleware.ts`).
- `components/` — UI compartida (header, footer, tarjetas, formularios).
- `lib/` — Prisma, Auth.js, validaciones Zod, correo, almacenamiento de imagenes.
- `prisma/` — esquema, migraciones y seed.
