import { describe, it, expect } from 'vitest';
import { builtinRuleEngine } from './builtinRuleEngine';
import { AI_PROVIDER_INFO, AI_PROVIDERS } from './orchestrator';
import { SEED_CAMERAS } from '../../data/cameras';
import { SEED_DEVICES } from '../../data/devices';

const DEVICES = SEED_DEVICES;
const CAMERAS = SEED_CAMERAS;

describe('AI provider registry', () => {
  it('exposes the three documented providers with unique ids', () => {
    expect(AI_PROVIDER_INFO.map((p) => p.id)).toEqual(['voxelle-builtin', 'ollama', 'lmstudio']);
    expect(Object.keys(AI_PROVIDERS)).toEqual(['voxelle-builtin', 'ollama', 'lmstudio']);
  });

  it('builtin engine is always healthy', async () => {
    const health = await builtinRuleEngine.checkHealth();
    expect(health.online).toBe(true);
    expect(health.error).toBeNull();
  });
});

describe('BuiltinRuleEngine.processCommand', () => {
  it('matches the movie night scene intent and returns a scene trigger', async () => {
    const result = await builtinRuleEngine.processCommand(
      'Prepare the house for movie night',
      DEVICES,
      CAMERAS
    );

    expect(result.sceneTrigger).toBe('movie-night');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]?.type).toBe('scene');
    expect(result.actions[0]?.sceneId).toBe('movie-night');
  });

  it('dims living room lights to an explicit percentage', async () => {
    const result = await builtinRuleEngine.processCommand(
      'Dim the living room lights to 25%',
      DEVICES,
      CAMERAS
    );

    expect(result.actions.length).toBeGreaterThan(0);
    const action = result.actions.find((a) => a.deviceId === 'lr-ceiling-lights');
    expect(action?.type).toBe('device_update');
    expect(action?.updates?.value).toBe(25);
    expect(action?.updates?.isOn).toBe(true);
    // Kitchen light must not be touched when a room is targeted
    expect(result.actions.find((a) => a.deviceId === 'kitchen-island')).toBeUndefined();
  });

  it('turns off all lights when no room is specified', async () => {
    const result = await builtinRuleEngine.processCommand('turn off the lights', DEVICES, CAMERAS);

    expect(result.actions).toHaveLength(9); // nine lights in the seed home
    result.actions.forEach((action) => {
      expect(action.updates?.isOn).toBe(false);
      expect(action.updates?.value).toBe(0);
    });
  });

  it('locks the front door by default and unlocks when asked', async () => {
    const lock = await builtinRuleEngine.processCommand('lock the front door', DEVICES, CAMERAS);
    expect(lock.actions[0]?.deviceId).toBe('entry-door');
    expect(lock.actions[0]?.updates?.isOn).toBe(true);

    const unlock = await builtinRuleEngine.processCommand('unlock the front door', DEVICES, CAMERAS);
    expect(unlock.actions[0]?.updates?.isOn).toBe(false);
  });

  it('extracts the target temperature and reports the real current reading', async () => {
    const result = await builtinRuleEngine.processCommand(
      'Adjust the thermostat to 68 degrees',
      DEVICES,
      CAMERAS
    );

    const action = result.actions.find((a) => a.deviceId === 'lr-thermostat');
    expect(action?.updates?.targetTemp).toBe(68);
    // lr-thermostat seeds currentTemp 69 — the reply must use it, not a fabricated number
    expect(result.reply).toContain('currently 69°F');
  });

  it('routes camera queries to the porch camera and uses seed detection data', async () => {
    const result = await builtinRuleEngine.processCommand(
      'What happened at the front doorbell camera?',
      DEVICES,
      CAMERAS
    );

    expect(result.cameraCheck).toBe('porch');
    expect(result.actions[0]?.type).toBe('camera_inspect');
    // Derived from the camera's own aiTag instead of invented confidence numbers
    expect(result.reply).toContain('Package Delivered (99%)');
  });

  it('falls back to a helpful message for unknown intents without fabricating state', async () => {
    const result = await builtinRuleEngine.processCommand('tell me a joke about the ocean', DEVICES, CAMERAS);

    expect(result.actions).toEqual([]);
    expect(result.reply).toMatch(/couldn't match/i);
    expect(result.reply).not.toMatch(/verified|nominal/i);
  });
});
