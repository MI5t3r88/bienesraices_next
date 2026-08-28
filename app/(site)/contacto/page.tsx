import Image from "next/image";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { FormularioContacto } from "@/components/FormularioContacto";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Llena el formulario de contacto y un asesor se pondra en contacto contigo.",
};

export default function ContactoPage() {
  return (
    <>
      <SiteHeader />

      <main className="contenedor max-w-[800px] py-separacion">
        <h1 className="text-h1">Contacto</h1>

        <div className="relative aspect-video w-full">
          <Image
            src="/img/destacada3.jpg"
            alt="Imagen Contacto"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-cover"
          />
        </div>

        <h2 className="text-h2">Llene el formulario de Contacto</h2>

        <FormularioContacto />
      </main>
    </>
  );
}
