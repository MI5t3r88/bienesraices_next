import Link from "next/link";

const enlaces = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-gris-oscuro py-separacion">
      <div className="contenedor flex flex-col items-center gap-6">
        <nav className="flex flex-col items-center gap-3 md:flex-row md:gap-8">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="text-blanco no-underline hover:text-verde"
            >
              {enlace.label}
            </Link>
          ))}
        </nav>

        <p className="text-center text-blanco">
          Todos los derechos Reservados {new Date().getFullYear()} &copy;
        </p>
      </div>
    </footer>
  );
}
