import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { formatearFecha } from "@/lib/formato";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const entrada = await prisma.entrada.findUnique({ where: { slug } });

  if (!entrada) return { title: "Entrada no encontrada" };

  return {
    title: entrada.titulo,
    description: entrada.contenido.slice(0, 150),
  };
}

export default async function EntradaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const entrada = await prisma.entrada.findUnique({ where: { slug } });

  if (!entrada) notFound();

  return (
    <>
      <SiteHeader />

      <main className="contenedor max-w-[800px] py-separacion">
        <h1 className="text-h1">{entrada.titulo}</h1>

        <div className="relative aspect-video w-full">
          <Image
            src={entrada.imagen}
            alt={entrada.titulo}
            fill
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <p>
          Escrito el: <span className="text-amarillo">{formatearFecha(entrada.creado)}</span> por:{" "}
          <span className="text-amarillo">{entrada.autor}</span>
        </p>

        <div className="border border-gris bg-gris p-8 dark:border-gris-oscuro dark:bg-gris-profundo">
          <p>{entrada.contenido}</p>
        </div>
      </main>
    </>
  );
}
