import { cachedRequest } from './requests';

/** Typed client for the Python connectome API (see server/app.py). */

export type Neuron = {
  bodyId: number;
  type: string | null;
  instance: string | null;
  superclass: string | null;
  class: string | null;
  role: string;
  group: string;
  nt: string;
  sign: number;
  side: string;
  part: string;
  neuromere: string | null;
  inSyn: number;
  outSyn: number;
  hasPos: boolean;
  xyz: [number, number, number] | null;
  weight?: number;
  polarity?: 'excitatory' | 'inhibitory';
  activation?: number;
};

export type NodeCloud = {
  count: number;
  ids: number[];
  xyz: number[];
  role: number[];
  group: number[];
  roleNames: string[];
  groupNames: string[];
};

/** Joint balance per limb: +1 fully agonist, -1 fully antagonist. */
export type JointState = {
  /** Direction scaled by how hard this joint is driven, in [-1, 1]. */
  angle: number;
  /** Raw agonist-antagonist balance, before the effort scaling. */
  balance: number;
  effort: number;
};
export type Posture = Record<string, Record<string, JointState>>;

/** Signed, normalised activation per body ID for one hop or one time step. */
/** Per-population activation for the circuit panel: [0..1 strength, +1/-1 sign]. */
export type CircuitActivity = Record<string, [number, number]>;

export type Frame = {
  time: number; peak: number; active: number;
  values: [number, number][];
  posture: Posture;
  circuit: CircuitActivity;
};

export type Bucket = { share: number; count: number; net: number };
export type MotorDrive = {
  part: string; side: string; excite: number; inhibit: number;
  neurons: number; active: number;
};

export type Summary = {
  reached: number;
  byGroup: Record<string, Bucket>;
  byRole: Record<string, Bucket>;
  motorOutput: Record<string, MotorDrive>;
  sensoryInvolved: Record<string, { amount: number; active: number; neurons: number }>;
  posture: Posture;
  topNeurons: Neuron[];
  gateway: { descending: number; ascending: number; motor: number; sensory: number };
};

export type SimResult = {
  mode: string;
  direction: string;
  /** Capped at 4,000 for display; seedCount is the real total. */
  seeds: number[];
  seedCount: number;
  times: number[];
  frames: Frame[];
  summary: Summary;
};

export type Preset = {
  id: string; title: string; detail: string;
  direction: string; mode: string; seeds: number[];
  /** Hops that actually demonstrate this preset's claim. */
  hops?: number;
};

export type Meta = {
  dataset: string; license: string; attribution: string; source: string;
  nodes: number; edges: number; renderable: number;
  edges_dropped_to_fragments?: number;
  node_universe?: string;
  signs: Record<string, number>;
  bodyParts: string[]; roles: string[]; groups: string[];
  presets: Preset[];
};

export type CircuitNode = {
  id: string; layer: string; tag: string;
  label: string; ko: string; count: number;
};
export type CircuitEdge = {
  s: string; t: string; w: number; exc: number; back: boolean;
};
export type Circuit = {
  layers: string[];
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  minEdge: number;
};

export type SimSettings = {
  mode: 'path' | 'rate';
  direction: 'downstream' | 'upstream';
  hops: number;
  decay: number;
  duration: number;
  tau: number;
  gain: number;
  stim: number;
  min_weight: number;
  inhibition: number;
};

export const DEFAULT_SETTINGS: SimSettings = {
  mode: 'path', direction: 'downstream', hops: 5, decay: 0.85,
  duration: 1, tau: 0.05, gain: 2, stim: 0.25, min_weight: 5, inhibition: 1,
};

/**
 * The hosted build has no backend: GitHub Pages is static and the engine needs a
 * 245 MB matrix. It reads precomputed files instead, so presets and circuit
 * populations still play, but an arbitrary neuron cannot be stimulated.
 */
export const IS_STATIC = import.meta.env.VITE_STATIC === '1';
const STATIC_ROOT = 'static-data';

