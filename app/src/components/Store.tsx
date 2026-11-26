import type { Theme } from "../types";

export function Store({ theme }: { theme: Theme }) {
  return (
    <section className="store" aria-label="Store page">
      <div className="nav">
        <div className="logo">
          {theme.name}
          <span>.</span>
        </div>
        <div className="navl">
          <span>Mats</span>
          <span>Props</span>
          <span>Apparel</span>
          <span>Cart (0)</span>
        </div>
      </div>
      <div className="pdp">
        <div>
          <div className="hero">
            <img src="img/plum.jpg" alt="Grip Pro Mat in plum, partly rolled" />
          </div>
          <div className="gal">
            <img src="img/plum.jpg" alt="" />
            <img src="img/align.jpg" alt="Align Mat in use outdoors" />
            <img src="img/sage.jpg" alt="Marble Flow Mat in use" />
          </div>
        </div>
        <div>
          <small style={{ color: "var(--sub)" }}>Mats · Best seller</small>
          <h2>Grip Pro Mat</h2>
          <p className="price">$118.00</p>
          <div style={{ fontSize: 14 }}>
            Colour: <b>Plum</b>
          </div>
          <div className="sw">
            <i className="on" style={{ background: "#7a4060" }} title="Plum" />
            <i className="out" style={{ background: "#8fa88a" }} title="Sage, sold out" />
            <i style={{ background: "#2e2a33" }} title="Black" />
          </div>
          <ul className="feat">
            <li>Natural rubber base, 5 mm cushioning</li>
            <li>Stays grippy in heat and sweat</li>
            <li>Alignment line down the centre</li>
            <li>183 × 66 cm, 2.4 kg</li>
          </ul>
          <button className="add" type="button">
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
