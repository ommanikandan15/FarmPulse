import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, CloudSun, Droplets, Leaf, MapPin, RefreshCw, ShieldCheck, Sprout, Waves } from "lucide-react";
import { api, type Advisory, type Plot } from "./api";

const demoPlots: Plot[] = [
  { id: "TN-001", name: "North Field", village: "Thanjavur demo", crop: "Paddy", area_acres: 2.4, ndvi: 0.39, ndwi: -0.18, soil_moisture_pct: 22, observed_symptoms: ["Uneven growth", "Dry patch reported"] },
  { id: "TN-002", name: "Canal-side Field", village: "Thiruvarur demo", crop: "Paddy", area_acres: 1.8, ndvi: 0.68, ndwi: 0.12, soil_moisture_pct: 41, observed_symptoms: [] },
  { id: "TN-003", name: "East Plot", village: "Nagapattinam demo", crop: "Paddy", area_acres: 3.1, ndvi: 0.52, ndwi: -0.04, soil_moisture_pct: null, observed_symptoms: ["Needs field review"] }
];

export default function App() {
  const [plots, setPlots] = useState<Plot[]>(demoPlots);
  const [selectedId, setSelectedId] = useState("TN-001");
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [weather, setWeather] = useState<{ source: string; is_live: boolean; summary: string; temperature_c: number | null; precipitation_mm: number | null } | null>(null);
  const [apiState, setApiState] = useState<"loading" | "connected" | "demo">("loading");
  const [error, setError] = useState("");

  const selected = useMemo(() => plots.find(p => p.id === selectedId) || plots[0], [plots, selectedId]);

  async function loadPlots() {
    try {
      const result = await api.plots();
      if (result.length) setPlots(result);
      setApiState("connected");
      setError("");
    } catch {
      setApiState("demo");
      setError("Backend is not connected. Showing clearly labelled local demo data.");
    }
  }

  async function loadAdvisory(plot: Plot) {
    try {
      setAdvisory(await api.advisory(plot));
    } catch {
      setAdvisory({
        plot_id: plot.id,
        status: plot.ndvi < 0.45 || plot.ndwi < -0.1 || (plot.soil_moisture_pct !== null && plot.soil_moisture_pct < 25) ? "attention" : "observe",
        headline: "Demo rule check",
        reasons: [`NDVI: ${plot.ndvi.toFixed(2)} (demo threshold 0.45)`, `NDWI: ${plot.ndwi.toFixed(2)} (demo threshold -0.10)`, plot.soil_moisture_pct === null ? "No soil-moisture value supplied." : `Soil moisture: ${plot.soil_moisture_pct}% (demo threshold 25%).`],
        next_steps: ["Inspect the plot directly and compare with a healthy nearby area.", "Confirm conditions with a local agricultural expert before making crop-management changes."],
        limitations: ["Local demo rules are not validated agronomic thresholds.", "No live satellite imagery or trained disease model is connected."]
      });
    }
  }

  async function loadWeather() {
    try {
      // Demo coordinates only; replace with user-confirmed plot coordinates in a real deployment.
      setWeather(await api.weather(10.787, 79.137));
    } catch {
      setWeather({ source: "demo-fallback", is_live: false, summary: "Weather unavailable; no live values shown.", temperature_c: null, precipitation_mm: null });
    }
  }

  useEffect(() => { void loadPlots(); void loadWeather(); }, []);
  useEffect(() => { if (selected) void loadAdvisory(selected); }, [selected]);

  if (!selected) return <main className="app"><p>Loading FarmPulse…</p></main>;

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sprout size={24} /></div><div><strong>FarmPulse</strong><span>FIELD INTELLIGENCE</span></div></div>
        <div className="side-label">WORKSPACE</div>
        <button className="nav-item active"><Activity size={18} /> Overview</button>
        <button className="nav-item" onClick={() => document.getElementById("plots")?.scrollIntoView({ behavior: "smooth" })}><MapPin size={18} /> My plots</button>
        <button className="nav-item" onClick={() => document.getElementById("advisory")?.scrollIntoView({ behavior: "smooth" })}><ShieldCheck size={18} /> Explainable advisory</button>
        <div className="sidebar-bottom"><div className="offline-icon"><ShieldCheck size={18} /></div><strong>Designed for the field</strong><p>Simple signals. Clear reasons. Better conversations.</p><span className="build-tag">PROTOTYPE BUILD</span></div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div><div className="eyebrow">TAMIL NADU · PADDY MONITORING</div><h1>Good morning, Farmer <span>🌱</span></h1><p className="subhead">A clearer picture of your fields starts here.</p></div>
          <div className="top-actions"><span className={`connection ${apiState}`}><i />{apiState === "connected" ? "API connected" : apiState === "loading" ? "Connecting…" : "Demo mode"}</span><button className="icon-button" onClick={() => { void loadPlots(); void loadWeather(); }} aria-label="Refresh"><RefreshCw size={17} /></button></div>
        </header>

        {error && <div className="notice"><ShieldCheck size={18} />{error}</div>}

        <section className="hero">
          <div className="hero-copy"><div className="hero-kicker"><span className="spark">✦</span> YOUR FIELD, EXPLAINED</div><h2>Don’t just know<br />what’s happening.<br /><em>Know why.</em></h2><p>Understand the signals behind each field advisory, with practical next steps and honest limitations.</p><button className="primary-button" onClick={() => document.getElementById("advisory")?.scrollIntoView({ behavior: "smooth" })}>View field advisory <ArrowUpRight size={17} /></button></div>
          <div className="hero-art" aria-hidden="true"><div className="sun"></div><div className="field field-back"></div><div className="field field-mid"></div><div className="field field-front"></div><div className="hero-leaf"><Leaf size={54} /></div><div className="art-chip"><span className="pulse-dot"></span> EXPLAINABLE BY DESIGN</div></div>
        </section>

        <div className="section-heading"><div><div className="eyebrow">FIELD SNAPSHOT</div><h2>Your plots at a glance</h2></div><span className="muted">{plots.length} demo plots</span></div>
        <section className="metrics">
          <Metric icon={<Sprout size={19} />} label="PLOTS TRACKED" value={String(plots.length).padStart(2, "0")} note="Sample plot records" />
          <Metric icon={<Activity size={19} />} label="NEEDS A FIELD CHECK" value={String(plots.filter(p => p.ndvi < 0.45 || p.ndwi < -0.1 || (p.soil_moisture_pct !== null && p.soil_moisture_pct < 25)).length).padStart(2, "0")} note="Prototype thresholds only" accent />
          <Metric icon={<Waves size={19} />} label="WATER SIGNAL" value={selected.ndwi.toFixed(2)} note="Selected plot · demo value" />
          <Metric icon={<Droplets size={19} />} label="SOIL MOISTURE" value={selected.soil_moisture_pct === null ? "—" : `${selected.soil_moisture_pct}%`} note="Sensor value not verified" />
        </section>

        <section id="plots" className="section-block">
          <div className="section-heading"><div><div className="eyebrow">PLOT EXPLORER</div><h2>Choose a field</h2></div><span className="muted">Select to view its signals</span></div>
          <div className="plot-grid">{plots.map((plot, index) => {
            const attention = plot.ndvi < 0.45 || plot.ndwi < -0.1 || (plot.soil_moisture_pct !== null && plot.soil_moisture_pct < 25);
            return <button key={plot.id} className={`plot-card ${selectedId === plot.id ? "selected" : ""}`} onClick={() => setSelectedId(plot.id)}>
              <div className={`plot-visual visual-${index % 3}`}><div className="plot-sun" /><div className="plot-lines" /><span className="plot-number">{String(index + 1).padStart(2, "0")}</span></div>
              <div className="plot-card-body"><div className="plot-title-row"><h3>{plot.name}</h3><span className={`status-pill ${attention ? "watch" : "steady"}`}>{attention ? "Check" : "Steady"}</span></div><p><MapPin size={13} /> {plot.village}</p><div className="plot-stats"><span>NDVI <b>{plot.ndvi.toFixed(2)}</b></span><span>NDWI <b>{plot.ndwi.toFixed(2)}</b></span></div></div>
            </button>;
          })}</div>
        </section>

        <section id="advisory" className="advisory-layout">
          <div className="advisory-panel">
            <div className="panel-header"><div><div className="eyebrow">WHY THIS ADVISORY?</div><h2>{selected.name}</h2></div><span className="explain-icon"><ShieldCheck size={21} /></span></div>
            <div className={`advisory-status ${advisory?.status === "attention" ? "status-attention" : ""}`}><div className="status-symbol">{advisory?.status === "attention" ? <Activity size={21} /> : <Leaf size={21} />}</div><div><strong>{advisory?.headline || "Preparing advisory…"}</strong><p>{advisory?.status === "attention" ? "Some demo signals crossed a watch threshold." : "Continue routine observation and review new data."}</p></div></div>
            <h3 className="subsection-title">Signals behind the result</h3>
            <ul className="reason-list">{(advisory?.reasons || ["Loading signal explanations…"]).map((reason, i) => <li key={i}><span className="reason-check">✓</span><span>{reason}</span></li>)}</ul>
            <h3 className="subsection-title">Suggested next steps</h3>
            <ol className="next-list">{(advisory?.next_steps || []).map((step, i) => <li key={i}><span>{i + 1}</span>{step}</li>)}</ol>
            <div className="limitations"><strong><ShieldCheck size={16} /> Important limitations</strong><ul>{(advisory?.limitations || ["Demo values are not field-verified."]).map((item, i) => <li key={i}>{item}</li>)}</ul></div>
          </div>
          <div className="right-column">
            <div className="weather-card"><div className="card-top"><div><div className="eyebrow">WEATHER CONTEXT</div><h3>Local conditions</h3></div><CloudSun size={25} /></div><div className="weather-reading">{weather?.temperature_c == null ? "—" : `${weather.temperature_c}°`}<span>{weather?.is_live ? "C" : "Live data off"}</span></div><p>{weather?.summary || "Checking weather configuration…"}</p><div className="source-line"><span className={weather?.is_live ? "live-dot" : "demo-dot"} />{weather?.source || "Checking source"}</div></div>
            <div className="signal-card"><div className="eyebrow">VEGETATION SIGNAL</div><div className="signal-number">{selected.ndvi.toFixed(2)}<span>NDVI</span></div><div className="signal-track"><div style={{ width: `${Math.max(0, Math.min(100, (selected.ndvi + 1) / 2 * 100))}%` }} /></div><p>Illustrative indicator from sample data. Not a live satellite observation.</p></div>
            <div className="principle-card"><div className="principle-mark"><ShieldCheck size={20} /></div><h3>Trust through transparency</h3><p>Every result should show the input signals, the reasoning, and what still needs verification.</p></div>
          </div>
        </section>

        <footer><div className="footer-brand"><Sprout size={18} /> FarmPulse</div><span>Prototype for learning and validation · Not a substitute for expert agronomic advice</span><span>Made for more explainable agriculture.</span></footer>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, note, accent = false }: { icon: React.ReactNode; label: string; value: string; note: string; accent?: boolean }) {
  return <article className={`metric-card ${accent ? "metric-accent" : ""}`}><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span></div><div className="metric-value">{value}</div><p>{note}</p></article>;
}
