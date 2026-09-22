import type { MotorDrive, Posture } from './api';

export type PoseJoint = {
  name: string; limb: string; key: string; weight: number;
  lower: number; upper: number;
};

export function jointAngle(posture: Posture | null, joint: PoseJoint): number {
  let angle = posture?.[joint.limb]?.[joint.key]?.angle;
  if (angle === undefined && joint.limb.startsWith('M ')) {
    const part = joint.limb.slice(2);
    const left = posture?.[`L ${part}`]?.[joint.key]?.angle ?? 0;
    const right = posture?.[`R ${part}`]?.[joint.key]?.angle ?? 0;
    // Midline pitch uses bilateral mean; lateral axes use half-difference.
    // This is a display convention, not measured muscle-to-axis physiology.
    angle = /abduct|twist/.test(joint.name) ? (left - right) / 2 : (left + right) / 2;
  }
  const balance = Math.max(-1, Math.min(1, (angle ?? 0) * joint.weight));
  return balance * (balance >= 0 ? joint.upper : -joint.lower);
}

export const netDrive = (value?: Pick<MotorDrive, 'excite' | 'inhibit'>) =>
  (value?.excite ?? 0) + (value?.inhibit ?? 0);

export function bodyDrives(motor: Record<string, MotorDrive>): Record<string, MotorDrive> {
  const result = { ...motor };
  for (const part of ['neck', 'abdomen']) {
    if (result[`M ${part}`]) continue;
    const left = motor[`L ${part}`], right = motor[`R ${part}`];
    if (!left && !right) continue;
    result[`M ${part}`] = {
      part, side: 'M',
      excite: ((left?.excite ?? 0) + (right?.excite ?? 0)) / 2,
      inhibit: ((left?.inhibit ?? 0) + (right?.inhibit ?? 0)) / 2,
      neurons: (left?.neurons ?? 0) + (right?.neurons ?? 0),
      active: (left?.active ?? 0) + (right?.active ?? 0),
    };
  }
  return result;
}
