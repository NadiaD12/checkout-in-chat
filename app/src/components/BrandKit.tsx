import { useState } from "react";
import type { FontKey, Theme } from "../types";
import { CORNERS, PRESETS, TONES, toThemeFile } from "../theme";

interface Props {
  theme: Theme;
  onChange: (next: Theme) => void;
}

export function BrandKit({ theme, onChange }: Props) {
  const [copyLabel, setCopyLabel] = useState("Copy");
  const json = JSON.stringify(toThemeFile(theme), null, 2);

  // Any manual edit turns the theme into a custom one.
  const edit = (patch: Partial<Theme>) => onChange({ ...theme, ...patch, id: "custom" });

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopyLabel("Copied");
    } catch {
      setCopyLabel("Select and copy");
    }
    window.setTimeout(() => setCopyLabel("Copy"), 1600);
  }

  return (
    <section className="kit" aria-label="Brand kit">
      <h2>Brand kit</h2>
      <p>
        Every brand sets its own tokens once. The assistant, cards and checkout pick them up everywhere, with no new
        design work per store.
      </p>

      <div className="pre">
        {PRESETS.map((p) => (
          <button key={p.id} type="button" aria-pressed={theme.id === p.id} onClick={() => onChange({ ...p })}>
            <i>
              <span style={{ background: p.color }} />
              <span style={{ background: "#fff", border: "1px solid #ddd" }} />
            </i>
            {p.name}
          </button>
        ))}
      </div>

      <div className="fields">
        <div className="f">
          <label htmlFor="kName">Store name</label>
          <input type="text" id="kName" value={theme.name} onChange={(e) => edit({ name: e.target.value || "Your store" })} />
        </div>
        <div className="f">
          <label htmlFor="kBot">Assistant name</label>
          <input type="text" id="kBot" value={theme.bot} onChange={(e) => edit({ bot: e.target.value || "Assistant" })} />
        </div>
        <div className="f">
          <label htmlFor="kCol">Brand colour</label>
          <input type="color" id="kCol" value={theme.color} onChange={(e) => edit({ color: e.target.value })} />
          <code>{theme.color}</code>
        </div>
        <div className="f">
          <label htmlFor="kFont">Typeface</label>
          <select id="kFont" value={theme.font} onChange={(e) => edit({ font: e.target.value as FontKey })}>
            <option value="inter">Inter (clean sans)</option>
            <option value="fraunces">Fraunces (warm serif)</option>
            <option value="grotesk">Space Grotesk (modern)</option>
          </select>
        </div>
        <div className="f">
          <label id="kCornerLabel">Corners</label>
          <div className="seg" role="group" aria-labelledby="kCornerLabel">
            {CORNERS.map((c) => (
              <button key={c.value} type="button" aria-pressed={theme.corner === c.value} onClick={() => edit({ corner: c.value })}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="f">
          <label id="kToneLabel">Voice</label>
          <div className="seg" role="group" aria-labelledby="kToneLabel">
            {TONES.map((t) => (
              <button key={t.value} type="button" aria-pressed={theme.tone === t.value} onClick={() => edit({ tone: t.value })}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tok">
        <div className="tokh">
          <span>theme.json, ready for engineering</span>
          <button type="button" onClick={copy}>
            {copyLabel}
          </button>
        </div>
        <pre>{json}</pre>
      </div>
    </section>
  );
}
