"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { FondoSlideshow, IndicadoresSlide, INTERVALO_MS, type ImagenSlide } from "@/components/FondoSlideshow";

const enlaces = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

// Alto de la barra fija: contrato compartido con el espaciador de las
// paginas internas y el padding-top del hero (pt-[72px] mas abajo). Los
// tres deben cambiar juntos. ALTO_BARRA es literal a proposito: Tailwind
// v4 detecta clases escaneando el archivo como texto, no evaluando JS, asi
// que un template string interpolado no generaria la utilidad h-[72px].
const ALTO_BARRA_PX = 72;
const ALTO_BARRA = "h-[72px]";

function EnlacesNav({ className, onEnlaceClick }: { className: string; onEnlaceClick: () => void }) {
  return (
    <nav className={className}>
      {enlaces.map((enlace) => (
        <Link
          key={enlace.href}
          href={enlace.href}
          className="text-blanco text-xl no-underline hover:text-verde md:text-lg"
          onClick={onEnlaceClick}
        >
          {enlace.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader({
  variante,
  titulo,
  imagenesFondo = [],
}: {
  variante?: "inicio";
  titulo?: string;
  imagenesFondo?: ImagenSlide[];
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [opacidadBarra, setOpacidadBarra] = useState(0);
  const [indice, setIndice] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Patron recomendado por next-themes para evitar mismatch de hidratacion:
  // el icono de tema solo puede pintarse una vez el cliente sabe el tema real.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true);
  }, []);

  const esInicio = variante === "inicio";

  // Avanza el slideshow de fondo. INTERVALO_MS tambien maneja la duracion
  // del aro que se llena en IndicadoresSlide, para que queden sincronizados.
  useEffect(() => {
    if (!esInicio || imagenesFondo.length < 2) return;
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % imagenesFondo.length);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [esInicio, imagenesFondo.length]);

  // Fondo de la barra en 0 mientras se vea aunque sea un pedacito del
  // header; recien cuando el hero termina de salir de pantalla del todo
  // (su borde inferior pasa bajo la barra fija) salta a 1 de un saque, y
  // es la transition-opacity de mas abajo la que convierte ese salto en
  // un fade-in suave. No es una interpolacion continua por cada pixel de
  // scroll: es un interruptor con una transicion CSS encima.
  useEffect(() => {
    if (!esInicio) return;
    const hero = heroRef.current;
    if (!hero) return;

    const recalcular = () => {
      setOpacidadBarra(hero.getBoundingClientRect().bottom <= ALTO_BARRA_PX ? 1 : 0);
    };

    recalcular();
    window.addEventListener("scroll", recalcular, { passive: true });
    window.addEventListener("resize", recalcular);
    return () => {
      window.removeEventListener("scroll", recalcular);
      window.removeEventListener("resize", recalcular);
    };
  }, [esInicio]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-amarillo shadow-lg transition-opacity duration-700 ease-in motion-reduce:transition-none"
          style={esInicio ? { opacity: menuAbierto ? 1 : opacidadBarra } : undefined}
        />

        <div className={"relative contenedor flex items-center justify-between gap-4 " + ALTO_BARRA}>
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.svg" alt="Logotipo de Bienes Raices" className="h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={resolvedTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
              className="invert cursor-pointer"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {montado ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src="/img/dark-mode.svg" alt="" className="w-8" />
              ) : (
                <span className="block h-8 w-8" />
              )}
            </button>

            <EnlacesNav className="hidden md:flex md:items-center md:gap-8" onEnlaceClick={() => setMenuAbierto(false)} />

            <button
              type="button"
              className="md:hidden"
              aria-label={menuAbierto ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={menuAbierto}
              onClick={() => setMenuAbierto((valor) => !valor)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/barras.svg" alt="" className="w-8" />
            </button>
          </div>
        </div>

        {menuAbierto && (
          <EnlacesNav
            className="relative contenedor flex flex-col items-center gap-3 pb-4 md:hidden"
            onEnlaceClick={() => setMenuAbierto(false)}
          />
        )}
      </header>

      {esInicio ? (
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-gris-oscuro bg-cover bg-center pt-[72px] md:min-h-[700px]"
          style={imagenesFondo.length === 0 ? { backgroundImage: "url(/img/header.jpg)" } : undefined}
        >
          {imagenesFondo.length > 0 && <FondoSlideshow imagenes={imagenesFondo} indice={indice} />}
          {imagenesFondo.length > 1 && <IndicadoresSlide total={imagenesFondo.length} indice={indice} />}

          <div className="relative z-10 contenedor flex flex-col items-center justify-center pb-8 md:min-h-[700px]">
            {titulo && (
              <h1 className="mt-8 max-w-[600px] text-center font-bold text-blanco text-h1">{titulo}</h1>
            )}

            {imagenesFondo.length > 0 && (
              <Link href={`/anuncios/${imagenesFondo[indice].id}`} className="boton-amarillo">
                Ver Propiedad
              </Link>
            )}
          </div>
        </section>
      ) : (
        <div className={"bg-gris-oscuro " + ALTO_BARRA} aria-hidden />
      )}
    </>
  );
}
