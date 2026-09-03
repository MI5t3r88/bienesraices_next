import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VendedorForm } from "@/components/VendedorForm";
import { actualizarVendedor } from "../../acciones";

export const metadata: Metadata = { title: "Editar vendedor" };

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ creado?: string }>;

export default async function EditarVendedorPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { creado } = await searchParams;

  const vendedor = await prisma.vendedor.findUnique({ where: { id } });
  if (!vendedor) notFound();

  const accionConId = actualizarVendedor.bind(null, id);

  return (
    <div>
      <h1 className="text-h2">Editar Vendedor</h1>
      {creado === "1" && (
        <p role="status" className="mb-4 font-bold text-verde">
          Vendedor creado correctamente.
        </p>
      )}
      <VendedorForm accion={accionConId} vendedor={vendedor} textoBoton="Guardar cambios" />
    </div>
  );
}
