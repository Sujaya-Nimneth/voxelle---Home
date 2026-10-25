import { useState, useEffect, useRef } from 'react';
import { useHome } from '../context/HomeContext';
import { localAi, AI_PROVIDER_INFO, AI_PROVIDERS } from '../services/ai/orchestrator';
import type { ProviderHealth } from '../services/ai/types';
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Volume2,
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import type { AiProviderId, ChatMessage } from '../types';

const SUGGESTIONS = [
  'Prepare the house for movie night',
  'Dim the living room lights to 25% and turn on fan',
  'Lock the front door and turn off entry lights',
  'What happened at the front doorbell camera?',
  'Adjust the thermostat to 68 degrees',
  'Check the backyard pool and deck camera'
];

/**
 * Minimal structural type for the Web Speech API (not in lib.dom for all targets).
 */
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getSpeechRecognition = (): SpeechRecognitionCtor | null => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export const LocalAiModal = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    devices,
    cameras,
    updateDevice,
    triggerScene,
    setSelectedCamera
  } = useHome();

  const [provider, setProvider] = useState<AiProviderId>('voxelle-builtin');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm your Voxelle assistant. The built-in rule engine runs entirely in your browser; switch to Ollama or LM Studio to use a local LLM server. How can I help?",
      actions: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);
  const [health, setHealth] = useState<ProviderHealth | null>(null);
  const [checking, setChecking] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.2');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const healthRequestSeq = useRef(0);
  const lastQueryRef = useRef<string | null>(null);

  const activeProvider = AI_PROVIDERS[provider];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop any active dictation and voice playback when the modal unmounts.
  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  // Probe server-backed providers whenever the tab switches to them.
  useEffect(() => {
    if (!activeProvider.requiresServer) {
      setHealth(null);
      return;
    }
    void checkHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  // Health probe with a stale-response guard so rapid tab switches can't
  // resolve out of order.
  const checkHealth = async () => {
    const requestSeq = ++healthRequestSeq.current;
    setChecking(true);
    try {
      const result = await localAi.checkProviderHealth(provider);
      if (healthRequestSeq.current === requestSeq) {
        setHealth(result);
        if (result.models.length > 0 && !result.models.includes(selectedModel)) {
          const next = result.models[0] ?? selectedModel;
          setSelectedModel(next);
          localAi.setSelectedModel(provider, next);
        }
      }
    } catch (error) {
      if (healthRequestSeq.current === requestSeq) {
        setHealth({
          online: false,
          models: [],
          latencyMs: null,
          error: error instanceof Error ? error.message : 'unreachable'
        });
      }
    } finally {
      if (healthRequestSeq.current === requestSeq) {
        setChecking(false);
      }
    }
  };

  // Web Speech API Voice Recognition setup
  const toggleSpeechRecognition = () => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      alert('Speech recognition is not supported in this browser. Please type your command.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputQuery(transcript);
          void handleSendQuery(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const executeResult = (response: import('../types').AiResult) => {
    if (response.sceneTrigger) {
      triggerScene(response.sceneTrigger);
    }

    if (response.cameraCheck) {
      const targetCam = cameras.find(c => c.id === response.cameraCheck);
      if (targetCam) setSelectedCamera(targetCam);
    }

    for (const action of response.actions) {
      if (action.type === 'device_update' && action.deviceId) {
        updateDevice(action.deviceId, action.updates ?? {});
      }
    }
  };

  const handleSendQuery = async (queryText?: string, options?: { forceBuiltin?: boolean }) => {
    const query = (queryText ?? inputQuery).trim();
    if (!query || isProcessing) return;

    const useProvider: AiProviderId = options?.forceBuiltin ? 'voxelle-builtin' : provider;
    lastQueryRef.current = query;

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: query, actions: [] };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const response = useProvider === provider
        ? await localAi.processCommand(query, devices, cameras)
        : await AI_PROVIDERS[useProvider].processCommand(query, devices, cameras);

      executeResult(response);

      if (voiceReplyEnabled && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response.reply);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: response.reply,
          actions: response.actions
        }
      ]);
    } catch (err) {
      // Honest failure reporting: never claim inference succeeded when it didn't.
      const providerName = AI_PROVIDERS[useProvider].name;
      const reason = err instanceof Error ? err.message : 'unknown error';
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `${providerName} failed: ${reason}. Nothing was executed.`,
          actions: [],
          error: true
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const runFallback = () => {
    const query = lastQueryRef.current;
    if (query) void handleSendQuery(query, { forceBuiltin: true });
  };

  const handleProviderSwitch = (id: AiProviderId) => {
    setProvider(id);
    localAi.setProvider(id);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localAi.setSelectedModel(provider, model);
  };

  if (!isAiModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsAiModalOpen(false)}>
      <div className="ai-modal-container" onClick={e => e.stopPropagation()}>
        <div className="ai-modal-iridescent-glow" />

        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-header-left">
            <div className="glowing-orb" style={{ width: 32, height: 32 }}>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <div>
              <div className="ai-modal-header-title">Voxelle Assistant</div>
              <div className="ai-modal-header-sub">
                Local-first intelligence • built-in engine, or your own Ollama / LM Studio server
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="action-circle-btn"
              style={{ width: 32, height: 32 }}
              onClick={() => setVoiceReplyEnabled(!voiceReplyEnabled)}
              title={voiceReplyEnabled ? 'Disable Voice Feedback' : 'Enable Voice Feedback'}
              aria-pressed={voiceReplyEnabled}
            >
              {voiceReplyEnabled ? <Volume2 size={15} color="#34d399" /> : <VolumeX size={15} />}
            </button>

            <button className="ai-modal-close-btn" onClick={() => setIsAiModalOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Engine Provider Switcher Tabs */}
        <div className="ai-engine-tabs">
          {AI_PROVIDER_INFO.map(p => (
            <button
              key={p.id}
              className={`ai-tab-btn ${provider === p.id ? 'active' : ''}`}
              onClick={() => handleProviderSwitch(p.id)}
              title={p.status}
            >
              <Cpu size={12} />
              <span>{p.name}</span>
            </button>
          ))}

          {activeProvider.requiresServer && (
            <button
              className="ai-tab-btn"
              style={{
                marginLeft: 'auto',
                background: health?.online ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'
              }}
              onClick={() => void checkHealth()}
              title={`Ping ${activeProvider.name}`}
            >
              <RefreshCw size={11} className={checking ? 'spin-anim' : ''} />
              <span>
                {checking
                  ? 'Checking…'
                  : health?.online
                    ? `Online • ${health.latencyMs}ms`
                    : 'Check connection'}
              </span>
            </button>
          )}
        </div>

        {/* Server provider status row: honest state + model picker */}
        {activeProvider.requiresServer && health && !health.online && (
          <div className="ai-provider-status offline">
            <AlertTriangle size={12} />
            <span>
              {activeProvider.name} is not reachable{health.error ? ` (${health.error})` : ''}. Start the
              server locally, or use the built-in engine.
            </span>
          </div>
        )}
        {activeProvider.requiresServer && health?.online && health.models.length > 0 && (
          <div className="ai-provider-status online">
            <span>Model:</span>
            <select
              className="ai-model-select"
              value={selectedModel}
              onChange={e => handleModelChange(e.target.value)}
              aria-label="Selected model"
            >
              {health.models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <span className="ai-provider-latency">{health.latencyMs}ms round-trip</span>
          </div>
        )}

        {/* Chat Body */}
        <div className="ai-chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message ${msg.sender}`}>
              <div className={`ai-message-bubble ${msg.error ? 'error' : ''}`}>
                <div>{msg.text}</div>

                {msg.actions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                    {msg.actions.map((act, index) => (
                      <span key={index} className="ai-action-chip">
                        <CheckCircle2 size={13} />
                        <span>{act.description}</span>
                      </span>
                    ))}
                  </div>
                )}

                {msg.error && (
                  <button className="ai-fallback-btn" onClick={runFallback}>
                    Run with built-in engine
                  </button>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="ai-message assistant">
              <div className="ai-message-bubble" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" style={{ background: '#f59e0b' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  {activeProvider.name} is thinking…
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="ai-suggestions-row">
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              className="ai-suggestion-pill"
              onClick={() => void handleSendQuery(sug)}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          className="ai-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSendQuery();
          }}
        >
          <input
            type="text"
            className="ai-input-field"
            placeholder="Ask Voxelle to control lights, adjust climate, or check cameras..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
          />

          <button
            type="button"
            className={`ai-mic-btn ${isListening ? 'is-listening' : ''}`}
            onClick={toggleSpeechRecognition}
            title={isListening ? 'Listening... click to stop' : 'Speak natural language command'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <button
            type="submit"
            className="ai-send-btn"
            disabled={!inputQuery.trim() || isProcessing}
            title="Send command"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
