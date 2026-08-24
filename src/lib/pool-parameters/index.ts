/** Parámetros de agua de PoolHaus SmartPool. */

export type ParameterKey =
  | "ph"
  | "cloroLibre"
  | "cloroCombinado"
  | "alcalinidad"
  | "durezaCalcica"
  | "acidoCianurico"
  | "salinidad"
  | "temperatura";

export type ParameterDef = {
  key: ParameterKey;
  label: string;
  unit: string;
  placeholder: string;
  help?: string;
};

export const PH_TARGET = 7.4;
export const PH_RANGE = { min: 7.0, max: 7.6 } as const;

export type PhStatus = "bajo" | "ideal" | "alto" | "operativo";

export type PhReading = {
  status: PhStatus;
  label: string;
  advice: string;
};

export function classifyPh(ph: number): PhReading {
  if (ph < PH_RANGE.min) {
    return {
      status: "bajo",
      label: "Ácido / bajo",
      advice:
        "El pH está por debajo del rango operativo (7,0 – 7,6). Corregí hasta 7,4 siguiendo las instrucciones del fabricante del producto elevador de pH.",
    };
  }
  if (ph > PH_RANGE.max) {
    return {
      status: "alto",
      label: "Alcalino / alto",
      advice:
        "El pH está por encima del rango operativo (7,0 – 7,6). Bajalo hasta 7,4 siguiendo las instrucciones del fabricante del reductor de pH.",
    };
  }
  if (Math.abs(ph - PH_TARGET) < 0.05) {
    return {
      status: "ideal",
      label: "Ideal PoolHaus",
      advice: "pH en el objetivo PoolHaus (7,4). Mantené el control periódico.",
    };
  }
  return {
    status: "operativo",
    label: "Dentro del rango operativo",
    advice: "Está dentro de 7,0 – 7,6. El objetivo PoolHaus es 7,4.",
  };
}

export const PARAMETERS: Record<ParameterKey, ParameterDef> = {
  ph: { key: "ph", label: "pH", unit: "", placeholder: "7.4", help: "Objetivo PoolHaus: 7,4" },
  cloroLibre: { key: "cloroLibre", label: "Cloro libre", unit: "ppm", placeholder: "1.5" },
  cloroCombinado: { key: "cloroCombinado", label: "Cloro combinado", unit: "ppm", placeholder: "0.2" },
  alcalinidad: { key: "alcalinidad", label: "Alcalinidad total", unit: "ppm", placeholder: "100" },
  durezaCalcica: { key: "durezaCalcica", label: "Dureza cálcica", unit: "ppm", placeholder: "250" },
  acidoCianurico: { key: "acidoCianurico", label: "Ácido cianúrico", unit: "ppm", placeholder: "40" },
  salinidad: {
    key: "salinidad",
    label: "Salinidad",
    unit: "ppm",
    placeholder: "3000",
    help: "El valor objetivo lo define el fabricante de tu clorador.",
  },
  temperatura: { key: "temperatura", label: "Temperatura", unit: "°C", placeholder: "26" },
};
