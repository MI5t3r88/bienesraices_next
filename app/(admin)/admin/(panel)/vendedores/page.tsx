import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BotonBorrarVendedor } from "@/components/BotonBorrarVendedor";

export const metadata: Metadata = { title: "Vendedores" };

export default async function VendedoresPage() {
  const vendedores = await prisma.vendedor.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { propiedades: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h2">Vendedores ({vendedores.length})</h1>
        <Link href="/admin/vendedores/nueva" className="boton-verde">
          + Nuevo Vendedor
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gris">
              <th className="p-3">Nombre</th>
              <th className="p-3">Telefono</th>
              <th className="p-3">Propiedades</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor) => (
              <tr key={vendedor.id} className="border-b border-gris">
                <td className="p-3">
                  {vendedor.nombre} {vendedor.apellido}
                </td>
                <td className="p-3">{vendedor.telefono}</td>
                <td className="p-3">{vendedor._count.propiedades}</td>
                <td className="p-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/vendedores/${vendedor.id}/editar`}
                      className="text-verde underline hover:text-[#649c00]"
                    >
                      Editar
                    </Link>
                    <BotonBorrarVendedor id={vendedor.id} nombre={`${vendedor.nombre} ${vendedor.apellido}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendedores.length === 0 && <p>Aun no hay vendedores. Crea el primero.</p>}
      </div>
    </div>
  );
}
