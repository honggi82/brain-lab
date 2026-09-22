export type Atlas = { positions: Float32Array; ids: Uint32Array; groups: Uint8Array; visibleIds: Set<number> };
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
