import Image from "next/image";
import Link from "next/link";
import { SiteHeader, ID_SECCION_NOSOTROS } from "@/components/SiteHeader";
import { TarjetaAnuncio } from "@/components/TarjetaAnuncio";
import { EntradaBlogCard } from "@/components/EntradaBlogCard";
import { prisma } from "@/lib/prisma";

const iconos = [
  {
    src: "/img/icono1.svg",
    titulo: "Seguridad",
    texto:
      "Todas nuestras propiedades cuentan con verificacion legal completa antes de publicarse.",
  },
  {
    src: "/img/icono2.svg",
    titulo: "Precio",
    texto:
      "Trabajamos con avaluos actualizados para ofrecerte el precio justo de mercado.",
  },
  {
    src: "/img/icono3.svg",
    titulo: "A Tiempo",
    texto:
      "Acompanamos cada compra o venta con tiempos claros, del primer contacto a la firma.",
  },
];

export default async function InicioPage() {
  const [propiedades, entradas] = await Promise.all([
    prisma.propiedad.findMany({ take: 3, orderBy: { creado: "desc" } }),
    prisma.entrada.findMany({ take: 2, orderBy: { creado: "desc" } }),
  ]);

  return (
    <>
      <SiteHeader variante="inicio" titulo="Venta de Casas y Departamentos Exclusivos de Lujo" />

      <div id={ID_SECCION_NOSOTROS} className="contenedor py-separacion">
        <h1 className="text-h1">Mas Sobre Nosotros</h1>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          {iconos.map((icono) => (
            <div key={icono.titulo} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icono.src} alt={`Icono ${icono.titulo}`} loading="lazy" className="mx-auto h-40" />
              <h3 className="text-h3 uppercase">{icono.titulo}</h3>
              <p>{icono.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="contenedor py-separacion">
        <h2 className="text-h2">Casas y Depas en Venta</h2>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          {propiedades.map((propiedad) => (
            <TarjetaAnuncio key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/anuncios" className="boton-verde">
            Ver Todas
          </Link>
        </div>
      </section>

      <section className="relative flex flex-col items-center bg-cover bg-center py-[100px]">
        <Image
          src="/img/encuentra.jpg"
          alt=""
          fill
          className="-z-10 object-cover"
          sizes="100vw"
        />
        <h2 className="text-center text-[40px] font-black text-blanco">
          Encuentra la casa de tus suenios
        </h2>
        <p className="text-center text-lg text-blanco">
          Llena el formulario de contacto y un asesor se pondra en contacto contigo a la brevedad
        </p>
        <Link href="/contacto" className="boton-amarillo">
          Contactanos
        </Link>
      </section>

      <div className="contenedor grid gap-8 py-separacion md:grid-cols-[2fr_1fr]">
        <section>
          <h3 className="text-h3">Nuestro Blog</h3>
          {entradas.map((entrada) => (
            <EntradaBlogCard key={entrada.id} entrada={entrada} />
          ))}
        </section>

        <section>
          <h3 className="text-h3">Testimoniales</h3>

          <div className="rounded-[20px] bg-verde p-8 text-[24px] text-blanco">
            <blockquote className="relative pl-[50px] before:absolute before:-left-8 before:block before:h-16 before:w-24 before:bg-[url('/img/comilla.svg')] before:bg-no-repeat before:content-['']">
              El personal se comporto de una excelente forma, muy buena atencion y la casa que me
              ofrecieron cumple con todas mis expectativas.
            </blockquote>
            <p className="text-right text-blanco">- Juan De la torre</p>
          </div>
        </section>
      </div>
    </>
  );
}
