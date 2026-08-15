import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ImageOff, MessageCircle, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { SiteNav } from "@/components/shop/SiteNav";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProduct } from "@/lib/shop/products.functions";
import { useCart } from "@/lib/shop/cart";
import { categoryLabel, discountPercent, formatPrice } from "@/lib/shop/types";
import { waLink } from "@/lib/contact";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["shop", "product", slug],
    queryFn: () => getProduct({ data: { slug } }),
  });

export const Route = createFileRoute("/producto/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!result.product) throw notFound();
    return { name: result.product.name, description: result.product.short_description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Producto no disponible | PoolHaus" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} | Accesorios PoolHaus Uruguay`;
    const description =
      loaderData.description ??
      `${loaderData.name} disponible en PoolHaus Uruguay. Envíos a todo el país y pago con Mercado Pago.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: ProductoPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-24 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      <Link to="/accesorios" className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
        Ver accesorios
      </Link>
    </div>
  ),
});

function ProductoPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const product = data.product!;
  const { add } = useCart();
  const [image, setImage] = useState(0);
  const [variant, setVariant] = useState<string | null>(product.variants[0] ?? null);
  const [qty, setQty] = useState(1);

  const off = discountPercent(product.price, product.compare_price);
  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-4 pt-24">
        <nav className="py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Inicio
          </Link>{" "}
          /{" "}
          <Link to="/accesorios" className="hover:text-primary">
            Accesorios
          </Link>{" "}
          /{" "}
          <Link to="/accesorios" search={{ cat: product.category }} className="hover:text-primary">
            {categoryLabel(product.category)}
          </Link>
        </nav>

        <div className="grid gap-8 py-6 lg:grid-cols-2">
          {/* GALERIA */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-secondary/40">
              {product.images[image] ? (
                <img
                  src={product.images[image]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImage(i)}
                    className={`aspect-square overflow-hidden rounded-lg border ${
                      i === image ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            {product.brand && (
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {product.brand}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-black tracking-tight">{product.name}</h1>
            {product.short_description && (
              <p className="mt-2 text-muted-foreground">{product.short_description}</p>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-black">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_price, product.currency)}
                </span>
              )}
              {off && (
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                  -{off}%
                </span>
              )}
            </div>
            {product.installments && product.installments > 1 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Hasta {product.installments} cuotas de{" "}
                {formatPrice(product.price / product.installments, product.currency)} con Mercado
                Pago
              </p>
            )}

            <p className="mt-4 text-sm">
              {outOfStock ? (
                <span className="font-semibold text-muted-foreground">Sin stock — consultanos</span>
              ) : (
                <span className="font-semibold text-primary">
                  Disponible · {product.stock} en stock
                </span>
              )}
            </p>

            {product.variants.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold">Opción</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVariant(v)}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                        variant === v
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg"
                  aria-label="Restar"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2 text-lg"
                  aria-label="Sumar"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  add(
                    {
                      productId: product.id,
                      slug: product.slug,
                      name: product.name,
                      image: product.images[0] ?? null,
                      price: product.price,
                      currency: product.currency,
                      variant,
                      stock: product.stock,
                    },
                    qty,
                  );
                  toast.success("Agregado al carrito", { description: product.name });
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
              >
                <ShoppingCart className="h-5 w-5" /> Agregar al carrito
              </button>
              <a
                href={waLink(`Hola PoolHaus, quiero consultar por: ${product.name}`)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-4 text-base font-semibold transition hover:bg-secondary"
              >
                <MessageCircle className="h-5 w-5 text-primary" /> Consultar por WhatsApp
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-xl border border-border bg-card p-4 text-sm">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{product.shipping_info ?? "Envíos a todo Uruguay"}</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-border bg-card p-4 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{product.warranty_info ?? "Garantía oficial PoolHaus"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETALLE */}
        <div className="grid gap-8 border-t border-border/50 py-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Descripción</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description ?? "Consultanos por más detalles de este producto."}
            </p>
            {product.features.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {product.specs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Especificaciones técnicas</h2>
              <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {data.related.length > 0 && (
          <div className="border-t border-border/50 py-12">
            <h2 className="text-2xl font-black tracking-tight">Productos relacionados</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {data.related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
