import type { AiProviderId, AiResult, Camera, Device } from '../../types';
import { fetchJsonWithTimeout } from './http';
import { buildCommandSystemPrompt } from './prompt';
import { extractJsonBlock, parseAiResult } from './resultParser';
import type { ProviderHealth } from './types';
import { ProviderUnavailableError } from './types';

const LMSTUDIO_URL = import.meta.env.VITE_LMSTUDIO_URL ?? 'http://localhost:1234';

interface LmStudioModelsResponse {
  data?: Array<{ id: string }>;
}

interface LmStudioChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

export class LmStudioProvider {
  readonly id: AiProviderId = 'lmstudio';
  readonly name = 'LM Studio Bridge';
  readonly requiresServer = true;

  selectedModel = 'local-model';

  setSelectedModel(model: string): void {
    this.selectedModel = model;
  }

  async checkHealth(): Promise<ProviderHealth> {
    const started = performance.now();
    const data = await fetchJsonWithTimeout<LmStudioModelsResponse>(`${LMSTUDIO_URL}/v1/models`, this.id, { method: 'GET' });
    const latencyMs = Math.round(performance.now() - started);
    return {
      online: true,
      models: (data.data ?? []).map(m => m.id),
      latencyMs,
      error: null
    };
  }

  async processCommand(query: string, devices: Device[], cameras: Camera[]): Promise<AiResult> {
    const data = await fetchJsonWithTimeout<LmStudioChatResponse>(`${LMSTUDIO_URL}/v1/chat/completions`, this.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.selectedModel,
        messages: [
          { role: 'system', content: buildCommandSystemPrompt(devices, cameras) },
          { role: 'user', content: query }
        ]
      })
    });

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new ProviderUnavailableError('LM Studio returned an empty completion', this.id);
    }

    return parseAiResult(extractJsonBlock(content), this.id);
  }
}

export const lmStudioProvider = new LmStudioProvider();
