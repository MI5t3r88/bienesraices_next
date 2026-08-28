import Image from "next/image";
import Link from "next/link";
import { formatearFecha } from "@/lib/formato";
import type { Entrada } from "@prisma/client";

export function EntradaBlogCard({ entrada }: { entrada: Entrada }) {
  return (
    <article className="mb-8 last-of-type:mb-0 md:grid md:grid-cols-[1fr_2fr] md:gap-8">
      <div className="relative aspect-video w-full md:aspect-square">
        <Image
          src={entrada.imagen}
          alt={entrada.titulo}
          fill
          loading="lazy"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div>
        <Link href={`/blog/${entrada.slug}`} className="mt-8 block text-negro no-underline dark:text-gris md:mt-0">
          <h4 className="m-0 leading-snug after:mt-4 after:block after:h-1 after:w-[150px] after:bg-verde">
            {entrada.titulo}
          </h4>
          <p>
            Escrito el: <span className="text-amarillo">{formatearFecha(entrada.creado)}</span> por:{" "}
            <span className="text-amarillo">{entrada.autor}</span>
          </p>
          <p>{entrada.contenido.slice(0, 160)}...</p>
        </Link>
      </div>
    </article>
  );
}
