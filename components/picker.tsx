"use client";

import { useState } from "react";
import { THEMES } from "@/lib/themes";
import { LOGOS, Logo } from "@/lib/logos";
import { TYPOGRAPHIES } from "@/lib/typography";
import { LAYOUTS, type LayoutId } from "@/lib/layouts";
import { isDarkTheme } from "@/lib/themes";
import { useSite } from "./site-provider";

const FONT_PREVIEW: Record<string, string> = {
  "modern-sans": "var(--font-inter)",
  "editorial-serif": "var(--font-playfair)",
  industrial: "var(--font-jetbrains)",
  friendly: "var(--font-dm-sans)",
};

export function Picker() {
  const { theme, setTheme, logo, setLogo, typography, setTypography, layout, setLayout } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="card mb-3 w-[360px] max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-surface pb-2">
            <div>
              <p className="eyebrow mb-1">Client preview</p>
              <h4 className="text-base font-bold text-fg">Pick a look</h4>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1.5 rounded-md hover:bg-app text-muted hover:text-fg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          </div>

          <Section label="Theme">
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    theme === t.id
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                      : "border-app hover:border-[var(--accent)]/50"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {t.swatch.map((c, i) => (
                      <span
                        key={i}
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-fg">{t.name}</p>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
          </Section>

          <Section label="Homepage layout">
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((la) => (
                <button
                  key={la.id}
                  onClick={() => setLayout(la.id)}
                  className={`text-left p-3 rounded-lg border transition-all bg-surface ${
                    layout === la.id
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                      : "border-app hover:border-[var(--accent)]/50"
                  }`}
                >
                  <LayoutThumb id={la.id} />
                  <p className="text-xs font-bold text-fg mt-2">{la.name}</p>
                  <p className="text-[10px] text-muted leading-tight">{la.description}</p>
                </button>
              ))}
            </div>
          </Section>

          <Section label="Typography">
            <div className="grid grid-cols-2 gap-2">
              {TYPOGRAPHIES.map((ty) => (
                <button
                  key={ty.id}
                  onClick={() => setTypography(ty.id)}
                  className={`text-left p-3 rounded-lg border transition-all bg-surface ${
                    typography === ty.id
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                      : "border-app hover:border-[var(--accent)]/50"
                  }`}
                >
                  <p
                    className="text-3xl font-bold text-fg mb-1 leading-none"
                    style={{ fontFamily: FONT_PREVIEW[ty.id], letterSpacing: "-0.04em" }}
                  >
                    {ty.sample}
                  </p>
                  <p className="text-xs font-bold text-fg mt-2">{ty.name}</p>
                  <p className="text-[10px] text-muted leading-tight">{ty.description}</p>
                </button>
              ))}
            </div>
          </Section>

          <Section label="Logo" last>
            <div className="grid grid-cols-1 gap-2">
              {LOGOS.map((l) => {
                const dim = l.darkOnly && !isDarkTheme(theme);
                return (
                  <button
                    key={l.id}
                    onClick={() => setLogo(l.id)}
                    className={`relative p-4 rounded-lg border transition-all bg-surface text-left ${
                      logo === l.id
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                        : "border-app hover:border-[var(--accent)]/50"
                    }`}
                  >
                    {l.darkOnly && (
                      <span
                        className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          background: "var(--fg)",
                          color: "var(--bg)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Dark only
                      </span>
                    )}
                    <div
                      className={`h-24 flex items-center justify-center mb-3 text-primary rounded-md p-2 ${
                        dim ? "opacity-40" : ""
                      }`}
                      style={{
                        background: l.darkOnly ? "#0a0a0a" : "var(--bg)",
                      }}
                    >
                      <Logo id={l.id} className="h-20 w-auto max-w-full" variant="compact" />
                    </div>
                    <p className="text-sm font-bold text-fg">{l.name}</p>
                    <p className="text-[11px] text-muted leading-tight">{l.description}</p>
                    {dim && logo === l.id && (
                      <p className="text-[11px] mt-2 font-semibold" style={{ color: "var(--accent)" }}>
                        Showing Original — switch to a dark theme to see this logo.
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-primary shadow-app !rounded-full !px-5 !py-3"
        aria-label="Open theme & logo picker"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18M3 12h18" />
        </svg>
        Customize
      </button>
    </div>
  );
}

function Section({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? "" : "mb-5"}>
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{label}</p>
      {children}
    </div>
  );
}

function LayoutThumb({ id }: { id: LayoutId }) {
  const stroke = "var(--fg)";
  const accent = "var(--accent)";
  const surface = "var(--surface)";
  switch (id) {
    case "classic":
      return (
        <svg viewBox="0 0 80 50" className="w-full h-10">
          <rect width="80" height="50" rx="3" fill={surface} stroke="var(--border)" />
          <rect x="6" y="10" width="28" height="4" rx="1" fill={stroke} />
          <rect x="6" y="18" width="24" height="3" rx="1" fill={stroke} opacity="0.4" />
          <rect x="6" y="24" width="20" height="3" rx="1" fill={stroke} opacity="0.4" />
          <rect x="6" y="34" width="14" height="6" rx="1" fill={accent} />
          <rect x="42" y="8" width="32" height="34" rx="2" fill={accent} opacity="0.3" />
        </svg>
      );
    case "centered":
      return (
        <svg viewBox="0 0 80 50" className="w-full h-10">
          <rect width="80" height="50" rx="3" fill={surface} stroke="var(--border)" />
          <rect x="22" y="8" width="36" height="4" rx="1" fill={stroke} />
          <rect x="28" y="15" width="24" height="3" rx="1" fill={stroke} opacity="0.4" />
          <rect x="33" y="22" width="14" height="4" rx="1" fill={accent} />
          <rect x="6" y="30" width="68" height="14" rx="2" fill={accent} opacity="0.3" />
        </svg>
      );
    case "magazine":
      return (
        <svg viewBox="0 0 80 50" className="w-full h-10">
          <rect width="80" height="50" rx="3" fill={accent} opacity="0.4" />
          <rect width="80" height="50" rx="3" fill="black" opacity="0.55" />
          <rect x="6" y="12" width="32" height="4" rx="1" fill="white" />
          <rect x="6" y="20" width="26" height="3" rx="1" fill="white" opacity="0.6" />
          <rect x="6" y="30" width="14" height="6" rx="1" fill={accent} />
        </svg>
      );
    case "bento":
      return (
        <svg viewBox="0 0 80 50" className="w-full h-10">
          <rect width="80" height="50" rx="3" fill={surface} stroke="var(--border)" />
          <rect x="4" y="4" width="46" height="30" rx="2" fill={accent} opacity="0.25" />
          <rect x="52" y="4" width="24" height="42" rx="2" fill={accent} opacity="0.45" />
          <rect x="4" y="36" width="14" height="10" rx="2" fill="var(--fg)" opacity="0.15" />
          <rect x="20" y="36" width="14" height="10" rx="2" fill="var(--fg)" opacity="0.15" />
          <rect x="36" y="36" width="14" height="10" rx="2" fill={stroke} />
        </svg>
      );
  }
}
