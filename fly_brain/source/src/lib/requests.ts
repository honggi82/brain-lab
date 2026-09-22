export function latestRequest() {
  let active: AbortController | null = null;
  return {
    begin() {
      active?.abort();
      active = new AbortController();
      return active;
    },
    current(request: AbortController) { return active === request && !request.signal.aborted; },
    cancel() { active?.abort(); active = null; },
  };
}

export function cachedRequest<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | null = null;
  return () => {
    pending ??= load().catch(error => { pending = null; throw error; });
    return pending;
  };
}
