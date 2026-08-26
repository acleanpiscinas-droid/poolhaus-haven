/** Catálogo comercial PoolHaus · Versión 1 (agosto 2026). Precios en USD. */

import cala from "@/assets/cat-img_p4_1.jpg.asset.json";
import bahia from "@/assets/cat-img_p4_2.jpg.asset.json";
import cavancha from "@/assets/cat-img_p5_1.jpg.asset.json";
import solanas from "@/assets/cat-img_p5_2.jpg.asset.json";
import aqua from "@/assets/cat-img_p6_1.jpg.asset.json";
import venecia from "@/assets/cat-img_p6_2.jpg.asset.json";
import cava from "@/assets/cat-img_p7_1.jpg.asset.json";
import bombaCalor from "@/assets/cat-img_p9_1.jpg.asset.json";
import filtro1 from "@/assets/cat-img_p11_1.jpg.asset.json";
import filtro2 from "@/assets/cat-img_p11_2.jpg.asset.json";
import clorador from "@/assets/cat-img_p12_1.jpg.asset.json";
import robot1 from "@/assets/cat-img_p12_2.jpg.asset.json";
import robot2 from "@/assets/cat-img_p13_1.jpg.asset.json";

export const CATALOG_VERSION = "Catálogo comercial · Versión 1 · Agosto 2026";

export const POOL_WARRANTY = "10 años de fábrica, sujeta a buena manipulación";

export type Pool = {
  name: string;
  size: string;
  mirror: string;
  depth: string;
  material: string;
  colors: string;
  includes: string;
  price: string;
  image: string;
};

export const POOLS: Pool[] = [
  {
    name: "Cala",
    size: "4 × 2 × 1,40 m",
    mirror: "3,70 × 2,70 m",
    depth: "1,30 m",
    material: "Consultar",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 2 luces, aspiración e inyector de calor",
    price: "Consultar",
    image: cala.url,
  },
  {
    name: "Bahía Inglesa",
    size: "5 × 3 m",
    mirror: "4,70 × 2,70 m",
    depth: "1,40 m",
    material: "Fibra de vidrio",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 2 luces, aspiración, 2 retornos direccionales e inyector de calor",
    price: "US$ 10.690",
    image: bahia.url,
  },
  {
    name: "Cavancha",
    size: "6 × 3 m",
    mirror: "5,70 × 2,70 m",
    depth: "1,50 m",
    material: "Fibra de vidrio",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 2 luces, aspiración, 2 retornos direccionales e inyector de calor",
    price: "US$ 10.890",
    image: cavancha.url,
  },
  {
    name: "Solanas",
    size: "7 × 3 m",
    mirror: "6,70 × 2,70 m",
    depth: "1,50 m",
    material: "Fibra de vidrio",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 2 luces, aspiración, 2 retornos direccionales e inyector de calor",
    price: "US$ 11.890",
    image: solanas.url,
  },
  {
    name: "Aqua Élité",
    size: "8 × 3 m",
    mirror: "7,70 × 2,70 m",
    depth: "1,50 m",
    material: "Fibra de vidrio",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 3 luces, aspiración, 2 retornos direccionales e inyector de calor",
    price: "US$ 12.990",
    image: aqua.url,
  },
  {
    name: "Venecia",
    size: "9,20 × 4 m",
    mirror: "8,85 × 3,70 m",
    depth: "1,50 m",
    material: "Fibra de vidrio",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 3 luces, aspiración, 2 retornos direccionales e inyector de calor",
    price: "US$ 13.990",
    image: venecia.url,
  },
  {
    name: "Cava",
    size: "10,5 × 4 m",
    mirror: "10,30 × 3,70 m",
    depth: "1,50 m",
    material: "Fibra de vidrio",
    colors: "Blanco, arena, celeste",
    includes: "Skimmer, 3 luces, aspiración, 2 retornos direccionales e inyector de calor",
    price: "US$ 14.890",
    image: cava.url,
  },
];

export const POOLS_NOTE =
  "Fabricación en 8 días. Modelos en fibra de vidrio, forma rectangular.";

