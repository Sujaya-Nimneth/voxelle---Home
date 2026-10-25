import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { localAi, LOCAL_AI_PROVIDERS } from './localAiEngine';
import type { Device } from '../types';

const makeDevice = (overrides: Partial<Device> & Pick<Device, 'id' | 'name' | 'room' | 'category' | 'type'>): Device => ({
  isOn: true,
  value: 50,
  unit: '%',
  color: '#f59e0b',
  theme: 'amber',
  statusText: '50%',
  ...overrides
});

const DEVICES: Device[] = [
  makeDevice({ id: 'lr-ceiling-lights', name: 'Ceiling Lights', room: 'Living Room', category: 'lights', type: 'light' }),
  makeDevice({ id: 'kitchen-island', name: 'Island Lights', room: 'Kitchen', category: 'lights', type: 'light' }),
  makeDevice({ id: 'entry-door', name: 'Front Door', room: 'Entry', category: 'security', type: 'lock', isOn: true, value: 1, statusText: 'Locked' }),
  makeDevice({ id: 'lr-thermostat', name: 'Thermostat', room: 'Living Room', category: 'climate', type: 'thermostat', value: 68, targetTemp: 68, currentTemp: 69 }),
  makeDevice({ id: 'entry-fan', name: 'Ceiling Fan', room: 'Entry', category: 'fans', type: 'fan' })
];

describe('LOCAL_AI_PROVIDERS registry', () => {
  it('exposes the three documented providers with unique ids', () => {
    expect(LOCAL_AI_PROVIDERS.map(p => p.id)).toEqual(['voxelle-builtin', 'ollama', 'lmstudio']);
  });
});

describe('LocalAiService.processCommand', () => {
  it('matches the movie night scene intent and returns a scene trigger', async () => {
    const result = await localAi.processCommand('Prepare the house for movie night', DEVICES);

    expect(result.sceneTrigger).toBe('movie-night');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]?.type).toBe('scene');
    expect(result.actions[0]?.sceneId).toBe('movie-night');
  });

  it('dims living room lights to an explicit percentage', async () => {
    const result = await localAi.processCommand('Dim the living room lights to 25%', DEVICES);

    expect(result.actions.length).toBeGreaterThan(0);
    const action = result.actions.find(a => a.deviceId === 'lr-ceiling-lights');
    expect(action?.type).toBe('device_update');
    expect(action?.updates?.value).toBe(25);
    expect(action?.updates?.isOn).toBe(true);
    // Kitchen light must not be touched when a room is targeted
    expect(result.actions.find(a => a.deviceId === 'kitchen-island')).toBeUndefined();
  });

  it('turns off all lights when no room is specified', async () => {
    const result = await localAi.processCommand('turn off the lights', DEVICES);

    const lightActions = result.actions.filter(a => a.deviceId?.includes('lights') || a.deviceId === 'kitchen-island');
    expect(lightActions.length).toBe(2);
    lightActions.forEach(action => {
      expect(action.updates?.isOn).toBe(false);
      expect(action.updates?.value).toBe(0);
    });
  });

  it('locks the front door by default and unlocks when asked', async () => {
    const lock = await localAi.processCommand('lock the front door', DEVICES);
    expect(lock.actions[0]?.deviceId).toBe('entry-door');
    expect(lock.actions[0]?.updates?.isOn).toBe(true);
    expect(lock.actions[0]?.updates?.statusText).toBe('Locked');

    const unlock = await localAi.processCommand('unlock the front door', DEVICES);
    expect(unlock.actions[0]?.updates?.isOn).toBe(false);
    expect(unlock.actions[0]?.updates?.statusText).toBe('Unlocked');
  });

  it('extracts the target temperature for thermostat intents', async () => {
    const result = await localAi.processCommand('Adjust the thermostat to 68 degrees', DEVICES);

    const action = result.actions.find(a => a.deviceId === 'lr-thermostat');
    expect(action?.updates?.targetTemp).toBe(68);
  });

  it('routes camera queries to the porch camera', async () => {
    const result = await localAi.processCommand('What happened at the front doorbell camera?', DEVICES);

    expect(result.cameraCheck).toBe('porch');
    expect(result.actions[0]?.type).toBe('camera_inspect');
  });

  it('falls back to a helpful message for unknown intents without fabricating state', async () => {
    const result = await localAi.processCommand('tell me a joke about the ocean', DEVICES);

    expect(result.actions).toEqual([]);
    expect(result.reply).toMatch(/couldn't match/i);
    // The reply must not pretend telemetry was verified
    expect(result.reply).not.toMatch(/verified|nominal/i);
  });
});

describe('LocalAiService.checkOllamaConnection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports online with the installed model list when Ollama responds', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: [{ name: 'llama3.2' }, { name: 'mistral' }] })
    } as Response);

    const result = await localAi.checkOllamaConnection();

    expect(result.online).toBe(true);
    expect(result.models).toEqual(['llama3.2', 'mistral']);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tags'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('reports offline when Ollama is not running', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('fetch failed'));

    const result = await localAi.checkOllamaConnection();

    expect(result.online).toBe(false);
    expect(result.models).toEqual([]);
  });

  it('reports offline on a non-200 response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

    const result = await localAi.checkOllamaConnection();

    expect(result.online).toBe(false);
  });
});
