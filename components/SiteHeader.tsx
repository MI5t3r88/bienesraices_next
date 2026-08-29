"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

// El bloque "Mas Sobre Nosotros" vive en app/(site)/page.tsx, fuera de
// este componente: se ubica por id en vez de por ref porque no hay
// forma de pasar un ref entre arboles de componentes hermanos.
export const ID_SECCION_NOSOTROS = "seccion-mas-sobre-nosotros";

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
}: {
  variante?: "inicio";
  titulo?: string;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  // Patron recomendado por next-themes para evitar mismatch de hidratacion:
  // el icono de tema solo puede pintarse una vez el cliente sabe el tema real.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true);
  }, []);

  const esInicio = variante === "inicio";

  // Solo en el inicio la barra arranca transparente sobre el hero: gana
  // fondo cuando su borde inferior alcanza el bloque "Mas Sobre Nosotros"
  // (no con un umbral fijo de scroll, para que quede alineada con esa
  // seccion sin importar la altura real del hero en cada viewport).
  useEffect(() => {
    if (!esInicio) return;

    const seccion = document.getElementById(ID_SECCION_NOSOTROS);
    if (!seccion) return;

    const alDesplazar = () => setDesplazado(seccion.getBoundingClientRect().top <= ALTO_BARRA_PX);
    alDesplazar(); // estado correcto si se recarga a media pagina
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, [esInicio]);

  // Con el menu movil desplegado, la barra necesita fondo aunque no haya
  // llegado a la seccion: si no, los enlaces quedan flotando sobre
  // contenido claro. Fuera del inicio no hay hero que tapar, asi que la
  // barra es solida desde el primer render (sin depender de scroll).
  const barraSolida = !esInicio || desplazado || menuAbierto;

  return (
    <>
      <header
        className={
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ease-in motion-reduce:transition-none " +
          (barraSolida ? "bg-amarillo shadow-lg" : "bg-transparent")
        }
      >
        <div className={"contenedor flex items-center justify-between gap-4 " + ALTO_BARRA}>
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
            className="contenedor flex flex-col items-center gap-3 pb-4 md:hidden"
            onEnlaceClick={() => setMenuAbierto(false)}
          />
        )}
      </header>

      {esInicio ? (
        <section
          className="relative bg-gris-oscuro bg-cover bg-center pt-[72px] md:min-h-[700px]"
          style={{ backgroundImage: "url(/img/header.jpg)" }}
        >
          <div className="contenedor flex flex-col justify-end pb-8 md:min-h-[700px]">
            {titulo && (
              <h1 className="mt-8 max-w-[600px] text-left font-bold text-blanco text-h1">{titulo}</h1>
            )}
          </div>
        </section>
      ) : (
        <div className={"bg-gris-oscuro " + ALTO_BARRA} aria-hidden />
      )}
    </>
  );
}
