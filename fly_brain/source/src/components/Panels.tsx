import { useEffect, useState } from 'react';
import {
  getNeuron, searchNeurons,
  type Meta, type Neuron, type SimSettings, type SimResult,
  IS_STATIC,
} from '../lib/api';
import { useT } from '../lib/i18n';

const name = (n: Neuron) => n.instance || n.type || `body ${n.bodyId}`;

/* ------------------------------------------------------------ experiments */

type ControlProps = {
  meta: Meta;
  settings: SimSettings;
  onSettings: (next: SimSettings) => void;
  onSeeds: (ids: number[], label: string) => void;
  onPreset: (preset: Meta['presets'][number], label: string) => void;
  onRun: () => void;
  running: boolean;
  seedCount: number;
};

export function Controls({ meta, settings, onSettings, onSeeds, onPreset, onRun,
                           running, seedCount }: ControlProps) {
  const { t } = useT();
  const set = <K extends keyof SimSettings>(key: K, value: SimSettings[K]) =>
    onSettings({ ...settings, [key]: value });

  return <div className="controls-panel">
    <fieldset>
      <legend>{t('ctrl.experiment')}</legend>
      <div className="preset-grid">
        {meta.presets.map(preset => <button key={preset.id} className="preset"
          title={t(('preset.' + preset.id + '.detail') as never)}
          onClick={() => onPreset(preset, t(('preset.' + preset.id + '.title') as never))}>
          <strong>{t(('preset.' + preset.id + '.title') as never)}</strong>
          <span>{preset.seeds.length}{t('ctrl.neurons')}</span>
        </button>)}
      </div>
    </fieldset>

    <fieldset>
      <legend>{t('ctrl.propagation')}</legend>
      {/* The hosted build replays precomputed runs, so only hops can move. */}
      <div className="row">
        <label>{t('ctrl.mode')}
          <select value={settings.mode} disabled={IS_STATIC}
                  onChange={e => set('mode', e.target.value as SimSettings['mode'])}>
            <option value="path">{t('ctrl.modePath')}</option>
            <option value="rate">{t('ctrl.modeRate')}</option>
          </select>
        </label>
        <label>{t('ctrl.direction')}
          <select value={settings.direction} disabled={IS_STATIC}
                  onChange={e => set('direction', e.target.value as SimSettings['direction'])}>
            <option value="downstream">{t('ctrl.down')}</option>
            <option value="upstream">{t('ctrl.up')}</option>
          </select>
        </label>
      </div>

      {settings.mode === 'path' ? <div className="row">
        <label>{t('ctrl.hops')} {settings.hops}
          <input type="range" min="1" max="10" step="1" value={settings.hops}
                 onChange={e => set('hops', Number(e.target.value))} />
        </label>
        <label className={IS_STATIC ? 'is-fixed' : undefined}>
          {t('ctrl.decay')} {settings.decay.toFixed(2)}
          <input type="range" min="0.3" max="1" step="0.05" value={settings.decay}
                 disabled={IS_STATIC}
                 onChange={e => set('decay', Number(e.target.value))} />
        </label>
      </div> : <div className="row">
        <label className={IS_STATIC ? 'is-fixed' : undefined}>{t('ctrl.duration')} {settings.duration.toFixed(2)} s
          <input type="range" min="0.1" max="3" step="0.1" value={settings.duration} disabled={IS_STATIC}
                 onChange={e => set('duration', Number(e.target.value))} />
        </label>
        <label className={IS_STATIC ? 'is-fixed' : undefined}>{t('ctrl.tau')} {(settings.tau * 1000).toFixed(0)} ms
          <input type="range" min="0.005" max="0.2" step="0.005" value={settings.tau} disabled={IS_STATIC}
                 onChange={e => set('tau', Number(e.target.value))} />
        </label>
        <label className={IS_STATIC ? 'is-fixed' : undefined}>{t('ctrl.gain')} {settings.gain.toFixed(1)}
          <input type="range" min="0.2" max="8" step="0.2" value={settings.gain} disabled={IS_STATIC}
                 onChange={e => set('gain', Number(e.target.value))} />
        </label>
        <label className={IS_STATIC ? 'is-fixed' : undefined}>{t('ctrl.stim')} {(settings.stim * 1000).toFixed(0)} ms
          <input type="range" min="0.01" max="1" step="0.01" value={settings.stim} disabled={IS_STATIC}
                 onChange={e => set('stim', Number(e.target.value))} />
        </label>
      </div>}

      <div className="row">
        <label className={IS_STATIC ? 'is-fixed' : undefined}>
          {t('ctrl.minWeight')} {settings.min_weight}
          <input type="range" min="1" max="50" step="1" value={settings.min_weight}
                 disabled={IS_STATIC}
                 onChange={e => set('min_weight', Number(e.target.value))} />
        </label>
        <label className={IS_STATIC ? 'is-fixed' : undefined}>
          {t('ctrl.inhibition')} x{settings.inhibition.toFixed(1)}
          <input type="range" min="0" max="3" step="0.1" value={settings.inhibition}
                 disabled={IS_STATIC}
                 onChange={e => set('inhibition', Number(e.target.value))} />
        </label>
      </div>

      {IS_STATIC
        ? <p className="fixed-note">{t('static.fixedNote')}</p>
        : <button className="run" onClick={onRun} disabled={running || seedCount === 0}>
            {running ? t('toolbar.running')
              : seedCount === 1 ? t('ctrl.stimulate1')
                                : t('ctrl.stimulateN', { n: seedCount })}
          </button>}
    </fieldset>
  </div>;
}

