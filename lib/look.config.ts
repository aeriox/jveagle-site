import type { LayoutId } from "@/lib/layouts";
import type { LogoId } from "@/lib/logos";
import type { ThemeId } from "@/lib/themes";
import type { TypographyId } from "@/lib/typography";

export type LookValues = {
  theme: ThemeId;
  layout: LayoutId;
  typography: TypographyId;
  logo: LogoId;
};

export type LookPreset = {
  id: string;
  name: string;
  thumb?: string;
  swatch?: [string, string, string];
  values: LookValues;
};

/** Roofing trade: Solid / Neighborhood / Heritage — look 1 = live default */
export const lookConfig = {
  key: "jveagle-look",
  brand: "JV Eagle Roofing",
  DEFAULTS: {
    theme: "navy-gold",
    layout: "classic",
    typography: "modern-sans",
    logo: "original",
  } as LookValues,
  PRESETS: [
    {
      id: "solid",
      name: "Solid",
      thumb: "/hero/services.webp",
      values: {
        theme: "navy-gold",
        layout: "classic",
        typography: "modern-sans",
        logo: "original",
      },
    },
    {
      id: "neighborhood",
      name: "Neighborhood",
      thumb: "/hero/repairs.webp",
      values: {
        theme: "coastal-teal",
        layout: "centered",
        typography: "friendly",
        logo: "shield-wings",
      },
    },
    {
      id: "heritage",
      name: "Heritage",
      thumb: "/hero/replacements.webp",
      values: {
        theme: "navy-gold",
        layout: "magazine",
        typography: "editorial-serif",
        logo: "crest-wide",
      },
    },
  ] as LookPreset[],
  themes: [
    { id: "navy-gold", label: "Navy & Gold" },
    { id: "bold-crimson", label: "Bold Crimson" },
    { id: "coastal-teal", label: "Coastal Teal" },
    { id: "dark-pro", label: "Dark Pro" },
  ],
  layouts: [
    { id: "classic", label: "Classic" },
    { id: "centered", label: "Centered" },
    { id: "magazine", label: "Magazine" },
    { id: "bento", label: "Bento" },
  ],
  fonts: [
    { id: "modern-sans", label: "Modern Sans" },
    { id: "editorial-serif", label: "Editorial Serif" },
    { id: "industrial", label: "Industrial" },
    { id: "friendly", label: "Friendly" },
  ],
  logos: [
    { id: "original", label: "Original" },
    { id: "navy-gold", label: "Navy + Gold" },
    { id: "shield-wings", label: "Shield Wings" },
    { id: "crest-wide", label: "Crest Wide" },
    { id: "modern-wide", label: "Modern Wide" },
    { id: "chrome-eagle", label: "Chrome Eagle (dark)" },
    { id: "silver-eagle", label: "Silver Eagle (dark)" },
    { id: "silver-wave", label: "Silver Wave (dark)" },
  ],
};
