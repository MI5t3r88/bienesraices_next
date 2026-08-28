import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { IconosCaracteristicas } from "@/components/IconosCaracteristicas";
import { formatearPrecio } from "@/lib/formato";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const propiedad = await prisma.propiedad.findUnique({ where: { id } });

  if (!propiedad) return { title: "Propiedad no encontrada" };

  return {
    title: propiedad.titulo,
    description: propiedad.descripcion,
  };
}

export default async function AnuncioPage({ params }: { params: Params }) {
  const { id } = await params;
  const propiedad = await prisma.propiedad.findUnique({
    where: { id },
    include: { vendedor: true },
  });

  if (!propiedad) notFound();

  return (
    <>
      <SiteHeader />

      <main className="contenedor py-separacion max-w-[800px]">
        <h1 className="text-h1">{propiedad.titulo}</h1>

        <div className="relative aspect-video w-full">
          <Image
            src={propiedad.imagen}
            alt={propiedad.titulo}
            fill
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="border border-gris bg-gris p-8 dark:border-gris-oscuro dark:bg-gris-profundo">
          <p className="text-h3 font-bold text-verde">{formatearPrecio(propiedad.precio)}</p>

          <IconosCaracteristicas
            wc={propiedad.wc}
            estacionamiento={propiedad.estacionamiento}
            habitaciones={propiedad.habitaciones}
          />

          <p>{propiedad.descripcion}</p>

          <p className="font-bold">
            Contacto del vendedor: {propiedad.vendedor.nombre} {propiedad.vendedor.apellido} &middot;{" "}
            {propiedad.vendedor.telefono}
          </p>
        </div>
      </main>
    </>
  );
}
