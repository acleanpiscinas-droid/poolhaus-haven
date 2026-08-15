import { createServerFn } from "@tanstack/react-start";
import { mapProduct } from "./map";
import type { Product, StoreSettings } from "./types";

export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<{
  products: Product[];
  settings: StoreSettings;
}> => {
  const { createPublicClient } = await import("./public-client.server");
  const supabase = createPublicClient();
  const [{ data: products }, { data: settings }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("store_settings").select("shipping_cost, free_shipping_threshold").maybeSingle(),
  ]);
  return {
    products: (products ?? []).map((r) => mapProduct(r as unknown as Record<string, unknown>)),
    settings: {
      shipping_cost: Number(settings?.shipping_cost ?? 0),
      free_shipping_threshold:
        settings?.free_shipping_threshold == null ? null : Number(settings.free_shipping_threshold),
    },
  };
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<{ product: Product | null; related: Product[] }> => {
    const { createPublicClient } = await import("./public-client.server");
    const supabase = createPublicClient();
    const { data: row } = await supabase
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (!row) return { product: null, related: [] };
    const product = mapProduct(row as unknown as Record<string, unknown>);
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(4);
    return {
      product,
      related: (related ?? []).map((r) => mapProduct(r as unknown as Record<string, unknown>)),
    };
  });
