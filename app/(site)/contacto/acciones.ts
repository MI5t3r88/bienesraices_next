"use server";

import { contactoSchema } from "@/lib/validaciones";
import { prisma } from "@/lib/prisma";
import { enviarCorreoContacto } from "@/lib/correo";

export type EstadoContacto = {
  success: boolean;
  message?: string;
  errores?: Partial<Record<string, string>>;
};

export async function enviarMensaje(
  _estadoPrevio: EstadoContacto,
  formData: FormData
): Promise<EstadoContacto> {
  const datos = Object.fromEntries(formData.entries());
  const resultado = contactoSchema.safeParse(datos);

  if (!resultado.success) {
    const errores: Partial<Record<string, string>> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0];
      if (typeof campo === "string" && !errores[campo]) {
        errores[campo] = issue.message;
      }
    }
    return { success: false, errores, message: "Revisa los campos marcados." };
  }

  const { presupuesto, fechaCita, horaCita, ...resto } = resultado.data;

  const mensaje = await prisma.mensaje.create({
    data: {
      ...resto,
      presupuesto: presupuesto === "" || presupuesto === undefined ? null : Number(presupuesto),
      fechaCita: fechaCita || null,
      horaCita: horaCita || null,
    },
  });

  try {
    await enviarCorreoContacto(mensaje);
  } catch (error) {
    console.error("[contacto] fallo el envio de correo, mensaje ya quedo guardado:", error);
  }

  return { success: true, message: "Gracias, tu mensaje fue enviado. Te contactaremos pronto." };
}
