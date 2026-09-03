import { z } from "zod";

export const contactoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es muy corto"),
  email: z.email("Correo invalido"),
  telefono: z.string().trim().min(7, "Telefono invalido"),
  mensaje: z.string().trim().min(10, "Cuentanos un poco mas"),
  tipo: z.enum(["Compra", "Vende"], { error: "Selecciona una opcion" }),
  presupuesto: z.coerce.number().positive().optional().or(z.literal("")),
  preferenciaContacto: z.enum(["telefono", "email"], {
    error: "Selecciona como contactarte",
  }),
  fechaCita: z.string().trim().optional().or(z.literal("")),
  horaCita: z.string().trim().optional().or(z.literal("")),
});

export type ContactoInput = z.infer<typeof contactoSchema>;

export const propiedadSchema = z.object({
  titulo: z.string().trim().min(4, "Titulo muy corto"),
  descripcion: z.string().trim().min(20, "Describe mejor la propiedad"),
  precio: z.coerce.number().int().positive("El precio debe ser mayor a 0"),
  habitaciones: z.coerce.number().int().min(0),
  wc: z.coerce.number().int().min(0),
  estacionamiento: z.coerce.number().int().min(0),
  vendedorId: z.string().min(1, "Selecciona un vendedor"),
});

export type PropiedadInput = z.infer<typeof propiedadSchema>;

export const vendedorSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre muy corto"),
  apellido: z.string().trim().min(2, "Apellido muy corto"),
  telefono: z.string().trim().min(7, "Telefono invalido"),
});

export type VendedorInput = z.infer<typeof vendedorSchema>;

export const credencialesSchema = z.object({
  email: z.email("Correo invalido"),
  password: z.string().min(6, "Contraseña muy corta"),
});
