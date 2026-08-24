import { evaluateSalt, type SaltResult } from "@/lib/calculations/chemicals";

export const CHLORINATOR_DISCLAIMER =
  "El significado del código puede variar según el fabricante y modelo. Consultá el manual específico del equipo.";

export const NO_TARGET_SALINITY_MESSAGE =
  "Consultá la especificación de tu clorador antes de agregar sal.";

/** Códigos iniciales soportados. Sin marca/modelo no se asume su significado. */
export const KNOWN_CODES = ["EC08", "EC012"] as const;
export type KnownCode = (typeof KNOWN_CODES)[number];

export type ChlorinatorInput = {
  brand: string;
  model: string;
  code: string;
  liters: number;
  currentPpm: number | null;
  targetPpm: number | null;
};

export type ChlorinatorResult = {
  needsSpec: boolean;
  message: string;
  salt: SaltResult | null;
  disclaimer: string;
};

export function analyzeChlorinator(input: ChlorinatorInput): ChlorinatorResult {
  const identified = input.brand.trim() !== "" && input.model.trim() !== "";
  const base = identified
    ? `Código ${input.code || "—"} en ${input.brand} ${input.model}.`
    : `Ingresá marca y modelo: el código ${input.code || "—"} no significa lo mismo en todos los equipos.`;

  if (input.currentPpm == null || input.targetPpm == null) {
    return {
      needsSpec: true,
      message: `${base} Necesitamos la salinidad actual y la salinidad objetivo del fabricante para calcular sal. ${NO_TARGET_SALINITY_MESSAGE}`,
      salt: null,
      disclaimer: CHLORINATOR_DISCLAIMER,
    };
  }

  const salt = evaluateSalt(input.liters, input.currentPpm, input.targetPpm);
  const message =
    salt.kind === "agregar"
      ? `${base} La salinidad está por debajo del objetivo del fabricante: calculamos la sal necesaria.`
      : salt.kind === "en-rango"
        ? `${base} La salinidad ya está en el objetivo indicado: no agregues más sal.`
        : `${base} La salinidad está por encima del objetivo: no agregues sal. Corregí diluyendo con agua.`;

  return { needsSpec: false, message, salt, disclaimer: CHLORINATOR_DISCLAIMER };
}
