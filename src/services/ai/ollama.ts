import type { AiProviderId, AiResult, Camera, Device } from '../../types';
import { fetchJsonWithTimeout } from './http';
import { buildCommandSystemPrompt } from './prompt';
import { extractJsonBlock, parseAiResult } from './resultParser';
import type { ProviderHealth } from './types';
import { ProviderUnavailableError } from './types';

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL ?? 'http://localhost:11434';

interface OllamaTagsResponse {
  models?: Array<{ name: string }>;
}

interface OllamaChatResponse {
  message?: { content?: string };
}

export class OllamaProvider {
  readonly id: AiProviderId = 'ollama';
  readonly name = 'Ollama Bridge';
  readonly requiresServer = true;

  selectedModel = 'llama3.2';

  setSelectedModel(model: string): void {
    this.selectedModel = model;
  }

  async checkHealth(): Promise<ProviderHealth> {
    const started = performance.now();
    const data = await fetchJsonWithTimeout<OllamaTagsResponse>(`${OLLAMA_URL}/api/tags`, this.id, { method: 'GET' });
    const latencyMs = Math.round(performance.now() - started);
    return {
      online: true,
      models: (data.models ?? []).map(m => m.name),
      latencyMs,
      error: null
    };
  }

  async processCommand(query: string, devices: Device[], cameras: Camera[]): Promise<AiResult> {
    const data = await fetchJsonWithTimeout<OllamaChatResponse>(`${OLLAMA_URL}/api/chat`, this.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.selectedModel,
        stream: false,
        format: 'json',
        messages: [
          { role: 'system', content: buildCommandSystemPrompt(devices, cameras) },
          { role: 'user', content: query }
        ]
      })
    });

    const content = data.message?.content;
    if (!content) {
      throw new ProviderUnavailableError('Ollama returned an empty completion', this.id);
    }

    return parseAiResult(extractJsonBlock(content), this.id);
  }
}

export const ollamaProvider = new OllamaProvider();
