import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropiedadForm } from "@/components/PropiedadForm";
import { actualizarPropiedad } from "../../acciones";

export const metadata: Metadata = { title: "Editar propiedad" };

type Params = Promise<{ id: string }>;

export default async function EditarPropiedadPage({ params }: { params: Params }) {
  const { id } = await params;

  const [propiedad, vendedores] = await Promise.all([
    prisma.propiedad.findUnique({ where: { id } }),
    prisma.vendedor.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!propiedad) notFound();

  const accionConId = actualizarPropiedad.bind(null, id);

  return (
    <div>
      <h1 className="text-h2">Editar Propiedad</h1>
      <PropiedadForm
        accion={accionConId}
        vendedores={vendedores}
        propiedad={propiedad}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}