async function json<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}${path}`, { signal });
  if (!response.ok) throw Error(`${path}: ${response.status}`);
  return response.json() as Promise<T>;
}

/** One row of labels.json, loaded lazily because the table is 8 MB. */
export type NeuronLabel = {
  bodyId: number; name: string; role: string; part: string;
  side: string; nt: string; population: string | null;
};
const loadLabels = cachedRequest(async () => {
  const table = await json<{ populations: string[]; rows: unknown[][] }>(
    `${STATIC_ROOT}/labels.json`);
  const index = new Map<number, NeuronLabel>();
  for (const row of table.rows) {
    const population = row[6] as number;
    index.set(row[0] as number, {
      bodyId: row[0] as number, name: row[1] as string, role: row[2] as string,
      part: row[3] as string, side: row[4] as string, nt: row[5] as string,
      population: population >= 0 ? table.populations[population] : null,
    });
  }
  return index;
});

export async function lookupLabel(bodyId: number): Promise<NeuronLabel | null> {
  return (await loadLabels()).get(bodyId) ?? null;
}

const staticKey = (populationId: string) =>
  `pop-${populationId.replace(/:/g, '_').replace(/ /g, '-').replace(/\//g, '-')}`;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: init?.body ? { 'content-type': 'application/json' } : undefined,
  });
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.detail) detail = String(body.detail);
    } catch { /* keep the status line */ }
    throw Error(detail);
  }
  return response.json() as Promise<T>;
}

export const getMeta = async (): Promise<Meta> => IS_STATIC
  ? (await json<{ meta: Meta }>(`${STATIC_ROOT}/index.json`)).meta
  : call<Meta>('/api/meta');

export const getCircuit = cachedRequest(() => IS_STATIC
  ? json<Circuit>(`${STATIC_ROOT}/circuit.json`)
  : call<Circuit>('/api/circuit'));

/** Hop counts the static build has precomputed: the same 1-10 the engine offers. */
const STATIC_HOP_MIN = 1;
const STATIC_HOP_MAX = 10;
const staticHop = (hops: number) =>
  Math.min(Math.max(Math.round(hops), STATIC_HOP_MIN), STATIC_HOP_MAX);

/** Play a preset: precomputed when static, computed live otherwise. */
export const runPreset = (preset: Preset, settings: SimSettings, signal?: AbortSignal) => IS_STATIC
  ? json<SimResult>(preset.mode === 'rate'
      ? `${STATIC_ROOT}/runs/preset-${preset.id}.json`
      : `${STATIC_ROOT}/runs/preset-${preset.id}-h${staticHop(settings.hops)}.json`, signal)
  : simulate(preset.seeds, {
      ...settings,
      mode: preset.mode as SimSettings['mode'],
      direction: preset.direction as SimSettings['direction'],
      hops: settings.hops,
    }, [], signal);

export const runPopulation = (populationId: string, settings: SimSettings, signal?: AbortSignal) =>
  IS_STATIC
    ? json<SimResult>(
        `${STATIC_ROOT}/runs/${staticKey(populationId)}-h${staticHop(settings.hops)}.json`, signal)
    : simulate([], settings, [populationId], signal);

/** Raised instead of a 404 when the hosted build is asked to compute. */
export class StaticLimitError extends Error {}
export const getNodes = () => IS_STATIC
  ? json<NodeCloud>(`${STATIC_ROOT}/nodes.json`)
  : call<NodeCloud>('/api/nodes');
export const getNeuron = (bodyId: number) =>
  call<{ neuron: Neuron; downstream: Neuron[]; upstream: Neuron[] }>(`/api/neuron/${bodyId}`);

export const searchNeurons = (query: string, filters: Record<string, string> = {}) => {
  const params = new URLSearchParams({ q: query, limit: '40', ...filters });
  return call<{ results: Neuron[] }>(`/api/search?${params}`);
};

export const getGroup = (filters: Record<string, string>) => {
  const params = new URLSearchParams({ limit: '400', ...filters });
  return call<{ ids: number[]; count: number }>(`/api/group?${params}`);
};

export const simulate = (
  seeds: number[], settings: SimSettings, populations: string[] = [], signal?: AbortSignal,
) => {
  if (IS_STATIC) {
    // No engine here, and a 404 would read as a broken site rather than a
    // deliberate limit of the hosted build.
    return Promise.reject(new StaticLimitError('static'));
  }
  return call<SimResult>('/api/simulate', {
    method: 'POST', signal,
    body: JSON.stringify({ seeds, populations, ...settings }),
  });
};

export type TracedPath = {
  score: number;
  nodes: Neuron[];
  steps: { from: number; to: number; weight: number; polarity: string }[];
};

export const tracePath = (source: number, target: number, direction: string) =>
  call<{ paths: TracedPath[] }>('/api/trace', {
    method: 'POST',
    body: JSON.stringify({ source, target, direction, max_hops: 5 }),
  });
