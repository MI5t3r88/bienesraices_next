import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [propiedades, entradas] = await Promise.all([
    prisma.propiedad.findMany({ select: { id: true, creado: true } }),
    prisma.entrada.findMany({
      where: { publicado: true },
      select: { slug: true, creado: true },
    }),
  ]);

  const estaticas: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/anuncios`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contacto`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const dinamicasPropiedades: MetadataRoute.Sitemap = propiedades.map((propiedad) => ({
    url: `${baseUrl}/anuncios/${propiedad.id}`,
    lastModified: propiedad.creado,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const dinamicasEntradas: MetadataRoute.Sitemap = entradas.map((entrada) => ({
    url: `${baseUrl}/blog/${entrada.slug}`,
    lastModified: entrada.creado,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...estaticas, ...dinamicasPropiedades, ...dinamicasEntradas];
}