export type TableSpec = {
  title: string;
  note?: string;
  columns: string[];
  rows: string[][];
  image?: string;
};

export const HEAT_PUMPS: TableSpec[] = [
  {
    title: "Línea Inverter",
    columns: ["Modelo", "Potencia", "Rango de aplicación", "Precio", "Garantía"],
    rows: [
      ["Veico Inverter", "7 kW", "hasta 20.000 L (20 m³)", "US$ 990", "12 meses"],
      ["Airway Inverter", "9 kW", "hasta 45.000 L (40 m³)", "US$ 1.199", "12 meses"],
      ["Visión Inverter", "17 kW", "Consultar", "US$ 2.200", "1 año"],
      ["Veico Inverter", "24 kW", "Consultar", "US$ 3.490", "1 año"],
    ],
    image: bombaCalor.url,
    note: "Alimentación eléctrica, COP, dimensiones y nivel de ruido: consultar. Entrega junto con la piscina, o en 48 horas si se compra por separado.",
  },
  {
    title: "Línea ON/OFF",
    columns: ["Modelo", "Potencia", "Rango de aplicación", "Precio", "Garantía"],
    rows: [["Airway ON/OFF", "15,5 kW", "Consultar", "US$ 1.800", "1 año"]],
  },
];

export const FILTRATION: TableSpec[] = [
  {
    title: "Bombas de circulación Vulcano",
    columns: ["Modelo", "Potencia", "Precio", "Garantía"],
    rows: [
      ["Vulcano", "1/2 HP", "US$ 270", "6 meses"],
      ["Vulcano", "3/4 HP", "US$ 320", "Consultar"],
      ["Vulcano", "1 HP", "US$ 360", "Consultar"],
      ["Vulcano", "2 HP", "US$ 540", "Consultar"],
    ],
    image: filtro1.url,
  },
  {
    title: "Filtros de arena",
    columns: ["Modelo", "Marca", "Precio"],
    rows: [
      ["VC30", "Vulcano", "US$ 180"],
      ["VC40", "Veico", "US$ 200"],
      ["VC50", "Vulcano", "US$ 250"],
      ["VC60", "Veico", "US$ 290"],
    ],
    image: filtro2.url,
  },
  {
    title: "Cloradores salinos Mypool",
    columns: ["Modelo", "Producción", "Rango de aplicación", "Precio"],
    rows: [
      ["Mypool", "8 g/h", "Consultar", "US$ 490"],
      ["Mypool", "12 g/h", "Consultar", "US$ 520"],
      ["Mypool", "16 g/h", "Consultar", "US$ 610"],
      ["Mypool", "20 g/h", "Consultar", "US$ 690"],
    ],
    image: clorador.url,
  },
  {
    title: "Accesorios sueltos",
    columns: ["Producto", "Precio"],
    rows: [
      ["Adhesivo PVC Tigre", "US$ 18"],
      ["Sal para piscinas", "US$ 16"],
      ["Arena de filtro", "US$ 16"],
    ],
    note: "Mantas térmicas, enrolladores, módulos habitacionales e instalación: consultanos por WhatsApp.",
  },
];

export type Robot = {
  name: string;
  specs: [string, string][];
  price: string;
  image: string;
};

export const ROBOTS: Robot[] = [
  {
    name: "Zodiac OP32",
    specs: [
      ["Piscina compatible", "Consultar"],
      ["Alimentación", "A batería"],
      ["Ciclo de limpieza", "2 horas"],
      ["Garantía", "1 año"],
      ["Entrega", "48 horas"],
    ],
    price: "US$ 790",
    image: robot1.url,
  },
  {
    name: "Zodiac Tornax GT3220",
    specs: [
      ["Piscina compatible", "Consultar"],
      ["Alimentación", "Consultar"],
      ["Ciclo de limpieza", "Consultar"],
      ["Garantía", "Consultar"],
    ],
    price: "US$ 1.200",
    image: robot2.url,
  },
];

export const ROBOTS_NOTE =
  "Limpiafondos manuales: línea en evaluación, sin modelos confirmados por el momento.";
