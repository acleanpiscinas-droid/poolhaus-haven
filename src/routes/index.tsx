import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Check, Home, Waves, Zap, MapPin, Clock, Shield, Phone, Instagram, ShoppingCart } from "lucide-react";

import { SiteNav } from "@/components/shop/SiteNav";

import logo from "@/assets/logo.jpg.asset.json";
import poolHero from "@/assets/pool-hero.jpg.asset.json";
import pool1 from "@/assets/pool-1.jpg.asset.json";
import pool2 from "@/assets/pool-2.jpg.asset.json";
import pool3 from "@/assets/pool-3.jpg.asset.json";
import poolNight from "@/assets/pool-night.jpg.asset.json";
import moduloForest from "@/assets/modulo-forest.jpg.asset.json";
import modulo1 from "@/assets/modulo-1.jpg.asset.json";
import modulo2 from "@/assets/modulo-2.jpg.asset.json";
import modulo3 from "@/assets/modulo-3.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Landing,
});

const WHATSAPP_NUMBER = "59892138522";
const WHATSAPP_DISPLAY = "092 138 522";
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

function Landing() {
  const [form, setForm] = useState({ nombre: "", whatsapp: "", tipo: "modulo" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola PoolHaus, soy ${form.nombre}. Me interesa: ${form.tipo === "modulo" ? "Módulo 6x3" : "Piscina"}. Mi WhatsApp: ${form.whatsapp}. Quiero recibir cotización.`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <SiteNav />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={poolHero.url} alt="Piscina PoolHaus instalada" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary-foreground">
              Uruguay · Instalación completa
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Piscinas y módulos <span className="bg-gradient-to-r from-primary to-[oklch(0.75_0.2_295)] bg-clip-text text-transparent">listos para instalar</span> en tu terreno
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              Instalación completa en Uruguay. Sistemas premium, rápidos y sin complicaciones.
            </p>

            <ul className="mt-6 grid gap-2 text-sm sm:text-base">
              {[
                "Instalación en terrenos de arena y costa",
                "Módulos 6x3 listos para usar",
                "Piscinas con todo incluido",
                "Atención directa por WhatsApp",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink("Hola PoolHaus, quiero cotizar ahora.")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-violet)] transition hover:scale-[1.02] hover:opacity-95"
              >
                <MessageCircle className="h-5 w-5" />
                Cotizar por WhatsApp ahora
              </a>
              <a
                href="#modelos"
                className="inline-flex items-center justify-center rounded-full border border-border bg-secondary/50 px-6 py-4 text-base font-semibold text-foreground transition hover:bg-secondary"
              >
                Ver modelos disponibles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="modelos" className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Doble oferta</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Elegí tu proyecto</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* MÓDULO */}
            <article className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={moduloForest.url} alt="Módulo 6x3 PoolHaus" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                  <Home className="h-3.5 w-3.5" /> Módulos 6x3
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">Módulo Habitacional 6x3</h3>
                <p className="mt-1 text-sm text-muted-foreground">18 m² estándar · listo para instalar</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Estructura resistente</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Piso + ventanas + puerta</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Diseño moderno</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Transporte incluido</li>
                </ul>
                <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                  📌 Módulo estándar, no personalizado
                </p>
                <a
                  href={waLink("Hola, quiero cotizar el Módulo 6x3.")}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> Cotizar módulo
                </a>
              </div>
            </article>

            {/* PISCINA */}
            <article className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={pool2.url} alt="Piscina PoolHaus" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                  <Waves className="h-3.5 w-3.5" /> Piscinas
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">Piscinas PoolHaus</h3>
                <p className="mt-1 text-sm text-muted-foreground">Modelos 6x3 y 7x3 · instalación completa</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Instalación llave en mano</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Sala de máquinas incluida</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Clorador de sal</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Diseño premium veraniego</li>
                </ul>
                <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                  🌊 Todo incluido, sin sorpresas
                </p>
                <a
                  href={waLink("Hola, quiero cotizar una Piscina PoolHaus.")}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> Cotizar piscina
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-t border-border/50 bg-secondary/20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
            ¿Por qué elegir PoolHaus?
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: "Instalación rápida", desc: "Entrega e instalación en tiempo récord." },
              { icon: MessageCircle, title: "Atención por WhatsApp", desc: "Respondemos directo, sin vueltas." },
              { icon: Shield, title: "Proyectos llave en mano", desc: "Sin complicaciones, todo incluido." },
              { icon: MapPin, title: "Terrenos difíciles", desc: "Instalamos en arena, costa y campo." },
              { icon: Check, title: "Calidad garantizada", desc: "Materiales premium y mano de obra profesional." },
              { icon: Clock, title: "Fechas seguras", desc: "Reservá y aseguramos tu instalación." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRUEBA VISUAL */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Proyectos reales</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Obras terminadas</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[pool1, poolNight, modulo1, pool3, modulo2, modulo3].map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-xl border border-border ${i === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""}`}>
                <img
                  src={img.url}
                  alt={`Obra PoolHaus ${i + 1}`}
                  className={`w-full object-cover transition duration-700 hover:scale-105 ${i === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square"}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCIA */}
      <section className="relative overflow-hidden border-y border-primary/40 py-16" style={{ background: "var(--gradient-violet)" }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            ⚡ Cupos limitados
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Cupos limitados por temporada
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
            La demanda aumenta en verano. Reservá tu instalación ahora para asegurar precio y fecha.
          </p>
          <a
            href={waLink("Hola, quiero reservar mi cupo antes de que se agoten.")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-4 text-base font-bold text-white transition hover:bg-black/80"
          >
            <MessageCircle className="h-5 w-5" /> Reservar por WhatsApp
          </a>
        </div>
      </section>

      {/* FORM CTA FINAL */}
      <section id="cotizar" className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Recibí tu cotización en minutos
            </h2>
            <p className="mt-2 text-muted-foreground">Completá y te contactamos por WhatsApp.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-violet)]">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Nombre</label>
              <input
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">WhatsApp</label>
              <input
                required
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                placeholder="09X XXX XXX"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">¿Qué te interesa?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "modulo", label: "Módulo 6x3" },
                  { v: "piscina", label: "Piscina" },
                ].map((o) => (
                  <button
                    type="button"
                    key={o.v}
                    onClick={() => setForm({ ...form, tipo: o.v })}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                      form.tipo === o.v
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-base font-bold text-primary-foreground transition hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" />
              Enviar y hablar por WhatsApp
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Sin spam. Respondemos en minutos.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-md bg-white">
              <img src={logo.url} alt="PoolHaus" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold tracking-tight">POOLHAUS</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={waLink("Hola PoolHaus, quiero información.")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <Phone className="h-4 w-4" /> +598 92 138 522
            </a>
            <a href="https://instagram.com/poolhaus.uy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <Instagram className="h-4 w-4" /> @poolhaus.uy
            </a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PoolHaus · Uruguay</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        href={waLink("Hola PoolHaus, quiero información.")}
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition hover:scale-110"
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
        </span>
      </a>
    </div>
  );
}
