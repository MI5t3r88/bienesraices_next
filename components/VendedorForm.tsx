"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Vendedor } from "@prisma/client";
import type { EstadoVendedor } from "@/app/(admin)/admin/(panel)/vendedores/acciones";

const estadoInicial: EstadoVendedor = { success: false };

function BotonGuardar({ texto }: { texto: string }) {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      value={pending ? "Guardando..." : texto}
      disabled={pending}
      className="boton-verde disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function CampoError({ campo, texto }: { campo: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={`${campo}-error`} className="mt-1 text-sm font-bold text-red-600">
      {texto}
    </p>
  );
}

export function VendedorForm({
  accion,
  vendedor,
  textoBoton,
}: {
  accion: (estadoPrevio: EstadoVendedor, formData: FormData) => Promise<EstadoVendedor>;
  vendedor?: Vendedor;
  textoBoton: string;
}) {
  const [estado, ejecutar] = useActionState(accion, estadoInicial);

  return (
    <form action={ejecutar} className="formulario max-w-[600px]">
      {estado.message && (
        <p
          className={`mb-4 font-bold ${estado.success ? "text-verde" : "text-red-600"}`}
          role={estado.success ? "status" : "alert"}
        >
          {estado.message}
        </p>
      )}

      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        name="nombre"
        id="nombre"
        defaultValue={vendedor?.nombre}
        required
        aria-invalid={!!estado.errores?.nombre}
        aria-describedby={estado.errores?.nombre ? "nombre-error" : undefined}
      />
      <CampoError campo="nombre" texto={estado.errores?.nombre} />

      <label htmlFor="apellido">Apellido</label>
      <input
        type="text"
        name="apellido"
        id="apellido"
        defaultValue={vendedor?.apellido}
        required
        aria-invalid={!!estado.errores?.apellido}
        aria-describedby={estado.errores?.apellido ? "apellido-error" : undefined}
      />
      <CampoError campo="apellido" texto={estado.errores?.apellido} />

      <label htmlFor="telefono">Telefono</label>
      <input
        type="tel"
        name="telefono"
        id="telefono"
        defaultValue={vendedor?.telefono}
        required
        aria-invalid={!!estado.errores?.telefono}
        aria-describedby={estado.errores?.telefono ? "telefono-error" : undefined}
      />
      <CampoError campo="telefono" texto={estado.errores?.telefono} />

      <BotonGuardar texto={textoBoton} />
    </form>
  );
}
