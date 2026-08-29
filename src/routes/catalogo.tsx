import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Waves, Flame, Filter, Bot } from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { CatalogFinder } from "@/components/site/CatalogFinder";
import { useCart } from "@/lib/cart";
import { CATALOG_ITEMS } from "@/lib/catalog/items";
import { waLink } from "@/lib/contact";
import {
  CATALOG_VERSION,
  FILTRATION,
  HEAT_PUMPS,
  POOLS,
  POOLS_NOTE,
  POOL_WARRANTY,
  ROBOTS,
  ROBOTS_NOTE,
  type TableSpec,
} from "@/lib/catalog";

const TITLE = "Catálogo PoolHaus · Piscinas, climatización y equipamiento";
const DESCRIPTION =
  "Catálogo comercial PoolHaus Uruguay: piscinas de fibra de vidrio de 4 a 10,5 m, bombas de calor, filtración, cloración salina, robots limpiafondos y accesorios con precios.";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalogo,
});

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  desc,
}: {
  icon: typeof Waves;
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-8">
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <Icon className="h-4 w-4" /> {eyebrow}
      </span>
      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      {desc && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

function SpecTable({ spec }: { spec: TableSpec }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {spec.image && (
        <div className="aspect-[16/9] overflow-hidden border-b border-border/60">
          <img src={spec.image} alt={spec.title} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-bold">{spec.title}</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
                {spec.columns.map((c) => (
                  <th key={c} className="whitespace-nowrap py-2 pr-4 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spec.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`whitespace-nowrap py-2.5 pr-4 ${
                        j === row.length - 1 ? "font-bold text-primary" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {spec.note && <p className="mt-4 text-xs text-muted-foreground">{spec.note}</p>}
      </div>
    </div>
  );
}

function AddToCartButton({ itemName, label }: { itemName: string; label: string }) {
  const { add, setOpen } = useCart();
  const item = CATALOG_ITEMS.find((i) => i.name === itemName);
  if (!item) return null;
  return (
    <button
      type="button"
      onClick={() => {
        add({
          id: item.id,
          name: item.name,
          detail: item.detail,
          price: item.price,
          priceLabel: item.priceLabel,
          image: item.image,
        });
        setOpen(true);
      }}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/60 px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary/10"
    >
      <ShoppingCart className="h-4 w-4" /> {label}
    </button>
  );
}

function Catalogo() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="border-b border-border/50 pb-14 pt-28">
        <div className="mx-auto max-w-6xl px-4">
          <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary-foreground">
            {CATALOG_VERSION}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            Piscinas y soluciones para{" "}
            <span className="bg-gradient-to-r from-primary to-[oklch(0.75_0.2_295)] bg-clip-text text-transparent">
              disfrutar tu espacio
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Diseñamos, fabricamos y equipamos piscinas de fibra de vidrio, con climatización,
            filtración y accesorios para que tu espacio esté listo todo el año.
          </p>
          <a
            href={waLink("Hola PoolHaus, vi el catálogo y quiero un presupuesto.")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-violet)] transition hover:opacity-95"
          >
            <MessageCircle className="h-5 w-5" /> Pedir presupuesto
          </a>
        </div>
      </section>

      {/* PISCINAS */}
      <section id="piscinas" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle icon={Waves} eyebrow="01 · Piscinas" title="Modelos disponibles" desc={POOLS_NOTE} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POOLS.map((p) => (
              <article
                key={p.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/60"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={`Piscina PoolHaus modelo ${p.name} de ${p.size}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-2xl font-bold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.size}</p>
                  <dl className="mt-4 space-y-1.5 text-sm">
                    {[
                      ["Espejo de agua", p.mirror],
                      ["Profundidad", p.depth],
                      ["Material", p.material],
                      ["Colores", p.colors],
                      ["Incluye", p.includes],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">{k}:</dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                    Garantía {POOL_WARRANTY}
                  </p>
                  <div className="mt-auto pt-5">
                    <p className="text-2xl font-black text-primary">{p.price}</p>
                    <a
                      href={waLink(`Hola PoolHaus, quiero cotizar la piscina ${p.name} (${p.size}).`)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" /> Cotizar {p.name}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLIMATIZACIÓN */}
      <section id="climatizacion" className="border-t border-border/50 bg-secondary/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            icon={Flame}
            eyebrow="02 · Climatización"
            title="Bombas de calor"
            desc="Líneas Inverter y ON/OFF para climatizar tu piscina todo el año."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {HEAT_PUMPS.map((s) => (
              <SpecTable key={s.title} spec={s} />
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPAMIENTO */}
      <section id="equipamiento" className="border-t border-border/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            icon={Filter}
            eyebrow="03 · Equipamiento"
            title="Filtración, cloración y accesorios"
            desc="Bombas de circulación, filtros de arena, cloradores salinos y consumibles."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {FILTRATION.map((s) => (
              <SpecTable key={s.title} spec={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ROBOTS */}
      <section id="robots" className="border-t border-border/50 bg-secondary/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle icon={Bot} eyebrow="04 · Limpieza" title="Robots limpiafondos" desc={ROBOTS_NOTE} />
          <div className="grid gap-6 md:grid-cols-2">
            {ROBOTS.map((r) => (
              <article key={r.name} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={r.image}
                    alt={`Robot limpiafondos ${r.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{r.name}</h3>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    {r.specs.map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">{k}:</dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-2xl font-black text-primary">{r.price}</p>
                  <a
                    href={waLink(`Hola PoolHaus, quiero cotizar el robot ${r.name}.`)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> Cotizar
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="border-y border-primary/40 py-16"
        style={{ background: "var(--gradient-violet)" }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Solicitá tu presupuesto
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/90">
            Te ayudamos a elegir la piscina, climatización y equipamiento ideal para tu espacio.
          </p>
          <a
            href={waLink("Hola PoolHaus, quiero asesoramiento sobre el catálogo.")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-4 text-base font-bold text-white transition hover:bg-black/80"
          >
            <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
          </a>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-muted-foreground">
        Precios de referencia en dólares, sujetos a cambios sin previo aviso. {CATALOG_VERSION}.
      </footer>
    </div>
  );
}
