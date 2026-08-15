import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/mercadopago/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { getPayment } = await import("@/lib/shop/mercadopago.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const url = new URL(request.url);
        let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
        let topic = url.searchParams.get("type") ?? url.searchParams.get("topic");

        try {
          const body = (await request.json()) as {
            type?: string;
            action?: string;
            data?: { id?: string | number };
          };
          paymentId = body?.data?.id != null ? String(body.data.id) : paymentId;
          topic = body?.type ?? topic;
        } catch {
          /* MP sometimes sends query-string-only notifications */
        }

        if (!paymentId || (topic && !topic.includes("payment"))) {
          return new Response("ignored", { status: 200 });
        }

        const payment = await getPayment(paymentId);
        if (!payment?.external_reference) return new Response("ignored", { status: 200 });

        const paid = payment.status === "approved";
        const rejected = ["rejected", "cancelled", "refunded", "charged_back"].includes(
          payment.status,
        );

        await supabaseAdmin
          .from("orders")
          .update({
            mp_payment_id: String(payment.id),
            payment_status: paid ? "pagado" : rejected ? "cancelado" : "pendiente_de_pago",
            ...(paid
              ? { order_status: "pagado" }
              : rejected
                ? { order_status: "cancelado" }
                : {}),
          })
          .eq("id", payment.external_reference);

        return new Response("ok", { status: 200 });
      },
    },
  },
});
