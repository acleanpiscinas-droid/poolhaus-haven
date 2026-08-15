import { Link } from "@tanstack/react-router";
import { MessageCircle, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo.jpg.asset.json";
import { useCart } from "@/lib/shop/cart";
import { waLink, WHATSAPP_DISPLAY } from "@/lib/contact";

type NavItem = { label: string; to?: string; href?: string; search?: Record<string, string> };

const ITEMS: NavItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Piscinas", href: "/#modelos" },
  { label: "Módulos", href: "/#modelos" },
  { label: "Accesorios", to: "/accesorios" },
  { label: "Climatización", to: "/accesorios", search: { cat: "climatizacion" } },
  { label: "Ofertas", to: "/ofertas" },
  { label: "Contacto", href: "/#cotizar" },
];

export function SiteNav() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-md bg-white">
            <img src={logo.url} alt="PoolHaus" className="h-full w-full object-contain" />
          </div>
          <span className="text-lg font-bold tracking-tight">POOLHAUS</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {ITEMS.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                className="text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/carrito"
            aria-label="Ver carrito"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 transition hover:border-primary/60"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <a
            href={waLink("Hola PoolHaus, quiero información.")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-violet)] transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">{WHATSAPP_DISPLAY}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/50 bg-background px-4 py-3 lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {ITEMS.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  search={item.search as never}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </a>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
