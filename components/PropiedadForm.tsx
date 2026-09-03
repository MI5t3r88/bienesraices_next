"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Propiedad, Vendedor } from "@prisma/client";
import type { EstadoPropiedad } from "@/app/(admin)/admin/(panel)/propiedades/acciones";

const estadoInicial: EstadoPropiedad = { success: false };

// Duplicado a proposito (no importado de lib/almacenamiento.ts): ese
// archivo usa fs/sharp, exclusivos de Node, y no puede entrar al bundle
// de este client component. Si cambia el limite alla, actualizar aqui.
const TIPOS_PERMITIDOS = "image/jpeg,image/png,image/webp,image/avif";
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;

function BotonGuardar({ texto, deshabilitado }: { texto: string; deshabilitado?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      value={pending ? "Guardando..." : texto}
      disabled={pending || deshabilitado}
      className="boton-verde disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function CampoError({ campo, texto }: { campo: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={`${campo}-error`} className="mt-1 text-sm font-bold text-red-600">
      {texto}
    </p>
  );
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
  const [errorImagenCliente, setErrorImagenCliente] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string>();

  // Libera el object URL del preview al desmontar o al elegir otra imagen,
  // para no acumular memoria mientras el formulario sigue abierto.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function manejarCambioImagen(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    setPreviewUrl((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return archivo ? URL.createObjectURL(archivo) : undefined;
    });

    if (!archivo) {
      setErrorImagenCliente(undefined);
      return;
    }
    if (archivo.size > TAMANO_MAXIMO_BYTES) {
      setErrorImagenCliente("La imagen pesa demasiado (maximo 5 MB)");
      return;
    }
    setErrorImagenCliente(undefined);
  }

  const sinVendedores = vendedores.length === 0;

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

      {sinVendedores && (
        <p role="alert" className="mb-4 font-bold text-red-600">
          Todavia no hay ningun vendedor registrado.{" "}
          <Link href="/admin/vendedores/nueva" className="underline">
            Crea uno primero
          </Link>
          {" "}para poder guardar una propiedad.
        </p>
      )}

      <label htmlFor="titulo">Titulo</label>
      <input
        type="text"
        name="titulo"
        id="titulo"
        defaultValue={propiedad?.titulo}
        required
        aria-invalid={!!estado.errores?.titulo}
        aria-describedby={estado.errores?.titulo ? "titulo-error" : undefined}
      />
      <CampoError campo="titulo" texto={estado.errores?.titulo} />

      <label htmlFor="descripcion">Descripcion</label>
      <textarea
        name="descripcion"
        id="descripcion"
        defaultValue={propiedad?.descripcion}
        required
        aria-invalid={!!estado.errores?.descripcion}
        aria-describedby={estado.errores?.descripcion ? "descripcion-error" : undefined}
      />
      <CampoError campo="descripcion" texto={estado.errores?.descripcion} />

      <label htmlFor="precio">Precio (MXN)</label>
      <input
        type="number"
        name="precio"
        id="precio"
        min={1}
        defaultValue={propiedad?.precio}
        required
        aria-invalid={!!estado.errores?.precio}
        aria-describedby={estado.errores?.precio ? "precio-error" : undefined}
      />
      <CampoError campo="precio" texto={estado.errores?.precio} />

      <label htmlFor="habitaciones">Habitaciones</label>
      <input
        type="number"
        name="habitaciones"
        id="habitaciones"
        min={0}
        defaultValue={propiedad?.habitaciones ?? 0}
        required
        aria-invalid={!!estado.errores?.habitaciones}
        aria-describedby={estado.errores?.habitaciones ? "habitaciones-error" : undefined}
      />
      <CampoError campo="habitaciones" texto={estado.errores?.habitaciones} />

      <label htmlFor="wc">Baños</label>
      <input
        type="number"
        name="wc"
        id="wc"
        min={0}
        defaultValue={propiedad?.wc ?? 0}
        required
        aria-invalid={!!estado.errores?.wc}
        aria-describedby={estado.errores?.wc ? "wc-error" : undefined}
      />
      <CampoError campo="wc" texto={estado.errores?.wc} />

      <label htmlFor="estacionamiento">Estacionamiento</label>
      <input
        type="number"
        name="estacionamiento"
        id="estacionamiento"
        min={0}
        defaultValue={propiedad?.estacionamiento ?? 0}
        required
        aria-invalid={!!estado.errores?.estacionamiento}
        aria-describedby={estado.errores?.estacionamiento ? "estacionamiento-error" : undefined}
      />
      <CampoError campo="estacionamiento" texto={estado.errores?.estacionamiento} />

      <label htmlFor="vendedorId">Vendedor</label>
      <select
        name="vendedorId"
        id="vendedorId"
        defaultValue={propiedad?.vendedorId ?? ""}
        required
        disabled={sinVendedores}
        aria-invalid={!!estado.errores?.vendedorId}
        aria-describedby={estado.errores?.vendedorId ? "vendedorId-error" : undefined}
      >
        <option value="" disabled>
          -- Seleccione --
        </option>
        {vendedores.map((vendedor) => (
          <option key={vendedor.id} value={vendedor.id}>
            {vendedor.nombre} {vendedor.apellido}
          </option>
        ))}
      </select>
      <CampoError campo="vendedorId" texto={estado.errores?.vendedorId} />

      <label htmlFor="imagen">
        Imagen {propiedad ? "(dejar vacio para no cambiarla)" : ""}
      </label>
      <input
        type="file"
        name="imagen"
        id="imagen"
        accept={TIPOS_PERMITIDOS}
        required={!propiedad}
        onChange={manejarCambioImagen}
        aria-invalid={!!(estado.errores?.imagen || errorImagenCliente)}
        aria-describedby={estado.errores?.imagen || errorImagenCliente ? "imagen-error" : undefined}
      />
      <CampoError campo="imagen" texto={errorImagenCliente ?? estado.errores?.imagen} />

      {(previewUrl || propiedad?.imagen) && (
        // Preview de un object URL local o de una imagen ya subida a
        // /uploads; next/image no aporta nada aqui y complica la
        // limpieza del blob URL.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl ?? propiedad?.imagen}
          alt=""
          className="mt-2 h-32 w-full object-cover"
        />
      )}

      <BotonGuardar texto={textoBoton} deshabilitado={sinVendedores || !!errorImagenCliente} />
    </form>
  );
}
