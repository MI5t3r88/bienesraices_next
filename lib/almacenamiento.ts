import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

/**
 * Guarda la imagen de una propiedad y devuelve la ruta publica.
 *
 * Aviso: escribe en public/uploads, que funciona en desarrollo local
 * pero NO en Vercel (filesystem de solo lectura en produccion). Al
 * desplegar, reemplazar esta funcion por una subida a Vercel Blob
 * (u otro almacenamiento de objetos) manteniendo la misma firma.
 */
export async function guardarImagen(archivo: File): Promise<string> {
  const buffer = Buffer.from(await archivo.arrayBuffer());
  const nombre = `${randomUUID()}.webp`;
  const carpeta = path.join(process.cwd(), "public", "uploads");
  const destino = path.join(carpeta, nombre);

  await mkdir(carpeta, { recursive: true });

  const optimizada = await sharp(buffer)
    .resize(1200, 800, { fit: "cover" })
    .webp({ quality: 82 })
    .toBuffer();

  await writeFile(destino, optimizada);

  return `/uploads/${nombre}`;
}
