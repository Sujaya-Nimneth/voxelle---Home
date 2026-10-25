import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { HomeProvider, useHome } from './HomeContext';
import { SEED_AUTOMATIONS } from '../data/automations';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => <HomeProvider>{children}</HomeProvider>;

const renderHome = () => renderHook(() => useHome(), { wrapper });

const PERSISTENCE_KEY = 'voxelle-home-state-v1';

beforeEach(() => {
  window.localStorage.clear();
});

describe('HomeProvider initial state', () => {
  it('seeds 20 devices, 6 scenes, and 4 cameras', () => {
    const { result } = renderHome();

    expect(result.current.devices).toHaveLength(20);
    expect(result.current.scenes).toHaveLength(6);
    expect(result.current.cameras).toHaveLength(4);
  });

  it('derives the correct status summary counts', () => {
    const { result } = renderHome();

    // 7 seeded lights start on: entry sconces + pendant, lr ceiling + accent,
    // kitchen island + cabinets, patio strings
    expect(result.current.activeLightsCount).toBe(7);
    expect(result.current.unlockedDoorsCount).toBe(0);
    expect(result.current.playingSpeakersCount).toBe(1);
    expect(result.current.waterStatus).toBe('All Off');
  });
});

describe('toggleDevice', () => {
  it('flips power, value, and status text for a light', () => {
    const { result } = renderHome();

    act(() => result.current.toggleDevice('entry-sconces'));
    const sconces = result.current.devices.find((d) => d.id === 'entry-sconces')!;
    expect(sconces.isOn).toBe(false);
    expect(sconces.value).toBe(0);
    expect(sconces.statusText).toBe('Off');

    act(() => result.current.toggleDevice('entry-sconces'));
    expect(result.current.devices.find((d) => d.id === 'entry-sconces')!.statusText).toBe('80%');
  });

  it('maps lock state to Locked/Unlocked text', () => {
    const { result } = renderHome();

    act(() => result.current.toggleDevice('entry-door'));
    const door = result.current.devices.find((d) => d.id === 'entry-door')!;
    expect(door.isOn).toBe(false);
    expect(door.statusText).toBe('Unlocked');
    expect(door.value).toBe(0);
  });
});

describe('updateDevice', () => {
  it('turns a light off when value reaches 0', () => {
    const { result } = renderHome();

    act(() => result.current.updateDevice('lr-ceiling-lights', { value: 0 }));
    const light = result.current.devices.find((d) => d.id === 'lr-ceiling-lights')!;
    expect(light.isOn).toBe(false);
    expect(light.statusText).toBe('Off');
  });

  it('derives thermostat status text from target temperature', () => {
    const { result } = renderHome();

    act(() => result.current.updateDevice('lr-thermostat', { targetTemp: 74 }));
    const thermostat = result.current.devices.find((d) => d.id === 'lr-thermostat')!;
    expect(thermostat.value).toBe(74);
    expect(thermostat.statusText).toContain('74°');
  });
});

describe('triggerScene', () => {
  it('goodnight turns off lights, locks doors, and closes shades', () => {
    const { result } = renderHome();

    act(() => result.current.triggerScene('goodnight'));

    const lights = result.current.devices.filter((d) => d.type === 'light');
    lights.forEach((light) => {
      expect(light.isOn, `${light.name} should be off`).toBe(false);
    });
    const door = result.current.devices.find((d) => d.id === 'entry-door')!;
    expect(door.isOn).toBe(true);
    expect(door.statusText).toBe('Locked');
    const shades = result.current.devices.filter((d) => d.type === 'shade');
    shades.forEach((shade) => expect(shade.statusText).toBe('Closed'));

    // Scene marked active
    expect(result.current.scenes.find((s) => s.id === 'goodnight')!.isActive).toBe(true);
  });

  it('movie night dims overheads, sets cinema accent, and starts the TV', () => {
    const { result } = renderHome();

    act(() => result.current.triggerScene('movie-night'));

    const ceiling = result.current.devices.find((d) => d.id === 'lr-ceiling-lights')!;
    expect(ceiling.isOn).toBe(false);

    const accent = result.current.devices.find((d) => d.id === 'lr-accent-lights')!;
    expect(accent.isOn).toBe(true);
    expect(accent.value).toBe(25);
    expect(accent.statusText).toContain('Cinema');

    const tv = result.current.devices.find((d) => d.id === 'lr-tv')!;
    expect(tv.isOn).toBe(true);
    expect(tv.statusText).toContain('4K HDR');
  });

  it('leave-home locks down the house', () => {
    const { result } = renderHome();

    act(() => result.current.triggerScene('leave-home'));

    const door = result.current.devices.find((d) => d.id === 'entry-door')!;
    expect(door.statusText).toBe('Locked');
    result.current.devices
      .filter((d) => d.type === 'light')
      .forEach((light) => expect(light.isOn, `${light.name} should be off`).toBe(false));
  });
});

