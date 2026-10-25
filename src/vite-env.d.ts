/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the local Ollama server (default http://localhost:11434). */
  readonly VITE_OLLAMA_URL?: string;
  /** Base URL of the local LM Studio server (default http://localhost:1234). */
  readonly VITE_LMSTUDIO_URL?: string;
}
