import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteNotFound() {
  return (
    <>
      <SiteHeader />

      <main className="contenedor flex flex-1 flex-col items-center justify-center gap-4 py-separacion text-center">
        <h1 className="text-h1">Pagina no encontrada</h1>
        <p>La propiedad, entrada o pagina que buscas ya no esta disponible.</p>
        <div className="flex gap-4">
          <Link href="/anuncios" className="boton-verde">
            Ver anuncios
          </Link>
          <Link href="/" className="boton-amarillo">
            Ir al inicio
          </Link>
        </div>
      </main>
    </>
  );
}
