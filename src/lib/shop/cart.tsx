import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  currency: string;
  variant: string | null;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  currency: string;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, variant: string | null, quantity: number) => void;
  remove: (productId: string, variant: string | null) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "poolhaus-cart-v1";

const sameLine = (a: CartItem, productId: string, variant: string | null) =>
  a.productId === productId && (a.variant ?? null) === (variant ?? null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    return {
      items,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      currency: items[0]?.currency ?? "USD",
      add: (item, quantity = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => sameLine(p, item.productId, item.variant ?? null));
          if (existing) {
            return prev.map((p) =>
              sameLine(p, item.productId, item.variant ?? null)
                ? { ...p, quantity: Math.min(p.quantity + quantity, Math.max(item.stock, 1)) }
                : p,
            );
          }
          return [...prev, { ...item, quantity }];
        }),
      setQuantity: (productId, variant, quantity) =>
        setItems((prev) =>
          prev
            .map((p) =>
              sameLine(p, productId, variant) ? { ...p, quantity: Math.max(1, quantity) } : p,
            )
            .filter((p) => p.quantity > 0),
        ),
      remove: (productId, variant) =>
        setItems((prev) => prev.filter((p) => !sameLine(p, productId, variant))),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