describe('selectedDevice modal sync', () => {
  it('keeps the open modal in sync when updateDevice runs', () => {
    const { result } = renderHome();

    act(() =>
      result.current.setSelectedDevice(result.current.devices.find((d) => d.id === 'lr-accent-lights')!)
    );
    act(() => result.current.updateDevice('lr-accent-lights', { value: 10 }));

    expect(result.current.selectedDevice?.value).toBe(10);
  });

  it('keeps the open modal in sync when toggleDevice runs', () => {
    const { result } = renderHome();

    act(() =>
      result.current.setSelectedDevice(result.current.devices.find((d) => d.id === 'entry-sconces')!)
    );
    act(() => result.current.toggleDevice('entry-sconces'));

    expect(result.current.selectedDevice?.isOn).toBe(false);
    expect(result.current.selectedDevice?.statusText).toBe('Off');
  });
});

describe('automations', () => {
  it('starts with the four seeded automations', () => {
    const { result } = renderHome();

    expect(result.current.automations).toHaveLength(4);
    expect(result.current.automationCount).toBe(4);
  });

  it('adds a generated automation at the top of the list and bumps the count', () => {
    const { result } = renderHome();

    act(() => {
      result.current.addAutomation({
        id: 'auto-1',
        title: 'Pool gate alert...',
        trigger: 'AI Semantic Rule: Triggered by user condition',
        action: 'Turn on backyard lights and notify me if the pool gate opens after 9 PM',
        icon: 'sparkles',
        enabled: true,
        color: '#10b981'
      });
    });

    expect(result.current.automations).toHaveLength(5);
    expect(result.current.automations[0]?.id).toBe('auto-1');
    expect(result.current.automationCount).toBe(5);
  });

  it('toggles an automation enabled flag', () => {
    const { result } = renderHome();
    const sentry = SEED_AUTOMATIONS.find((a) => a.id === 'sentry')!;

    expect(sentry.enabled).toBe(false);
    act(() => result.current.toggleAutomation('sentry'));

    expect(result.current.automations.find((a) => a.id === 'sentry')!.enabled).toBe(true);
  });
});

describe('persistence', () => {
  it('persists mutated home state to localStorage', () => {
    const { result } = renderHome();

    act(() => result.current.toggleDevice('entry-sconces'));

    const stored = JSON.parse(window.localStorage.getItem(PERSISTENCE_KEY)!);
    expect(stored.version).toBe(1);
    const sconces = (stored.devices as Array<{ id: string; isOn: boolean }>).find(
      (d) => d.id === 'entry-sconces'
    );
    expect(sconces?.isOn).toBe(false);
  });

  it('restores persisted state on a fresh provider mount', () => {
    window.localStorage.setItem(
      PERSISTENCE_KEY,
      JSON.stringify({
        version: 1,
        devices: [
          {
            id: 'lone-bulb',
            name: 'Lone Bulb',
            room: 'Entry',
            category: 'lights',
            type: 'light',
            isOn: false,
            value: 0,
            unit: '%',
            color: '#fff',
            theme: 'amber',
            statusText: 'Off'
          }
        ],
        scenes: [],
        automations: []
      })
    );

    const { result } = renderHome();

    expect(result.current.devices).toHaveLength(1);
    expect(result.current.devices[0]?.id).toBe('lone-bulb');
    expect(result.current.activeLightsCount).toBe(0);
  });

  it('ignores persisted state written by an unknown schema version', () => {
    window.localStorage.setItem(PERSISTENCE_KEY, JSON.stringify({ version: 999, devices: [] }));

    const { result } = renderHome();

    expect(result.current.devices).toHaveLength(20);
  });

  it('resetHome restores the seed state and re-persists it', () => {
    const { result } = renderHome();

    act(() => result.current.toggleDevice('entry-sconces'));
    act(() => result.current.resetHome());

    expect(result.current.devices.find((d) => d.id === 'entry-sconces')!.isOn).toBe(true);
    expect(result.current.automations).toHaveLength(4);

    // The reset state is immediately re-persisted with the seed values.
    const stored = JSON.parse(window.localStorage.getItem(PERSISTENCE_KEY)!) as {
      devices: Array<{ id: string; isOn: boolean }>;
    };
    expect(stored.devices.find((d) => d.id === 'entry-sconces')!.isOn).toBe(true);
  });
});

describe('derived climate summary', () => {
  it('reflects the thermostat target range', () => {
    const { result } = renderHome();

    // Seeds: living room 68°, bedroom 72°
    expect(result.current.climateSummary).toBe('68° - 72°');

    act(() => result.current.updateDevice('lr-thermostat', { targetTemp: 75 }));
    expect(result.current.climateSummary).toBe('72° - 75°');
  });
});
