import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { SiteNav } from "@/components/shop/SiteNav";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { useCart } from "@/lib/shop/cart";
import { createOrder } from "@/lib/shop/checkout.functions";
import { DEPARTAMENTOS, formatPrice } from "@/lib/shop/types";
import { waLink } from "@/lib/contact";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra | Tienda PoolHaus Uruguay" },
      {
        name: "description",
        content:
          "Completá tus datos de envío y pagá con Mercado Pago tus accesorios de piscina PoolHaus.",
      },
      { property: "og:title", content: "Finalizar compra | Tienda PoolHaus Uruguay" },
      {
        property: "og:description",
        content: "Completá tus datos y pagá con Mercado Pago de forma segura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Finalizar compra | Tienda PoolHaus Uruguay" },
      { name: "twitter:description", content: "Pagá con Mercado Pago de forma segura." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, currency, clear } = useCart();
  const navigate = useNavigate();
  const submitOrder = useServerFn(createOrder);
  const [delivery, setDelivery] = useState<"envio" | "retiro">("envio");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    department: "",
    postalCode: "",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      submitOrder({
        data: {
          items: items.map((i) => ({
            productId: i.productId,
            variant: i.variant,
            quantity: i.quantity,
          })),
          customer: form,
          deliveryMethod: delivery,
          origin: window.location.origin,
        },
      }),
    onSuccess: (result) => {
      clear();
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      toast.success("Pedido registrado", {
        description: "Te contactamos por WhatsApp para coordinar el pago.",
      });
      void navigate({ to: "/pedido/$id", params: { id: result.orderId } });
    },
    onError: (error: Error) =>
      toast.error("No pudimos procesar el pedido", { description: error.message }),
  });

  const field = (
    name: keyof typeof form,
    label: string,
    opts: { type?: string; required?: boolean; placeholder?: string } = {},
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <input
        required={opts.required}
        type={opts.type ?? "text"}
        value={form[name]}
        placeholder={opts.placeholder}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28">
        <h1 className="text-3xl font-black tracking-tight">Finalizar compra</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="text-lg font-bold">No hay productos en tu carrito</h2>
            <Link
              to="/accesorios"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Ver accesorios
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"
          >
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold">Tus datos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("firstName", "Nombre", { required: true })}
                {field("lastName", "Apellido", { required: true })}
                {field("phone", "WhatsApp", {
                  required: true,
                  type: "tel",
                  placeholder: "09X XXX XXX",
                })}
                {field("email", "Email", { required: true, type: "email" })}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Entrega</p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { v: "envio", label: "Envío a domicilio" },
                      { v: "retiro", label: "Retiro en local" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setDelivery(o.v)}
                      className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                        delivery === o.v
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {delivery === "envio" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("address", "Dirección", { required: true })}
                  {field("city", "Ciudad / localidad", { required: true })}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Departamento</label>
                    <select
                      required
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                    >
                      <option value="">Seleccioná</option>
                      {DEPARTAMENTOS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  {field("postalCode", "Código postal")}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Observaciones</label>
                <textarea
                  value={form.notes}
                  rows={3}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                  placeholder="Referencias de entrega, horarios, etc."
                />
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-violet)]">
              <h2 className="text-lg font-bold">Tu pedido</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((i) => (
                  <li
                    key={`${i.productId}-${i.variant ?? ""}`}
                    className="flex justify-between gap-3"
                  >
                    <span className="text-muted-foreground">
                      {i.quantity}× {i.name}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(i.price * i.quantity, i.currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-black">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                El envío se confirma según destino antes del pago.
              </p>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-base font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
                Pagar con Mercado Pago
              </button>
              <a
                href={waLink("Hola PoolHaus, quiero coordinar mi compra de accesorios.")}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary"
              >
                <MessageCircle className="h-4 w-4 text-primary" /> Coordinar por WhatsApp
              </a>
            </aside>
          </form>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
