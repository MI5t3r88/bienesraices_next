import type { Metadata } from "next";
import { VendedorForm } from "@/components/VendedorForm";
import { crearVendedor } from "../acciones";

export const metadata: Metadata = { title: "Nuevo vendedor" };

export default function NuevoVendedorPage() {
  return (
    <div>
      <h1 className="text-h2">Nuevo Vendedor</h1>
      <VendedorForm accion={crearVendedor} textoBoton="Crear vendedor" />
    </div>
  );
}
