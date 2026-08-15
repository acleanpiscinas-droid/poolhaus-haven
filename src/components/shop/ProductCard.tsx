import { Link } from "@tanstack/react-router";
import { ShoppingCart, ImageOff } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/shop/cart";
import { discountPercent, formatPrice, type Product } from "@/lib/shop/types";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = discountPercent(product.price, product.compare_price);
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/60">
      <Link
        to="/producto/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-secondary/40"
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {off && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase text-primary-foreground">
              -{off}%
            </span>
          )}
          {product.is_new && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase text-background">
              Nuevo
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase text-muted-foreground">
              Sin stock
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            {product.brand}
          </span>
        )}
        <Link to="/producto/$slug" params={{ slug: product.slug }} className="mt-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug sm:text-base">
            {product.name}
          </h3>
        </Link>
        {product.short_description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_price, product.currency)}
              </span>
            )}
          </div>
          {product.installments && product.installments > 1 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.installments} cuotas de{" "}
              {formatPrice(product.price / product.installments, product.currency)}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => {
            add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0] ?? null,
              price: product.price,
              currency: product.currency,
              variant: product.variants[0] ?? null,
              stock: product.stock,
            });
            toast.success("Agregado al carrito", { description: product.name });
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingCart className="h-4 w-4" /> {outOfStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
