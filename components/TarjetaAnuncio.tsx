import Image from "next/image";
import Link from "next/link";
import { IconosCaracteristicas } from "@/components/IconosCaracteristicas";
import { formatearPrecio } from "@/lib/formato";
import type { Propiedad } from "@prisma/client";

export function TarjetaAnuncio({ propiedad }: { propiedad: Propiedad }) {
  return (
    <div className="mb-8 border border-gris bg-gris dark:border-gris-oscuro dark:bg-gris-profundo">
      <div className="relative aspect-video w-full">
        <Image
          src={propiedad.imagen}
          alt={propiedad.titulo}
          fill
          loading="lazy"
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="p-8">
        <h3 className="m-0 text-h3">{propiedad.titulo}</h3>
        <p className="m-0 line-clamp-3">{propiedad.descripcion}</p>
        <p className="m-0 text-h3 font-bold text-verde">
          {formatearPrecio(propiedad.precio)}
        </p>

        <IconosCaracteristicas
          wc={propiedad.wc}
          estacionamiento={propiedad.estacionamiento}
          habitaciones={propiedad.habitaciones}
        />

        <Link href={`/anuncios/${propiedad.id}`} className="boton-amarillo-block">
          Ver Propiedad
        </Link>
      </div>
    </div>
  );
}
