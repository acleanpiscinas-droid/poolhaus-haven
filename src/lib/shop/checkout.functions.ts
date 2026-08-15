import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variant: z.string().nullable().optional(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1),
  customer: z.object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    phone: z.string().min(6).max(30),
    email: z.string().email().max(120),
    address: z.string().max(160).optional().default(""),
    city: z.string().max(80).optional().default(""),
    department: z.string().max(80).optional().default(""),
    postalCode: z.string().max(20).optional().default(""),
    notes: z.string().max(600).optional().default(""),
  }),
  deliveryMethod: z.enum(["envio", "retiro"]),
  origin: z.string().url(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{
      orderId: string;
      orderNumber: string;
      checkoutUrl: string | null;
      total: number;
      currency: string;
    }> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { createPreference } = await import("./mercadopago.server");

      const ids = data.items.map((i) => i.productId);
      const { data: rows, error } = await supabaseAdmin
        .from("products")
        .select("id, name, slug, price, currency, images, stock, active")
        .in("id", ids);
      if (error) throw new Error("No se pudo validar el carrito");

      const available = (rows ?? []).filter((r) => r.active);
      if (available.length === 0) throw new Error("Los productos del carrito no están disponibles");

      const lines = data.items
        .map((item) => {
          const p = available.find((r) => r.id === item.productId);
          if (!p) return null;
          const quantity = p.stock > 0 ? Math.min(item.quantity, p.stock) : item.quantity;
          return {
            product_id: p.id,
            name: p.name,
            slug: p.slug,
            image: (p.images as string[] | null)?.[0] ?? null,
            variant: item.variant ?? null,
            unit_price: Number(p.price),
            quantity,
            currency: p.currency ?? "USD",
          };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null);

      if (lines.length === 0) throw new Error("Los productos del carrito no están disponibles");

      const currency = lines[0]!.currency;
      const subtotal = lines.reduce((acc, l) => acc + l.unit_price * l.quantity, 0);

      const { data: settings } = await supabaseAdmin
        .from("store_settings")
        .select("shipping_cost, free_shipping_threshold")
        .maybeSingle();
      const baseShipping = Number(settings?.shipping_cost ?? 0);
      const threshold =
        settings?.free_shipping_threshold == null ? null : Number(settings.free_shipping_threshold);
      const shippingCost =
        data.deliveryMethod === "retiro" || (threshold != null && subtotal >= threshold)
          ? 0
          : baseShipping;
      const total = subtotal + shippingCost;

      const orderNumber = `PH-${Date.now().toString(36).toUpperCase()}`;

      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          first_name: data.customer.firstName,
          last_name: data.customer.lastName,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.customer.address || null,
          city: data.customer.city || null,
          department: data.customer.department || null,
          postal_code: data.customer.postalCode || null,
          notes: data.customer.notes || null,
          delivery_method: data.deliveryMethod,
          currency,
          subtotal,
          shipping_cost: shippingCost,
          total,
          payment_method: "mercadopago",
        })
        .select("id, order_number")
        .single();
      if (orderError || !order) throw new Error("No se pudo crear el pedido");

      await supabaseAdmin.from("order_items").insert(
        lines.map((l) => ({
          order_id: order.id,
          product_id: l.product_id,
          name: l.name,
          slug: l.slug,
          image: l.image,
          variant: l.variant,
          unit_price: l.unit_price,
          quantity: l.quantity,
        })),
      );

      const preference = await createPreference({
        orderId: order.id,
        orderNumber: order.order_number,
        currency,
        shippingCost,
        items: lines.map((l) => ({
          title: l.variant ? `${l.name} (${l.variant})` : l.name,
          quantity: l.quantity,
          unit_price: l.unit_price,
          currency_id: currency,
        })),
        payer: {
          name: data.customer.firstName,
          surname: data.customer.lastName,
          email: data.customer.email,
          phone: data.customer.phone,
        },
        origin: data.origin,
      });

      if (preference) {
        await supabaseAdmin
          .from("orders")
          .update({ mp_preference_id: preference.id })
          .eq("id", order.id);
      }

      return {
        orderId: order.id,
        orderNumber: order.order_number,
        checkoutUrl: preference?.initPoint ?? null,
        total,
        currency,
      };
    },
  );

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, first_name, delivery_method, currency, subtotal, shipping_cost, total, payment_status, order_status, created_at",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (!order) return null;
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("name, variant, unit_price, quantity, image")
      .eq("order_id", data.id);
    return { order, items: items ?? [] };
  });
