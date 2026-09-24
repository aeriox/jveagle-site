"use client";

import { useEffect, useMemo, useState } from "react";
import { lookConfig, type LookPreset, type LookValues } from "@/lib/look.config";
import { useSite } from "@/components/site-provider";
import { isDarkTheme, type ThemeId } from "@/lib/themes";
import type { LayoutId } from "@/lib/layouts";
import type { LogoId } from "@/lib/logos";
import type { TypographyId } from "@/lib/typography";

function cloneValues(v: LookValues): LookValues {
  return { theme: v.theme, layout: v.layout, typography: v.typography, logo: v.logo };
}

function valuesEqual(a: LookValues, b: LookValues) {
  return a.theme === b.theme && a.layout === b.layout && a.typography === b.typography && a.logo === b.logo;
}

function matchPresetId(values: LookValues, presets: LookPreset[]) {
  return presets.find((p) => valuesEqual(values, p.values))?.id ?? null;
}

export function Look() {
  const { theme, setTheme, logo, setLogo, typography, setTypography, layout, setLayout } = useSite();
  const presets = lookConfig.PRESETS;
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [presetId, setPresetId] = useState<string | null>(presets[0]?.id ?? null);

  const values: LookValues = useMemo(
    () => ({ theme, layout, typography, logo }),
    [theme, layout, typography, logo],
  );

  useEffect(() => {
    setPresetId(matchPresetId(values, presets));
  }, [values, presets]);

  useEffect(() => {
    if (open) document.documentElement.dataset.pickerOpen = "1";
    else delete document.documentElement.dataset.pickerOpen;
  }, [open]);

  function applyPreset(p: LookPreset) {
    const v = cloneValues(p.values);
    setTheme(v.theme);
    setLayout(v.layout);
    setTypography(v.typography);
    setLogo(v.logo);
    setPresetId(p.id);
    try {
      localStorage.setItem(lookConfig.key, JSON.stringify({ ...v, presetId: p.id }));
    } catch {}
  }

  function reset() {
    applyPreset(presets[0]);
    try {
      localStorage.removeItem(lookConfig.key);
    } catch {}
  }

  function setThemeAxis(mode: "light" | "dark") {
    if (mode === "dark") setTheme("dark-pro");
    else if (isDarkTheme(theme)) setTheme("navy-gold");
  }

  const status = presetId ? presets.find((p) => p.id === presetId)?.name || "" : "Custom";
  const modeValue: "light" | "dark" = isDarkTheme(theme) ? "dark" : "light";

  return (
    <div
      className={`look-picker pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 max-md:bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] ${open ? "is-open" : ""}`}
    >
      {open && (
        <div className="look-panel pointer-events-auto w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-app bg-surface p-1.5 shadow-2xl shadow-black/20">
          <div className="max-h-[min(70vh,calc(100dvh-5.5rem))] overflow-y-auto rounded-[calc(1rem-0.375rem)] bg-app p-4">
            <div className="look-head flex items-center gap-2">
              <span className="eyebrow text-accent">Look</span>
              <span className="text-[0.7rem] text-muted">{status}</span>
              {!presetId && <span className="ml-auto text-[0.65rem] uppercase tracking-wider text-muted">Custom</span>}
              <button type="button" aria-label="Close" className="ml-auto text-muted hover:text-fg" onClick={() => setOpen(false)}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="look-presets mt-3 grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`look-preset rounded-xl border p-1.5 text-center transition-colors ${
                    presetId === p.id ? "border-[var(--accent)]" : "border-app hover:border-[var(--accent)]/50"
                  }`}
                  onClick={() => applyPreset(p)}
                  aria-label={p.name}
                >
                  <span className="look-preset-thumb block aspect-[4/3] overflow-hidden rounded-lg bg-app">
                    {p.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.thumb} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-[0.72rem] font-medium text-fg">{p.name}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="look-customize-link mt-3 text-left text-[0.78rem] underline text-fg"
              aria-expanded={customize}
              aria-controls="look-customize"
              onClick={() => setCustomize((c) => !c)}
            >
              Customize
            </button>

            {customize && (
              <div id="look-customize" className="look-customize mt-3 space-y-3">
                <Axis
                  label="Layout"
                  options={lookConfig.layouts}
                  value={layout}
                  onPick={(id) => setLayout(id as LayoutId)}
                />
                <Axis
                  label="Theme"
                  options={[
                    { id: "light", label: "Light" },
                    { id: "dark", label: "Dark" },
                  ]}
                  value={modeValue}
                  onPick={(id) => setThemeAxis(id as "light" | "dark")}
                />
                <Axis
                  label="Palette"
                  options={lookConfig.themes}
                  value={theme}
                  onPick={(id) => setTheme(id as ThemeId)}
                />
                <Axis
                  label="Type"
                  options={lookConfig.fonts}
                  value={typography}
                  onPick={(id) => setTypography(id as TypographyId)}
                />
                <Axis
                  label="Logo"
                  options={lookConfig.logos}
                  value={logo}
                  onPick={(id) => setLogo(id as LogoId)}
                />
                <button type="button" className="look-reset text-[0.78rem] underline text-muted" onClick={reset}>
                  Reset to Look 1
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Look"
        aria-expanded={open}
        className="look-toggle pointer-events-auto flex h-12 items-center justify-center rounded-full bg-accent px-4 text-[0.8rem] font-medium text-[var(--accent-fg)] shadow-lg shadow-black/20"
      >
        Look
      </button>
    </div>
  );
}

function Axis({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <div className="eyebrow text-accent">{label}</div>
      <div className="mt-2 flex flex-col gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            className={`rounded-lg px-3 py-2 text-left text-[0.8rem] transition-colors ${
              value === o.id ? "bg-accent text-[var(--accent-fg)]" : "hover:bg-app text-fg"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
