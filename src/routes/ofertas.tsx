import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";

import { SiteNav } from "@/components/shop/SiteNav";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { ProductCard } from "@/components/shop/ProductCard";
import { listProducts } from "@/lib/shop/products.functions";

const productsQuery = queryOptions({
  queryKey: ["shop", "products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/ofertas")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
  },
  head: () => ({
    meta: [
      { title: "Ofertas en accesorios de piscina | PoolHaus Uruguay" },
      {
        name: "description",
        content:
          "Aprovechá las ofertas de temporada en bombas, filtros, climatización e iluminación para piscinas. Stock limitado en Uruguay.",
      },
      { property: "og:title", content: "Ofertas en accesorios de piscina | PoolHaus Uruguay" },
      {
        property: "og:description",
        content: "Descuentos de temporada en accesorios y equipamiento para piscinas en Uruguay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ofertas en accesorios de piscina | PoolHaus Uruguay" },
      {
        name: "twitter:description",
        content: "Descuentos de temporada en accesorios para piscinas.",
      },
    ],
  }),
  component: OfertasPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-24 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-24 text-center">Sin ofertas activas.</div>,
});

function OfertasPage() {
  const { data } = useSuspenseQuery(productsQuery);
  const ofertas = data.products.filter(
    (p) => p.on_sale || (p.compare_price != null && p.compare_price > p.price),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section
        className="border-b border-primary/40 pt-24"
        style={{ background: "var(--gradient-violet)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            <Flame className="h-3.5 w-3.5" /> Ofertas de temporada
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Descuentos en accesorios para tu piscina
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            Stock limitado. Precios válidos hasta agotar unidades.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {ofertas.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="text-lg font-bold">Todavía no hay ofertas activas</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mirá todo el catálogo de accesorios disponibles.
            </p>
            <Link
              to="/accesorios"
              className="mt-5 inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Ver accesorios
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ofertas.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
