"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV, COMPANY } from "@/lib/content";
import { Logo, effectiveLogoId } from "@/lib/logos";
import { useSite } from "./site-provider";

export function Nav() {
  const pathname = usePathname();
  const { logo, theme } = useSite();
  const displayedLogo = effectiveLogoId(logo, theme);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-app/85 backdrop-blur-md border-b border-app">
      <div className="mx-auto max-w-7xl container-pad flex items-center justify-between h-24 lg:h-28">
        <Link href="/" className="flex items-center gap-3 text-fg">
          <Logo id={displayedLogo} className="h-16 lg:h-20 w-auto text-primary" />
          <span className="sr-only">{COMPANY.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  active ? "text-accent" : "text-fg hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={COMPANY.phoneHref} className="text-sm font-semibold text-fg hover:text-accent">
            {COMPANY.phone}
          </a>
          <Link href="/contact" className="btn btn-accent">
            Free Inspection
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md border border-app"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6L18 18M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-app bg-surface">
          <div className="container-pad py-4 flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 rounded-md text-base font-semibold text-fg hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <a href={COMPANY.phoneHref} className="px-2 py-3 font-semibold text-accent">
              {COMPANY.phone}
            </a>
            <Link href="/contact" className="btn btn-accent mt-2" onClick={() => setOpen(false)}>
              Free Inspection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
