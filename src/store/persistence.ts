import type { Automation, Device, Scene } from '../types';

const STORAGE_KEY = 'voxelle-home-state-v1';
const STATE_VERSION = 1;

/**
 * Only user-mutable home state is persisted. UI state (active filters,
 * chassis, modals) intentionally resets on reload.
 */
export interface PersistedHomeState {
  version: number;
  devices: Device[];
  scenes: Scene[];
  automations: Automation[];
}

export function loadPersistedState(): Partial<PersistedHomeState> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersistedHomeState>;
    if (parsed.version !== STATE_VERSION) return null;
    if (
      !Array.isArray(parsed.devices) ||
      !Array.isArray(parsed.scenes) ||
      !Array.isArray(parsed.automations)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedHomeState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or private browsing — persistence is best-effort.
  }
}

export function clearPersistedState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing to recover from.
  }
}
