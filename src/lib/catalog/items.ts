/** Índice unificado del catálogo para búsqueda, filtros, ordenamiento y carrito. */

import { EXTRAS, FILTRATION, HEAT_PUMPS, POOLS, ROBOTS } from "@/lib/catalog";

export const CATEGORIES = [
  "Piscinas",
  "Climatización",
  "Bombas y filtros",
  "Cloración salina",
  "Robots",
  "Accesorios",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type CatalogItem = {
  id: string;
  name: string;
  detail: string;
  category: Category;
  price: number | null;
  priceLabel: string;
  image?: string;
  search: string;
};

/** "US$ 10.690" -> 10690 · "Consultar" -> null */
export function parsePrice(label: string): number | null {
  const digits = label.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(/,/g, ".");
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) ? n : null;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function make(
  name: string,
  detail: string,
  category: Category,
  priceLabel: string,
  image?: string,
): CatalogItem {
  return {
    id: `${slug(category)}-${slug(name)}-${slug(detail) || "x"}`,
    name,
    detail,
    category,
    price: parsePrice(priceLabel),
    priceLabel,
    image,
    search: `${name} ${detail} ${category} ${priceLabel}`.toLowerCase(),
  };
}

const poolItems = POOLS.map((p) =>
  make(`Piscina ${p.name}`, `${p.size} · espejo ${p.mirror}`, "Piscinas", p.price, p.image),
);

const heatItems = HEAT_PUMPS.flatMap((spec) =>
  spec.rows.map((row) =>
    make(
      `${row[0]} ${row[1]}`,
      `${spec.title} · ${row[2]}`,
      "Climatización",
      row[3] ?? "Consultar",
      spec.image,
    ),
  ),
);

const filtrationItems = FILTRATION.flatMap((spec) => {
  const category: Category = spec.title.includes("Cloradores")
    ? "Cloración salina"
    : spec.title.includes("Accesorios")
      ? "Accesorios"
      : "Bombas y filtros";
  return spec.rows.map((row) => {
    const priceLabel = row[row.length - 1] ?? "Consultar";
    const name = row.length > 2 ? `${row[0]} ${row[1]}` : (row[0] ?? "");
    const detail = row.length > 3 ? `${spec.title} · ${row[2]}` : spec.title;
    return make(name, detail, category, priceLabel, spec.image);
  });
});

const robotItems = ROBOTS.map((r) =>
  make(r.name, "Robot limpiafondos", "Robots", r.price, r.image),
);

const extraItems = EXTRAS.map((e) =>
  make(e.name, e.detail, "Accesorios", e.unit ? `${e.price} / ${e.unit}` : e.price, e.image),
);

export const CATALOG_ITEMS: CatalogItem[] = [
  ...poolItems,
  ...heatItems,
  ...filtrationItems,
  ...robotItems,
  ...extraItems,
];

export type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevancia", label: "Orden del catálogo" },
  { key: "precio-asc", label: "Precio: menor a mayor" },
  { key: "precio-desc", label: "Precio: mayor a menor" },
  { key: "nombre", label: "Nombre A-Z" },
];

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function filterAndSort(opts: {
  query: string;
  categories: Category[];
  maxPrice: number | null;
  onlyWithPrice: boolean;
  sort: SortKey;
}): CatalogItem[] {
  const q = norm(opts.query.trim());
  let out = CATALOG_ITEMS.filter((i) => {
    if (q && !norm(i.search).includes(q)) return false;
    if (opts.categories.length > 0 && !opts.categories.includes(i.category)) return false;
    if (opts.onlyWithPrice && i.price == null) return false;
    if (opts.maxPrice != null && (i.price == null || i.price > opts.maxPrice)) return false;
    return true;
  });

  if (opts.sort === "nombre") out = [...out].sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (opts.sort === "precio-asc")
    out = [...out].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (opts.sort === "precio-desc")
    out = [...out].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  return out;
}

export const MAX_CATALOG_PRICE = CATALOG_ITEMS.reduce((m, i) => Math.max(m, i.price ?? 0), 0);
