"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { iniciarSesion, type EstadoLogin } from "./acciones";

const estadoInicial: EstadoLogin = {};

function BotonEntrar() {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      value={pending ? "Entrando..." : "Iniciar sesion"}
      disabled={pending}
      className="boton-verde w-full disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

export default function LoginPage() {
  const [estado, accion] = useActionState(iniciarSesion, estadoInicial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gris-oscuro px-4">
      <form
        action={accion}
        className="formulario relative w-full max-w-[400px] bg-blanco p-8 dark:bg-gris-profundo"
      >
        <Link
          href="/"
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-2xl leading-none text-gris-oscuro no-underline hover:text-verde dark:text-gris"
        >
          &times;
        </Link>

        <h1 className="text-h2">Bienes Raices</h1>
        <p className="text-center">Panel de administracion</p>

        {estado.error && (
          <p className="mb-4 font-bold text-red-600" role="alert">
            {estado.error}
          </p>
        )}

        <label htmlFor="email">Correo</label>
        <input type="email" name="email" id="email" required autoComplete="email" />

        <label htmlFor="password">Contraseña</label>
        <input type="password" name="password" id="password" required autoComplete="current-password" />

        <BotonEntrar />
      </form>
    </div>
  );
}
