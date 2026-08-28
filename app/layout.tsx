import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bienes Raices",
    template: "%s | Bienes Raices",
  },
  description:
    "Venta de casas y departamentos exclusivos de lujo. Encuentra la propiedad de tus suenios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={lato.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
