"use client";

import { useFormStatus } from "react-dom";
import { borrarPropiedad } from "@/app/(admin)/admin/(panel)/propiedades/acciones";

function BotonSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-600 underline hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Borrando..." : "Borrar"}
    </button>
  );
}

export function BotonBorrarPropiedad({ id, titulo }: { id: string; titulo: string }) {
  return (
    <form
      action={borrarPropiedad.bind(null, id)}
      onSubmit={(evento) => {
        if (!window.confirm(`¿Borrar "${titulo}"? Esta accion no se puede deshacer.`)) {
          evento.preventDefault();
        }
      }}
    >
      <BotonSubmit />
    </form>
  );
}
