import type { AiProviderId, AiResult, Camera, Device } from '../../types';

/** Result of probing a provider's local server. */
export interface ProviderHealth {
  online: boolean;
  models: string[];
  /** Measured round-trip of the health probe; null when offline or not applicable. */
  latencyMs: number | null;
  /** Human-readable failure reason when offline. */
  error: string | null;
}

/**
 * A chat provider that turns a natural-language command into a structured
 * smart-home result. Implementations must throw ProviderUnavailableError
 * when their backing server cannot be reached.
 */
export interface AiChatProvider {
  readonly id: AiProviderId;
  readonly name: string;
  /** True when the provider needs a locally running server (Ollama, LM Studio). */
  readonly requiresServer: boolean;
  /** Server-backed providers expose the model the chat requests are sent to. */
  setSelectedModel?(model: string): void;
  checkHealth(): Promise<ProviderHealth>;
  processCommand(query: string, devices: Device[], cameras: Camera[]): Promise<AiResult>;
}

export class ProviderUnavailableError extends Error {
  constructor(
    message: string,
    public readonly providerId: AiProviderId
  ) {
    super(message);
    this.name = 'ProviderUnavailableError';
  }
}

export class ProviderResponseError extends Error {
  constructor(
    message: string,
    public readonly providerId: AiProviderId
  ) {
    super(message);
    this.name = 'ProviderResponseError';
  }
}
