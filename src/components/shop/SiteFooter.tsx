import { Link } from "@tanstack/react-router";
import { Instagram, Phone } from "lucide-react";

import logo from "@/assets/logo.jpg.asset.json";
import { INSTAGRAM, waLink } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-md bg-white">
            <img src={logo.url} alt="PoolHaus" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold tracking-tight">POOLHAUS</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/accesorios" className="text-sm text-muted-foreground hover:text-primary">
            Accesorios
          </Link>
          <Link to="/ofertas" className="text-sm text-muted-foreground hover:text-primary">
            Ofertas
          </Link>
          <a
            href={waLink("Hola PoolHaus, quiero información.")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Phone className="h-4 w-4" /> +598 92 138 522
          </a>
          <a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Instagram className="h-4 w-4" /> @{INSTAGRAM}
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PoolHaus · Uruguay
        </p>
      </div>
    </footer>
  );
}
