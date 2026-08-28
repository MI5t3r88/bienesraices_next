"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type EstadoLogin = { error?: string };

export async function iniciarSesion(
  _estadoPrevio: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }
}
