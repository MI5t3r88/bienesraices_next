import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatearFecha } from "@/lib/formato";

export const metadata: Metadata = { title: "Mensajes" };

export default async function MensajesPage() {
  const mensajes = await prisma.mensaje.findMany({ orderBy: { creado: "desc" } });

  return (
    <div>
      <h1 className="text-h2">Mensajes de Contacto ({mensajes.length})</h1>

      <div className="flex flex-col gap-4">
        {mensajes.map((mensaje) => (
          <div key={mensaje.id} className="border border-gris p-4 dark:border-gris-oscuro">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">
                {mensaje.nombre} &middot; <span className="text-amarillo">{mensaje.email}</span>
              </p>
              <p className="text-sm">{formatearFecha(mensaje.creado)}</p>
            </div>

            <p>
              {mensaje.tipo} &middot; Tel: {mensaje.telefono}
              {mensaje.presupuesto ? ` · Presupuesto: $${mensaje.presupuesto}` : ""}
            </p>
            <p>Prefiere contacto por: {mensaje.preferenciaContacto}</p>
            {mensaje.fechaCita && (
              <p>
                Cita propuesta: {mensaje.fechaCita} {mensaje.horaCita}
              </p>
            )}

            <p className="mt-2">{mensaje.mensaje}</p>
          </div>
        ))}

        {mensajes.length === 0 && <p>Todavia no hay mensajes de contacto.</p>}
      </div>
    </div>
  );
}
