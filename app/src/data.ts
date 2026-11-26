import type { Product } from "./types";

export const PRODUCTS = {
  grip: { name: "Grip Pro Mat", price: 118, why: "Natural rubber, stays grippy in heat", thumb: "img/plum-t.jpg" },
  align: { name: "Align Mat", price: 128, why: "Printed alignment guides, extra long", thumb: "img/align-t.jpg" },
  flow: { name: "Marble Flow Mat", price: 96, why: "Lighter, grips more as you sweat", thumb: "img/sage-t.jpg" },
} satisfies Record<string, Product>;

export type ProductKey = keyof typeof PRODUCTS;

export const TAX_RATE = 0.13;

export const money = (n: number) => `$${n.toFixed(2)}`;

export function cartTotals(qty: number) {
  const sub = PRODUCTS.grip.price * qty;
  const tax = +(sub * TAX_RATE).toFixed(2);
  return { sub, tax, total: sub + tax };
}

export const REASONS: [label: string, pct: number][] = [
  ["Grip for hot yoga", 38],
  ["Eco and natural materials", 22],
  ["Mat for travel", 15],
  ["Sizing for tall bodies", 12],
  ["Gift ideas", 8],
  ["Shipping and returns", 5],
];

export const ASKS: [question: string, detail: string][] = [
  ["Do you have the Grip Pro in sage?", "41 shoppers · restocks Dec 9"],
  ["Is there an extra-long version?", "17 shoppers · not in catalogue"],
  ["Can I get it gift wrapped?", "9 shoppers · not offered yet"],
];

export const NOTES: [title: string, body: string][] = [
  ["One widget, any brand", "Colour, type, corners, names and voice are tokens. A new store goes live by filling in its brand kit, not by redesigning screens."],
  ["Nothing is bought without a tap", "The assistant prepares the order, but the shopper confirms the total, address and card before anything is charged."],
  ["It recovers instead of failing", "When a colour is sold out, it offers what ships today or the restock date, never a dead end."],
  ["A person is one tap away", "“Talk to a person” stays in the header, and the team sees the whole conversation."],
];
