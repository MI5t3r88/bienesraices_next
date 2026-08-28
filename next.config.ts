import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silencia el warning de Turbopack: hay un package-lock.json de otro
  // proyecto en una carpeta superior (fuera de este repo git).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
