export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  short_description: string | null;
  description: string | null;
  features: string[];
  specs: ProductSpec[];
  variants: string[];
  images: string[];
  currency: string;
  price: number;
  compare_price: number | null;
  installments: number | null;
  stock: number;
  shipping_info: string | null;
  warranty_info: string | null;
  active: boolean;
  featured: boolean;
  on_sale: boolean;
  is_new: boolean;
  sales_count: number;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
};

export type StoreSettings = {
  shipping_cost: number;
  free_shipping_threshold: number | null;
};

export const CATEGORIES = [
  { slug: "bombas-filtros", label: "Bombas y filtros" },
  { slug: "climatizacion", label: "Climatización" },
  { slug: "iluminacion", label: "Iluminación LED" },
  { slug: "quimicos", label: "Químicos y cloradores" },
  { slug: "limpieza", label: "Limpieza y mantenimiento" },
  { slug: "cobertores", label: "Cobertores y lonas" },
  { slug: "deck-bordes", label: "Deck y bordes" },
  { slug: "repuestos", label: "Repuestos" },
] as const;

export const categoryLabel = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export const DEPARTAMENTOS = [
  "Montevideo",
  "Canelones",
  "Maldonado",
  "Rocha",
  "Colonia",
  "San José",
  "Florida",
  "Lavalleja",
  "Durazno",
  "Flores",
  "Soriano",
  "Río Negro",
  "Paysandú",
  "Salto",
  "Artigas",
  "Rivera",
  "Tacuarembó",
  "Cerro Largo",
  "Treinta y Tres",
];

export const formatPrice = (value: number, currency = "USD") => {
  const n = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
  return currency === "UYU" ? `$ ${n}` : `US$ ${n}`;
};

export const discountPercent = (price: number, comparePrice: number | null) =>
  comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null;

export const ORDER_STATUSES = [
  "pendiente_de_pago",
  "pagado",
  "en_preparacion",
  "enviado",
  "entregado",
  "cancelado",
] as const;

export const statusLabel = (s: string) =>
  ({
    pendiente_de_pago: "Pendiente de pago",
    pagado: "Pagado",
    en_preparacion: "En preparación",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  })[s] ?? s;
