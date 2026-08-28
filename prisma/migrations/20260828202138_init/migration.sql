-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "creado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Propiedad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "habitaciones" INTEGER NOT NULL,
    "wc" INTEGER NOT NULL,
    "estacionamiento" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "creado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendedorId" TEXT NOT NULL,
    CONSTRAINT "Propiedad_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "creado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "presupuesto" INTEGER,
    "preferenciaContacto" TEXT NOT NULL,
    "fechaCita" TEXT,
    "horaCita" TEXT,
    "creado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_slug_key" ON "Entrada"("slug");
