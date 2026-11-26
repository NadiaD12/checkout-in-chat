export type FontKey = "inter" | "fraunces" | "grotesk";
export type Tone = "warm" | "brief";
export type Corner = 2 | 14 | 22;
export type View = "shop" | "kit" | "mer";

/** The shape of every file in /themes. A new brand is one of these. */
export interface ThemeFile {
  brand: { name: string; assistantName: string };
  color: { primary: string; onPrimary: string };
  type: { family: FontKey };
  shape: { radius: number };
  voice: Tone;
}

/** The live theme the assistant renders with. */
export interface Theme {
  id: string;
  name: string;
  bot: string;
  color: string;
  font: FontKey;
  corner: number;
  tone: Tone;
  url: string;
}

export interface Product {
  name: string;
  price: number;
  why: string;
  thumb: string;
}
