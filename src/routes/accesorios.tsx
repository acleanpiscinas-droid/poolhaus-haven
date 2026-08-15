import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, MessageCircle } from "lucide-react";

import { SiteNav } from "@/components/shop/SiteNav";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { ProductCard } from "@/components/shop/ProductCard";
import { listProducts } from "@/lib/shop/products.functions";
import { CATEGORIES, categoryLabel, type Product } from "@/lib/shop/types";
import { waLink } from "@/lib/contact";

const productsQuery = queryOptions({
  queryKey: ["shop", "products"],
  queryFn: () => listProducts(),
});

type SearchParams = { cat?: string; orden?: string; q?: string };

export const Route = createFileRoute("/accesorios")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    cat: typeof search["cat"] === "string" ? search["cat"] : undefined,
    orden: typeof search["orden"] === "string" ? search["orden"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
  },
  head: () => ({
    meta: [
      { title: "Accesorios para piscinas en Uruguay | Tienda PoolHaus" },
      {
        name: "description",
        content:
          "Comprá online bombas, filtros, climatización, iluminación LED, químicos y limpieza para tu piscina. Envíos en todo Uruguay y pago con Mercado Pago.",
      },
      { property: "og:title", content: "Accesorios para piscinas en Uruguay | Tienda PoolHaus" },
      {
        property: "og:description",
        content:
          "Tienda online de accesorios para piscinas: bombas, filtros, climatización, iluminación, químicos y más.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Accesorios para piscinas en Uruguay | Tienda PoolHaus" },
      {
        name: "twitter:description",
        content: "Bombas, filtros, climatización, iluminación y químicos para tu piscina.",
      },
    ],
  }),
  component: AccesoriosPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-24 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-24 text-center">Sin resultados.</div>,
});

const ORDERS = [
  { value: "destacados", label: "Destacados" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "vendidos", label: "Más vendidos" },
];

export function sortProducts(list: Product[], orden: string | undefined) {
  const arr = [...list];
  switch (orden) {
    case "precio-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "vendidos":
      return arr.sort((a, b) => b.sales_count - a.sales_count);
    default:
      return arr.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order,
      );
  }
}

function AccesoriosPage() {
  const { cat, orden, q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data } = useSuspenseQuery(productsQuery);

  const filtered = sortProducts(
    data.products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (q) {
        const needle = q.toLowerCase();
        const haystack = `${p.name} ${p.brand ?? ""} ${p.short_description ?? ""}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    }),
    orden,
  );

  const setSearch = (patch: SearchParams) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="border-b border-border/50 pt-24">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tienda online
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Accesorios para piscinas
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Todo lo que necesitás para equipar y mantener tu piscina. Envíos en todo Uruguay y
            asesoramiento directo por WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* FILTROS */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Categorías
              </div>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
                <button
                  type="button"
                  onClick={() => setSearch({ cat: undefined })}
                  className={`rounded-full border px-3 py-1.5 text-left text-sm transition lg:rounded-lg ${
                    !cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSearch({ cat: c.slug })}
                    className={`rounded-full border px-3 py-1.5 text-left text-sm transition lg:rounded-lg ${
                      cat === c.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <a
              href={waLink("Hola PoolHaus, necesito asesoramiento con accesorios para mi piscina.")}
              className="mt-4 hidden w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary/20 lg:inline-flex"
            >
              <MessageCircle className="h-4 w-4 text-primary" /> Asesorate por WhatsApp
            </a>
          </aside>

          {/* LISTA */}
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q ?? ""}
                  onChange={(e) => setSearch({ q: e.target.value || undefined })}
                  placeholder="Buscar producto o marca"
                  className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <select
                value={orden ?? "destacados"}
                onChange={(e) => setSearch({ orden: e.target.value })}
                className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                {ORDERS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {filtered.length} producto{filtered.length === 1 ? "" : "s"}
              {cat ? ` en ${categoryLabel(cat)}` : ""}
            </p>

            {filtered.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
                <h2 className="text-lg font-bold">Todavía no hay productos en esta sección</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Escribinos y te cotizamos el accesorio que necesitás.
                </p>
                <a
                  href={waLink("Hola PoolHaus, busco un accesorio para mi piscina.")}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
                </a>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-6 text-center">
              <h2 className="text-xl font-bold">¿Querés una piscina o un módulo 6x3?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Instalación completa en todo Uruguay, llave en mano.
              </p>
              <Link
                to="/"
                hash="modelos"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:border-primary"
              >
                Ver piscinas y módulos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
