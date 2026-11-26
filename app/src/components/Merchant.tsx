import { ASKS, REASONS } from "../data";

const KPIS: [value: string, label: string][] = [
  ["1,284", "shopping chats"],
  ["23%", "chats that ended in an order"],
  ["$96", "average order in chat"],
  ["41", "asked for Grip Pro in sage (sold out)"],
];

export function Merchant() {
  const top = Math.max(...REASONS.map(([, v]) => v));
  return (
    <section className="merch" aria-label="Merchant insights">
      <h2>What shoppers asked for this week</h2>
      <p>Every chat becomes a signal: see what customers want, in their own words, including what you don't sell yet.</p>
      <div className="kpis">
        {KPIS.map(([v, l]) => (
          <div className="kpi" key={l}>
            <b>{v}</b>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <div className="mg">
        <div>
          <h3>Top reasons shoppers opened the chat</h3>
          {REASONS.map(([label, pct]) => (
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
          {ASKS.map(([q, s]) => (
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
