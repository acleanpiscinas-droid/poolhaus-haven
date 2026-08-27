import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  detail?: string;
  price: number | null;
  priceLabel: string;
  image?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  count: number;
  total: number;
  hasConsult: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const STORAGE_KEY = "poolhaus.cart.v1";
const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* storage no disponible */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage no disponible */
    }
  }, [items]);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + (i.price ?? 0) * i.qty, 0);
    return {
      items,
      count,
      total,
      hasConsult: items.some((i) => i.price == null),
      open,
      setOpen,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.id === item.id);
          if (found) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { ...item, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

export const formatUsd = (n: number) =>
  `US$ ${n.toLocaleString("es-UY", { maximumFractionDigits: 0 })}`;

export function cartWhatsappMessage(items: CartItem[], total: number, hasConsult: boolean) {
  const lines = items.map(
    (i) => `• ${i.qty} × ${i.name}${i.detail ? ` (${i.detail})` : ""} — ${i.priceLabel}`,
  );
  const totalLine = hasConsult
    ? `Total estimado: ${formatUsd(total)} + ítems a consultar`
    : `Total estimado: ${formatUsd(total)}`;
  return `Hola PoolHaus, quiero solicitar esta compra:\n${lines.join("\n")}\n\n${totalLine}`;
}
