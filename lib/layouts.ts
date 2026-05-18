export type LayoutId = "classic" | "centered" | "magazine" | "bento";

export type Layout = {
  id: LayoutId;
  name: string;
  description: string;
};

export const LAYOUTS: Layout[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Text left, image right, floating badge",
  },
  {
    id: "centered",
    name: "Centered Editorial",
    description: "Centered hero, image strip below",
  },
  {
    id: "magazine",
    name: "Magazine",
    description: "Full-bleed image, text overlay",
  },
  {
    id: "bento",
    name: "Bento Grid",
    description: "Asymmetric tiles, modern bold",
  },
];

export const DEFAULT_LAYOUT: LayoutId = "classic";
