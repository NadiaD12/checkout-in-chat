import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Theme } from "../types";
import { voice } from "../theme";
import { STORES, cartTotals, lower } from "../data";

/** What a message shows. Cards are rendered from live state (theme, quantity, payment). */
export type Body =
  | { kind: "typing" }
  | { kind: "greet" }
  | { kind: "text"; content: ReactNode }
  | { kind: "picks" }
  | { kind: "cart" }
  | { kind: "confirm" }
  | { kind: "done"; order: string; qty: number; total: number };

export interface Message {
  id: number;
  from: "a" | "u";
  card: boolean;
  body: Body;
}

export type PayState = "idle" | "processing" | "paid";

/** Thrown into a scripted flow when the conversation is reset mid-way. */
class Cancelled extends Error {}

const PAY_STEP = 4;

/** Off-script chips: a quick answer, then the chips that steer back to the flow. */
function sideChips(t: Theme): Record<string, { reply: string; then: string[] }> {
  const { chips, copy, variant } = STORES[t.store];
  return {
    [chips.notify]: {
      reply: voice(t, `Done, you’ll get one message when it’s back. Want ${lower(variant.got)} in the meantime?`, `Done. ${variant.got} in the meantime?`),
      then: [chips.accept],
    },
    [chips.compare]: { reply: copy.compare, then: [chips.add] },
    [chips.ship]: { reply: copy.ship, then: [chips.ask] },
    "Keep shopping": { reply: voice(t, "Anytime. I’m here if you need anything.", "Sure."), then: [] },
    "Thanks!": { reply: voice(t, ...copy.thanks), then: [] },
  };
}

