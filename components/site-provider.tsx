"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, type ThemeId } from "@/lib/themes";
import { DEFAULT_TYPOGRAPHY, type TypographyId } from "@/lib/typography";
import { DEFAULT_LAYOUT, type LayoutId } from "@/lib/layouts";
import type { LogoId } from "@/lib/logos";

type SiteContextValue = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  logo: LogoId;
  setLogo: (l: LogoId) => void;
  typography: TypographyId;
  setTypography: (t: TypographyId) => void;
  layout: LayoutId;
  setLayout: (l: LayoutId) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

const THEME_KEY = "jveagle:theme";
const LOGO_KEY = "jveagle:logo";
const TYPO_KEY = "jveagle:typography";
const LAYOUT_KEY = "jveagle:layout";

export function SiteProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [logo, setLogoState] = useState<LogoId>("original");
  const [typography, setTypographyState] = useState<TypographyId>(DEFAULT_TYPOGRAPHY);
  const [layout, setLayoutState] = useState<LayoutId>(DEFAULT_LAYOUT);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(THEME_KEY) as ThemeId | null;
    const l = localStorage.getItem(LOGO_KEY) as LogoId | null;
    const ty = localStorage.getItem(TYPO_KEY) as TypographyId | null;
    const la = localStorage.getItem(LAYOUT_KEY) as LayoutId | null;
    if (t) setThemeState(t);
    if (l) setLogoState(l);
    if (ty) setTypographyState(ty);
    if (la) setLayoutState(la);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-typography", typography);
  }, [typography]);

  useEffect(() => {
    document.documentElement.setAttribute("data-layout", layout);
  }, [layout]);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
  };
  const setLogo = (l: LogoId) => {
    setLogoState(l);
    try { localStorage.setItem(LOGO_KEY, l); } catch {}
  };
  const setTypography = (t: TypographyId) => {
    setTypographyState(t);
    try { localStorage.setItem(TYPO_KEY, t); } catch {}
  };
  const setLayout = (l: LayoutId) => {
    setLayoutState(l);
    try { localStorage.setItem(LAYOUT_KEY, l); } catch {}
  };

  return (
    <SiteContext.Provider value={{ theme, setTheme, logo, setLogo, typography, setTypography, layout, setLayout }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
