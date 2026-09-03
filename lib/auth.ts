import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

/**
 * El middleware solo protege /admin/*, pero un Server Action es un
 * endpoint POST identificable por su Action ID que puede invocarse
 * contra cualquier ruta (el matcher del middleware no aplica ahi).
 * Llamar esto como primera linea de cada Server Action que mute datos
 * del panel, para no depender solo de la proteccion de la ruta.
 */
export async function exigirSesion() {
  const session = await auth();
  if (!session) {
    throw new Error("No autorizado");
  }
  return session;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return null;

        const valido = await bcrypt.compare(password, usuario.passwordHash);
        if (!valido) return null;

        return { id: usuario.id, email: usuario.email, name: usuario.nombre };
      },
    }),
  ],
});
