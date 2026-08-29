/**
 * Cálculos de volumen del espejo de agua.
 * Todas las medidas en metros. Resultado en litros.
 */

/** El espejo de agua mide 30 cm menos que el casco en cada lado (ej.: 7 × 3 → 6,70 × 2,70). */
export const MIRROR_OFFSET_M = 0.3;

export const mirrorFromShell = (m: number): number =>
  Number.isFinite(m) ? Math.max(m - MIRROR_OFFSET_M, 0) : NaN;

export const formatMeters = (m: number): string =>
  `${m.toLocaleString("es-UY", { maximumFractionDigits: 2 })} m`;

export type DepthInput =
  | { mode: "uniforme"; depth: number }
  | { mode: "variable"; minDepth: number; maxDepth: number };

export const averageDepth = (min: number, max: number): number => (min + max) / 2;

export const resolveDepth = (input: DepthInput): number =>
  input.mode === "uniforme" ? input.depth : averageDepth(input.minDepth, input.maxDepth);

/** litros = largo × ancho × profundidad × 1000 */
export const litersFromDimensions = (length: number, width: number, depth: number): number =>
  length * width * depth * 1000;

export const litersFromInput = (length: number, width: number, depth: DepthInput): number =>
  litersFromDimensions(length, width, resolveDepth(depth));

export const formatLiters = (liters: number): string =>
  `${Math.round(liters).toLocaleString("es-UY")} L`;

export const formatGrams = (grams: number): string =>
  `${Math.round(grams).toLocaleString("es-UY")} g`;

export const formatKg = (kg: number): string =>
  `${kg.toLocaleString("es-UY", { maximumFractionDigits: 1 })} kg`;
