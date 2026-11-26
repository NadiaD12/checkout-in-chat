import type { Product, StoreId } from "./types";

/** Unsplash photo, cropped square at the size we need. */
const u = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=80`;

/** A pair of lines: one for a warm brand voice, one for a brief one. */
export type Line = [warm: string, brief: string];

/** Everything that changes from one store to the next. The chat flow itself is shared. */
export interface StoreData {
  /** Path shown in the browser bar. */
  slug: string;
  nav: string[];
  placeholder: string;
  /** Three picks. The first is the one the shopper buys. */
  picks: [Product, Product, Product];
  pickTag: string;
  variant: { want: string; got: string; restock: string };
  cartLine: string;
  pdp: {
    kicker: string;
    hero: string;
    heroAlt: string;
    gallery: [src: string, alt: string][];
    option: [label: string, value: string];
    swatches: { color: string; title: string; on?: boolean; out?: boolean }[];
    features: string[];
  };
  chips: {
    ask: string;
    add: string;
    accept: string;
    notify: string;
    compare: string;
    ship: string;
  };
  copy: {
    intro: Line;
    compare: string;
    ship: string;
    tip: Line;
    thanks: Line;
  };
  merchant: {
    kpis: [value: string, label: string][];
    reasons: [label: string, pct: number][];
    asks: [question: string, detail: string][];
  };
}

export const STORES: Record<StoreId, StoreData> = {
  yoga: {
    slug: "products/grip-pro-mat",
    nav: ["Mats", "Props", "Apparel"],
    placeholder: "Ask about sizes, materials, delivery…",
    picks: [
      { name: "Grip Pro Mat", price: 118, why: "Natural rubber, stays grippy in heat", thumb: "img/plum-t.jpg" },
      { name: "Align Mat", price: 128, why: "Printed alignment guides, extra long", thumb: "img/align-t.jpg" },
      { name: "Marble Flow Mat", price: 96, why: "Lighter, grips more as you sweat", thumb: "img/sage-t.jpg" },
    ],
    pickTag: "Most reviewed for hot yoga",
    variant: { want: "Sage", got: "Plum", restock: "Dec 9" },
    cartLine: "Grip Pro Mat · Plum",
    pdp: {
      kicker: "Mats · Best seller",
      hero: "img/plum.jpg",
      heroAlt: "Grip Pro Mat in plum, partly rolled",
      gallery: [
        ["img/plum.jpg", ""],
        ["img/align.jpg", "Align Mat in use outdoors"],
        ["img/sage.jpg", "Marble Flow Mat in use"],
      ],
      option: ["Colour", "Plum"],
      swatches: [
        { color: "#7a4060", title: "Plum", on: true },
        { color: "#8fa88a", title: "Sage, sold out", out: true },
        { color: "#2e2a33", title: "Black" },
      ],
      features: ["Natural rubber base, 5 mm cushioning", "Stays grippy in heat and sweat", "Alignment line down the centre", "183 × 66 cm, 2.4 kg"],
    },
    chips: {
      ask: "I need a non-slip mat for hot yoga",
      add: "Add the Grip Pro in sage",
      accept: "Plum is perfect",
      notify: "Notify me for sage",
      compare: "What’s the difference?",
      ship: "Do you ship to Canada?",
    },
    copy: {
      intro: ["Good call, regular mats get slippery in heat. These are the three shoppers like you pick most:", "Top picks for hot yoga:"],
      compare:
        "Grip Pro grips straight away and cushions most. Align has printed guides and is extra long. Marble Flow is lighter and grips better the more you sweat.",
      ship: "Yes, free shipping anywhere in Canada on orders over $75, usually 2 to 4 business days.",
      tip: ["Tip: wipe natural rubber with a damp cloth, no soap, and it stays grippy for years.", "Care tip: damp cloth, no soap."],
      thanks: ["Enjoy your practice!", "You’re welcome."],
    },
    merchant: {
      kpis: [
        ["1,284", "shopping chats"],
        ["23%", "chats that ended in an order"],
        ["$96", "average order in chat"],
        ["41", "asked for Grip Pro in sage (sold out)"],
      ],
      reasons: [
        ["Grip for hot yoga", 38],
        ["Eco and natural materials", 22],
        ["Mat for travel", 15],
        ["Sizing for tall bodies", 12],
        ["Gift ideas", 8],
        ["Shipping and returns", 5],
      ],
      asks: [
        ["Do you have the Grip Pro in sage?", "41 shoppers · restocks Dec 9"],
        ["Is there an extra-long version?", "17 shoppers · not in catalogue"],
        ["Can I get it gift wrapped?", "9 shoppers · not offered yet"],
      ],
    },
  },

  plants: {
    slug: "plants/snake-plant",
    nav: ["Plants", "Pots", "Care"],
    placeholder: "Ask about light, care, delivery…",
    picks: [
      { name: "Snake Plant", price: 48, why: "Happy far from a window, water every few weeks", thumb: u("1687552212914-03a30c82053c", 160) },
      { name: "ZZ Plant", price: 54, why: "Glossy leaves, shrugs off missed waterings", thumb: u("1607776996766-8b9e3ae74f5c", 160) },
      { name: "Spider Plant", price: 32, why: "Pet-safe and quick to grow", thumb: u("1622459369222-93bb1fb9bb1f", 160) },
    ],
    pickTag: "Easiest in low light",
    variant: { want: "The stone pot", got: "The clay pot", restock: "Dec 12" },
    cartLine: "Snake Plant · Clay pot",
    pdp: {
      kicker: "Plants · Best seller",
      hero: u("1687552212914-03a30c82053c", 900),
      heroAlt: "Snake plant in a clay pot",
      gallery: [
        [u("1687552212914-03a30c82053c", 300), ""],
        [u("1642004346232-7717892cec48", 300), "Snake plant in a woven pot, styled in a living room"],
        [u("1593482892290-f54927ae1bb6", 300), "Tall snake plant in a white pot"],
      ],
      option: ["Pot", "Clay"],
      swatches: [
        { color: "#b8714f", title: "Clay", on: true },
        { color: "#a7a29a", title: "Stone, sold out", out: true },
        { color: "#f1eee8", title: "White" },
      ],
      features: ["Handles low light and missed waterings", "Arrives potted, 50 to 60 cm tall", "Not pet-safe, keep away from cats and dogs", "Free care card in every box"],
    },
    chips: {
      ask: "I need a plant for a low-light bedroom",
      add: "Add the snake plant in the stone pot",
      accept: "The clay pot is perfect",
      notify: "Notify me for stone",
      compare: "Which is easiest?",
      ship: "Do you deliver in Toronto?",
    },
    copy: {
      intro: ["Good news, a few plants are happy far from a window. These are the three shoppers like you pick most:", "Top picks for low light:"],
      compare:
        "Snake Plant is the hardest to kill and only needs water every few weeks. ZZ is just as easy with softer, glossy leaves. Spider Plant likes a bit more light but is the one to pick if you have pets.",
      ship: "Yes, we hand-deliver across Toronto in 1 to 2 days, wrapped so the plant stays warm.",
      tip: ["Tip: water it every 2 to 3 weeks, only once the soil is fully dry. It’s happy far from the window.", "Care: water every 2 to 3 weeks."],
      thanks: ["Enjoy your new plant!", "You’re welcome."],
    },
    merchant: {
      kpis: [
        ["946", "shopping chats"],
        ["27%", "chats that ended in an order"],
        ["$61", "average order in chat"],
        ["33", "asked for the snake plant in stone (sold out)"],
      ],
      reasons: [
        ["Plants for low light", 34],
        ["Pet-safe plants", 21],
        ["Care and watering", 17],
        ["Gift ideas", 13],
        ["Pot sizes", 9],
        ["Delivery", 6],
      ],
      asks: [
        ["Is the snake plant in the stone pot?", "33 shoppers · restocks Dec 12"],
        ["Which plants are safe for cats?", "24 shoppers · no pet-safe filter yet"],
        ["Can you deliver to my office?", "11 shoppers · home delivery only"],
      ],
    },
  },

  coats: {
    slug: "outerwear/long-wool-coat",
    nav: ["Outerwear", "Knitwear", "Trousers"],
    placeholder: "Ask about sizes, fabric, delivery…",
    picks: [
      { name: "Long Wool Coat", price: 420, why: "Wool and cashmere, falls below the knee", thumb: u("1735559001354-76bb1a94b16a", 160) },
      { name: "Oversized Coat", price: 380, why: "Dropped shoulders, room for a thick knit", thumb: u("1741591567621-e70d842e07f1", 160) },
      { name: "Belted Trench", price: 340, why: "Water-resistant, for milder days", thumb: u("1676716105765-e19fe6a01851", 160) },
    ],
    pickTag: "Warmest in the range",
    variant: { want: "Size S", got: "Size M", restock: "Dec 15" },
    cartLine: "Long Wool Coat · Black · M",
    pdp: {
      kicker: "Outerwear · New season",
      hero: u("1794305459035-9c3da251b120", 900),
      heroAlt: "Long black wool coat, worn outdoors",
      gallery: [
        [u("1794305459035-9c3da251b120", 300), ""],
        [u("1735559001354-76bb1a94b16a", 300), "Long Wool Coat, front"],
        [u("1741591567621-e70d842e07f1", 300), "Oversized Coat, worn with a beanie"],
      ],
      option: ["Colour", "Black"],
      swatches: [
        { color: "#141414", title: "Black", on: true },
        { color: "#4a4744", title: "Charcoal" },
        { color: "#b08a5c", title: "Camel" },
      ],
      features: ["80% wool, 20% cashmere", "Falls below the knee", "Fully lined, two inside pockets", "Sizes XS to XL"],
    },
    chips: {
      ask: "I need a warm black coat for winter",
      add: "Add the long coat in size S",
      accept: "Size M is fine",
      notify: "Notify me for size S",
      compare: "What’s the difference?",
      ship: "Do you ship to Canada?",
    },
    copy: {
      intro: ["Good call, these hold up in a real winter. These are the three shoppers like you pick most:", "Top picks for winter:"],
      compare:
        "The Long Wool Coat is the warmest and the longest. The Oversized Coat is just as warm with more room for layers. The Belted Trench is lighter, for spring and autumn.",
      ship: "Yes. Free express shipping in Canada, 1 to 3 business days, and free returns.",
      tip: ["Tip: dry clean only, and keep it on a wide hanger so the shoulders hold their shape.", "Care: dry clean only."],
      thanks: ["Wear it well!", "You’re welcome."],
    },
    merchant: {
      kpis: [
        ["1,512", "shopping chats"],
        ["19%", "chats that ended in an order"],
        ["$388", "average order in chat"],
        ["52", "asked for the long coat in S (sold out)"],
      ],
      reasons: [
        ["Warmth and fabric", 31],
        ["Sizing and fit", 26],
        ["Length for petite or tall", 14],
        ["Gift ideas", 11],
        ["Care", 10],
        ["Shipping and returns", 8],
      ],
      asks: [
        ["Is the long coat in size S?", "52 shoppers · restocks Dec 15"],
        ["Is there a petite length?", "19 shoppers · not in catalogue"],
        ["Does it come in navy?", "12 shoppers · not offered yet"],
      ],
    },
  },
};

export const TAX_RATE = 0.13;

export const money = (n: number) => `$${n.toFixed(2)}`;

export function cartTotals(price: number, qty: number) {
  const sub = price * qty;
  const tax = +(sub * TAX_RATE).toFixed(2);
  return { sub, tax, total: sub + tax };
}

/** Lower-case the first letter, e.g. "The clay pot" → "the clay pot". */
export const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const NOTES: [title: string, body: string][] = [
  ["One widget, any brand", "Colour, type, corners, names and voice are tokens. A new store goes live by filling in its brand kit, not by redesigning screens."],
  ["Nothing is bought without a tap", "The assistant prepares the order, but the shopper confirms the total, address and card before anything is charged."],
  ["It recovers instead of failing", "When an item is sold out, it offers what ships today or the restock date, never a dead end."],
  ["A person is one tap away", "“Talk to a person” stays in the header, and the team sees the whole conversation."],
];