/* ---------------------------------------------------------------- search */

type SearchProps = {
  meta: Meta;
  onSeeds: (ids: number[], label: string) => void;
  onSelect: (bodyId: number) => void;
};

export function SearchPanel({ meta, onSeeds, onSelect }: SearchProps) {
  const { t, role: tRole, part: tPart } = useT();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [part, setPart] = useState('');
  const [side, setSide] = useState('');
  const [results, setResults] = useState<Neuron[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: Record<string, string> = {};
      if (role) filters.role = role;
      if (part) filters.part = part;
      if (side) filters.side = side;
      searchNeurons(query, filters)
        .then(r => { setResults(r.results); setError(''); })
        .catch(e => setError(String(e)));
    }, 180);
    return () => clearTimeout(timer);
  }, [query, role, part, side]);

  return <div className="search-panel">
    <input className="search-box" placeholder={t('search.placeholder')}
           value={query} onChange={e => setQuery(e.target.value)} />
    <div className="filters">
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="">{t('search.anyRole')}</option>
        {meta.roles.map(r => <option key={r} value={r}>{tRole(r)}</option>)}
      </select>
      <select value={part} onChange={e => setPart(e.target.value)}>
        <option value="">{t('search.anyPart')}</option>
        {meta.bodyParts.map(p => <option key={p} value={p}>{tPart(p)}</option>)}
      </select>
      <select value={side} onChange={e => setSide(e.target.value)}>
        <option value="">{t('search.bothSides')}</option>
        <option value="L">{t('search.left')}</option>
        <option value="R">{t('search.right')}</option>
        <option value="M">{t('search.midline')}</option>
      </select>
    </div>
    {error && <p className="error">{error}</p>}
    {results.length > 0 && <button className="stimulate-all"
      onClick={() => onSeeds(results.map(r => r.bodyId),
        t('search.matching', { n: results.length }))}>
      {t('search.stimulateAll', { n: results.length })}
    </button>}
    <ul className="result-list">
      {results.map(n => <li key={n.bodyId}>
        <button onClick={() => onSelect(n.bodyId)}>
          <strong>{name(n)}</strong>
          <span>{tRole(n.role)} · {tPart(n.part)} {n.side} · {n.nt}</span>
        </button>
        <button className="tiny" title={t('search.stimTip')}
                onClick={() => onSeeds([n.bodyId], name(n))}>{t('search.stim')}</button>
      </li>)}
      {results.length === 0 && !error && <li className="muted">{t('search.none')}</li>}
    </ul>
  </div>;
}

/* ------------------------------------------------------------- inspector */

type InspectorProps = {
  bodyId: number | null;
  onSeeds: (ids: number[], label: string) => void;
  onSelect: (bodyId: number) => void;
};

