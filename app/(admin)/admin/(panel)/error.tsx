"use client";

import { useEffect } from "react";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-separacion text-center">
      <h1 className="text-h2">Algo salio mal</h1>
      <p>{error.message === "No autorizado" ? "Tu sesion expiro o no tienes permiso para esto." : "Ocurrio un error inesperado en el panel."}</p>
      <button type="button" onClick={reset} className="boton-verde">
        Intentar de nuevo
      </button>
    </div>
  );
}
