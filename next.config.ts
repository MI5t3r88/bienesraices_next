import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silencia el warning de Turbopack: hay un package-lock.json de otro
  // proyecto en una carpeta superior (fuera de este repo git).
  turbopack: {
    root: __dirname,
  },
  // Los Server Actions limitan el body a 1MB por defecto. La subida de
  // imagenes de propiedades valida hasta 5MB en lib/almacenamiento.ts;
  // 6MB deja margen para el overhead de multipart/form-data.
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