export function useConversation(theme: Theme) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [qty, setQtyState] = useState(1);
  const [pay, setPay] = useState<PayState>("idle");

  // Refs keep the async script reading the latest values between renders.
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const qtyRef = useRef(1);
  const ids = useRef(0);
  const session = useRef(0);
  const step = useRef(0);
  const busy = useRef(false);
  const auto = useRef(false);
  const timers = useRef(new Set<number>());
  /** 0 skips every delay: used to jump straight to a step for screenshots. */
  const speed = useRef(1);

  const nextId = () => ++ids.current;

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const s = session.current;
        const t = window.setTimeout(() => {
          timers.current.delete(t);
          if (s === session.current) resolve();
          else reject(new Cancelled());
        }, ms * speed.current);
        timers.current.add(t);
      }),
    [],
  );

  const addUser = (text: string) =>
    setMessages((m) => [...m, { id: nextId(), from: "u", card: false, body: { kind: "text", content: text } }]);

  /** Show a typing indicator, then swap it for the reply. */
  const say = async (body: Body, card = false, delay = 650) => {
    const id = nextId();
    setMessages((m) => [...m, { id, from: "a", card: false, body: { kind: "typing" } }]);
    await wait(delay);
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, card, body } : x)));
  };
  const sayText = (content: ReactNode, delay?: number) => say({ kind: "text", content }, false, delay);

  const store = () => STORES[themeRef.current.store];

  /** The scripted happy path, the same for every store. `user` is what the shopper sends to start each step. */
  const steps: { user: () => string | null; run: () => Promise<void> }[] = [
    {
      user: () => store().chips.ask,
      run: async () => {
        const { copy, chips } = store();
        await sayText(voice(themeRef.current, ...copy.intro));
        await say({ kind: "picks" }, true, 500);
        setChips([chips.add, chips.compare]);
      },
    },
    {
      user: () => store().chips.add,
      run: async () => {
        const t = themeRef.current;
        const { variant, chips } = store();
        const tag = <span className="tag warn">Restocks {variant.restock}</span>;
        await sayText(
          t.tone === "brief" ? (
            <>{variant.want}: sold out. {tag}<br />{variant.got} ships today.</>
          ) : (
            <>{variant.want} is sold out right now. {tag}<br />{variant.got} ships today, or I can let you know when {lower(variant.want)} is back.</>
          ),
        );
        setChips([chips.accept, chips.notify]);
      },
    },
    {
      user: () => store().chips.accept,
      run: async () => {
        await sayText(voice(themeRef.current, "Added. Here’s your cart. You can change the quantity right here.", "Added. Your cart:"));
        await say({ kind: "cart" }, true, 400);
        setChips(["Check out", "Keep shopping"]);
      },
    },
    {
      user: () => "Check out",
      run: async () => {
        await sayText(voice(themeRef.current, "Almost done. Please check these before I place the order:", "Confirm to place your order:"));
        await say({ kind: "confirm" }, true, 500);
        setChips([]);
      },
    },
    {
      user: () => null, // started by tapping "Confirm and pay"
      run: async () => {
        setPay("processing");
        await wait(900);
        setPay("paid");
        const t = themeRef.current;
        const { picks, copy } = store();
        const prefix = t.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "OR";
        const q = qtyRef.current;
        await say({ kind: "done", order: `${prefix}-20481`, qty: q, total: cartTotals(picks[0].price, q).total }, true, 500);
        await sayText(voice(t, ...copy.tip));
        setChips(["Thanks!"]);
      },
    },
  ];

  const schedule = () => {
    if (step.current >= steps.length) {
      auto.current = false;
      return;
    }
    const s = session.current;
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      if (s === session.current) void next();
    }, step.current === PAY_STEP ? 1700 : 1500);
    timers.current.add(t);
  };

  async function next(text?: string) {
    if (busy.current) return;
    const current = steps[step.current];
    if (!current) return;
    busy.current = true;
    const s = session.current;
    try {
      const said = current.user();
      if (said) {
        addUser(text ?? said);
        setChips([]);
      }
      await current.run();
      if (s !== session.current) return;
      step.current += 1;
      busy.current = false;
      if (auto.current) schedule();
    } catch (e) {
      if (!(e instanceof Cancelled)) throw e;
    }
  }

  const reset = () => {
    session.current += 1;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
    auto.current = false;
    busy.current = false;
    speed.current = 1;
    step.current = 0;
    qtyRef.current = 1;
    setQtyState(1);
    setPay("idle");
    setMessages([{ id: nextId(), from: "a", card: false, body: { kind: "greet" } }]);
    const { chips } = STORES[themeRef.current.store];
    setChips([chips.ask, chips.ship]);
  };

  const play = () => {
    reset();
    auto.current = true;
    schedule();
  };

  /** Run the first `count` steps with no delays, e.g. to land on the cart for a screenshot. */
  const jumpTo = async (count: number) => {
    reset();
    speed.current = 0;
    const s = session.current;
    try {
      while (step.current < Math.min(count, PAY_STEP) && s === session.current) await next();
    } finally {
      if (s === session.current) speed.current = 1;
    }
  };

  const tapChip = (label: string) => {
    const side = sideChips(themeRef.current)[label];
    if (!side) return void next(label);
    addUser(label);
    setChips([]);
    sayText(side.reply)
      .then(() => setChips(side.then))
      .catch((e) => {
        if (!(e instanceof Cancelled)) throw e;
      });
  };

  const send = (text: string) => {
    if (step.current === 0) return void next(text);
    addUser(text);
    void sayText("Happy to help with that. For this demo, tap a suggestion below to keep going.").catch(() => {});
  };

  const askHuman = () => {
    const t = themeRef.current;
    void sayText(
      voice(
        t,
        `Connecting you with the ${t.name} team. Average wait is under 2 minutes, and they’ll see this conversation so you don’t repeat yourself.`,
        "Connecting you to a person. They’ll see this chat.",
      ),
    ).catch(() => {});
  };

  const setQty = (delta: number) => {
    const q = Math.max(1, Math.min(5, qtyRef.current + delta));
    qtyRef.current = q;
    setQtyState(q);
  };

  const confirmPay = () => {
    if (step.current === PAY_STEP) void next();
  };

  // Start with a greeting; clear timers on unmount.
  useEffect(() => {
    reset();
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { messages, chips, qty, pay, reset, play, jumpTo, tapChip, send, askHuman, setQty, confirmPay };
}

export type Conversation = ReturnType<typeof useConversation>;
