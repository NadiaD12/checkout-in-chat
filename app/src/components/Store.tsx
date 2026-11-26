import type { Theme } from "../types";
import { STORES, money } from "../data";

export function Store({ theme }: { theme: Theme }) {
  const store = STORES[theme.store];
  const item = store.picks[0];
  const { pdp } = store;
  return (
    <section className="store" aria-label="Store page">
      <div className="nav">
        <div className="logo">
          {theme.name}
          <span>.</span>
        </div>
        <div className="navl">
          {store.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
          <span>Cart (0)</span>
        </div>
      </div>
      <div className="pdp">
        <div>
          <div className="hero">
            <img src={pdp.hero} alt={pdp.heroAlt} />
          </div>
          <div className="gal">
            {pdp.gallery.map(([src, alt]) => (
              <img key={src} src={src} alt={alt} />
            ))}
          </div>
        </div>
        <div>
          <small style={{ color: "var(--sub)" }}>{pdp.kicker}</small>
          <h2>{item.name}</h2>
          <p className="price">{money(item.price)}</p>
          <div style={{ fontSize: 14 }}>
            {pdp.option[0]}: <b>{pdp.option[1]}</b>
          </div>
          <div className="sw">
            {pdp.swatches.map((s) => (
              <i key={s.title} className={s.on ? "on" : s.out ? "out" : undefined} style={{ background: s.color }} title={s.title} />
            ))}
          </div>
          <ul className="feat">
            {pdp.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className="add" type="button">
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
