/** Tabla de códigos de error para cloradores salinos EC08 y EC12.
 *  Fuente: manual del fabricante. Ante diferencias, prevalece el manual del equipo. */

export const CHLORINATOR_MODELS = ["EC08", "EC12"] as const;
export type ChlorinatorModel = (typeof CHLORINATOR_MODELS)[number];

export type ErrorCode = {
  code: string;
  meaning: string;
  normal: string;
  solution: string;
  manual?: boolean;
};

const SHARED: ErrorCode[] = [
  {
    code: "E1",
    meaning: "Falla de comunicación del controlador",
    normal: "Comunicación estable entre panel y celda",
    solution: "Apagá y volvé a encender el equipo. Si persiste, revisá el cableado del panel.",
    manual: true,
  },
  {
    code: "E2",
    meaning: "Temperatura del agua fuera de rango",
    normal: "Agua entre 10 °C y 40 °C",
    solution: "Esperá que el agua entre en rango; con agua muy fría la producción se detiene.",
  },
  {
    code: "E3",
    meaning: "Falta de agua / sin flujo",
    normal: "Se requiere caudal adecuado de agua en el clorador",
    solution:
      "Verificá que la bomba esté funcionando, que el filtro no esté sucio y que no haya aire en el circuito. Asegurate de que el sensor de flujo esté conectado.",
  },
  {
    code: "E4",
    meaning: "Concentración de sal demasiado alta",
    normal: "3500 ppm",
    solution:
      "Medí la salinidad con un medidor de sal. Si es mayor al valor normal, desaguá parte del agua y reponé con agua dulce hasta llegar al rango.",
  },
  {
    code: "E5",
    meaning: "Concentración de sal demasiado baja",
    normal: "3500 ppm",
    solution:
      "Medí la salinidad. Si es menor a 3500 ppm, agregá sal (usá la calculadora de sal de SmartPool) y esperá a que disuelva con la bomba en marcha.",
  },
  {
    code: "E6",
    meaning: "Sensor de temperatura dentro del controlador no funciona",
    normal: "Sensor conectado y con lectura válida",
    solution: "Verificá la conexión del sensor de temperatura; si está bien conectado, reemplazalo.",
    manual: true,
  },
  {
    code: "E7",
    meaning: "Sensor de temperatura del agua no funciona",
    normal: "Sensor conectado y con lectura válida",
    solution: "Verificá la conexión del sensor de temperatura; si está bien conectado, reemplazalo.",
    manual: true,
  },
  {
    code: "E8",
    meaning: "Voltaje de entrada muy bajo o muy alto",
    normal: "Tensión de red dentro del rango del equipo",
    solution: "Revisá la instalación eléctrica y cambiá la fuente de alimentación si corresponde.",
    manual: true,
  },
  {
    code: "E9",
    meaning: "Potencia de salida demasiado alta",
    normal: "Salida dentro del rango del equipo",
    solution: "Contactá a tu distribuidor para reparar o sustituir el controlador.",
    manual: true,
  },
  {
    code: "EA",
    meaning: "Error del electrodo (celda)",
    normal: "Electrodo limpio y bien conectado",
    solution:
      "Verificá que el electrodo esté bien conectado y sin incrustaciones de calcio. Si el error sigue, cambiá el electrodo.",
    manual: true,
  },
  {
    code: "EB",
    meaning: "El chip de memoria no funciona",
    normal: "Memoria interna operativa",
    solution: "Contactá a tu distribuidor para reemplazar el chip de almacenamiento.",
    manual: true,
  },
  {
    code: "EC",
    meaning: "El sistema detector del circuito no funciona",
    normal: "Circuito de detección operativo",
    solution:
      "Apagá y volvé a encender. Si el error persiste, contactá al distribuidor para reparar o sustituir el controlador.",
    manual: true,
  },
];

export const CHLORINATOR_CODES: Record<ChlorinatorModel, ErrorCode[]> = {
  EC08: SHARED,
  EC12: SHARED,
};

/** Acepta "E4", "e4", "EC08 E4", "ec12-e5" y devuelve el código encontrado. */
export function findErrorCode(model: ChlorinatorModel, input: string): ErrorCode | null {
  const raw = input.toUpperCase().replace(/\s|-|_/g, "");
  const cleaned = raw.replace(/^EC0?8|^EC0?12|^EC12/, "");
  const list = CHLORINATOR_CODES[model];
  return (
    list.find((c) => c.code === cleaned) ??
    list.find((c) => c.code === raw) ??
    list.find((c) => cleaned.endsWith(c.code)) ??
    null
  );
}

export const MODEL_TARGET_SALINITY_PPM = 3500;
