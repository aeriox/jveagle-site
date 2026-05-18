export type ThemeId = "navy-gold" | "bold-crimson" | "coastal-teal" | "dark-pro";

export type Theme = {
  id: ThemeId;
  name: string;
  description: string;
  swatch: [string, string, string];
  surface: "light" | "dark";
};

export function isDarkTheme(id: ThemeId): boolean {
  return THEMES.find((t) => t.id === id)?.surface === "dark";
}

export const THEMES: Theme[] = [
  {
    id: "navy-gold",
    name: "Navy & Gold",
    description: "Classic, trustworthy, premium",
    swatch: ["#0B2545", "#D4A437", "#F7F4EE"],
    surface: "light",
  },
  {
    id: "bold-crimson",
    name: "Bold Crimson",
    description: "Strong, masculine, contractor",
    swatch: ["#1A1A1A", "#B91C1C", "#F5F1E8"],
    surface: "light",
  },
  {
    id: "coastal-teal",
    name: "Coastal Teal",
    description: "Modern Florida, fresh",
    swatch: ["#0F4C5C", "#E29578", "#FDFCFA"],
    surface: "light",
  },
  {
    id: "dark-pro",
    name: "Dark Pro",
    description: "Sleek, modern, high-contrast",
    swatch: ["#0A0A0A", "#F97316", "#FAFAFA"],
    surface: "dark",
  },
];

export const DEFAULT_THEME: ThemeId = "navy-gold";
