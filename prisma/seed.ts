import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bienesraices.test";
  const adminPassword = process.env.ADMIN_PASSWORD || "bienesraices123";

  await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      nombre: "Administrador",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const vendedor = await prisma.vendedor.upsert({
    where: { id: "vendedor-demo" },
    update: {},
    create: {
      id: "vendedor-demo",
      nombre: "Laura",
      apellido: "Jimenez",
      telefono: "+52 55 1234 5678",
    },
  });

  const propiedades = [
    {
      titulo: "Casa de Lujo en el Lago",
      descripcion:
        "Casa a la orilla del lago con vista panoramica, acabados de lujo y terraza privada para disfrutar el atardecer.",
      precio: 3_000_000,
      habitaciones: 4,
      wc: 3,
      estacionamiento: 3,
      imagen: "/img/anuncio1.jpg",
    },
    {
      titulo: "Casa con Acabados de Lujo",
      descripcion:
        "Residencia recien terminada con materiales de primera, cocina integral y amplios espacios para la familia.",
      precio: 2_750_000,
      habitaciones: 4,
      wc: 3,
      estacionamiento: 2,
      imagen: "/img/anuncio2.jpg",
    },
    {
      titulo: "Casa con Alberca Privada",
      descripcion:
        "Propiedad de un nivel con alberca privada, jardin amplio y zona de asador ideal para reuniones familiares.",
      precio: 3_200_000,
      habitaciones: 3,
      wc: 2,
      estacionamiento: 2,
      imagen: "/img/anuncio3.jpg",
    },
    {
      titulo: "Departamento Vista al Parque",
      descripcion:
        "Departamento moderno frente a un parque, con balcon, gimnasio en el edificio y seguridad las 24 horas.",
      precio: 1_950_000,
      habitaciones: 2,
      wc: 2,
      estacionamiento: 1,
      imagen: "/img/anuncio4.jpg",
    },
    {
      titulo: "Casa en Fraccionamiento Privado",
      descripcion:
        "Casa de dos niveles dentro de fraccionamiento con caseta de vigilancia, areas verdes y ludoteca.",
      precio: 2_400_000,
      habitaciones: 3,
      wc: 3,
      estacionamiento: 2,
      imagen: "/img/anuncio5.jpg",
    },
    {
      titulo: "Villa con Jardin Amplio",
      descripcion:
        "Villa de estilo contemporaneo con jardin amplio, estudio independiente y doble altura en la sala principal.",
      precio: 3_600_000,
      habitaciones: 5,
      wc: 4,
      estacionamiento: 3,
      imagen: "/img/anuncio6.jpg",
    },
  ];

  for (const propiedad of propiedades) {
    await prisma.propiedad.upsert({
      where: { id: `propiedad-${propiedad.imagen.split("/").pop()}` },
      update: {},
      create: { id: `propiedad-${propiedad.imagen.split("/").pop()}`, vendedorId: vendedor.id, ...propiedad },
    });
  }

  const entradas = [
    {
      slug: "terraza-en-el-techo-de-tu-casa",
      titulo: "Terraza en el techo de tu casa",
      imagen: "/img/blog1.jpg",
      autor: "Admin",
      contenido:
        "Consejos para construir una terraza en el techo de tu casa con los mejores materiales y ahorrando dinero. Planifica el drenaje antes que la decoracion, elige materiales resistentes a la intemperie y considera la carga estructural que soporta tu techo antes de empezar la obra.",
    },
    {
      slug: "guia-para-la-decoracion-de-tu-hogar",
      titulo: "Guia para la decoracion de tu hogar",
      imagen: "/img/blog2.jpg",
      autor: "Admin",
      contenido:
        "Maximiza el espacio en tu hogar con esta guia: aprende a combinar muebles y colores para darle vida a tu espacio. La regla del 60-30-10 en la paleta de color y la iluminacion en capas son el punto de partida de cualquier ambiente bien resuelto.",
    },
    {
      slug: "como-elegir-la-mejor-zona-para-comprar",
      titulo: "Como elegir la mejor zona para comprar",
      imagen: "/img/blog3.jpg",
      autor: "Admin",
      contenido:
        "Antes de firmar, investiga la plusvalia historica de la zona, la cercania a servicios y transporte, y el desarrollo urbano planeado para los proximos anios. Una buena ubicacion protege tu inversion mas que cualquier acabado.",
    },
    {
      slug: "financiamiento-hipotecario-lo-que-debes-saber",
      titulo: "Financiamiento hipotecario: lo que debes saber",
      imagen: "/img/blog4.jpg",
      autor: "Admin",
      contenido:
        "Compara tasas fijas y variables, calcula el CAT real de cada oferta y no comprometas mas del 30% de tu ingreso mensual en la mensualidad. Un buen historial crediticio es tu mejor herramienta de negociacion.",
    },
  ];

  for (const entrada of entradas) {
    await prisma.entrada.upsert({
      where: { slug: entrada.slug },
      update: {},
      create: entrada,
    });
  }

  console.log("Seed completo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
