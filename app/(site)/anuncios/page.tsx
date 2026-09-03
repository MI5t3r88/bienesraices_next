import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { TarjetaAnuncio } from "@/components/TarjetaAnuncio";
import { Paginacion } from "@/components/Paginacion";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Anuncios",
  description: "Casas y departamentos en venta: todas las propiedades disponibles.",
};

const POR_PAGINA = 9;

type SearchParams = Promise<{ pagina?: string }>;

export default async function AnunciosPage({ searchParams }: { searchParams: SearchParams }) {
  const { pagina } = await searchParams;
  const paginaActual = Math.max(1, Number(pagina) || 1);

  const [propiedades, total] = await Promise.all([
    prisma.propiedad.findMany({
      orderBy: { creado: "desc" },
      skip: (paginaActual - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.propiedad.count(),
  ]);
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  return (
    <>
      <SiteHeader />

      <main className="contenedor py-separacion">
        <h2 className=" pb-12 text-h2">Casas y Departamentos en Venta</h2>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          {propiedades.map((propiedad) => (
            <TarjetaAnuncio key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>

        {propiedades.length === 0 && (
          <p>Por el momento no hay propiedades publicadas.</p>
        )}

        <Paginacion basePath="/anuncios" paginaActual={paginaActual} totalPaginas={totalPaginas} />
      </main>
    </>
  );
}
