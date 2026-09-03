# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Real-estate listing site ("Bienes Raices") migrated from a static PHP site (`bienesraices_PHP/`, outside this repo) to Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma 7. Adds what the PHP version lacked: a database, an admin panel with login, and a working contact form. UI copy, routes, and code identifiers are in Spanish — match that convention (`propiedades`, `vendedores`, `mensajes`, `entradas`) when adding code.

## Commands


There is no test suite configured in this repo. After changing a Server Action or schema, verify with `npm run lint`, `npx tsc --noEmit`, and by exercising the flow with `npm run dev`.

First-time setup: `npm install` → copy `.env.example` to `.env` → `npx auth secret` (writes `AUTH_SECRET`; login fails without it) → `npx prisma migrate dev` (creates `dev.db` at the **repo root**, not under `prisma/`) → `npx prisma db seed` → `npm run dev`. `.env` is gitignored — only `.env.example` is committed.

Admin login is at `/admin/login`, credentials from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env` (seeded by `prisma/seed.ts`).

## Architecture

**Route groups**: `app/(site)/` holds public pages (home, nosotros, anuncios, blog, contacto) sharing `app/(site)/layout.tsx`. `app/(admin)/admin/` splits into `login/` (public) and `(panel)/` (protected). Route-group parentheses don't affect URLs — `(panel)` pages still live under `/admin/*`.

**Auth (Auth.js v5 / NextAuth beta)**: Split into two files specifically to keep the Edge Runtime middleware working:
- `lib/auth.config.ts` — edge-safe config: no providers, just session strategy and the `authorized` callback that gates `/admin/*`. This is the only file `middleware.ts` imports.
- `lib/auth.ts` — extends `authConfig` with the `Credentials` provider (bcrypt + Prisma), which depends on Node APIs unavailable on the Edge Runtime. Everything outside middleware (Server Actions, layouts, route handlers) imports from here.

Never import `lib/auth.ts` from `middleware.ts` — it will break the edge build. `middleware.ts` matches only `/admin/:path*`. The `(panel)` layout (`app/(admin)/admin/(panel)/layout.tsx`) does a second, defensive `auth()` check server-side in case a page renders outside the middleware flow.

**Data layer**: Prisma 7 with the `better-sqlite3` driver adapter (`lib/prisma.ts`), not the default Prisma engine. `DATABASE_URL` points at a local SQLite file. Models (`prisma/schema.prisma`): `Usuario` (admin login), `Vendedor` (has many `Propiedad`), `Propiedad`, `Entrada` (blog post), `Mensaje` (contact form submissions). Prisma config lives in `prisma.config.ts` (not `package.json`), pointing seed at `tsx prisma/seed.ts`.

**Server Actions**: Mutations live in `acciones.ts` files colocated with their route (e.g. `app/(site)/contacto/acciones.ts`, `app/(admin)/admin/(panel)/propiedades/acciones.ts`), marked `"use server"`. Established pattern for form-backed actions used with `useActionState`:
1. `Object.fromEntries(formData.entries())` → `zodSchema.safeParse(...)`.
2. On failure, build a `Partial<Record<string, string>>` of first-error-per-field and return `{ success: false, errores, message }`.
3. On success, do the Prisma write, then `revalidatePath(...)` every affected route, then either `redirect(...)` or return `{ success: true, message }`.

Every admin-panel mutation also calls `exigirSesion()` as its first line, before touching Prisma (see `app/(admin)/admin/(panel)/propiedades/acciones.ts` and the parallel `vendedores/acciones.ts`) — the middleware gate on `/admin/*` isn't treated as sufficient on its own. `exigirSesion()` (`lib/auth.ts`) throws `Error("No autorizado")` when there's no session; thrown errors from a Server Action propagate to the nearest `error.tsx` boundary, which is why `app/(admin)/admin/(panel)/error.tsx` special-cases that exact message into a friendlier one instead of a generic failure screen. Before deleting a row that others reference by required foreign key (e.g. `borrarVendedor` against `Propiedad.vendedorId`, which is `ON DELETE RESTRICT`), count dependents first and return a readable `{ success: false, message }` instead of letting the delete throw a Prisma FK error.

Validation schemas are centralized in `lib/validaciones.ts` (Zod). Add new form validation there rather than inline in the action.

**Image uploads**: `lib/almacenamiento.ts`'s `guardarImagen(archivo: File): Promise<string>` resizes/converts to webp via `sharp` and writes to `public/uploads/`; `borrarImagen` removes one. This only works in local dev — Vercel's filesystem is read-only in production. If deploying, replace the function bodies with object-storage calls (e.g. Vercel Blob) but **keep the same signatures** so callers don't need to change.

**Email**: `lib/correo.ts`'s `enviarCorreoContacto` sends via Resend if `RESEND_API_KEY` is set; otherwise it logs and no-ops. The contact Server Action always saves the `Mensaje` to the DB first and treats email failure as non-fatal (wrapped in try/catch, logged, doesn't affect the returned success state).

**Providers**: `components/Providers.tsx` wraps the app in `next-themes`'s `ThemeProvider` (`attribute="class"`, toggles a `.dark` class on `<html>`) and, nested inside it, framer-motion's `MotionConfig reducedMotion="user"`. That second wrapper is the app's single source of accessible-motion policy — components using `motion.*` don't need to repeat a `motion-reduce:` variant individually. Tailwind v4's `dark:` variant defaults to `@media (prefers-color-scheme: dark)` and ignores the `.dark` class — `app/globals.css` overrides it near the top with `@custom-variant dark (&:where(.dark, .dark *));` so `dark:` classes react to the class instead. If dark-mode styles stop responding to the theme toggle, check that line first before touching component code.

**Fixed header / hero**: `components/SiteHeader.tsx` is rendered per-page (each `(site)` page includes its own `<SiteHeader />`; `app/(site)/layout.tsx` does not render it), so it doubles as the home's hero when passed `variante="inicio"` and `titulo`. The 72px bar height is a contract duplicated on purpose across four places that must change together: the JS constant `ALTO_BARRA_PX = 72` (used in the scroll-position comparison), the literal string `ALTO_BARRA = "h-[72px]"` (Tailwind v4 scans files as text rather than evaluating JS, so an interpolated template string wouldn't generate the utility), the hero's hardcoded `pt-[72px]`, and the spacer `<div className="bg-gris-oscuro h-[72px]" aria-hidden />` that non-home pages render in its place. On the home page, the bar starts fully transparent and crossfades to solid (`bg-amarillo`) once the hero's bottom edge scrolls past the bar — implemented as an absolutely-positioned sibling layer (`motion.div` with `absolute inset-0 -z-10`, animating `opacity` between the 0/1 switch on scroll) rather than animating the header's own `background-color`, and measured via a local `ref` on the hero section rather than `document.getElementById` from another file.

## Conventions

- Follow `AGENTS.md`'s instruction: this repo pins a Next.js version with breaking API changes from what's in training data. Before writing code that touches App Router APIs, check `node_modules/next/dist/docs/` for the relevant guide.
- Tailwind v4 with custom theme tokens used throughout (`bg-gris-oscuro`, `text-blanco`, `text-verde`, `contenedor`, `py-separacion`, etc.) — check `app/globals.css` for the token definitions before introducing new ones.
- `next.config.ts` sets `turbopack.root` to silence a warning about a stray `package-lock.json` in a parent folder outside this repo; don't remove it without checking why.
- The `@/*` TypeScript path alias (`tsconfig.json`) resolves to the **repo root**, not a `src/` directory — there is no `src/` folder here.
- `(site)` pages are async Server Components that query `prisma` directly (imported from `@/lib/prisma`), with no service layer in between; interactivity is isolated in leaf components marked `"use client"` (e.g. `SiteHeader`, `FormularioContacto`).
- Two deliberate ways of rendering images: `next/image` with `fill` + `sizes` for full-bleed background photos, vs. a raw `<img>` (with `// eslint-disable-next-line @next/next/no-img-element`) for UI SVGs like the logo and icons, where Next's image optimization doesn't help. Don't "fix" the raw `<img>` usages into `next/image` — that's intentional, not leftover debt.
- `app/sitemap.ts` and `app/robots.ts` read `SITE_URL` from the environment.
- Pagination is server-rendered, not client state: `components/Paginacion.tsx` takes `basePath`/`paginaActual`/`totalPaginas` and links to `?pagina=N`, reused as-is by `/anuncios`, `/admin`, and `/admin/mensajes`. Don't reach for `useState`/`useSearchParams` client pagination — read `pagina` from the page's `searchParams` prop server-side instead.
- `app/(site)/not-found.tsx` renders the public 404 (with `<SiteHeader />` and links back to `/anuncios` and `/`); `app/(admin)/admin/(panel)/error.tsx` is the panel's error boundary. Keep both in mind as the place to route new not-found/error handling rather than ad hoc checks inside pages.
