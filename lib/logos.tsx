/* eslint-disable @next/next/no-img-element */
import { isDarkTheme, type ThemeId } from "./themes";

export type LogoId =
  | "chrome-eagle"
  | "silver-eagle"
  | "silver-wave"
  | "modern-wide"
  | "navy-gold"
  | "shield-wings"
  | "crest-wide"
  | "original";

export type LogoMeta = {
  id: LogoId;
  name: string;
  description: string;
  src: string;
  darkOnly?: boolean;
};

export const FALLBACK_LOGO: LogoId = "original";

/** When a dark-only logo is picked under a light theme, fall back. */
export function effectiveLogoId(id: LogoId, theme: ThemeId): LogoId {
  const meta = LOGOS.find((l) => l.id === id);
  if (meta?.darkOnly && !isDarkTheme(theme)) return FALLBACK_LOGO;
  return id;
}

export const LOGOS: LogoMeta[] = [
  {
    id: "chrome-eagle",
    name: "Chrome Eagle (Oval)",
    description: "Silver eagle in chrome oval frame — dark themes only",
    src: "/logos/chrome-eagle.png",
    darkOnly: true,
  },
  {
    id: "silver-eagle",
    name: "Silver Eagle",
    description: "Silver eagle with water drops — dark themes only",
    src: "/logos/silver-eagle.png",
    darkOnly: true,
  },
  {
    id: "silver-wave",
    name: "Silver Wave",
    description: "Silver eagle with water accents — dark themes only",
    src: "/logos/silver-wave.png",
    darkOnly: true,
  },
  {
    id: "modern-wide",
    name: "Modern Wide",
    description: "Angular navy eagle, horizontal layout",
    src: "/logos/modern-wide.png",
  },
  {
    id: "navy-gold",
    name: "Navy + Gold",
    description: "Navy eagle with gold roof accent",
    src: "/logos/navy-gold.png",
  },
  {
    id: "shield-wings",
    name: "Shield Wings",
    description: "Winged eagle inside shield emblem",
    src: "/logos/shield-wings.png",
  },
  {
    id: "crest-wide",
    name: "Crest Wide",
    description: "Bold eagle crest with side wordmark",
    src: "/logos/crest-wide.png",
  },
  {
    id: "original",
    name: "Original (Website)",
    description: "Logo from current website",
    src: "/logos/original.jpeg",
  },
];

const META: Record<LogoId, LogoMeta> = Object.fromEntries(
  LOGOS.map((l) => [l.id, l]),
) as Record<LogoId, LogoMeta>;

export function Logo({
  id,
  className,
}: {
  id: LogoId;
  className?: string;
  variant?: "full" | "compact";
}) {
  const meta = META[id] ?? META["chrome-eagle"];
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      <img
        src={meta.src}
        alt="JV Eagle Roofing & Waterproofing"
        style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
      />
    </span>
  );
}
