import type { NextAuthConfig } from "next-auth";

/**
 * Config "edge-safe": sin providers (Credentials usa bcrypt + Prisma,
 * que dependen de modulos de Node y no corren en el Edge Runtime del
 * middleware). Este archivo es lo unico que el middleware importa;
 * lib/auth.ts la extiende con los providers para el resto de la app.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const estaLogueado = !!auth?.user;
      const { pathname } = nextUrl;
      const esLogin = pathname === "/admin/login";

      if (pathname.startsWith("/admin") && !esLogin && !estaLogueado) {
        return false;
      }

      if (esLogin && estaLogueado) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
};
