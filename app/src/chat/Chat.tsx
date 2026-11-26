import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Theme } from "../types";
import { voice } from "../theme";
import { STORES, cartTotals, money, type StoreData } from "../data";
import type { Body, Conversation, PayState } from "./useConversation";

interface Props {
  theme: Theme;
  convo: Conversation;
}

export function Chat({ theme, convo }: Props) {
  const logRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const { messages, chips, qty, pay } = convo;

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = draft.trim();
    if (!v) return;
    setDraft("");
    convo.send(v);
  }

  const initial = (theme.name.trim()[0] || "S").toUpperCase();
  const store = STORES[theme.store];

  return (
    <section className="chat" aria-label="Shopping assistant">
      <div className="ch">
        <div className="av">{initial}</div>
        <div>
          <b>{theme.bot}</b>
          <small>Replies instantly</small>
        </div>
        <button className="human" type="button" onClick={convo.askHuman}>
          Talk to a person
        </button>
      </div>

      <div className="log" ref={logRef} aria-live="polite">
        {messages.map((m) => (
          // Re-key when the typing dots turn into the reply so the entrance animation plays again.
          <div key={`${m.id}-${m.body.kind === "typing" ? "t" : "r"}`} className={`m ${m.from}${m.card ? " card" : ""}`}>
            <MessageBody body={m.body} theme={theme} store={store} qty={qty} pay={pay} convo={convo} />
          </div>
        ))}
      </div>

      <div className="chips">
        {chips.map((c) => (
          <button key={c} className="chip" type="button" onClick={() => convo.tapChip(c)}>
            {c}
          </button>
        ))}
      </div>

      <form className="in" onSubmit={onSubmit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={store.placeholder}
          autoComplete="off"
          aria-label="Message"
        />
        <button className="send">Send</button>
      </form>
    </section>
  );
}

interface BodyProps {
  body: Body;
  theme: Theme;
  store: StoreData;
  qty: number;
  pay: PayState;
  convo: Conversation;
}

function MessageBody({ body, theme, store, qty, pay, convo }: BodyProps) {
  const item = store.picks[0];
  switch (body.kind) {
    case "typing":
      return (
        <span className="typing" aria-label="Typing">
          <i />
          <i />
          <i />
        </span>
      );
    case "greet":
      return (
        <>
          {voice(
            theme,
            `Hi! I’m ${theme.bot}. Looking for something specific? I can help you pick, answer questions and check out right here.`,
            `${theme.bot} here. Tell me what you need. I can also check you out in this chat.`,
          )}
        </>
      );
    case "text":
      return <>{body.content}</>;
    case "picks":
      return (
        <>
          {store.picks.map((p, i) => (
            <div className="prod" key={p.name}>
              <div className="thumb">
                <img src={p.thumb} alt={p.name} />
              </div>
              <div>
                <b>{p.name}</b>
                <small>{p.why}</small>
                {i === 0 && <span className="tag">{store.pickTag}</span>}
              </div>
              <div className="p">{money(p.price)}</div>
            </div>
          ))}
        </>
      );
    case "cart":
      return <Cart store={store} qty={qty} onQty={convo.setQty} />;
    case "confirm": {
      const label = pay === "processing" ? "Processing…" : pay === "paid" ? "Paid" : `Confirm and pay ${money(cartTotals(item.price, qty).total)}`;
      return (
        <>
          <div className="info" style={{ borderTop: 0 }}>
            <div>
              <small>Ship to</small>Alex Morgan, 120 Front St W, Toronto ON
            </div>
            <a href="#" onClick={(e) => e.preventDefault()}>Change</a>
          </div>
          <div className="info">
            <div>
              <small>Pay with</small>Visa ending 4242
            </div>
            <a href="#" onClick={(e) => e.preventDefault()}>Change</a>
          </div>
          <div className="info">
            <div>
              <small>Arrives</small>Tue, Dec 1 · Free shipping
            </div>
          </div>
          <button className="pay" type="button" disabled={pay !== "idle"} onClick={convo.confirmPay}>
            {label}
          </button>
          <p className="note">Nothing is charged until you tap confirm.</p>
        </>
      );
    }
    case "done":
      return (
        <>
          <div className="done">
            <div className="check">✓</div>
            <b>Order {body.order} placed</b>
            <small style={{ color: "var(--sub)" }}>
              {body.qty} × {store.cartLine} · {money(body.total)}
              <br />
              Arrives Tue, Dec 1. Receipt sent to alex@example.com
            </small>
          </div>
          <div className="info">
            <a href="#" onClick={(e) => e.preventDefault()}>Track order</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cancel within 30 min</a>
          </div>
        </>
      );
  }
}

function Cart({ store, qty, onQty }: { store: StoreData; qty: number; onQty: (delta: number) => void }) {
  const item = store.picks[0];
  const t = cartTotals(item.price, qty);
  return (
    <>
      <div className="prod">
        <div className="thumb">
          <img src={item.thumb} alt={item.name} />
        </div>
        <div>
          <b>{store.cartLine}</b>
          <small>Ships today</small>
          <div className="qty" style={{ marginTop: 6 }}>
            <button type="button" aria-label="Fewer" onClick={() => onQty(-1)}>
              −
            </button>
            <span>{qty}</span>
            <button type="button" aria-label="More" onClick={() => onQty(1)}>
              +
            </button>
          </div>
        </div>
        <div className="p">{money(item.price * qty)}</div>
      </div>
      <div className="sum">
        <div className="row"><span>Subtotal</span><span>{money(t.sub)}</span></div>
        <div className="row"><span>Shipping (Toronto)</span><span>Free</span></div>
        <div className="row"><span>HST 13%</span><span>{money(t.tax)}</span></div>
        <div className="row tot"><span>Total</span><span>{money(t.total)}</span></div>
      </div>
    </>
  );
}
