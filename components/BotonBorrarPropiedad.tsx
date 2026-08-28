"use client";

import { borrarPropiedad } from "@/app/(admin)/admin/(panel)/propiedades/acciones";

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
      <button type="submit" className="text-red-600 underline hover:text-red-800">
        Borrar
      </button>
    </form>
  );
}
