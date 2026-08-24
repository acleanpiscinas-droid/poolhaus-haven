import type { ParameterKey } from "@/lib/pool-parameters";

export type DiagnosisId =
  | "agua-verde"
  | "agua-turbia"
  | "agua-lechosa"
  | "algas-mostaza"
  | "ph-alto"
  | "ph-bajo"
  | "cloro-bajo"
  | "agua-marron"
  | "olor-cloro"
  | "espuma"
  | "algas-paredes"
  | "filtracion"
  | "salinidad"
  | "error-clorador"
  | "no-se";

export type Diagnosis = {
  id: DiagnosisId;
  emoji: string;
  label: string;
  summary: string;
  /** Solo los parámetros necesarios para este diagnóstico. */
  parameters: ParameterKey[];
  /** Protocolo detallado disponible (paso a paso). */
  protocol?: "agua-verde";
  /** Herramienta especial asociada. */
  tool?: "sal" | "clorador";
  /** Guía general cuando aún no hay protocolo completo definido. */
  guidance?: string[];
};

export const DIAGNOSES: Diagnosis[] = [
  {
    id: "agua-verde",
    emoji: "🟢",
    label: "Agua verde",
    summary: "Presencia de algas. Protocolo completo PoolHaus de 7 pasos.",
    parameters: ["ph", "cloroLibre"],
    protocol: "agua-verde",
  },
  {
    id: "agua-turbia",
    emoji: "⚪",
    label: "Agua turbia",
    summary: "Partículas en suspensión o filtración insuficiente.",
    parameters: ["ph", "cloroLibre"],
    guidance: [
      "Verificá el pH y llevalo al objetivo PoolHaus (7,4).",
      "Cepillá paredes y fondo, y limpiá el prefiltro y la canasta del skimmer.",
      "Aumentá la filtración (aproximadamente 8 horas) y realizá retrolavado si tu filtro lo permite.",
      "Si continúa turbia, usá floculante siguiendo exactamente las instrucciones del fabricante, decantá y aspirá a desagote.",
    ],
  },
  {
    id: "agua-lechosa",
    emoji: "🥛",
    label: "Agua blanca / lechosa",
    summary: "Suele relacionarse con desequilibrio de pH, alcalinidad o dureza.",
    parameters: ["ph", "alcalinidad", "durezaCalcica"],
    guidance: [
      "Medí pH, alcalinidad total y dureza cálcica antes de agregar productos.",
      "Corregí primero el pH hasta 7,4 según las indicaciones del fabricante.",
      "Ajustá alcalinidad y dureza solo con las dosis indicadas en la etiqueta de cada producto.",
      "Filtrá de forma continua y controlá el estado del medio filtrante.",
    ],
  },
  {
    id: "algas-mostaza",
    emoji: "🟡",
    label: "Algas mostaza",
    summary: "Algas resistentes, adheridas en zonas de sombra.",
    parameters: ["ph", "cloroLibre", "acidoCianurico"],
    guidance: [
      "Cepillado intensivo de paredes, fondo, escalones y rincones.",
      "Corregí el pH a 7,4 antes de clorar.",
      "Aplicá cloro shock según el cálculo de tu volumen y la etiqueta del producto.",
      "Filtrá de forma prolongada, aspirá y desinfectá accesorios y elementos de limpieza.",
    ],
  },
  {
    id: "ph-alto",
    emoji: "🔴",
    label: "pH alto",
    summary: "Por encima del rango operativo 7,0 – 7,6.",
    parameters: ["ph", "alcalinidad"],
    guidance: [
      "Objetivo PoolHaus: pH 7,4.",
      "Usá reductor de pH respetando la dosis de la etiqueta del fabricante.",
      "Agregá con la filtración en marcha y volvé a medir después de la recirculación.",
    ],
  },
  {
    id: "ph-bajo",
    emoji: "🔵",
    label: "pH bajo",
    summary: "Por debajo del rango operativo 7,0 – 7,6.",
    parameters: ["ph", "alcalinidad"],
    guidance: [
      "Objetivo PoolHaus: pH 7,4.",
      "Usá elevador de pH respetando la dosis de la etiqueta del fabricante.",
      "Revisá la alcalinidad total: un valor bajo hace que el pH sea inestable.",
    ],
  },
  {
    id: "cloro-bajo",
    emoji: "🧪",
    label: "Cloro bajo",
    summary: "Desinfección insuficiente: riesgo de algas.",
    parameters: ["ph", "cloroLibre", "acidoCianurico"],
    guidance: [
      "Corregí el pH a 7,4: con pH alto el cloro pierde eficacia.",
      "Usá el cálculo de cloro shock según tu volumen como referencia y respetá la etiqueta del producto.",
      "Si el ácido cianúrico está muy alto, el cloro se bloquea: consultá con PoolHaus antes de seguir dosificando.",
    ],
  },
  {
    id: "agua-marron",
    emoji: "🟤",
    label: "Agua marrón",
    summary: "Suele indicar hierro/metales o mucha materia orgánica.",
    parameters: ["ph", "cloroLibre"],
    guidance: [
      "No agregues cloro shock a ciegas si sospechás presencia de metales: puede fijar la mancha.",
      "Medí pH y cloro libre y registrá el origen del agua (pozo, canilla, lluvia).",
      "Consultá a PoolHaus por WhatsApp con estos datos para definir el tratamiento correcto.",
    ],
  },
  {
    id: "olor-cloro",
    emoji: "👃",
    label: "Olor fuerte a cloro",
    summary: "Indica cloraminas (cloro combinado), no exceso de cloro.",
    parameters: ["cloroLibre", "cloroCombinado", "ph"],
    guidance: [
      "El olor fuerte casi siempre significa cloro combinado alto, no cloro libre alto.",
      "Corregí el pH a 7,4 y aplicá cloro shock según el cálculo de volumen y la etiqueta.",
      "Filtrá de forma prolongada y renová parte del agua si el cloro combinado no baja.",
    ],
  },
  {
    id: "espuma",
    emoji: "🫧",
    label: "Espuma",
    summary: "Restos de productos, aceites o algicidas espumantes.",
    parameters: ["ph"],
    guidance: [
      "Suspendé el uso de algicidas espumantes y productos no específicos para piscinas.",
      "Limpiá la línea de agua y los skimmers.",
      "Filtrá de forma continua; si persiste, renová parte del agua.",
    ],
  },
  {
    id: "algas-paredes",
    emoji: "🧱",
    label: "Algas en paredes o fondo",
    summary: "Adherencia localizada de algas.",
    parameters: ["ph", "cloroLibre"],
    protocol: "agua-verde",
  },
  {
    id: "filtracion",
    emoji: "🔄",
    label: "Problemas de filtración",
    summary: "Caudal bajo, presión alta o retorno débil.",
    parameters: [],
    guidance: [
      "Limpiá canasta del skimmer y prefiltro de la bomba.",
      "Verificá la presión del manómetro y realizá retrolavado si corresponde a tu tipo de filtro.",
      "Controlá que no haya aire en el sistema y que las válvulas estén en la posición correcta.",
      "Si la presión no se normaliza, escribinos: puede requerir cambio de medio filtrante o service.",
    ],
  },
  {
    id: "salinidad",
    emoji: "🧂",
    label: "Problemas de salinidad",
    summary: "Calculadora de sal según la especificación de tu clorador.",
    parameters: ["salinidad"],
    tool: "sal",
  },
  {
    id: "error-clorador",
    emoji: "⚙️",
    label: "Error del clorador",
    summary: "Códigos como EC08 o EC012 según marca y modelo.",
    parameters: ["salinidad"],
    tool: "clorador",
  },
  {
    id: "no-se",
    emoji: "❓",
    label: "No sé qué le pasa",
    summary: "Registramos tus datos y te ayudamos por WhatsApp.",
    parameters: ["ph", "cloroLibre"],
    guidance: [
      "Medí al menos pH y cloro libre.",
      "Cepillá y filtrá aproximadamente 8 horas antes de agregar cualquier producto.",
      "Envianos el diagnóstico por WhatsApp y te orientamos con tu caso puntual.",
    ],
  },
];

export const getDiagnosis = (id: DiagnosisId): Diagnosis =>
  DIAGNOSES.find((d) => d.id === id) ?? DIAGNOSES[DIAGNOSES.length - 1]!;
