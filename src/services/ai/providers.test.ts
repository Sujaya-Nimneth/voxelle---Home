import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ollamaProvider } from './ollama';
import { lmStudioProvider } from './lmstudio';
import { parseAiResult, extractJsonBlock } from './resultParser';
import { ProviderUnavailableError, ProviderResponseError } from './types';
import { SEED_DEVICES } from '../../data/devices';
import { SEED_CAMERAS } from '../../data/cameras';

const validCompletion = JSON.stringify({
  reply: 'Done — living room lights set to 30%.',
  sceneTrigger: null,
  cameraCheck: null,
  actions: [
    {
      type: 'device_update',
      deviceId: 'lr-ceiling-lights',
      updates: { isOn: true, value: 30, statusText: '30%' },
      description: 'Set Ceiling Lights to 30%'
    }
  ]
});

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('OllamaProvider', () => {
  it('reports health with installed models and measured latency', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: [{ name: 'llama3.2' }] })
    } as Response);

    const health = await ollamaProvider.checkHealth();

    expect(health.online).toBe(true);
    expect(health.models).toEqual(['llama3.2']);
    expect(health.latencyMs).toBeGreaterThanOrEqual(0);
    expect(health.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tags'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('reports an honest offline error when the server is down', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('fetch failed'));

    const health = await ollamaProvider.checkHealth().catch((error) => {
      // checkHealth lets ProviderUnavailableError propagate for the UI to render
      expect(error).toBeInstanceOf(ProviderUnavailableError);
      return null;
    });

    expect(health).toBeNull();
  });

  it('sends the structured prompt to /api/chat and parses the JSON reply', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: { content: validCompletion } })
    } as Response);

    const result = await ollamaProvider.processCommand('dim the lights a bit', SEED_DEVICES, SEED_CAMERAS);

    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/chat');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string) as { messages: Array<{ role: string; content: string }> };
    expect(body.messages[0]?.role).toBe('system');
    expect(body.messages[0]?.content).toContain('DEVICE INVENTORY');
    expect(body.messages[0]?.content).toContain('lr-ceiling-lights');

    expect(result.reply).toContain('30%');
    expect(result.actions[0]?.deviceId).toBe('lr-ceiling-lights');
  });

  it('rejects with a provider error when the model ignores the JSON contract', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: { content: 'Sure, I dimmed the lights for you!' } })
    } as Response);

    await expect(
      ollamaProvider.processCommand('dim the lights', SEED_DEVICES, SEED_CAMERAS)
    ).rejects.toBeInstanceOf(ProviderResponseError);
  });

  it('times out after 8 seconds instead of hanging forever', async () => {
    vi.useFakeTimers();
    vi.mocked(fetch).mockImplementationOnce(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        })
    );

    const pending = ollamaProvider.processCommand('dim the lights', SEED_DEVICES, SEED_CAMERAS);
    vi.advanceTimersByTime(8500);

    await expect(pending).rejects.toThrow(/timed out/i);
    vi.useRealTimers();
  });
});

describe('LmStudioProvider', () => {
  it('reports health via /v1/models', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: 'qwen2.5-7b' }] })
    } as Response);

    const health = await lmStudioProvider.checkHealth();

    expect(health.online).toBe(true);
    expect(health.models).toEqual(['qwen2.5-7b']);
  });

  it('parses an OpenAI-compatible chat completion', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: validCompletion } }] })
    } as Response);

    const result = await lmStudioProvider.processCommand('dim the lights', SEED_DEVICES, SEED_CAMERAS);

    expect(result.actions[0]?.deviceId).toBe('lr-ceiling-lights');
  });
});

describe('result parsing helpers', () => {
  it('unwraps fenced JSON blocks from chatty models', () => {
    const wrapped = 'Here you go:\n```json\n' + validCompletion + '\n```\nEnjoy!';
    const parsed = parseAiResult(extractJsonBlock(wrapped), 'ollama');
    expect(parsed.reply).toContain('30%');
  });

  it('drops actions with unknown types or missing device ids', () => {
    const parsed = parseAiResult(
      JSON.stringify({
        reply: 'ok',
        actions: [
          { type: 'reboot_router', description: 'nope' },
          { type: 'device_update', description: 'missing deviceId' },
          { type: 'device_update', deviceId: 'entry-door', description: 'valid' }
        ]
      }),
      'ollama'
    );

    expect(parsed.actions).toHaveLength(1);
    expect(parsed.actions[0]?.deviceId).toBe('entry-door');
  });

  it('strips invalid thermostat modes but keeps valid ones', () => {
    const parsed = parseAiResult(
      JSON.stringify({
        reply: 'ok',
        actions: [
          {
            type: 'device_update',
            deviceId: 'lr-thermostat',
            updates: { mode: 'Party' },
            description: 'bad mode'
          },
          { type: 'device_update', deviceId: 'br-ac', updates: { mode: 'Eco' }, description: 'good mode' }
        ]
      }),
      'ollama'
    );

    expect(parsed.actions[0]?.updates?.mode).toBeUndefined();
    expect(parsed.actions[1]?.updates?.mode).toBe('Eco');
  });
});
