import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { jointAngle, bodyDrives, netDrive } from '../src/lib/bodyPose.ts';
import { cachedRequest, latestRequest } from '../src/lib/requests.ts';

const root = new URL(existsSync(new URL('../../app/static-data/', import.meta.url))
  ? '../../app/' : '../public/', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const joint = { name: 'head', limb: 'M neck', key: 'neck', weight: 1, lower: -2, upper: 2 };
const pose = (left, right) => ({ 'L neck': { neck: { angle: left } }, 'R neck': { neck: { angle: right } } });

test('midline pitch responds to symmetric bilateral drive; lateral axes respond to imbalance', () => {
  assert.equal(jointAngle(pose(0.5, 0.5), joint), 1);
  assert.equal(jointAngle(pose(0.5, 0.5), { ...joint, name: 'head_abduct' }), 0);
  assert.equal(jointAngle(pose(0.5, -0.5), { ...joint, name: 'head_twist' }), 1);
  assert.equal(jointAngle(pose(0.5, -0.5), joint), 0);
});
test('direct midline values win, absent input stays neutral, joint range stays bounded', () => {
  assert.equal(jointAngle({ ...pose(1, 1), 'M neck': { neck: { angle: -0.25 } } }, joint), -0.5);
  assert.equal(jointAngle(null, joint), 0);
  assert.equal(jointAngle(pose(-20, -20), joint), -2);
});
test('net drive includes signed inhibition and midline colors use bilateral mean', () => {
  const motor = { 'L neck': { part: 'neck', side: 'L', excite: 2, inhibit: -6, active: 2, neurons: 4 },
    'R neck': { part: 'neck', side: 'R', excite: 4, inhibit: -2, active: 3, neurons: 8 } };
  assert.equal(netDrive(motor['L neck']), -4);
  const result = bodyDrives(motor);
  assert.equal(netDrive(result['M neck']), -1);
  assert.equal(result['M neck'].active, 5);
  assert.equal(result['M neck'].neurons, 12);
  assert.equal(motor['M neck'], undefined);
});
test('all shipped frames produce finite bounded angles and every midline joint can move', async () => {
  const model = await json('data/flybody-full/model.json');
  const joints = model.joints.filter(j => j.limb && j.key).map(j => ({
    ...j, lower: Math.min(...j.range), upper: Math.max(...j.range),
  }));
  const midline = joints.filter(j => j.limb.startsWith('M '));
  assert.equal(midline.length, 17);
  const moved = new Set();
  for (const file of await readdir(new URL('static-data/runs/', root))) {
    if (!file.endsWith('.json')) continue;
    const run = await json(`static-data/runs/${file}`);
    for (const frame of run.frames) for (const j of joints) {
      const angle = jointAngle(frame.posture, j);
      assert.ok(Number.isFinite(angle), `${file} ${j.name}`);
      assert.ok(angle >= j.lower - 1e-9 && angle <= j.upper + 1e-9, `${file} ${j.name}`);
      if (j.limb.startsWith('M ') && Math.abs(angle) > 1e-9) moved.add(j.name);
    }
  }
  assert.deepEqual([...moved].sort(), midline.map(j => j.name).sort());
});
test('an older completion cannot overwrite the newer experiment', async () => {
  const gate = latestRequest();
  let finishOld;
  let displayed;
  const old = gate.begin();
  const pending = new Promise(resolve => { finishOld = resolve; }).then(value => {
    if (gate.current(old)) displayed = value;
  });
  const current = gate.begin();
  assert.ok(old.signal.aborted);
  if (gate.current(current)) displayed = 'new';
  finishOld('old');
  await pending;
  assert.equal(displayed, 'new');
});
test('clearing invalidates an in-flight experiment even if its request still finishes', () => {
  const gate = latestRequest();
  const pending = gate.begin();
  gate.cancel();
  assert.ok(pending.signal.aborted);
  assert.equal(gate.current(pending), false);
  assert.equal(gate.current(gate.begin()), true);
});
test('concurrent label lookups share one request and retain its result', async () => {
  let calls = 0;
  const load = cachedRequest(async () => { calls++; return new Map([[10, 'neuron']]); });
  const [first, second] = await Promise.all([load(), load()]);
  assert.equal(first, second);
  assert.equal(await load(), first);
  assert.equal(calls, 1);
});
test('a failed label download can be retried', async () => {
  let calls = 0;
  const load = cachedRequest(async () => { if (++calls === 1) throw Error('offline'); return 'ready'; });
  await assert.rejects(load(), /offline/);
  assert.equal(await load(), 'ready');
  assert.equal(calls, 2);
});
