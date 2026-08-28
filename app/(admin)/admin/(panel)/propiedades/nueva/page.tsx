import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PropiedadForm } from "@/components/PropiedadForm";
import { crearPropiedad } from "../acciones";

export const metadata: Metadata = { title: "Nueva propiedad" };

export default async function NuevaPropiedadPage() {
  const vendedores = await prisma.vendedor.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div>
      <h1 className="text-h2">Nueva Propiedad</h1>
      <PropiedadForm accion={crearPropiedad} vendedores={vendedores} textoBoton="Crear propiedad" />
    </div>
  );
}
