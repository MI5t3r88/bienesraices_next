"use client";

import { useActionState } from "react";
import { borrarVendedor, type EstadoVendedor } from "@/app/(admin)/admin/(panel)/vendedores/acciones";

const estadoInicial: EstadoVendedor = { success: false };

export function BotonBorrarVendedor({ id, nombre }: { id: string; nombre: string }) {
  const accion = borrarVendedor.bind(null, id);
  const [estado, ejecutar, pendiente] = useActionState(accion, estadoInicial);

  return (
    <div>
      <form
        action={ejecutar}
        onSubmit={(evento) => {
          if (!window.confirm(`¿Borrar a "${nombre}"? Esta accion no se puede deshacer.`)) {
            evento.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          disabled={pendiente}
          className="text-red-600 underline hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendiente ? "Borrando..." : "Borrar"}
        </button>
      </form>
      {/* Solo se llega aqui cuando el borrado falla (tiene propiedades
          asignadas): un borrado exitoso revalida la lista y esta fila
          desaparece antes de poder mostrar un mensaje de exito. */}
      {estado.message && !estado.success && (
        <p role="alert" className="mt-1 text-sm font-bold text-red-600">
          {estado.message}
        </p>
      )}
    </div>
  );
}
