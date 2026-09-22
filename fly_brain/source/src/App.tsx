import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CnsScene } from './components/CnsScene';
import { CircuitMap } from './components/CircuitMap';
import { DeferredBody } from './components/DeferredBody';
import { latestRequest } from './lib/requests';
import { Controls, Inspector, SearchPanel, SignalFlow } from './components/Panels';
import { Attribution } from './components/Attribution';
import {
  DEFAULT_SETTINGS, getMeta, getNodes, getCircuit, simulate, runPreset, runPopulation,
  lookupLabel, IS_STATIC, StaticLimitError,
  type Meta, type NeuronLabel, type NodeCloud, type Preset,
  type SimResult, type SimSettings, type Circuit,
} from './lib/api';
import { asset } from './lib/atlas';
import { EMBEDDED, LangContext, readLang, writeLang, useT, type Lang } from './lib/i18n';

type Tab = 'search' | 'neuron' | 'flow';
type Run = { kind: 'preset'; preset: Preset; label: string }
  | { kind: 'population'; id: string; label: string }
  | { kind: 'neurons'; ids: number[]; label: string };

export function App() {
  const [lang, setLang] = useState<Lang>(readLang);

  // Embedded in the lab site there is one language switch, and it is the
  // site's: the shell posts the choice in, the same way the brain atlas gets it.
  useEffect(() => {
    if (!EMBEDDED) return;
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data = event.data as { type?: string; language?: string } | null;
      if (data?.type !== 'brainlab-language') return;
      setLang(data.language === 'ko' ? 'ko' : 'en');
    };
    window.addEventListener('message', receive);
    window.parent?.postMessage({ type: 'fly-brain-ready' }, window.location.origin);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (!EMBEDDED) writeLang(lang);
  }, [lang]);

  return <LangContext.Provider value={lang}>
    <Simulator lang={lang} onLang={setLang} />
  </LangContext.Provider>;
}

