import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatearPrecio } from "@/lib/formato";
import { BotonBorrarPropiedad } from "@/components/BotonBorrarPropiedad";
import { Paginacion } from "@/components/Paginacion";

export const metadata: Metadata = { title: "Panel" };

const POR_PAGINA = 20;

type SearchParams = Promise<{ pagina?: string }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { pagina } = await searchParams;
  const paginaActual = Math.max(1, Number(pagina) || 1);

  const [propiedades, total] = await Promise.all([
    prisma.propiedad.findMany({
      orderBy: { creado: "desc" },
      include: { vendedor: true },
      skip: (paginaActual - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.propiedad.count(),
  ]);
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h2">Propiedades ({total})</h1>
        <Link href="/admin/propiedades/nueva" className="boton-verde">
          + Nueva Propiedad
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gris">
              <th className="p-3">Imagen</th>
              <th className="p-3">Titulo</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Vendedor</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.map((propiedad) => (
              <tr key={propiedad.id} className="border-b border-gris">
                <td className="p-3">
                  <div className="relative h-12 w-16">
                    <Image
                      src={propiedad.imagen}
                      alt={propiedad.titulo}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-3">{propiedad.titulo}</td>
                <td className="p-3">{formatearPrecio(propiedad.precio)}</td>
                <td className="p-3">
                  {propiedad.vendedor.nombre} {propiedad.vendedor.apellido}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/propiedades/${propiedad.id}/editar`}
                      className="text-verde underline hover:text-[#649c00]"
                    >
                      Editar
                    </Link>
                    <BotonBorrarPropiedad id={propiedad.id} titulo={propiedad.titulo} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {propiedades.length === 0 && <p>Aun no hay propiedades. Crea la primera.</p>}
      </div>

      <Paginacion basePath="/admin" paginaActual={paginaActual} totalPaginas={totalPaginas} />
    </div>
  );
}
