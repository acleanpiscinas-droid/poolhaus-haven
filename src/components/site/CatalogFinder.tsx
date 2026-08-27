import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus, MessageCircle } from "lucide-react";

import { useCart } from "@/lib/cart";
import { waLink } from "@/lib/contact";
import {
  CATEGORIES,
  MAX_CATALOG_PRICE,
  SORT_OPTIONS,
  filterAndSort,
  type Category,
  type SortKey,
} from "@/lib/catalog/items";

export function CatalogFinder() {
  const { add, setOpen } = useCart();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_CATALOG_PRICE);
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevancia");

  const results = useMemo(
    () =>
      filterAndSort({
        query,
        categories,
        maxPrice: maxPrice >= MAX_CATALOG_PRICE ? null : maxPrice,
        onlyWithPrice,
        sort,
      }),
    [query, categories, maxPrice, onlyWithPrice, sort],
  );

  const toggleCategory = (c: Category) =>
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const clearFilters = () => {
    setQuery("");
    setCategories([]);
    setMaxPrice(MAX_CATALOG_PRICE);
    setOnlyWithPrice(false);
    setSort("relevancia");
  };

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar piscina, bomba, filtro, robot…"
            aria-label="Buscar en el catálogo"
            className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
          />
        </div>
        <label className="sr-only" htmlFor="orden">
          Ordenar
        </label>
        <select
          id="orden"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = categories.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/60"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:items-center">
        <div>
          <label
            htmlFor="precio"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Precio máximo:{" "}
            {maxPrice >= MAX_CATALOG_PRICE ? "sin límite" : `US$ ${maxPrice.toLocaleString("es-UY")}`}
          </label>
          <input
            id="precio"
            type="range"
            min={100}
            max={MAX_CATALOG_PRICE}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-[oklch(0.62_0.22_295)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={onlyWithPrice}
              onChange={(e) => setOnlyWithPrice(e.target.checked)}
              className="h-4 w-4 accent-[oklch(0.62_0.22_295)]"
            />
            Solo con precio publicado
          </label>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {results.length} producto{results.length === 1 ? "" : "s"} encontrado
        {results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-background p-5 text-sm text-muted-foreground">
          No encontramos productos con esos filtros. Probá otra búsqueda o escribinos por WhatsApp.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background"
            >
              {item.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {item.category}
                </span>
                <h3 className="mt-1 text-base font-bold">{item.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                <p className="mt-3 text-xl font-black text-primary">{item.priceLabel}</p>
                <div className="mt-auto pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      add({
                        id: item.id,
                        name: item.name,
                        detail: item.detail,
                        price: item.price,
                        priceLabel: item.priceLabel,
                        image: item.image,
                      });
                      setOpen(true);
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" /> Agregar al carrito
                  </button>
                  <a
                    href={waLink(`Hola PoolHaus, quiero consultar por ${item.name}.`)}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-semibold transition hover:border-primary"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Consultar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
