import { Resend } from "resend";
import type { Mensaje } from "@prisma/client";

/**
 * Envia el aviso del formulario de contacto por correo.
 *
 * Sin RESEND_API_KEY configurada, el mensaje ya quedo guardado en la
 * base de datos (ver Server Action de /contacto): aqui solo se deja
 * constancia en consola y el flujo sigue como exitoso.
 */
export async function enviarCorreoContacto(mensaje: Mensaje) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[contacto] Sin RESEND_API_KEY. Mensaje #${mensaje.id} de ${mensaje.nombre} <${mensaje.email}> guardado en base de datos.`
    );
    return;
  }

  const resend = new Resend(apiKey);
  const destino = process.env.CONTACTO_EMAIL_DESTINO || "admin@bienesraices.test";

  await resend.emails.send({
    from: "Bienes Raices <onboarding@resend.dev>",
    to: destino,
    replyTo: mensaje.email,
    subject: `Nuevo contacto de ${mensaje.nombre}`,
    text: [
      `Nombre: ${mensaje.nombre}`,
      `Email: ${mensaje.email}`,
      `Telefono: ${mensaje.telefono}`,
      `Tipo: ${mensaje.tipo}`,
      mensaje.presupuesto ? `Presupuesto: $${mensaje.presupuesto}` : null,
      `Prefiere que lo contacten por: ${mensaje.preferenciaContacto}`,
      mensaje.fechaCita ? `Fecha propuesta: ${mensaje.fechaCita} ${mensaje.horaCita ?? ""}` : null,
      "",
      mensaje.mensaje,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
