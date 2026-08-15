import type { Product, ProductSpec } from "./types";

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

const asSpecs = (v: unknown): ProductSpec[] =>
  Array.isArray(v)
    ? v
        .filter((x): x is { label?: unknown; value?: unknown } => !!x && typeof x === "object")
        .map((x) => ({ label: String(x.label ?? ""), value: String(x.value ?? "") }))
        .filter((s) => s.label || s.value)
    : [];

export function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row["id"]),
    slug: String(row["slug"]),
    name: String(row["name"]),
    brand: (row["brand"] as string | null) ?? null,
    category: String(row["category"]),
    short_description: (row["short_description"] as string | null) ?? null,
    description: (row["description"] as string | null) ?? null,
    features: asStringArray(row["features"]),
    specs: asSpecs(row["specs"]),
    variants: asStringArray(row["variants"]),
    images: asStringArray(row["images"]),
    currency: String(row["currency"] ?? "USD"),
    price: Number(row["price"] ?? 0),
    compare_price: row["compare_price"] == null ? null : Number(row["compare_price"]),
    installments: row["installments"] == null ? null : Number(row["installments"]),
    stock: Number(row["stock"] ?? 0),
    shipping_info: (row["shipping_info"] as string | null) ?? null,
    warranty_info: (row["warranty_info"] as string | null) ?? null,
    active: Boolean(row["active"]),
    featured: Boolean(row["featured"]),
    on_sale: Boolean(row["on_sale"]),
    is_new: Boolean(row["is_new"]),
    sales_count: Number(row["sales_count"] ?? 0),
    sort_order: Number(row["sort_order"] ?? 0),
    meta_title: (row["meta_title"] as string | null) ?? null,
    meta_description: (row["meta_description"] as string | null) ?? null,
  };
}
