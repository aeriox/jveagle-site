export type TypographyId = "modern-sans" | "editorial-serif" | "industrial" | "friendly";

export type Typography = {
  id: TypographyId;
  name: string;
  description: string;
  sample: string;
};

export const TYPOGRAPHIES: Typography[] = [
  {
    id: "modern-sans",
    name: "Modern Sans",
    description: "Inter · tight, bold, contemporary",
    sample: "Aa",
  },
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    description: "Playfair · elegant, premium, magazine",
    sample: "Aa",
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "JetBrains Mono · technical, contractor",
    sample: "Aa",
  },
  {
    id: "friendly",
    name: "Friendly Rounded",
    description: "DM Sans · approachable, warm",
    sample: "Aa",
  },
];

export const DEFAULT_TYPOGRAPHY: TypographyId = "modern-sans";
