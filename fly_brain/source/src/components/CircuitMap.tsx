import { useEffect, useMemo, useState } from 'react';
import {
  getCircuit,
  type Circuit, type CircuitActivity, type CircuitEdge, type CircuitNode,
} from '../lib/api';
import { useT } from '../lib/i18n';

/** One hue per functional tier, kept clear of the excitation/inhibition pair. */
const TIER: Record<string, string> = {
  sensory: '#dfb672',
  early: '#81b5c8',
  brain: '#9aa8c4',
  bridge: '#dfb672',
  cord: '#af9bc3',
  motor: '#6fd3c0',
};
const EXCITE = '#5fd8ef';
const INHIBIT = '#ff9a63';
const BACK = '#c99ae0';

/** Reading order inside a column, so related body parts sit together. */
const ORDER = [
  'visual', 'olfactory', 'gustatory', 'head mechano', 'head other',
  'neck', 'wing', 'haltere', 'abdomen',
  'L front leg', 'R front leg', 'L middle leg', 'R middle leg',
  'L hind leg', 'R hind leg',
  'optic lobe', 'lobula output', 'antennal lobe', 'gnathal ganglion',
  'ventrolateral protocerebrum', 'superior protocerebrum',
  'lateral accessory / posterior', 'mushroom body', 'central complex',
  'other central', 'descending', 'ascending',
  'T1', 'T2', 'T3', 'A', 'other', 'head', 'efferent',
];

const WIDTH = 1400;
const PAD_TOP = 52;
const PAD_BOTTOM = 26;
const NODE_W = 150;

type Placed = { node: CircuitNode; x: number; y: number; h: number };

function layoutOf(circuit: Circuit) {
  const maxCount = Math.max(...circuit.nodes.map(n => n.count), 1);
  const height = (n: CircuitNode) => 16 + 28 * Math.sqrt(n.count / maxCount);
  const rank = (n: CircuitNode) => {
    const i = ORDER.indexOf(n.label);
    return i < 0 ? 900 - Math.min(800, n.count / 100) : i;
  };

  const columnX = circuit.layers.map(
    (_, i) => 90 + i * ((WIDTH - 220) / (circuit.layers.length - 1)));
  const columns = circuit.layers.map(layer =>
    circuit.nodes.filter(n => n.layer === layer).sort((a, b) => rank(a) - rank(b)));
  const gap = 10;
  const tallest = Math.max(...columns.map(
    members => members.reduce((sum, n) => sum + height(n) + gap, 0)), 1);
  const svgHeight = Math.max(520, tallest + PAD_TOP + PAD_BOTTOM);

  const placed = new Map<string, Placed>();
  columns.forEach((members, column) => {
    const total = members.reduce((sum, n) => sum + height(n) + gap, 0);
    let y = PAD_TOP + (svgHeight - PAD_TOP - PAD_BOTTOM - total) / 2;
    for (const node of members) {
      const h = height(node);
      placed.set(node.id, { node, x: columnX[column], y: y + h / 2, h });
      y += h + gap;
    }
  });
  return { placed, svgHeight, columnX };
}

/**
 * The connectome as populations rather than neurons: sensory on the left, motor
 * on the right, with every synapse between two groups summed into one edge.
 *
 * The layer order is an arrangement, not a claim about how signal travels, so
 * edges running against it are kept and drawn bowed and dashed rather than
 * dropped. The manual explains what that does and does not mean.
 */
type Props = {
  /** Per-population activation from the frame being played, if any. */
  activity: CircuitActivity | null;
  /** Stimulate every neuron in a population, the way clicking a soma does. */
  onStimulate: (populationId: string, label: string) => void;
  running: boolean;
  selectedPopulation: string | null;
};

