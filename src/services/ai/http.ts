import { ProviderUnavailableError } from './types';
import type { AiProviderId } from '../../types';

const DEFAULT_TIMEOUT_MS = 8000;

/**
 * JSON fetch with an abort-based timeout. Normalises every failure mode
 * (offline, refused, timeout, HTTP error) into a ProviderUnavailableError
 * with a user-readable message — no silent catches.
 */
export async function fetchJsonWithTimeout<T>(
  url: string,
  providerId: AiProviderId,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });

    if (!response.ok) {
      throw new ProviderUnavailableError(`server responded with HTTP ${response.status}`, providerId);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ProviderUnavailableError) throw error;

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ProviderUnavailableError(`request timed out after ${timeoutMs / 1000}s`, providerId);
    }

    throw new ProviderUnavailableError(
      error instanceof Error ? error.message : 'network request failed',
      providerId
    );
  } finally {
    clearTimeout(timer);
  }
}