function Simulator({ lang, onLang }: { lang: Lang; onLang: (next: Lang) => void }) {
  const { t, role: tRole, part: tPart } = useT();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [cloud, setCloud] = useState<NodeCloud | null>(null);
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [settings, setSettings] = useState<SimSettings>(DEFAULT_SETTINGS);
  const [seeds, setSeeds] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<SimResult | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>(IS_STATIC ? 'neuron' : 'search');
  const [picked, setPicked] = useState<NeuronLabel | null>(null);
  const [picking, setPicking] = useState(false);
  const [activeRun, setActiveRun] = useState<Run | null>(null);
  const settingsRef = useRef(settings);
  const lastRun = useRef<Run | null>(null);
  const requests = useRef(latestRequest());
  const lookups = useRef(latestRequest());
  const hopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMeta(), getNodes(), getCircuit()])
      .then(([m, c, graph]) => {
        if (!cancelled) { setMeta(m); setCloud(c); setCircuit(graph); }
      }).catch(e => { if (!cancelled) setError(String(e)); });
    return () => { cancelled = true; };
  }, []);

  const stopPending = useCallback(() => {
    requests.current.cancel();
    if (hopTimer.current !== null) clearTimeout(hopTimer.current);
    hopTimer.current = null;
  }, []);

  useEffect(() => () => {
    stopPending();
    lookups.current.cancel();
  }, [stopPending]);

  const execute = useCallback(async (request: Run, next: SimSettings) => {
    stopPending();
    const ticket = requests.current.begin();
    const effective = IS_STATIC ? { ...DEFAULT_SETTINGS, hops: next.hops,
      mode: request.kind === 'preset' ? request.preset.mode as SimSettings['mode'] : 'path' as const,
      direction: request.kind === 'preset' ? request.preset.direction as SimSettings['direction'] : 'downstream' as const,
    } : next;
    settingsRef.current = effective;
    setSettings(effective);
    lastRun.current = request;
    setActiveRun(request);
    setRunning(true);
    setError('');
    setResult(null);
    setSeeds([]);
    setFrameIndex(0);
    setPlaying(false);
    lookups.current.cancel();
    setPicking(false);
    setPicked(null);
    setSelected(null);
    try {
      const outcome = request.kind === 'preset'
        ? await runPreset(request.preset, effective, ticket.signal)
        : request.kind === 'population'
          ? await runPopulation(request.id, effective, ticket.signal)
          : await simulate(request.ids, effective, [], ticket.signal);
      if (!requests.current.current(ticket)) return;
      const resolved: SimSettings = { ...effective,
        mode: outcome.mode as SimSettings['mode'],
        direction: outcome.direction as SimSettings['direction'],
        hops: outcome.mode === 'path' ? outcome.frames.length - 1 : effective.hops,
      };
      settingsRef.current = resolved;
      setSettings(resolved);
      setResult(outcome);
      setSeeds(outcome.seeds);
      setPlaying(true);
    } catch (e) {
      if (requests.current.current(ticket)) {
        setError(e instanceof StaticLimitError ? 'static' : String(e));
      }
    } finally {
      if (requests.current.current(ticket)) setRunning(false);
    }
  }, [stopPending]);

  const playPreset = useCallback((preset: Preset, label: string) => execute(
    { kind: 'preset', preset, label }, { ...settingsRef.current,
      mode: preset.mode as SimSettings['mode'], direction: preset.direction as SimSettings['direction'],
      hops: preset.hops ?? settingsRef.current.hops,
    }), [execute]);

  const playPopulation = useCallback((id: string, label: string) =>
    execute({ kind: 'population', id, label }, settingsRef.current), [execute]);

  const replay = useCallback(() => {
    if (lastRun.current) return execute(lastRun.current, settingsRef.current);
  }, [execute]);

  const clear = useCallback(() => {
    stopPending();
    lookups.current.cancel();
    lastRun.current = null;
    setActiveRun(null);
    setSeeds([]);
    setResult(null);
    setSelected(null);
    setPicked(null);
    setPicking(false);
    setFrameIndex(0);
    setPlaying(false);
    setRunning(false);
    setError('');
  }, [stopPending]);

  const changeSettings = useCallback((next: SimSettings) => {
    const hopChanged = next.hops !== settingsRef.current.hops;
    settingsRef.current = next;
    setSettings(next);
    if (!IS_STATIC || !hopChanged || !lastRun.current) return;
    stopPending();
    setPlaying(false);
    setRunning(true);
    hopTimer.current = setTimeout(() => { void replay(); }, 250);
  }, [replay, stopPending]);

  const applySeeds = useCallback((ids: number[], label: string) => {
    lastRun.current = { kind: 'neurons', ids, label };
    setActiveRun(lastRun.current);
    setSeeds(ids);
  }, []);

  const run = useCallback((ids?: number[]) => {
    if (IS_STATIC) return replay();
    const targets = ids ?? seeds;
    if (!targets.length) return;
    return execute({ kind: 'neurons', ids: targets,
      label: lastRun.current?.kind === 'neurons' ? lastRun.current.label : `body ${targets.join(', ')}`,
    }, settingsRef.current);
  }, [execute, replay, seeds]);

  const pick = useCallback((bodyId: number, additive: boolean) => {
    setSelected(bodyId);
    setTab('neuron');
    if (IS_STATIC) {
      const ticket = lookups.current.begin();
      setPicked(null);
      setPicking(true);
      void lookupLabel(bodyId).then(label => {
        if (lookups.current.current(ticket)) setPicked(label);
      }).catch(e => {
        if (lookups.current.current(ticket)) setError(String(e));
      }).finally(() => {
        if (lookups.current.current(ticket)) setPicking(false);
      });
      return;
    }
    const next = additive
      ? (seeds.includes(bodyId) ? seeds.filter(id => id !== bodyId) : [...seeds, bodyId])
      : [bodyId];
    applySeeds(next, `body ${next.join(', ')}`);
    if (!additive) void run(next);
  }, [run, seeds, applySeeds]);

  const population = activeRun?.kind === 'population'
    ? circuit?.nodes.find(node => node.id === activeRun.id) : null;
  const displayLabel = activeRun?.kind === 'preset'
    ? t(`preset.${activeRun.preset.id}.title` as never)
    : population ? (lang === 'ko' ? population.ko : population.label) : activeRun?.label;

  const frames = result?.frames ?? [];
  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const step = setInterval(() => {
      setFrameIndex(index => {
        if (index >= frames.length - 1) { setPlaying(false); return index; }
        return index + 1;
      });
    }, result?.mode === 'rate' ? 60 : 420);
    return () => clearInterval(step);
  }, [playing, frames.length, result?.mode]);

  const frame = frames[Math.min(frameIndex, Math.max(0, frames.length - 1))] ?? null;
  const stepLabel = useMemo(() => {
    if (!result || !frame) return t('toolbar.noSim');
    return result.mode === 'rate'
      ? `t = ${frame.time.toFixed(3)} s`
      : `${t('toolbar.hop')} ${frame.time.toFixed(0)} ${t('toolbar.of')} ${result.frames.length - 1}`;
  }, [result, frame, lang]);

  return <>
    <header>
      <h1>{t('app.title')}</h1>
      <span>{t(IS_STATIC ? 'static.subtitle' : 'app.subtitle')}</span>
      {!EMBEDDED && <a href="https://male-cns.janelia.org/">{t('app.dataset')}</a>}
      <button className="manual-button" title={t('app.manualTip')}
              onClick={() => window.open(asset(t('app.manualFile')), 'fly-sim-manual',
                'noopener,width=1180,height=900')}>
        {t('app.manual')}
      </button>
      {!EMBEDDED && <div className="lang-toggle" role="group" aria-label={t('app.langLabel')}>
        <button aria-pressed={lang === 'ko'} onClick={() => onLang('ko')}>Kr</button>
        <button aria-pressed={lang === 'en'} onClick={() => onLang('en')}>En</button>
      </div>}
    </header>

    <main>
      <div className="toolbar">
        <span className="status">
          {t('toolbar.stimulating')}: <strong>{displayLabel || t('toolbar.nothing')}</strong> ·{' '}
          {(result?.seedCount ?? seeds.length).toLocaleString()}
          {lang === 'ko' ? '' : ' '}
          {seeds.length === 1 ? t('toolbar.seed') : t('toolbar.seeds')}
          {' · '}
          {(result?.direction ?? settings.direction) === 'downstream' ? t('ctrl.down') : t('ctrl.up')}
          {' · '}{stepLabel}
        </span>
        <div className="controls">
          <button onClick={() => { setFrameIndex(0); setPlaying(false); }}>{t('toolbar.reset')}</button>
          <button disabled={frames.length === 0}
                  onClick={() => {
                    if (frameIndex >= frames.length - 1) setFrameIndex(0);
                    setPlaying(!playing);
                  }}>{playing ? t('toolbar.pause') : t('toolbar.play')}</button>
          <button disabled={running || !activeRun} onClick={() => void replay()}>
            {running ? t(IS_STATIC ? 'static.loadingRun' : 'toolbar.running') : t('toolbar.rerun')}
          </button>
          <button disabled={!activeRun && selected === null && !running} onClick={clear}>
            {t('toolbar.clear')}
          </button>
        </div>
      </div>

      {error && <p className="error" role="alert">{t(error === "static" ? "static.cannotCompute" : "error.load")} {error !== "static" && error}</p>}
      {IS_STATIC && <p className="static-note">
        <strong>{t('static.badge')}</strong> {t('static.why')}
      </p>}

      <div className="sim-workbench">
        <section className="panel cns-panel">
          <h2>{t('panel.cns')}
            <span>{meta ? `${meta.renderable.toLocaleString()}${t('panel.cnsSomata')}` : '…'}</span></h2>
          {cloud
            ? <CnsScene cloud={cloud} frame={frame} seeds={seeds} selected={selected} onPick={pick} />
            : <p className="loading" role="status">{t('panel.loadingAnatomy')}</p>}
          <div className="panel-bottom">
            <span>{meta ? `${meta.edges.toLocaleString()}${t('panel.cnsEdges')}` : ''}</span>
            <span>{t('panel.cnsOrient')}</span>
          </div>
        </section>

        <section className="panel body-panel">
          <h2>{t('panel.body')} <span>{t('panel.bodyTag')}</span></h2>
          <div className="body-inner">
            <DeferredBody summary={result?.summary ?? null}
                       posture={frame?.posture ?? result?.summary?.posture ?? null}
                       direction={result?.direction ?? 'downstream'} />
          </div>
          <div className="panel-bottom">
            <span>{t('panel.bodyPosed')}</span>
            <span>{t('panel.bodyDrag')}</span>
          </div>
        </section>

        <section className="panel circuit-panel">
          <h2>{t('circuit.title')} <span>{t('circuit.tag')}</span></h2>
          <CircuitMap activity={frame?.circuit ?? null}
                      onStimulate={playPopulation} running={running}
                      selectedPopulation={activeRun?.kind === 'population' ? activeRun.id : null} />
        </section>

        <section className="panel tools-panel">
          <h2>{t('panel.experiment')}</h2>
          <div className="tools-inner">
            {meta && <Controls meta={meta} settings={settings} onSettings={changeSettings}
                               onSeeds={(ids, label) => { applySeeds(ids, label); void run(ids); }}
                               onPreset={playPreset}
                               onRun={() => void run()} running={running}
                               seedCount={seeds.length} />}
          </div>
        </section>

        <section className="panel detail-panel">
          <h2>{t('panel.detail')}
            <span className="tabs">
              {((IS_STATIC ? ['neuron', 'flow'] : ['search', 'neuron', 'flow']) as Tab[]).map(key => (
                <button key={key} aria-pressed={tab === key} onClick={() => setTab(key)}>
                  {t(`tab.${key}` as const)}
                </button>
              ))}
            </span>
          </h2>
          <div className="detail-inner">
            {IS_STATIC && tab === 'neuron' && <div className="inspector">
              {picking ? <p className="muted" role="status">{t('insp.loading')}</p> : picked ? <>
                <h3>{picked.name || `body ${picked.bodyId}`}</h3>
                <dl className="facts">
                  <div><dt>{t('insp.bodyId')}</dt><dd>{picked.bodyId}</dd></div>
                  <div><dt>{t('insp.role')}</dt><dd>{tRole(picked.role)}</dd></div>
                  <div><dt>{t('insp.bodyPart')}</dt><dd>{tPart(picked.part)} {picked.side}</dd></div>
                  <div><dt>{t('insp.transmitter')}</dt><dd>{picked.nt}</dd></div>
                </dl>
                {picked.population && <button className="run" disabled={running}
                  onClick={() => void playPopulation(picked.population!, picked.population!)}>
                  {t('static.runIts')}
                </button>}
              </> : <p className="muted">{t('static.inspect')}</p>}
            </div>}
            {IS_STATIC && tab === 'search' && <p className="muted">{t('static.noSearch')}</p>}
            {!IS_STATIC && tab === 'search' && meta &&
              <SearchPanel meta={meta}
                           onSeeds={(ids, label) => { applySeeds(ids, label); void run(ids); }}
                           onSelect={id => { setSelected(id); setTab('neuron'); }} />}
            {!IS_STATIC && tab === 'neuron' &&
              <Inspector bodyId={selected}
                         onSeeds={(ids, label) => { applySeeds(ids, label); void run(ids); }}
                         onSelect={setSelected} />}
            {tab === 'flow' && <SignalFlow result={result} frameIndex={frameIndex} />}
          </div>
        </section>
      </div>

      <section className="model-status">
        <label>{t('step.label')}
          <input type="range" min="0" max={Math.max(0, frames.length - 1)} step="1"
                 value={frameIndex} disabled={frames.length === 0}
                 onChange={e => { setPlaying(false); setFrameIndex(Number(e.target.value)); }} />
          <span>{stepLabel}</span>
        </label>
      </section>

      <details>
        <summary>{t('notes.title')}</summary>
        <p><strong>{t('notes.measuredLabel')}</strong> {t('notes.measured', {
          nodes: meta?.nodes.toLocaleString() ?? '—',
          edges: meta?.edges.toLocaleString() ?? '—',
        })}</p>
        <p><strong>{t('notes.modelledLabel')}</strong> {t('notes.modelled')}</p>
        <p><strong>{t('notes.bodyLabel')}</strong> {t('notes.body')}</p>
        <p><strong>{t('notes.directionLabel')}</strong> {t('notes.direction')}</p>
        <p>{t('notes.credit')}
          <a href="https://male-cns.janelia.org/download/">{t('notes.creditLink')}</a>
          {t('notes.creditTail')}</p>
      </details>

    </main>

    <Attribution />
  </>;
}
