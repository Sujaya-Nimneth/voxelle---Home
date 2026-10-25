import type { Camera, Device } from '../../types';

const SCENE_IDS = ['arrive-home', 'wake-up', 'leave-home', 'movie-night', 'goodnight', 'focus-mode'];

/**
 * System prompt describing the home inventory and the strict JSON contract
 * the model must answer with. Shared by the Ollama and LM Studio providers.
 */
export function buildCommandSystemPrompt(devices: Device[], cameras: Camera[]): string {
  const deviceLines = devices
    .map(d => {
      const state = d.type === 'thermostat'
        ? `target ${d.targetTemp ?? d.value}°F, currently ${d.currentTemp ?? '?'}°F, mode ${d.mode ?? '—'}`
        : `${d.isOn ? 'on' : 'off'} at ${d.value}${d.unit}`;
      return `- ${d.id} | ${d.name} | ${d.room} | ${d.category}/${d.type} | ${state}`;
    })
    .join('\n');

  const cameraLines = cameras
    .map(c => `- ${c.id} | ${c.name} | ${c.location} | last detection: ${c.aiTag}`)
    .join('\n');

  return [
    'You are Voxelle, a smart-home control assistant embedded in a home dashboard.',
    'Answer ONLY with minified JSON, no markdown, matching this schema:',
    '{"reply":"<short friendly confirmation>","sceneTrigger":<scene id or null>,"cameraCheck":<camera id or null>,"actions":[{"type":"device_update","deviceId":"<id>","updates":{"isOn":boolean,"value":number,"statusText":string,"targetTemp":number,"mode":"Cool|Heat|Auto|Eco","color":"#hex"},"description":"<what you did>"}]}',
    `Valid sceneTrigger values: ${SCENE_IDS.join(', ')}. Use null when no scene applies.`,
    'Only reference device ids from the inventory below. Never invent telemetry.',
    '',
    'DEVICE INVENTORY:',
    deviceLines,
    '',
    'CAMERA INVENTORY:',
    cameraLines
  ].join('\n');
}
