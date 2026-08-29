"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { propiedadSchema } from "@/lib/validaciones";
import { guardarImagen, borrarImagen, ImagenInvalidaError } from "@/lib/almacenamiento";
import { exigirSesion } from "@/lib/auth";

export type EstadoPropiedad = {
  success: boolean;
  message?: string;
  errores?: Partial<Record<string, string>>;
};

async function procesarFormulario(formData: FormData): Promise<
  | { ok: true; datos: ReturnType<typeof propiedadSchema.parse>; imagen?: string }
  | { ok: false; estado: EstadoPropiedad }
> {
  const datos = Object.fromEntries(formData.entries());
  const resultado = propiedadSchema.safeParse(datos);

  if (!resultado.success) {
    const errores: Partial<Record<string, string>> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0];
      if (typeof campo === "string" && !errores[campo]) errores[campo] = issue.message;
    }
    return { ok: false, estado: { success: false, errores, message: "Revisa los campos marcados." } };
  }

  const archivo = formData.get("imagen");
  let imagen: string | undefined;
  if (archivo instanceof File && archivo.size > 0) {
    try {
      imagen = await guardarImagen(archivo);
    } catch (error) {
      if (error instanceof ImagenInvalidaError) {
        return {
          ok: false,
          estado: { success: false, errores: { imagen: error.message }, message: "Revisa los campos marcados." },
        };
      }
      throw error;
    }
  }

  return { ok: true, datos: resultado.data, imagen };
}

export async function crearPropiedad(
  _estadoPrevio: EstadoPropiedad,
  formData: FormData
): Promise<EstadoPropiedad> {
  await exigirSesion();

  const resultado = await procesarFormulario(formData);
  if (!resultado.ok) return resultado.estado;

  if (!resultado.imagen) {
    return {
      success: false,
      message: "La imagen es obligatoria.",
      errores: { imagen: "Selecciona una imagen" },
    };
  }

  const propiedad = await prisma.propiedad.create({
    data: { ...resultado.datos, imagen: resultado.imagen },
  });

  revalidatePath("/admin");
  revalidatePath("/anuncios");
  redirect(`/admin/propiedades/${propiedad.id}/editar?creada=1`);
}

export async function actualizarPropiedad(
  id: string,
  _estadoPrevio: EstadoPropiedad,
  formData: FormData
): Promise<EstadoPropiedad> {
  await exigirSesion();

  const resultado = await procesarFormulario(formData);
  if (!resultado.ok) return resultado.estado;

  const anterior = await prisma.propiedad.findUnique({ where: { id }, select: { imagen: true } });

  await prisma.propiedad.update({
    where: { id },
    data: {
      ...resultado.datos,
      ...(resultado.imagen ? { imagen: resultado.imagen } : {}),
    },
  });

  if (resultado.imagen && anterior) {
    await borrarImagen(anterior.imagen);
  }

  revalidatePath("/admin");
  revalidatePath("/anuncios");
  revalidatePath(`/anuncios/${id}`);

  return { success: true, message: "Propiedad actualizada." };
}

export async function borrarPropiedad(id: string) {
  await exigirSesion();

  const propiedad = await prisma.propiedad.delete({ where: { id } });
  await borrarImagen(propiedad.imagen);

  revalidatePath("/admin");
  revalidatePath("/anuncios");
  redirect("/admin");
}
