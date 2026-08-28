import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Instancia "edge-safe": solo lee la cookie de sesion, no importa
// providers (ver comentario en lib/auth.config.ts).
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/admin/:path*"],
};
