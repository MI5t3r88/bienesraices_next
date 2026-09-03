import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // El middleware ya protege /admin/*; esto es una segunda verificacion
  // defensiva por si el layout se renderiza fuera de ese flujo.
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-col items-center gap-4 bg-gris-oscuro px-6 py-4 md:flex-row md:justify-between">
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-blanco no-underline">
            Bienes Raices &middot; Admin
          </Link>
          <Link href="/admin/mensajes" className="text-blanco no-underline hover:text-verde">
            Mensajes
          </Link>
          <Link href="/admin/vendedores" className="text-blanco no-underline hover:text-verde">
            Vendedores
          </Link>
          <Link href="/" className="text-blanco no-underline hover:text-verde">
            Ver sitio
          </Link>
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button type="submit" className="text-blanco underline hover:text-verde">
            Cerrar sesion ({session.user?.email})
          </button>
        </form>
      </header>

      <main className="contenedor flex-1 py-separacion">{children}</main>
    </div>
  );
}
