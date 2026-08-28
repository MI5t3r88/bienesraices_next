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

export function SiteHeader({
  variante,
  titulo,
}: {
  variante?: "inicio";
  titulo?: string;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  // Patron recomendado por next-themes para evitar mismatch de hidratacion:
  // el icono de tema solo puede pintarse una vez el cliente sabe el tema real.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true);
  }, []);

  const esInicio = variante === "inicio";

  return (
    <header
      className={
        "relative bg-gris-oscuro" +
        (esInicio
          ? " bg-cover bg-center md:min-h-[700px]"
          : " py-4")
      }
      style={esInicio ? { backgroundImage: "url(/img/header.jpg)" } : undefined}
    >
      <div
        className={
          "contenedor flex flex-col" +
          (esInicio ? " justify-between md:min-h-[700px] pb-8" : "")
        }
      >
        <div className="flex flex-col items-center gap-4 pt-12 md:flex-row md:items-end md:justify-between">
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.svg" alt="Logotipo de Bienes Raices" className="h-10 w-auto" />
          </Link>

          <button
            type="button"
            className="md:hidden"
            aria-label={menuAbierto ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((valor) => !valor)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/barras.svg" alt="" className="w-12" />
          </button>

          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
            <button
              type="button"
              aria-label="Cambiar modo oscuro"
              className="invert cursor-pointer"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {montado ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src="/img/dark-mode.svg" alt="" className="w-8" />
              ) : (
                <span className="block w-8 h-8" />
              )}
            </button>

            <nav
              className={
                (menuAbierto ? "flex" : "hidden") +
                " flex-col items-center gap-3 md:flex md:flex-row md:gap-8"
              }
            >
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  className="text-blanco text-xl no-underline hover:text-verde md:text-lg"
                  onClick={() => setMenuAbierto(false)}
                >
                  {enlace.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {esInicio && titulo && (
          <h1 className="mt-8 max-w-[600px] text-left font-bold text-blanco text-h1">
            {titulo}
          </h1>
        )}
      </div>
    </header>
  );
}
