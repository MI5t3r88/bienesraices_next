"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { vendedorSchema } from "@/lib/validaciones";
import { exigirSesion } from "@/lib/auth";

export type EstadoVendedor = {
  success: boolean;
  message?: string;
  errores?: Partial<Record<string, string>>;
};

function validar(formData: FormData):
  | { ok: true; datos: ReturnType<typeof vendedorSchema.parse> }
  | { ok: false; estado: EstadoVendedor } {
  const datos = Object.fromEntries(formData.entries());
  const resultado = vendedorSchema.safeParse(datos);

  if (!resultado.success) {
    const errores: Partial<Record<string, string>> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0];
      if (typeof campo === "string" && !errores[campo]) errores[campo] = issue.message;
    }
    return { ok: false, estado: { success: false, errores, message: "Revisa los campos marcados." } };
  }

  return { ok: true, datos: resultado.data };
}

export async function crearVendedor(
  _estadoPrevio: EstadoVendedor,
  formData: FormData
): Promise<EstadoVendedor> {
  await exigirSesion();

  const resultado = validar(formData);
  if (!resultado.ok) return resultado.estado;

  const vendedor = await prisma.vendedor.create({ data: resultado.datos });

  revalidatePath("/admin/vendedores");
  redirect(`/admin/vendedores/${vendedor.id}/editar?creado=1`);
}

export async function actualizarVendedor(
  id: string,
  _estadoPrevio: EstadoVendedor,
  formData: FormData
): Promise<EstadoVendedor> {
  await exigirSesion();

  const resultado = validar(formData);
  if (!resultado.ok) return resultado.estado;

  await prisma.vendedor.update({ where: { id }, data: resultado.datos });

  // Los datos del vendedor se muestran en el detalle publico de cada
  // propiedad que le pertenece (nombre, apellido, telefono).
  revalidatePath("/admin/vendedores");
  revalidatePath("/anuncios");

  return { success: true, message: "Vendedor actualizado." };
}

export async function borrarVendedor(id: string): Promise<EstadoVendedor> {
  await exigirSesion();

  // La FK Propiedad.vendedorId es ON DELETE RESTRICT: intentar borrar un
  // vendedor con propiedades asignadas fallaria en la base de datos.
  // Se cuenta antes para devolver un mensaje legible sin tocar la BD.
  const propiedades = await prisma.propiedad.count({ where: { vendedorId: id } });
  if (propiedades > 0) {
    return {
      success: false,
      message: `No se puede borrar: tiene ${propiedades} propiedad${propiedades === 1 ? "" : "es"} asignada${propiedades === 1 ? "" : "s"}.`,
    };
  }

  await prisma.vendedor.delete({ where: { id } });

  revalidatePath("/admin/vendedores");
  return { success: true, message: "Vendedor borrado." };
}
