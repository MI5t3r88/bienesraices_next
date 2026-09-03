"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // Sin prop `session`: hace su propio fetch a /api/auth/session en el
    // cliente. A proposito, para no forzar `await auth()` en el layout raiz
    // (eso volveria dinamica toda pagina del sitio, incluidas las estaticas
    // como home/blog/contacto/nosotros). El costo es un breve estado inicial
    // sin sesion resuelta en SiteHeader (ver useSession() ahi).
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* reducedMotion="user" respeta prefers-reduced-motion del sistema,
            igual que el motion-reduce:transition-none que reemplaza en SiteHeader. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </SessionProvider>
  );
}
