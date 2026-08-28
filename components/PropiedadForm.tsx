"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Propiedad, Vendedor } from "@prisma/client";
import type { EstadoPropiedad } from "@/app/(admin)/admin/(panel)/propiedades/acciones";

const estadoInicial: EstadoPropiedad = { success: false };

function BotonGuardar({ texto }: { texto: string }) {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      value={pending ? "Guardando..." : texto}
      disabled={pending}
      className="boton-verde disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function CampoError({ texto }: { texto?: string }) {
  if (!texto) return null;
  return <p className="mt-1 text-sm font-bold text-red-600">{texto}</p>;
}

export function PropiedadForm({
  accion,
  vendedores,
  propiedad,
  textoBoton,
}: {
  accion: (estadoPrevio: EstadoPropiedad, formData: FormData) => Promise<EstadoPropiedad>;
  vendedores: Vendedor[];
  propiedad?: Propiedad;
  textoBoton: string;
}) {
  const [estado, ejecutar] = useActionState(accion, estadoInicial);

  return (
    <form action={ejecutar} className="formulario max-w-[600px]">
      {estado.message && (
        <p
          className={`mb-4 font-bold ${estado.success ? "text-verde" : "text-red-600"}`}
          role={estado.success ? "status" : "alert"}
        >
          {estado.message}
        </p>
      )}

      <label htmlFor="titulo">Titulo</label>
      <input type="text" name="titulo" id="titulo" defaultValue={propiedad?.titulo} required />
      <CampoError texto={estado.errores?.titulo} />

      <label htmlFor="descripcion">Descripcion</label>
      <textarea name="descripcion" id="descripcion" defaultValue={propiedad?.descripcion} required />
      <CampoError texto={estado.errores?.descripcion} />

      <label htmlFor="precio">Precio (MXN)</label>
      <input type="number" name="precio" id="precio" min={1} defaultValue={propiedad?.precio} required />
      <CampoError texto={estado.errores?.precio} />

      <label htmlFor="habitaciones">Habitaciones</label>
      <input
        type="number"
        name="habitaciones"
        id="habitaciones"
        min={0}
        defaultValue={propiedad?.habitaciones ?? 0}
        required
      />

      <label htmlFor="wc">Baños</label>
      <input type="number" name="wc" id="wc" min={0} defaultValue={propiedad?.wc ?? 0} required />

      <label htmlFor="estacionamiento">Estacionamiento</label>
      <input
        type="number"
        name="estacionamiento"
        id="estacionamiento"
        min={0}
        defaultValue={propiedad?.estacionamiento ?? 0}
        required
      />

      <label htmlFor="vendedorId">Vendedor</label>
      <select name="vendedorId" id="vendedorId" defaultValue={propiedad?.vendedorId ?? ""} required>
        <option value="" disabled>
          -- Seleccione --
        </option>
        {vendedores.map((vendedor) => (
          <option key={vendedor.id} value={vendedor.id}>
            {vendedor.nombre} {vendedor.apellido}
          </option>
        ))}
      </select>
      <CampoError texto={estado.errores?.vendedorId} />

      <label htmlFor="imagen">
        Imagen {propiedad ? "(dejar vacio para no cambiarla)" : ""}
      </label>
      <input type="file" name="imagen" id="imagen" accept="image/*" required={!propiedad} />
      <CampoError texto={estado.errores?.imagen} />

      <BotonGuardar texto={textoBoton} />
    </form>
  );
}
