import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { TarjetaAnuncio } from "@/components/TarjetaAnuncio";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Anuncios",
  description: "Casas y departamentos en venta: todas las propiedades disponibles.",
};

export default async function AnunciosPage() {
  const propiedades = await prisma.propiedad.findMany({ orderBy: { creado: "desc" } });

  return (
    <>
      <SiteHeader />

      <main className="contenedor py-separacion">
        <h2 className="text-h2">Casas y Depas en Venta</h2>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          {propiedades.map((propiedad) => (
            <TarjetaAnuncio key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>

        {propiedades.length === 0 && (
          <p>Por el momento no hay propiedades publicadas.</p>
        )}
      </main>
    </>
  );
}
