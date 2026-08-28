"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enviarMensaje, type EstadoContacto } from "@/app/(site)/contacto/acciones";

const estadoInicial: EstadoContacto = { success: false };

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      value={pending ? "Enviando..." : "Enviar"}
      disabled={pending}
      className="boton-verde disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function Error({ texto }: { texto?: string }) {
  if (!texto) return null;
  return <p className="mt-1 text-sm font-bold text-red-600">{texto}</p>;
}

export function FormularioContacto() {
  const [estado, accion] = useActionState(enviarMensaje, estadoInicial);

  if (estado.success) {
    return (
      <div className="border border-verde bg-gris p-8 dark:border-gris-oscuro dark:bg-gris-profundo" role="status">
        <p className="font-bold text-verde">{estado.message}</p>
      </div>
    );
  }

  return (
    <form action={accion} className="formulario" noValidate>
      {estado.message && (
        <p className="mb-4 font-bold text-red-600" role="alert">
          {estado.message}
        </p>
      )}

      <fieldset>
        <legend>Informacion Personal</legend>

        <label htmlFor="nombre">Nombre</label>
        <input type="text" name="nombre" id="nombre" placeholder="Tu Nombre" required />
        <Error texto={estado.errores?.nombre} />

        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" id="email" placeholder="Tu Email" required />
        <Error texto={estado.errores?.email} />

        <label htmlFor="telefono">Telefono</label>
        <input type="tel" name="telefono" id="telefono" placeholder="Tu Telefono" required />
        <Error texto={estado.errores?.telefono} />

        <label htmlFor="mensaje">Mensaje:</label>
        <textarea name="mensaje" id="mensaje" required />
        <Error texto={estado.errores?.mensaje} />
      </fieldset>

      <fieldset>
        <legend>Informacion sobre la propiedad</legend>

        <label htmlFor="tipo">Vende o Compra:</label>
        <select name="tipo" id="tipo" defaultValue="" required>
          <option value="" disabled>
            -- Seleccione --
          </option>
          <option value="Compra">Compra</option>
          <option value="Vende">Vende</option>
        </select>
        <Error texto={estado.errores?.tipo} />

        <label htmlFor="presupuesto">Precio o Presupuesto</label>
        <input type="number" name="presupuesto" id="presupuesto" placeholder="Tu Precio o Presupuesto" />
        <Error texto={estado.errores?.presupuesto} />
      </fieldset>

      <fieldset>
        <legend>Preferencia de contacto</legend>

        <p>Como desea ser contactado</p>

        <div className="forma-contacto">
          <label htmlFor="contactar-telefono">Telefono</label>
          <input
            name="preferenciaContacto"
            type="radio"
            value="telefono"
            id="contactar-telefono"
            defaultChecked
          />

          <label htmlFor="contactar-email">E-mail</label>
          <input name="preferenciaContacto" type="radio" value="email" id="contactar-email" />
        </div>
        <Error texto={estado.errores?.preferenciaContacto} />

        <p>Si eligio telefono, elija la fecha y la hora</p>

        <label htmlFor="fechaCita">Fecha:</label>
        <input type="date" name="fechaCita" id="fechaCita" />

        <label htmlFor="horaCita">Hora:</label>
        <input type="time" name="horaCita" id="horaCita" min="09:00" max="18:00" />
      </fieldset>

      <BotonEnviar />
    </form>
  );
}