export function Inspector({ bodyId, onSeeds, onSelect }: InspectorProps) {
  const { t, role: tRole, part: tPart } = useT();
  const [data, setData] = useState<{ neuron: Neuron; downstream: Neuron[]; upstream: Neuron[] } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bodyId === null) { setData(null); return; }
    let cancelled = false;
    getNeuron(bodyId)
      .then(d => { if (!cancelled) { setData(d); setError(''); } })
      .catch(e => { if (!cancelled) setError(String(e)); });
    return () => { cancelled = true; };
  }, [bodyId]);

  if (bodyId === null) return <p className="muted">{t('insp.empty')}</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">{t('insp.loading')}</p>;

  const n = data.neuron;
  const list = (title: string, items: Neuron[]) => <div className="partner-block">
    <h4>{title}</h4>
    <ul>
      {items.slice(0, 10).map(p => <li key={`${title}-${p.bodyId}`}>
        <button onClick={() => onSelect(p.bodyId)}>
          <span className={p.polarity === 'inhibitory' ? 'neg' : 'pos'}>
            {p.polarity === 'inhibitory' ? '-' : '+'}{p.weight?.toFixed(0)}
          </span>
          {name(p)} <em>{tRole(p.role)}</em>
        </button>
      </li>)}
      {items.length === 0 && <li className="muted">{t('insp.noPartners')}</li>}
    </ul>
  </div>;

  return <div className="inspector">
    <h3>{name(n)}</h3>
    <dl className="facts">
      <div><dt>{t('insp.bodyId')}</dt><dd>{n.bodyId}</dd></div>
      <div><dt>{t('insp.role')}</dt><dd>{tRole(n.role)}</dd></div>
      <div><dt>{t('insp.superclass')}</dt><dd>{n.superclass ?? '-'}</dd></div>
      <div><dt>{t('insp.transmitter')}</dt><dd className={n.sign < 0 ? 'neg' : 'pos'}>
        {n.nt} ({t(n.sign > 0 ? 'insp.excitatory'
                  : n.sign < 0 ? 'insp.inhibitory' : 'insp.neutral')})
      </dd></div>
      <div><dt>{t('insp.bodyPart')}</dt><dd>{tPart(n.part)} {n.side}</dd></div>
      <div><dt>{t('insp.synapses')}</dt>
        <dd>{n.inSyn.toFixed(0)} {t('insp.in')} / {n.outSyn.toFixed(0)} {t('insp.out')}</dd></div>
    </dl>
    <button className="run" onClick={() => onSeeds([n.bodyId], name(n))}>
      {t('insp.stimulateThis')}
    </button>
    <div className="partners">
      {list(t('insp.targets'), data.downstream)}
      {list(t('insp.sources'), data.upstream)}
    </div>
  </div>;
}

/* ----------------------------------------------------------- signal flow */

const GROUP_ORDER = ['optic', 'central', 'descending', 'vnc', 'other'];
const GROUP_TINT: Record<string, string> = {
  optic: '#81b5c8', central: '#cfcac0', descending: '#dfb672',
  vnc: '#af9bc3', other: '#6c7777',
};

/**
 * Where the signal is, region by region. This is the panel that answers
 * "did it actually leave the brain" without reading coordinates.
 */
export function SignalFlow({ result, frameIndex }: { result: SimResult | null; frameIndex: number }) {
  const { t, role: tRole, part: tPart, group: tGroup } = useT();
  if (!result) return <p className="muted">{t('flow.empty')}</p>;
  const summary = result.summary;
  const frame = result.frames[Math.min(frameIndex, result.frames.length - 1)];

  return <div className="flow">
    <div className="flow-stats">
      <span><strong>{frame.active.toLocaleString()}</strong>{' '}{t('flow.carrying')}</span>
      <span><strong>{summary.reached.toLocaleString()}</strong>{' '}{t('flow.reached')}</span>
      <span>{t('flow.descending')} <strong>{summary.gateway.descending}</strong></span>
      <span>{t('flow.ascending')} <strong>{summary.gateway.ascending}</strong></span>
      <span>{t('flow.motor')} <strong>{summary.gateway.motor}</strong></span>
      <span>{t('flow.sensory')} <strong>{summary.gateway.sensory}</strong></span>
    </div>
    <div className="flow-bars">
      {GROUP_ORDER.filter(g => summary.byGroup[g]).map(group => {
        const bucket = summary.byGroup[group];
        return <div key={group} className="flow-bar">
          <span className="flow-name">{tGroup(group)}</span>
          <span className="flow-track">
            <span className="flow-fill" style={{
              width: `${Math.round(bucket.share * 100)}%`,
              background: GROUP_TINT[group],
            }} />
          </span>
          <span className="flow-value">{(bucket.share * 100).toFixed(1)}% · {bucket.count}</span>
        </div>;
      })}
    </div>
    <h4>{t('flow.strongest')}</h4>
    <ol className="top-list">
      {summary.topNeurons.slice(0, 12).map(n => <li key={n.bodyId}>
        <span className={(n.activation ?? 0) < 0 ? 'neg' : 'pos'}>
          {(n.activation ?? 0).toFixed(3)}
        </span>
        {name(n)} <em>{tRole(n.role)}{n.part !== 'other' ? ` · ${tPart(n.part)} ${n.side}` : ''}</em>
      </li>)}
    </ol>
  </div>;
}
