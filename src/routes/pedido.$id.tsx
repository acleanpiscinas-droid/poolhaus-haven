import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";

import { SiteNav } from "@/components/shop/SiteNav";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { getOrder } from "@/lib/shop/checkout.functions";
import { formatPrice, statusLabel } from "@/lib/shop/types";
import { waLink } from "@/lib/contact";

const orderQuery = (id: string) =>
  queryOptions({ queryKey: ["order", id], queryFn: () => getOrder({ data: { id } }) });

export const Route = createFileRoute("/pedido/$id")({
  head: () => ({
    meta: [
      { title: "Tu pedido | PoolHaus Uruguay" },
      { name: "description", content: "Estado y detalle de tu pedido de accesorios PoolHaus." },
      { property: "og:title", content: "Tu pedido | PoolHaus Uruguay" },
      { property: "og:description", content: "Estado y detalle de tu pedido PoolHaus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tu pedido | PoolHaus Uruguay" },
      { name: "twitter:description", content: "Estado y detalle de tu pedido." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PedidoPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-24 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-24 text-center">Pedido no encontrado.</div>,
});

function PedidoPage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(orderQuery(id));

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 text-center">
          <h1 className="text-2xl font-bold">No encontramos este pedido</h1>
          <Link
            to="/accesorios"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Volver a la tienda
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const paid = data.order.payment_status === "pagado";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-2xl px-4 pb-16 pt-28">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-violet)]">
          {paid ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          ) : (
            <Clock className="mx-auto h-12 w-12 text-primary" />
          )}
          <h1 className="mt-4 text-2xl font-black tracking-tight">
            {paid ? "¡Gracias por tu compra!" : "Pedido registrado"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pedido <span className="font-bold text-foreground">{data.order.order_number}</span> ·
            estado: {statusLabel(data.order.order_status)}
          </p>

          <ul className="mt-6 space-y-2 text-left text-sm">
            {data.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3 border-b border-border pb-2">
                <span className="text-muted-foreground">
                  {i.quantity}× {i.name}
                  {i.variant ? ` (${i.variant})` : ""}
                </span>
                <span className="font-semibold">
                  {formatPrice(Number(i.unit_price) * i.quantity, data.order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(Number(data.order.subtotal), data.order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{formatPrice(Number(data.order.shipping_cost), data.order.currency)}</span>
            </div>
            <div className="flex justify-between text-base font-black">
              <span>Total</span>
              <span>{formatPrice(Number(data.order.total), data.order.currency)}</span>
            </div>
          </div>

          <a
            href={waLink(`Hola PoolHaus, consulto por mi pedido ${data.order.order_number}.`)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
          </a>
          <Link
            to="/accesorios"
            className="mt-3 block text-sm text-muted-foreground hover:text-primary"
          >
            Seguir comprando
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