export function CircuitMap({ activity, onStimulate, running, selectedPopulation }: Props) {
  const { t, lang } = useT();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [error, setError] = useState('');
  const [minWeight, setMinWeight] = useState(40000);
  const [showBack, setShowBack] = useState(true);
  const selected = selectedPopulation;

  useEffect(() => {
    let cancelled = false;
    getCircuit()
      .then(c => { if (!cancelled) setCircuit(c); })
      .catch(e => { if (!cancelled) setError(String(e)); });
    return () => { cancelled = true; };
  }, []);

  const geometry = useMemo(() => (circuit ? layoutOf(circuit) : null), [circuit]);
  const maxEdge = useMemo(
    () => (circuit ? Math.max(...circuit.edges.map(e => e.w), 1) : 1), [circuit]);

  if (error) return <p className="error">{error}</p>;
  if (!circuit || !geometry) {
    return <p className="muted" style={{ padding: '14px' }}>{t('circuit.loading')}</p>;
  }

  const { placed, svgHeight, columnX } = geometry;
  const name = (n: CircuitNode) => (lang === 'ko' ? n.ko : n.label);

  const visible = circuit.edges.filter(e => {
    if (e.w < minWeight) return false;
    if (e.back && !showBack) return false;
    if (selected && e.s !== selected && e.t !== selected) return false;
    return true;
  });
  const touched = new Set<string>();
  for (const e of visible) { touched.add(e.s); touched.add(e.t); }

  const live = activity && Object.keys(activity).length > 0 ? activity : null;
  // An edge only carries signal when both ends are lit, so scoring it by the
  // weaker end stops a bright population from lighting up its quiet partners.
  const edgeHeat = (e: CircuitEdge) => {
    if (!live) return 0;
    return Math.min(live[e.s]?.[0] ?? 0, live[e.t]?.[0] ?? 0);
  };

  const path = (e: CircuitEdge, index: number) => {
    const a = placed.get(e.s), b = placed.get(e.t);
    if (!a || !b) return null;
    const x1 = a.x + (e.back ? -NODE_W / 2 : NODE_W / 2);
    const x2 = b.x + (e.back ? NODE_W / 2 : -NODE_W / 2);
    const dx = Math.max(58, Math.abs(x2 - x1) * 0.45);
    if (e.back) {
      // Bow a returning edge upward so it never hides beneath a forward one.
      const lift = 44 + (index % 4) * 16;
      return `M${x1},${a.y} C${x1 + dx * 0.7},${a.y - lift} `
        + `${x2 - dx * 0.7},${b.y - lift} ${x2},${b.y}`;
    }
    return `M${x1},${a.y} C${x1 + dx},${a.y} ${x2 - dx},${b.y} ${x2},${b.y}`;
  };

  const partners = (key: 's' | 't') => circuit.edges
    .filter(e => e.w >= minWeight && (!e.back || showBack)
      && (key === 's' ? e.t : e.s) === selected)
    .sort((a, b) => b.w - a.w)
    .slice(0, 10);

  const chosen = selected ? circuit.nodes.find(n => n.id === selected) ?? null : null;

  return <>
    <div className="circuit-controls">
      <label>
        {t('circuit.min')}
        <input type="range" min={2000} max={400000} step={2000} value={minWeight}
               onChange={e => setMinWeight(Number(e.target.value))} />
        <span className="val">{minWeight.toLocaleString()}</span>
      </label>
      <button aria-pressed={showBack} onClick={() => setShowBack(!showBack)}>
        {t('circuit.back')}
      </button>
      <span>{t('circuit.shown', {
        a: visible.length.toLocaleString(), b: circuit.edges.length.toLocaleString(),
      })}</span>
      <span style={{ color: live ? EXCITE : undefined }}>
        {t(live ? 'circuit.live' : 'circuit.idle')}
      </span>
    </div>

    <div className="circuit-body">
      <div className="circuit-canvas">
        <svg viewBox={`0 0 ${WIDTH} ${svgHeight}`} role="group"
             aria-label={t('circuit.aria')}>
          {circuit.layers.map((layer, i) => <g key={layer}>
            <line x1={columnX[i]} y1={36} x2={columnX[i]} y2={svgHeight - 12}
                  stroke="#1e272f" />
            <text className="circuit-col" x={columnX[i]} y={24} textAnchor="middle">
              {t(`circuit.col.${layer}` as never)}
            </text>
          </g>)}

          {visible.map((e, i) => {
            const d = path(e, i);
            if (!d) return null;
            return <path key={`${e.s}->${e.t}`} d={d} fill="none" strokeLinecap="round"
                         stroke={e.back ? BACK : (e.exc >= 0.5 ? EXCITE : INHIBIT)}
                         strokeWidth={0.7 + 6.5 * Math.pow(e.w / maxEdge, 0.45)}
                         strokeDasharray={e.back ? '7 5' : undefined}
                         opacity={live
                           ? 0.1 + 0.85 * Math.pow(edgeHeat(e), 0.5)
                           : (selected ? 0.9 : 0.4)} />;
          })}

          {[...placed.values()].map(({ node, x, y, h }) => {
            const colour = TIER[node.tag] ?? '#6c7777';
            const active = selected === node.id;
            const dim = selected && !active && !touched.has(node.id);
            const [heat, sign] = live?.[node.id] ?? [0, 1];
            // Gamma-boost so a population carrying a small but real share of the
            // signal still reads, the same way the 3D view treats its somata.
            const glow = heat > 0 ? Math.pow(heat, 0.45) : 0;
            const hot = sign >= 0 ? EXCITE : INHIBIT;
            const fill = active ? colour : (glow > 0.01 ? hot : '#131920');
            const inverted = active || glow > 0.55;
            return <g key={node.id} opacity={dim ? 0.22 : 1}>
              <rect role="button" tabIndex={running ? -1 : 0}
                    aria-label={`${name(node)} (${node.count.toLocaleString()})`}
                    aria-pressed={active} aria-disabled={running}
                    onKeyDown={event => {
                      if (!running && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        onStimulate(node.id, name(node));
                      }
                    }}
                    x={x - NODE_W / 2} y={y - h / 2} width={NODE_W} height={h} rx={3}
                    fill={fill} fillOpacity={active ? 1 : (glow > 0.01 ? glow : 1)}
                    stroke={glow > 0.01 ? hot : colour}
                    strokeWidth={glow > 0.01 ? 1.4 + glow : 1.4}
                    style={{ cursor: running ? 'wait' : 'pointer' }}
                    onClick={() => {
                      if (running) return;
                      onStimulate(node.id, name(node));
                    }} />
              <text x={x - NODE_W / 2 + 8} y={y + 3.5} fontSize={10}
                    fill={inverted ? '#0b0e12' : '#d6dce3'} pointerEvents="none">
                {name(node)}
              </text>
              <text x={x + NODE_W / 2 - 8} y={y + 3.5} fontSize={9} textAnchor="end"
                    fill={inverted ? '#0b0e12' : '#7f8d9e'} pointerEvents="none">
                {node.count.toLocaleString()}
              </text>
            </g>;
          })}
        </svg>
      </div>

      <div className="circuit-side">
        {!chosen
          ? <>
              <h3>{t('circuit.pick')}</h3>
              <p className="sub">{t('circuit.pickSub')}</p>
            </>
          : <>
              <h3>{name(chosen)}</h3>
              <p className="sub">
                {chosen.count.toLocaleString()}{t('circuit.popNeurons')}
                {' · '}{t(`circuit.col.${chosen.layer}` as never)}
                <br />
                <span style={{ color: EXCITE }}>{t('circuit.stimulating')}</span>
              </p>
              {([['circuit.inbound', 's'], ['circuit.outbound', 't']] as const)
                .map(([label, key]) => {
                  const rows = partners(key);
                  return <div key={key}>
                    <h4>{t(label)}</h4>
                    {rows.length === 0
                      ? <p className="muted">{t('circuit.none')}</p>
                      : <ul>
                          {rows.map(e => {
                            const otherId = key === 's' ? e.s : e.t;
                            const other = circuit.nodes.find(n => n.id === otherId);
                            if (!other) return null;
                            return <li key={`${e.s}->${e.t}`}>
                              <span className="w">{e.w.toLocaleString()}</span>
                              <span className="nm">
                                {name(other)}
                                {e.back && <span style={{ color: BACK }}> &#8629;</span>}
                              </span>
                              <span className="pol"
                                    style={{ color: e.exc >= 0.5 ? EXCITE : INHIBIT }}>
                                {Math.round(e.exc * 100)}%
                              </span>
                            </li>;
                          })}
                        </ul>}
                  </div>;
                })}
            </>}
      </div>
    </div>

    <div className="circuit-legend">
      {(['sensory', 'early', 'brain', 'bridge', 'cord', 'motor'] as const).map(k =>
        <span key={k}>
          <i style={{ background: TIER[k] }} />{t(`circuit.leg.${k}` as never)}
        </span>)}
      <span><i className="bar" style={{ background: EXCITE }} />{t('circuit.leg.exc')}</span>
      <span><i className="bar" style={{ background: INHIBIT }} />{t('circuit.leg.inh')}</span>
      <span><i className="bar" style={{ background: BACK }} />{t('circuit.leg.back')}</span>
    </div>
  </>;
}
