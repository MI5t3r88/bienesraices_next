# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Real-estate listing site ("Bienes Raices") migrated from a static PHP site (`bienesraices_PHP/`, outside this repo) to Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma 7. Adds what the PHP version lacked: a database, an admin panel with login, and a working contact form. UI copy, routes, and code identifiers are in Spanish — match that convention (`propiedades`, `vendedores`, `mensajes`, `entradas`) when adding code.

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build         # production build
npm run start          # serve production build
npm run lint            # ESLint (flat config, eslint-config-next)
npm run db:migrate       # prisma migrate dev
npm run db:seed          # prisma db seed (admin user, sample propiedades/entradas)
npm run db:studio        # Prisma Studio
```

There is no test suite configured in this repo. After changing a Server Action or schema, verify with `npm run lint`, `npx tsc --noEmit`, and by exercising the flow with `npm run dev`.

First-time setup: `npm install` → `npx prisma migrate dev` (creates `prisma/dev.db`) → `npx prisma db seed` → `npm run dev`. A working `.env` with test data is already committed; copy `.env.example` only if you need to change a value.

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

Validation schemas are centralized in `lib/validaciones.ts` (Zod). Add new form validation there rather than inline in the action.

**Image uploads**: `lib/almacenamiento.ts`'s `guardarImagen(archivo: File): Promise<string>` resizes/converts to webp via `sharp` and writes to `public/uploads/`. This only works in local dev — Vercel's filesystem is read-only in production. If deploying, replace the function body with an object-storage upload (e.g. Vercel Blob) but **keep the same signature** so callers don't need to change.

**Email**: `lib/correo.ts`'s `enviarCorreoContacto` sends via Resend if `RESEND_API_KEY` is set; otherwise it logs and no-ops. The contact Server Action always saves the `Mensaje` to the DB first and treats email failure as non-fatal (wrapped in try/catch, logged, doesn't affect the returned success state).

## Conventions

- Follow `AGENTS.md`'s instruction: this repo pins a Next.js version with breaking API changes from what's in training data. Before writing code that touches App Router APIs, check `node_modules/next/dist/docs/` for the relevant guide.
- Tailwind v4 with custom theme tokens used throughout (`bg-gris-oscuro`, `text-blanco`, `text-verde`, `contenedor`, `py-separacion`, etc.) — check `app/globals.css` for the token definitions before introducing new ones.
- `next.config.ts` sets `turbopack.root` to silence a warning about a stray `package-lock.json` in a parent folder outside this repo; don't remove it without checking why.
