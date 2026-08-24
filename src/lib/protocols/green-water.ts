import { MANUFACTURER_NOTICE, RECOMMENDED_FILTRATION_HOURS, shockChlorineGrams } from "@/lib/calculations/chemicals";
import { formatGrams } from "@/lib/calculations/volume";
import { PH_TARGET } from "@/lib/pool-parameters";

export type ProtocolStep = {
  n: number;
  title: string;
  body: string[];
  notice?: string;
  /** Pregunta de confirmación (paso con decisión). */
  question?: { text: string; yes: string; no: string };
};

export type GreenWaterContext = { liters: number; ph?: number };

export function buildGreenWaterProtocol({ liters, ph }: GreenWaterContext): ProtocolStep[] {
  const grams = shockChlorineGrams(liters);
  const phHigh = typeof ph === "number" && ph > PH_TARGET;

  return [
    {
      n: 1,
      title: "Cepillar",
      body: ["Comenzá cepillando paredes, fondo, escalones y rincones."],
    },
    {
      n: 2,
      title: "Bajar pH",
      body: [
        `Objetivo: pH ${PH_TARGET.toLocaleString("es-UY")}.`,
        phHigh
          ? "Tu pH está alto: primero corregí el pH hasta 7,4."
          : "Si está alto: primero corregí el pH hasta 7,4.",
        "Usá el reductor de pH siguiendo las instrucciones del fabricante.",
      ],
      notice: "PoolHaus no define dosis de reductor de pH: seguí la etiqueta del producto.",
    },
    {
      n: 3,
      title: "Cloro shock",
      body: [
        "Dosis base PoolHaus: 100 g cada 10.000 L.",
        `Tu volumen: ${Math.round(liters).toLocaleString("es-UY")} L`,
        `Dosis calculada: ${formatGrams(grams)} aproximadamente.`,
      ],
      notice: MANUFACTURER_NOTICE,
    },
    {
      n: 4,
      title: "Filtración",
      body: [`Filtrá aproximadamente ${RECOMMENDED_FILTRATION_HOURS} horas.`],
    },
    {
      n: 5,
      title: "Floculante",
      body: [
        "Si el agua continúa turbia, utilizá floculante siguiendo exactamente las instrucciones del fabricante.",
      ],
      notice: "PoolHaus no define dosis de floculante.",
    },
    {
      n: 6,
      title: "Decantación",
      body: [
        "Apagá el sistema.",
        "Dejá actuar hasta el día siguiente según las instrucciones del producto.",
      ],
    },
    {
      n: 7,
      title: "Aspirado",
      body: [],
      question: {
        text: "¿La suciedad quedó claramente decantada y se ve en el fondo?",
        yes: "Aspirá a desagote (no a filtro) para retirar la suciedad decantada.",
        no: "Volvé a evaluar: repetí decantación o revisá el paso anterior antes de aspirar.",
      },
    },
    {
      n: 8,
      title: "Control final",
      body: ["Medí pH.", "Medí cloro libre.", "Verificá el aspecto del agua."],
    },
  ];
}
