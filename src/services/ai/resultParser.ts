import type { AiAction, AiResult } from '../../types';
import { ProviderResponseError } from './types';
import type { AiProviderId } from '../../types';

const ACTION_TYPES = new Set(['scene', 'camera_inspect', 'device_update']);
const THERMOSTAT_MODES = new Set(['Cool', 'Heat', 'Auto', 'Eco']);

/**
 * Validates and narrows raw model output into an AiResult. Throws
 * ProviderResponseError with the raw payload when the model ignores the
 * JSON contract, so callers can surface an honest error.
 */
export function parseAiResult(raw: string, providerId: AiProviderId): AiResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ProviderResponseError(`model reply was not valid JSON: ${raw.slice(0, 160)}`, providerId);
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new ProviderResponseError('model reply was not a JSON object', providerId);
  }

  const candidate = parsed as Partial<AiResult> & { actions?: unknown };

  if (typeof candidate.reply !== 'string' || candidate.reply.length === 0) {
    throw new ProviderResponseError('model reply missing "reply" string', providerId);
  }

  const actions: AiAction[] = [];
  if (Array.isArray(candidate.actions)) {
    for (const entry of candidate.actions) {
      if (typeof entry !== 'object' || entry === null) continue;
      const action = entry as Partial<AiAction>;
      if (typeof action.type !== 'string' || !ACTION_TYPES.has(action.type)) continue;
      if (action.type === 'device_update' && typeof action.deviceId !== 'string') continue;
      if (typeof action.description !== 'string') continue;
      if (action.updates && typeof action.updates === 'object') {
        const { mode, ...rest } = action.updates;
        if (mode !== undefined && !THERMOSTAT_MODES.has(mode)) {
          action.updates = { ...rest };
        }
      }
      actions.push(action as AiAction);
    }
  }

  return {
    reply: candidate.reply,
    sceneTrigger: typeof candidate.sceneTrigger === 'string' ? candidate.sceneTrigger : undefined,
    cameraCheck: typeof candidate.cameraCheck === 'string' ? candidate.cameraCheck : undefined,
    actions
  };
}

/** Best-effort extraction of a JSON object from a model reply that wrapped it in prose or code fences. */
export function extractJsonBlock(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) return raw.slice(firstBrace, lastBrace + 1);
  return raw.trim();
}
