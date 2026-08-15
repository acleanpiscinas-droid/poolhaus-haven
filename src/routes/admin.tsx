import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, ORDER_STATUSES, formatPrice, statusLabel } from "@/lib/shop/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | PoolHaus" },
      { name: "description", content: "Gestión de productos y pedidos de la tienda PoolHaus." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Row = Record<string, unknown>;

const emptyProduct = {
  name: "",
  slug: "",
  brand: "",
  category: CATEGORIES[0].slug as string,
  short_description: "",
  description: "",
  price: "0",
  compare_price: "",
  currency: "USD",
  stock: "0",
  installments: "",
  images: "",
  features: "",
  active: true,
  on_sale: false,
  is_new: false,
  featured: false,
};

function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"productos" | "pedidos">("productos");
  const [products, setProducts] = useState<Row[]>([]);
  const [orders, setOrders] = useState<Row[]>([]);
  const [form, setForm] = useState({ ...emptyProduct });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [creds, setCreds] = useState({ email: "", password: "" });

  const loadData = async () => {
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setProducts((p ?? []) as Row[]);
    setOrders((o ?? []) as Row[]);
  };

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      setSession(!!user);
      if (!user) return;
      const { data: admin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(Boolean(admin));
      if (admin) await loadData();
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void check());
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const { error } = await supabase.auth.signInWithPassword(creds);
            setBusy(false);
            if (error) toast.error("No pudimos iniciar sesión", { description: error.message });
          }}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <h1 className="text-xl font-black">Panel PoolHaus</h1>
          <input
            required
            type="email"
            placeholder="Email"
            value={creds.email}
            onChange={(e) => setCreds({ ...creds, email: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
          />
          <input
            required
            type="password"
            placeholder="Contraseña"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-xl font-bold">Tu cuenta no tiene permisos de administrador</h1>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  const saveProduct = async () => {
    setBusy(true);
    const payload = {
      name: form.name,
      slug:
        form.slug ||
        form.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      brand: form.brand || null,
      category: form.category,
      short_description: form.short_description || null,
      description: form.description || null,
      price: Number(form.price || 0),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      currency: form.currency,
      stock: Number(form.stock || 0),
      installments: form.installments ? Number(form.installments) : null,
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      active: form.active,
      on_sale: form.on_sale,
      is_new: form.is_new,
      featured: form.featured,
    };
    const { error } = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) {
      toast.error("No se pudo guardar", { description: error.message });
      return;
    }
    toast.success(editingId ? "Producto actualizado" : "Producto creado");
    setForm({ ...emptyProduct });
    setEditingId(null);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-black tracking-tight">POOLHAUS · Panel</h1>
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-2">
          {(["productos", "pedidos"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "productos" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="h-fit space-y-3 rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold">
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h2>
              {(
                [
                  ["name", "Nombre"],
                  ["slug", "URL (opcional)"],
                  ["brand", "Marca"],
                  ["short_description", "Descripción corta"],
                  ["price", "Precio"],
                  ["compare_price", "Precio anterior"],
                  ["stock", "Stock"],
                  ["installments", "Cuotas"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold">{label}</label>
                  <input
                    value={String(form[key])}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-semibold">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Moneda</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="UYU">UYU</option>
                </select>
              </div>
              {(
                [
                  ["description", "Descripción completa"],
                  ["images", "Imágenes (una URL por línea)"],
                  ["features", "Características (una por línea)"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold">{label}</label>
                  <textarea
                    rows={3}
                    value={String(form[key])}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-3 text-xs">
                {(
                  [
                    ["active", "Activo"],
                    ["on_sale", "Oferta"],
                    ["is_new", "Nuevo"],
                    ["featured", "Destacado"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={Boolean(form[key])}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <button
                type="button"
                disabled={busy || !form.name}
                onClick={() => void saveProduct()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
              >
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Guardar cambios" : "Crear producto"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyProduct });
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-primary"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <div className="space-y-2">
              {products.length === 0 && (
                <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  Todavía no hay productos cargados.
                </p>
              )}
              {products.map((p) => (
                <div
                  key={String(p["id"])}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-secondary/40">
                    {(p["images"] as string[] | null)?.[0] && (
                      <img
                        src={(p["images"] as string[])[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{String(p["name"])}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(Number(p["price"]), String(p["currency"]))} · stock{" "}
                      {String(p["stock"])} · {p["active"] ? "activo" : "inactivo"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(String(p["id"]));
                      setForm({
                        name: String(p["name"] ?? ""),
                        slug: String(p["slug"] ?? ""),
                        brand: String(p["brand"] ?? ""),
                        category: String(p["category"] ?? CATEGORIES[0].slug),
                        short_description: String(p["short_description"] ?? ""),
                        description: String(p["description"] ?? ""),
                        price: String(p["price"] ?? "0"),
                        compare_price: p["compare_price"] == null ? "" : String(p["compare_price"]),
                        currency: String(p["currency"] ?? "USD"),
                        stock: String(p["stock"] ?? "0"),
                        installments: p["installments"] == null ? "" : String(p["installments"]),
                        images: ((p["images"] as string[] | null) ?? []).join("\n"),
                        features: ((p["features"] as string[] | null) ?? []).join("\n"),
                        active: Boolean(p["active"]),
                        on_sale: Boolean(p["on_sale"]),
                        is_new: Boolean(p["is_new"]),
                        featured: Boolean(p["featured"]),
                      });
                    }}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    aria-label="Eliminar"
                    onClick={async () => {
                      const { error } = await supabase
                        .from("products")
                        .delete()
                        .eq("id", String(p["id"]));
                      if (error) toast.error("No se pudo eliminar");
                      else {
                        toast.success("Producto eliminado");
                        await loadData();
                      }
                    }}
                    className="rounded-full border border-border p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {orders.length === 0 && (
              <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Todavía no hay pedidos.
              </p>
            )}
            {orders.map((o) => (
              <div
                key={String(o["id"])}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    {String(o["order_number"])} · {String(o["first_name"])}{" "}
                    {String(o["last_name"])}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {String(o["phone"])} · {String(o["email"])} ·{" "}
                    {formatPrice(Number(o["total"]), String(o["currency"]))} ·{" "}
                    {String(o["delivery_method"])}
                  </p>
                </div>
                <select
                  value={String(o["order_status"])}
                  onChange={async (e) => {
                    const { error } = await supabase
                      .from("orders")
                      .update({ order_status: e.target.value })
                      .eq("id", String(o["id"]));
                    if (error) toast.error("No se pudo actualizar");
                    else await loadData();
                  }}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
