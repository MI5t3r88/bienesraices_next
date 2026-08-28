import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { EntradaBlogCard } from "@/components/EntradaBlogCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog",
  description: "Consejos sobre decoracion, financiamiento y todo lo relacionado a tu casa.",
};

export default async function BlogPage() {
  const entradas = await prisma.entrada.findMany({
    where: { publicado: true },
    orderBy: { creado: "desc" },
  });

  return (
    <>
      <SiteHeader />

      <main className="contenedor max-w-[800px] py-separacion">
        <h1 className="text-h1">Nuestro Blog</h1>

        {entradas.map((entrada) => (
          <EntradaBlogCard key={entrada.id} entrada={entrada} />
        ))}
      </main>
    </>
  );
}
