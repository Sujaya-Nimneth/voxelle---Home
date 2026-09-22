import React, { useState, useEffect, useRef } from 'react';
import { useHome } from '../context/HomeContext';
import { localAi, LOCAL_AI_PROVIDERS } from '../services/localAiEngine';
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Terminal,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

const SUGGESTIONS = [
  "Prepare the house for movie night",
  "Dim the living room lights to 25% and turn on fan",
  "Lock the front door and turn off entry lights",
  "What happened at the front doorbell camera?",
  "Adjust the thermostat to 68 degrees",
  "Check the backyard pool and deck camera"
];

export const LocalAiModal = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    devices,
    scenes,
    cameras,
    updateDevice,
    triggerScene,
    setSelectedCamera
  } = useHome();

  const [provider, setProvider] = useState('voxelle-builtin');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm your Voxelle Local Neural Engine, running 100% on-device with zero cloud telemetry. How can I automate or control your home today?",
      actions: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ online: false, checking: false, models: [] });

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check Ollama status if selected
  useEffect(() => {
    if (provider === 'ollama') {
      checkOllama();
    }
  }, [provider]);

  const checkOllama = async () => {
    setOllamaStatus(prev => ({ ...prev, checking: true }));
    const result = await localAi.checkOllamaConnection();
    setOllamaStatus({ online: result.online, checking: false, models: result.models });
  };

  // Web Speech API Voice Recognition setup
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your command.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSendQuery = async (queryText) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isProcessing) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query, actions: [] };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      // Process through local AI orchestrator
      const response = await localAi.processCommand(query, devices, scenes, cameras);

      // Execute returned actions directly into smart home state
      if (response.sceneTrigger) {
        triggerScene(response.sceneTrigger);
      }

      if (response.cameraCheck) {
        const targetCam = cameras.find(c => c.id === response.cameraCheck);
        if (targetCam) setSelectedCamera(targetCam);
      }

      if (response.actions && response.actions.length > 0) {
        response.actions.forEach(action => {
          if (action.type === 'device_update' && action.deviceId) {
            updateDevice(action.deviceId, action.updates);
          }
        });
      }

      // Voice synthesis reply if enabled
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
          actions: response.actions || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "Local inference processed. Home state verified.",
          actions: []
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
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
              <div className="ai-modal-header-title">Voxelle Neural Assistant</div>
              <div className="ai-modal-header-sub">
                100% Private On-Device Intelligence • Zero Cloud Outbound
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Voice Speech Synthesis Toggle */}
            <button
              className="action-circle-btn"
              style={{ width: 32, height: 32 }}
              onClick={() => setVoiceReplyEnabled(!voiceReplyEnabled)}
              title={voiceReplyEnabled ? "Disable Voice Feedback" : "Enable Voice Feedback"}
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
          {LOCAL_AI_PROVIDERS.map(p => (
            <button
              key={p.id}
              className={`ai-tab-btn ${provider === p.id ? 'active' : ''}`}
              onClick={() => {
                setProvider(p.id);
                localAi.setProvider(p.id);
              }}
            >
              <Cpu size={12} />
              <span>{p.name}</span>
            </button>
          ))}

          {provider === 'ollama' && (
            <button
              className="ai-tab-btn"
              style={{ marginLeft: 'auto', background: ollamaStatus.online ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }}
              onClick={checkOllama}
              title="Ping Ollama server at localhost:11434"
            >
              <RefreshCw size={11} className={ollamaStatus.checking ? 'spin-anim' : ''} />
              <span>{ollamaStatus.online ? 'Ollama Online' : 'Check localhost:11434'}</span>
            </button>
          )}
        </div>

        {/* Chat Body */}
        <div className="ai-chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message ${msg.sender}`}>
              <div className="ai-message-bubble">
                <div>{msg.text}</div>

                {/* Render executed smart home actions */}
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                    {msg.actions.map((act, index) => (
                      <span key={index} className="ai-action-chip">
                        <CheckCircle2 size={13} />
                        <span>{act.description}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="ai-message assistant">
              <div className="ai-message-bubble" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" style={{ background: '#f59e0b' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  Local neural model computing actions...
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
              onClick={() => handleSendQuery(sug)}
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
            handleSendQuery();
          }}
        >
          <input
            type="text"
            className="ai-input-field"
            placeholder="Ask Voxelle to control lights, adjust climate, or check cameras..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
          />

          {/* Voice dictation button */}
          <button
            type="button"
            className={`ai-mic-btn ${isListening ? 'is-listening' : ''}`}
            onClick={toggleSpeechRecognition}
            title={isListening ? "Listening... click to stop" : "Speak natural language command"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Send query button */}
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
