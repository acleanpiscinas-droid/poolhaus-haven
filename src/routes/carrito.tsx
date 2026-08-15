import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingCart, ArrowRight, ImageOff } from "lucide-react";

import { SiteNav } from "@/components/shop/SiteNav";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { useCart } from "@/lib/shop/cart";
import { formatPrice } from "@/lib/shop/types";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Tu carrito | Tienda PoolHaus Uruguay" },
      {
        name: "description",
        content:
          "Revisá los accesorios para piscina que agregaste y finalizá tu compra con Mercado Pago.",
      },
      { property: "og:title", content: "Tu carrito | Tienda PoolHaus Uruguay" },
      {
        property: "og:description",
        content: "Revisá tu pedido de accesorios para piscina y finalizá la compra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tu carrito | Tienda PoolHaus Uruguay" },
      { name: "twitter:description", content: "Revisá tu pedido y finalizá la compra." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CarritoPage,
});

function CarritoPage() {
  const { items, subtotal, currency, setQuantity, remove } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28">
        <h1 className="text-3xl font-black tracking-tight">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-bold">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Descubrí los accesorios para equipar tu piscina.
            </p>
            <Link
              to="/accesorios"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Ver accesorios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variant ?? ""}`}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary/40">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      to="/producto/$slug"
                      params={{ slug: item.slug }}
                      className="text-sm font-bold hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Restar"
                          onClick={() =>
                            setQuantity(item.productId, item.variant, item.quantity - 1)
                          }
                          className="px-3 py-1 text-base"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Sumar"
                          onClick={() =>
                            setQuantity(item.productId, item.variant, item.quantity + 1)
                          }
                          className="px-3 py-1 text-base"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.productId, item.variant)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Quitar
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-sm font-black">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-violet)]">
              <h2 className="text-lg font-bold">Resumen</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal, currency)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                El costo de envío se calcula en el siguiente paso.
              </p>
              <Link
                to="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-base font-bold text-primary-foreground transition hover:opacity-90"
              >
                Finalizar compra <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/accesorios"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary"
              >
                Seguir comprando
              </Link>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
