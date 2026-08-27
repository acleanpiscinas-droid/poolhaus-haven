import { Minus, Plus, ShoppingCart, Trash2, X, MessageCircle } from "lucide-react";

import { cartWhatsappMessage, formatUsd, useCart } from "@/lib/cart";
import { waLink } from "@/lib/contact";

export function CartDrawer() {
  const { items, total, count, hasConsult, open, setOpen, setQty, remove, clear } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" /> Mi carrito
            {count > 0 && <span className="text-sm text-muted-foreground">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Tu carrito está vacío. Agregá productos del catálogo para pedir tu presupuesto.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  {i.image && (
                    <img
                      src={i.image}
                      alt={i.name}
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{i.name}</p>
                    {i.detail && (
                      <p className="truncate text-xs text-muted-foreground">{i.detail}</p>
                    )}
                    <p className="mt-1 text-sm font-black text-primary">{i.priceLabel}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Quitar una unidad"
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-primary"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                      <button
                        type="button"
                        aria-label="Agregar una unidad"
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-primary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar ${i.name}`}
                        onClick={() => remove(i.id)}
                        className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-border px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total estimado</span>
            <span className="text-2xl font-black text-primary">{formatUsd(total)}</span>
          </div>
          {hasConsult && (
            <p className="mt-1 text-xs text-muted-foreground">
              Incluye ítems con precio a consultar: los cotizamos por WhatsApp.
            </p>
          )}
          <a
            href={waLink(cartWhatsappMessage(items, total, hasConsult))}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={items.length === 0}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition hover:opacity-90 ${
              items.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <MessageCircle className="h-5 w-5" /> Solicitar compra por WhatsApp
          </a>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-2 w-full rounded-full border border-border px-5 py-3 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              Vaciar carrito
            </button>
          )}
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Precios de referencia en dólares. Confirmamos stock y envío por WhatsApp.
          </p>
        </footer>
      </aside>
    </div>
  );
}
