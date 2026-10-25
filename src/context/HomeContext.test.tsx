import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { HomeProvider, useHome } from './HomeContext';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <HomeProvider>{children}</HomeProvider>
);

const renderHome = () => renderHook(() => useHome(), { wrapper });

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
    const sconces = result.current.devices.find(d => d.id === 'entry-sconces')!;
    expect(sconces.isOn).toBe(false);
    expect(sconces.value).toBe(0);
    expect(sconces.statusText).toBe('Off');

    act(() => result.current.toggleDevice('entry-sconces'));
    expect(result.current.devices.find(d => d.id === 'entry-sconces')!.statusText).toBe('80%');
  });

  it('maps lock state to Locked/Unlocked text', () => {
    const { result } = renderHome();

    act(() => result.current.toggleDevice('entry-door'));
    const door = result.current.devices.find(d => d.id === 'entry-door')!;
    expect(door.isOn).toBe(false);
    expect(door.statusText).toBe('Unlocked');
    expect(door.value).toBe(0);
  });
});

describe('updateDevice', () => {
  it('turns a light off when value reaches 0', () => {
    const { result } = renderHome();

    act(() => result.current.updateDevice('lr-ceiling-lights', { value: 0 }));
    const light = result.current.devices.find(d => d.id === 'lr-ceiling-lights')!;
    expect(light.isOn).toBe(false);
    expect(light.statusText).toBe('Off');
  });

  it('derives thermostat status text from target temperature', () => {
    const { result } = renderHome();

    act(() => result.current.updateDevice('lr-thermostat', { targetTemp: 74 }));
    const thermostat = result.current.devices.find(d => d.id === 'lr-thermostat')!;
    expect(thermostat.value).toBe(74);
    expect(thermostat.statusText).toContain('74°');
  });
});

describe('triggerScene', () => {
  it('goodnight turns off lights, locks doors, and closes shades', () => {
    const { result } = renderHome();

    act(() => result.current.triggerScene('goodnight'));

    const lights = result.current.devices.filter(d => d.type === 'light');
    lights.forEach(light => {
      expect(light.isOn, `${light.name} should be off`).toBe(false);
    });
    const door = result.current.devices.find(d => d.id === 'entry-door')!;
    expect(door.isOn).toBe(true);
    expect(door.statusText).toBe('Locked');
    const shades = result.current.devices.filter(d => d.type === 'shade');
    shades.forEach(shade => expect(shade.statusText).toBe('Closed'));

    // Scene marked active
    expect(result.current.scenes.find(s => s.id === 'goodnight')!.isActive).toBe(true);
  });

  it('movie night dims overheads, sets cinema accent, and starts the TV', () => {
    const { result } = renderHome();

    act(() => result.current.triggerScene('movie-night'));

    const ceiling = result.current.devices.find(d => d.id === 'lr-ceiling-lights')!;
    expect(ceiling.isOn).toBe(false);

    const accent = result.current.devices.find(d => d.id === 'lr-accent-lights')!;
    expect(accent.isOn).toBe(true);
    expect(accent.value).toBe(25);
    expect(accent.statusText).toContain('Cinema');

    const tv = result.current.devices.find(d => d.id === 'lr-tv')!;
    expect(tv.isOn).toBe(true);
    expect(tv.statusText).toContain('4K HDR');
  });

  it('leave-home locks down the house', () => {
    const { result } = renderHome();

    act(() => result.current.triggerScene('leave-home'));

    const door = result.current.devices.find(d => d.id === 'entry-door')!;
    expect(door.statusText).toBe('Locked');
    result.current.devices
      .filter(d => d.type === 'light')
      .forEach(light => expect(light.isOn, `${light.name} should be off`).toBe(false));
  });
});

describe('selectedDevice modal sync', () => {
  it('keeps the open modal in sync when updateDevice runs', () => {
    const { result } = renderHome();

    act(() => result.current.setSelectedDevice(result.current.devices.find(d => d.id === 'lr-accent-lights')!));
    act(() => result.current.updateDevice('lr-accent-lights', { value: 10 }));

    expect(result.current.selectedDevice?.value).toBe(10);
  });
});
