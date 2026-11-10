import { useSyncExternalStore } from "react";

type State = { progress: number; ready: boolean; note: string };
let state: State = { progress: 0, ready: false, note: "" };
const subs = new Set<() => void>();

export const loadState = {
  set(patch: Partial<State>) {
    const next = { ...state, ...patch };
    if (next.progress === state.progress && next.ready === state.ready && next.note === state.note) return;
    state = next;
    subs.forEach((fn) => fn());
  },
  get: () => state,
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
};

const initial: State = { progress: 0, ready: false, note: "" };
export function useLoadState() {
  return useSyncExternalStore(loadState.subscribe, loadState.get, () => initial);
}
