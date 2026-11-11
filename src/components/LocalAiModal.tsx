import { useState, useEffect, useRef } from 'react';
import { useHome } from '../context/HomeContext';
import { localAi, AI_PROVIDER_INFO, AI_PROVIDERS } from '../services/ai/orchestrator';
import type { ProviderHealth } from '../services/ai/types';
import { useToast } from './Toast';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { ToggleButton } from '@astryxdesign/core/ToggleButton';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Selector } from '@astryxdesign/core/Selector';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Mic, MicOff, CheckCircle2, Cpu, RefreshCw, Volume2, VolumeX, Send } from 'lucide-react';
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
  const { isAiModalOpen, setIsAiModalOpen, devices, cameras, updateDevice, triggerScene, setSelectedCamera } =
    useHome();

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

  const { notify } = useToast();

  const activeProvider = AI_PROVIDERS[provider];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop any active dictation and voice playback when the modal unmounts.
  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    },
    []
  );

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
      notify('Speech recognition is not supported in this browser — please type your command.');
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
      const targetCam = cameras.find((c) => c.id === response.cameraCheck);
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
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const response =
        useProvider === provider
          ? await localAi.processCommand(query, devices, cameras)
          : await AI_PROVIDERS[useProvider].processCommand(query, devices, cameras);

      executeResult(response);

      if (voiceReplyEnabled && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response.reply);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }

      setMessages((prev) => [
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
      setMessages((prev) => [
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

  const close = () => setIsAiModalOpen(false);
  const modelOptions = health?.models.map((model) => ({ value: model, label: model })) ?? [];

  return (
    <Dialog
      isOpen
      onOpenChange={(open) => !open && close()}
      width={640}
      maxHeight="85dvh"
      purpose="form"
      padding={0}
    >
      <VStack gap={0} height="100%">
        <DialogHeader
          title="Voxelle Assistant"
          subtitle="Local-first intelligence: built-in engine, or your own Ollama / LM Studio server"
          onOpenChange={close}
          endContent={
            <IconButton
              icon={<Icon icon={voiceReplyEnabled ? Volume2 : VolumeX} size="sm" />}
              label={voiceReplyEnabled ? 'Disable voice feedback' : 'Enable voice feedback'}
              variant="ghost"
              size="sm"
              tooltip={voiceReplyEnabled ? 'Disable Voice Feedback' : 'Enable Voice Feedback'}
              onClick={() => setVoiceReplyEnabled(!voiceReplyEnabled)}
            />
          }
        />

        <VStack gap={2} padding={3}>
          <HStack gap={1.5} wrap="wrap" vAlign="center">
            {AI_PROVIDER_INFO.map((info) => (
              <Button
                key={info.id}
                label={info.name}
                variant={provider === info.id ? 'primary' : 'secondary'}
                size="sm"
                icon={<Icon icon={Cpu} size="sm" />}
                onClick={() => handleProviderSwitch(info.id)}
              />
            ))}
            {activeProvider.requiresServer && (
              <Button
                label={checking ? 'Checking…' : health?.online ? `Online · ${health.latencyMs}ms` : 'Check connection'}
                variant={health?.online ? 'secondary' : 'ghost'}
                size="sm"
                icon={<Icon icon={RefreshCw} size="sm" />}
                isLoading={checking}
                onClick={() => void checkHealth()}
              />
            )}
          </HStack>

          {activeProvider.requiresServer && health && !health.online && (
            <HStack gap={1.5} vAlign="center" wrap="wrap">
              <StatusDot variant="error" label="Server unreachable" />
              <Text type="supporting">
                {activeProvider.name} is not reachable
                {health.error ? ` (${health.error})` : ''}. Start the server locally, or use the
                built-in engine.
              </Text>
            </HStack>
          )}

          {activeProvider.requiresServer && health?.online && health.models.length > 0 && (
            <HStack gap={2} vAlign="end" wrap="wrap">
              <Selector
                label="Model"
                options={modelOptions}
                value={selectedModel}
                onChange={handleModelChange}
                size="sm"
              />
              <Text type="supporting" hasTabularNumbers>
                {health.latencyMs}ms round-trip
              </Text>
            </HStack>
          )}
        </VStack>

        <VStack gap={2} padding={3} isScrollable height="100%">
          <div aria-live="polite" aria-label="Assistant conversation" style={{ width: '100%' }}>
            <VStack gap={2} width="100%">
              {messages.map((msg) => (
                <HStack key={msg.id} hAlign={msg.sender === 'user' ? 'end' : 'start'} width="100%">
                  <Card
                    padding={2}
                    variant={msg.sender === 'user' ? 'muted' : 'default'}
                    maxWidth="80%"
                  >
                    <VStack gap={1}>
                      <Text color={msg.error ? 'accent' : 'primary'}>{msg.text}</Text>
                      {msg.actions.length > 0 && (
                        <HStack gap={1} wrap="wrap">
                          {msg.actions.map((action, index) => (
                            <Badge
                              key={index}
                              label={action.description}
                              variant="success"
                              icon={<Icon icon={CheckCircle2} size="sm" />}
                            />
                          ))}
                        </HStack>
                      )}
                      {msg.error && (
                        <Button
                          label="Run with built-in engine"
                          variant="secondary"
                          size="sm"
                          onClick={runFallback}
                        />
                      )}
                    </VStack>
                  </Card>
                </HStack>
              ))}

              {isProcessing && (
                <HStack gap={1.5} vAlign="center">
                  <StatusDot variant="accent" label="Processing" isPulsing />
                  <Text type="supporting">{activeProvider.name} is thinking…</Text>
                </HStack>
              )}
              <div ref={chatEndRef} />
            </VStack>
          </div>
        </VStack>

        <VStack gap={2} padding={3}>
          <HStack gap={1} wrap="wrap">
            {SUGGESTIONS.map((suggestion, index) => (
              <Button
                key={index}
                label={suggestion}
                variant="secondary"
                size="sm"
                onClick={() => void handleSendQuery(suggestion)}
              />
            ))}
          </HStack>

          <HStack gap={1.5} vAlign="end" width="100%">
            <TextInput
              label="Ask Voxelle"
              isLabelHidden
              placeholder="Ask Voxelle to control lights, adjust climate, or check cameras..."
              value={inputQuery}
              onChange={setInputQuery}
              onEnter={() => void handleSendQuery()}
              width="100%"
            />
            <ToggleButton
              label={isListening ? 'Stop listening' : 'Speak a command'}
              isPressed={isListening}
              onPressedChange={() => toggleSpeechRecognition()}
              size="sm"
              isIconOnly
              icon={<Icon icon={isListening ? MicOff : Mic} size="sm" />}
            />
            <IconButton
              label="Send command"
              icon={<Icon icon={Send} size="sm" />}
              variant="primary"
              isDisabled={!inputQuery.trim() || isProcessing}
              onClick={() => void handleSendQuery()}
            />
          </HStack>
        </VStack>
      </VStack>
    </Dialog>
  );
};
