import type { CSSProperties } from "react";
import type { FontKey, StoreId, Theme, ThemeFile, Tone } from "./types";
import juniper from "../../themes/juniper.json";
import sageAndStone from "../../themes/sage-and-stone.json";
import studioNoir from "../../themes/studio-noir.json";

/** Body and display font stacks for each typeface token. */
export const FONTS: Record<FontKey, [body: string, display: string]> = {
  inter: ["Inter,system-ui,sans-serif", '"Inter Tight",Inter,sans-serif'],
  fraunces: ["Inter,system-ui,sans-serif", "Fraunces,Georgia,serif"],
  grotesk: ['"Space Grotesk",Inter,sans-serif', '"Space Grotesk",Inter,sans-serif'],
};

export const CORNERS = [
  { value: 2, label: "Sharp" },
  { value: 14, label: "Soft" },
  { value: 22, label: "Round" },
] as const;

export const TONES: { value: Tone; label: string }[] = [
  { value: "warm", label: "Warm" },
  { value: "brief", label: "Brief" },
];

function fromFile(id: string, file: ThemeFile, url: string, store: StoreId): Theme {
  return {
    id,
    name: file.brand.name,
    bot: file.brand.assistantName,
    color: file.color.primary,
    font: file.type.family,
    corner: file.shape.radius,
    tone: file.voice,
    url,
    store,
  };
}

/** Presets are loaded straight from the JSON files in /themes. Each brand sells something different. */
export const PRESETS: Theme[] = [
  fromFile("juniper", juniper as ThemeFile, "juniper.example", "yoga"),
  fromFile("sage", sageAndStone as ThemeFile, "sageandstone.example", "plants"),
  fromFile("noir", studioNoir as ThemeFile, "studionoir.example", "coats"),
];

/** Black or white text, whichever reads better on the brand colour. */
export function textOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? "#1d1a22" : "#ffffff";
}

/** CSS custom properties the whole widget reads from. */
export function themeVars(t: Theme): CSSProperties {
  return {
    "--b": t.color,
    "--bt": textOn(t.color),
    "--r": `${t.corner}px`,
    "--ff": FONTS[t.font][0],
    "--fd": FONTS[t.font][1],
  } as CSSProperties;
}

/** The theme as engineering would receive it: same shape as /themes/*.json. */
export function toThemeFile(t: Theme): ThemeFile {
  return {
    brand: { name: t.name, assistantName: t.bot },
    color: { primary: t.color, onPrimary: textOn(t.color) },
    type: { family: t.font },
    shape: { radius: t.corner },
    voice: t.tone,
  };
}

/** Pick copy for the brand's voice. */
export const voice = (t: Theme, warm: string, brief: string) => (t.tone === "brief" ? brief : warm);
