const MP_API = "https://api.mercadopago.com";

export const mpToken = () => process.env["MERCADOPAGO_ACCESS_TOKEN"] ?? "";

export type MpItem = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
};

/** Creates a Checkout Pro preference. Returns null when MP is not configured yet. */
export async function createPreference(input: {
  orderId: string;
  orderNumber: string;
  items: MpItem[];
  shippingCost: number;
  currency: string;
  payer: { name: string; surname: string; email: string; phone: string };
  origin: string;
}): Promise<{ id: string; initPoint: string } | null> {
  const token = mpToken();
  if (!token) return null;

  const body = {
    items: input.items,
    payer: {
      name: input.payer.name,
      surname: input.payer.surname,
      email: input.payer.email,
      phone: { number: input.payer.phone },
    },
    external_reference: input.orderId,
    statement_descriptor: "POOLHAUS",
    shipments:
      input.shippingCost > 0
        ? { cost: input.shippingCost, mode: "not_specified" }
        : { mode: "not_specified" },
    back_urls: {
      success: `${input.origin}/pedido/${input.orderId}`,
      pending: `${input.origin}/pedido/${input.orderId}`,
      failure: `${input.origin}/pedido/${input.orderId}`,
    },
    auto_return: "approved",
    notification_url: `${input.origin}/api/public/mercadopago/webhook`,
  };

  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Mercado Pago preference error", res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as { id: string; init_point: string; sandbox_init_point: string };
  return { id: json.id, initPoint: json.init_point ?? json.sandbox_init_point };
}

export async function getPayment(paymentId: string) {
  const token = mpToken();
  if (!token) return null;
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    id: number;
    status: string;
    external_reference: string | null;
    payment_type_id?: string;
  };
}
