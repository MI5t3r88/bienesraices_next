const items = [
  { icono: "/img/icono_wc.svg", alt: "icono wc", campo: "wc" as const },
  {
    icono: "/img/icono_estacionamiento.svg",
    alt: "icono estacionamiento",
    campo: "estacionamiento" as const,
  },
  {
    icono: "/img/icono_dormitorio.svg",
    alt: "icono habitaciones",
    campo: "habitaciones" as const,
  },
];

export function IconosCaracteristicas({
  wc,
  estacionamiento,
  habitaciones,
}: {
  wc: number;
  estacionamiento: number;
  habitaciones: number;
}) {
  const valores = { wc, estacionamiento, habitaciones };

  return (
    <ul className="flex max-w-[400px] list-none gap-4 p-0">
      {items.map((item) => (
        <li key={item.campo} className="flex flex-1 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.icono}
            alt={item.alt}
            loading="lazy"
            className="w-8 shrink-0 dark:invert"
          />
          <p className="font-black">{valores[item.campo]}</p>
        </li>
      ))}
    </ul>
  );
}
