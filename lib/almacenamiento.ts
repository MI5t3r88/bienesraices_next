import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB

/** Error esperado (mensaje seguro para mostrar en el formulario). */
export class ImagenInvalidaError extends Error {}

/**
 * Guarda la imagen de una propiedad y devuelve la ruta publica.
 *
 * Aviso: escribe en public/uploads, que funciona en desarrollo local
 * pero NO en Vercel (filesystem de solo lectura en produccion). Al
 * desplegar, reemplazar esta funcion por una subida a Vercel Blob
 * (u otro almacenamiento de objetos) manteniendo la misma firma.
 */
export async function guardarImagen(archivo: File): Promise<string> {
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    throw new ImagenInvalidaError("Formato no soportado: usa JPG, PNG, WEBP o AVIF");
  }
  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    throw new ImagenInvalidaError("La imagen pesa demasiado (maximo 5 MB)");
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const nombre = `${randomUUID()}.webp`;
  const carpeta = path.join(process.cwd(), "public", "uploads");
  const destino = path.join(carpeta, nombre);

  await mkdir(carpeta, { recursive: true });

  let optimizada: Buffer;
  try {
    optimizada = await sharp(buffer)
      .resize(1200, 800, { fit: "cover" })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    // El nombre y tipo declarado pasaron la validacion pero el
    // contenido no es una imagen decodificable (archivo renombrado).
    throw new ImagenInvalidaError("El archivo no es una imagen valida");
  }

  await writeFile(destino, optimizada);

  return `/uploads/${nombre}`;
}

/**
 * Borra una imagen previamente guardada por guardarImagen. Solo actua
 * sobre rutas dentro de /uploads/ (las imagenes de seed viven en
 * /img/ y no deben tocarse). Ignora si el archivo ya no existe.
 */
export async function borrarImagen(ruta: string): Promise<void> {
  if (!ruta.startsWith("/uploads/")) return;

  const destino = path.join(process.cwd(), "public", ruta);
  try {
    await unlink(destino);
  } catch (error) {
    const codigo = (error as NodeJS.ErrnoException).code;
    if (codigo !== "ENOENT") throw error;
  }
}
