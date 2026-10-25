import type { AiProviderId, AiResult, Camera, Device } from '../../types';
import { builtinRuleEngine } from './builtinRuleEngine';
import { lmStudioProvider } from './lmstudio';
import { ollamaProvider } from './ollama';
import type { AiChatProvider, ProviderHealth } from './types';

export const AI_PROVIDERS: Record<AiProviderId, AiChatProvider> = {
  'voxelle-builtin': builtinRuleEngine,
  ollama: ollamaProvider,
  lmstudio: lmStudioProvider
};

export const AI_PROVIDER_INFO = [
  { id: 'voxelle-builtin', name: 'Built-in Rule Engine', status: 'Always available' },
  { id: 'ollama', name: 'Ollama Bridge', status: 'Needs local Ollama server' },
  { id: 'lmstudio', name: 'LM Studio Bridge', status: 'Needs local LM Studio server' }
] as const;

/**
 * Facade the UI talks to. Provider selection actually routes — switching to
 * Ollama sends chat requests to Ollama, etc. Health latencies are measured
 * at request time, never hard-coded.
 */
export class LocalAiService {
  provider: AiProviderId = 'voxelle-builtin';

  setProvider(provider: AiProviderId): void {
    this.provider = provider;
  }

  get activeProvider(): AiChatProvider {
    return AI_PROVIDERS[this.provider];
  }

  setSelectedModel(providerId: AiProviderId, model: string): void {
    AI_PROVIDERS[providerId].setSelectedModel?.(model);
  }

  checkProviderHealth(providerId: AiProviderId = this.provider): Promise<ProviderHealth> {
    return AI_PROVIDERS[providerId].checkHealth();
  }

  async processCommand(query: string, devices: Device[], cameras: Camera[]): Promise<AiResult> {
    return this.activeProvider.processCommand(query, devices, cameras);
  }
}

export const localAi = new LocalAiService();
