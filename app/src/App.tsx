import { useEffect, useRef, useState } from "react";
import type { Theme, View } from "./types";
import { PRESETS, themeVars } from "./theme";
import { NOTES, STORES } from "./data";
import { Store } from "./components/Store";
import { BrandKit } from "./components/BrandKit";
import { Merchant } from "./components/Merchant";
import { Chat } from "./chat/Chat";
import { useConversation } from "./chat/useConversation";

declare global {
  interface Window {
    /** Switch brand from the console or a recording script, e.g. __brand("noir"). */
    __brand?: (id: string) => void;
  }
}

const VIEWS: { id: View; label: string }[] = [
  { id: "shop", label: "Shopper" },
  { id: "kit", label: "Brand kit" },
  { id: "mer", label: "Merchant" },
];

export default function App() {
  // ?brand=sage starts on another preset; ?to=cart jumps straight to that step (used for screenshots).
  const params = new URLSearchParams(location.search);
  const [theme, setTheme] = useState<Theme>(() => ({ ...(PRESETS.find((p) => p.id === params.get("brand")) ?? PRESETS[0]) }));
  const [view, setView] = useState<View>("shop");
  const convo = useConversation(theme);

  // ?embed hides the notes and footer when the prototype sits inside a portfolio page.
  useEffect(() => {
    if (new URLSearchParams(location.search).has("embed")) document.documentElement.classList.add("embed");
    window.__brand = (id) => {
      const preset = PRESETS.find((p) => p.id === id);
      if (preset) setTheme({ ...preset });
    };
    if (location.hash === "#brand-kit") setView("kit");
    if (location.hash === "#play") window.setTimeout(() => play(), 600);
    const to = { picks: 1, soldout: 2, cart: 3, confirm: 4 }[params.get("to") ?? ""];
    if (to) window.setTimeout(() => void convo.jumpTo(to), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A different store sells different things, so its conversation starts over.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    convo.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.store]);

  function play() {
    setView("shop");
    convo.play();
  }

  function restart() {
    setView("shop");
    convo.reset();
  }

  const appClass = ["app", view === "kit" && "v-kit", view === "mer" && "v-mer"].filter(Boolean).join(" ");

  return (
    <main className="band">
      <div className="wrap">
        <div className="top">
          <div>
            <h1>Checkout in chat</h1>
            <p className="lede">
              A white-label assistant that lets shoppers find, ask and buy in a brand's own chat, dressed in that brand's
              colours, type and voice. Switch brands in the Brand kit to see three different stores: yoga mats, houseplants and winter coats. Inspired by my agentic-commerce work at Agentix. Stores and data are fictional.
            </p>
          </div>
          <div className="ctrl">
            <div className="tabs" role="tablist" aria-label="View">
              {VIEWS.map((v) => (
                <button key={v.id} className="tab" role="tab" aria-selected={view === v.id} onClick={() => setView(v.id)}>
                  {v.label}
                </button>
              ))}
            </div>
            <button className="btn primary" onClick={play}>
              Play walkthrough
            </button>
            <button className="btn" onClick={restart}>
              Restart
            </button>
          </div>
        </div>

        <div className="win">
          <div className="bar">
            <i className="dot" />
            <i className="dot" />
            <i className="dot" />
            <div className="url">{theme.url}/{STORES[theme.store].slug}</div>
          </div>
          <div className={appClass} style={themeVars(theme)}>
            <Store theme={theme} />
            <BrandKit theme={theme} onChange={setTheme} />
            <Chat theme={theme} convo={convo} />
            <Merchant theme={theme} />
          </div>
        </div>

        <div className="notes">
          {NOTES.map(([title, body]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <p className="foot">
          Designed and coded by Nadia Dadollahi in React and TypeScript ·{" "}
          <a href="https://nadiadadollahi.framer.website" style={{ color: "inherit" }}>
            nadiadadollahi.framer.website
          </a>
        </p>
      </div>
    </main>
  );
}
