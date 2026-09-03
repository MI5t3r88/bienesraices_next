import Link from "next/link";

/**
 * Paginacion server-rendered por enlaces (?pagina=N), sin JS en cliente.
 * Reutilizada por /anuncios, /admin y /admin/mensajes.
 */
export function Paginacion({
  basePath,
  paginaActual,
  totalPaginas,
}: {
  basePath: string;
  paginaActual: number;
  totalPaginas: number;
}) {
  if (totalPaginas <= 1) return null;

  const anterior = paginaActual - 1;
  const siguiente = paginaActual + 1;

  return (
    <nav aria-label="Paginacion" className="mt-8 flex items-center justify-center gap-6">
      {anterior >= 1 ? (
        <Link href={`${basePath}?pagina=${anterior}`} className="text-verde underline hover:text-[#649c00]">
          Anterior
        </Link>
      ) : (
        <span aria-hidden className="text-gris">Anterior</span>
      )}

      <span>
        Pagina {paginaActual} de {totalPaginas}
      </span>

      {siguiente <= totalPaginas ? (
        <Link href={`${basePath}?pagina=${siguiente}`} className="text-verde underline hover:text-[#649c00]">
          Siguiente
        </Link>
      ) : (
        <span aria-hidden className="text-gris">Siguiente</span>
      )}
    </nav>
  );
}
