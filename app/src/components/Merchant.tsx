import type { Theme } from "../types";
import { STORES } from "../data";

export function Merchant({ theme }: { theme: Theme }) {
  const { kpis, reasons, asks } = STORES[theme.store].merchant;
  const top = Math.max(...reasons.map(([, v]) => v));
  return (
    <section className="merch" aria-label="Merchant insights">
      <h2>What shoppers asked for this week</h2>
      <p>Every chat becomes a signal: see what customers want, in their own words, including what you don't sell yet.</p>
      <div className="kpis">
        {kpis.map(([v, l]) => (
          <div className="kpi" key={l}>
            <b>{v}</b>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <div className="mg">
        <div>
          <h3>Top reasons shoppers opened the chat</h3>
          {reasons.map(([label, pct]) => (
            <div className="hb" key={label}>
              <span>{label}</span>
              <div className="t">
                <i style={{ width: `${(pct / top) * 100}%` }} />
              </div>
              <span>{pct}%</span>
            </div>
          ))}
        </div>
        <div>
          <h3>Requests you can't fill yet</h3>
          {asks.map(([q, s]) => (
            <div className="ask" key={q}>
              <q>{q}</q>
              <small>{s}</small>
            </div>
          ))}
        </div>
      </div>
      <p className="fine">Sample data for a fictional store.</p>
    </section>
  );
}
