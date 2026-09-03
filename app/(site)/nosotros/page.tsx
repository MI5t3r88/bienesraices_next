import Image from "next/image";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "25 anios de experiencia ayudando a familias a encontrar su proxima casa.",
};

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

export default function NosotrosPage() {
  return (
    <>
      <SiteHeader />

      <main className="contenedor py-separacion">
        <h1 className="text-h1 pb-12">Conoce sobre Nosotros</h1>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div className="relative aspect-video w-full">
            <Image
              src="/img/nosotros.jpg"
              alt="Sobre Nosotros"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <blockquote className="mt-8 text-[22px] font-black md:mt-0">
              25 Anios de experiencia
            </blockquote>

            <p>
              Somos una inmobiliaria familiar con 25 anios de trayectoria, especializada en
              propiedades residenciales de lujo. Acompanamos a cada cliente desde la primera
              visita hasta la firma, con asesoria legal y financiera incluida en todo el proceso.
            </p>

            <p>
              Nuestro equipo conoce a fondo cada zona en la que operamos: plusvalia, servicios
              cercanos y desarrollo urbano planeado, para que la decision de compra o venta este
              siempre respaldada por informacion real.
            </p>
          </div>
        </div>
      </main>

      <section className="contenedor pb-separacion">
        <h1 className="text-h1 pb-12">Mas Sobre Nosotros</h1>

        <div className="md:grid md:grid-cols-3 md:gap-8">
          {iconos.map((icono) => (
            <div key={icono.titulo} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icono.src} alt={`Icono ${icono.titulo}`} loading="lazy" className="mx-auto h-40" />
              <h3 className=" text-h3 uppercase">{icono.titulo}</h3>
              <p>{icono.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
