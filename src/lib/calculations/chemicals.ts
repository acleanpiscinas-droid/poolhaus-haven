/** Dosis calculadas por PoolHaus. Nunca sustituyen la etiqueta del fabricante. */

export const MANUFACTURER_NOTICE =
  "Si la etiqueta del producto utilizado indica una dosis diferente, prevalece la indicación del fabricante.";

/** Cloro shock base PoolHaus: 100 g cada 10.000 L → gramos = litros / 100 */
export const shockChlorineGrams = (liters: number): number => liters / 100;

/** kg de sal = litros × (objetivo ppm − actual ppm) / 1.000.000 */
export const saltKg = (liters: number, currentPpm: number, targetPpm: number): number =>
  (liters * (targetPpm - currentPpm)) / 1_000_000;

export type SaltResult =
  | { kind: "agregar"; kg: number }
  | { kind: "en-rango" }
  | { kind: "excedido"; kg: number };

export function evaluateSalt(liters: number, currentPpm: number, targetPpm: number): SaltResult {
  const kg = saltKg(liters, currentPpm, targetPpm);
  if (kg > 0.1) return { kind: "agregar", kg };
  if (kg < -0.1) return { kind: "excedido", kg: Math.abs(kg) };
  return { kind: "en-rango" };
}

export const RECOMMENDED_FILTRATION_HOURS = 8;
