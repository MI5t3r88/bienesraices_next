"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const enlaces = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

// Alto de la barra fija: contrato compartido con el padding-top del hero
// (pt-[72px] mas abajo) y el spacer de las paginas internas. Los tres deben
// cambiar juntos. Literal a proposito: Tailwind v4 detecta clases escaneando
// el archivo como texto, no evaluando JS, asi que un template string
// interpolado no generaria la utilidad h-[72px].
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
}: {
  variante?: "inicio";
  titulo?: string;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [opacidadBarra, setOpacidadBarra] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status: estadoSesion } = useSession();
  const [montado, setMontado] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Patron recomendado por next-themes para evitar mismatch de hidratacion:
  // el icono de tema solo puede pintarse una vez el cliente sabe el tema real.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true);
  }, []);

  const esInicio = variante === "inicio";

  // Fondo amarillo de la barra en 0 mientras se vea el hero; recien cuando
  // este termina de salir de pantalla del todo (su borde inferior pasa bajo
  // la barra fija, o sea que el div siguiente ya llego completo arriba)
  // salta a 1, y motion.div convierte ese salto en un fade suave.
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
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10 bg-amarillo shadow-lg"
          initial={false}
          animate={{ opacity: esInicio ? (menuAbierto ? 1 : opacidadBarra) : 1 }}
          transition={{ duration: 0.7, ease: "easeIn" }}
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

            {/* Mientras useSession() resuelve (fetch a /api/auth/session sin
                sesion precargada desde el servidor), no mostrar "Iniciar
                sesion" de entrada: parpadearia mal para un admin ya logueado. */}
            {estadoSesion !== "loading" && (
              <Link href={session ? "/admin" : "/admin/login"} className="boton-verde mt-0">
                {session ? "Panel" : "Iniciar sesión"}
              </Link>
            )}

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
          className="relative bg-gris-oscuro bg-cover bg-center pt-[72px] md:min-h-[700px]"
          style={{ backgroundImage: "url(/img/header.jpg)" }}
        >
          <div className="relative z-10 contenedor flex flex-col items-center justify-center pb-8 md:min-h-[700px]">
            {titulo && (
              <h1 className="mt-8 max-w-[600px] text-center font-bold text-blanco text-h1">{titulo}</h1>
            )}
          </div>
        </section>
      ) : (
        <div className={"bg-gris-oscuro " + ALTO_BARRA} aria-hidden />
      )}
    </>
  );
}
