import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { Clock, Plus, Sparkles, Sun, Moon, MapPin, ShieldAlert, Check, ArrowRight } from 'lucide-react';

const INITIAL_AUTOMATIONS = [
  {
    id: 'sunset',
    title: 'Sunset Ambiance',
    trigger: 'Every day at Sunset',
    action: 'Turn on Patio Strings and dim Living Room Accent Lights to 60% purple',
    icon: Sun,
    enabled: true,
    color: '#f59e0b'
  },
  {
    id: 'geofence',
    title: 'Arrive Home Geo-Trigger',
    trigger: 'When your iPhone enters home perimeter',
    action: 'Unlock Front Door, set Living Room Thermostat to 70°F, and turn on Entry Sconces',
    icon: MapPin,
    enabled: true,
    color: '#06b6d4'
  },
  {
    id: 'goodnight',
    title: 'Goodnight Security & Darken',
    trigger: 'Every night at 11:00 PM',
    action: 'Lock all doors, close blackout shades, turn off all indoor lights, arm cameras',
    icon: Moon,
    enabled: true,
    color: '#a855f7'
  },
  {
    id: 'sentry',
    title: 'Porch AI Detection Sentry',
    trigger: 'When Porch Camera AI detects person between 12:00 AM - 6:00 AM',
    action: 'Turn Entry Overhead to 100%, send local notification to Mac & iPhone',
    icon: ShieldAlert,
    enabled: false,
    color: '#ef4444'
  }
];

export const AutomationsView = () => {
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { setIsAiModalOpen } = useHome();

  const toggleAutomation = (id) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleCreateWithAi = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newAuto = {
        id: `auto-${Date.now()}`,
        title: aiPrompt.slice(0, 30) + '...',
        trigger: 'AI Semantic Rule: Triggered by user condition',
        action: aiPrompt,
        icon: Sparkles,
        enabled: true,
        color: '#10b981'
      };
      setAutomations(prev => [newAuto, ...prev]);
      setAiPrompt('');
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="dashboard-title-row">
        <div>
          <h1 className="home-name-text">Automations</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Local event triggers executed on-device with zero cloud delay.
          </p>
        </div>

        <button
          className="viewport-btn active"
          style={{ padding: '8px 16px', background: '#f59e0b', color: '#111', fontWeight: 700 }}
          onClick={() => setIsAiModalOpen(true)}
        >
          <Sparkles size={14} />
          <span>Ask AI to Build Automation</span>
        </button>
      </div>

      {/* AI Automation Generator Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(168, 85, 247, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 20,
          padding: 20,
          backdropFilter: 'blur(20px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#fbbf24', fontWeight: 700, fontSize: 14 }}>
          <Sparkles size={16} />
          <span>Natural Language Automation Synthesizer</span>
        </div>
        <form onSubmit={handleCreateWithAi} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="ai-input-field"
            placeholder="e.g. Turn on backyard lights and notify me if the pool gate opens after 9 PM..."
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="viewport-btn active"
            style={{ padding: '0 20px', background: '#f59e0b', color: '#111', fontWeight: 700 }}
            disabled={isGenerating || !aiPrompt.trim()}
          >
            <span>{isGenerating ? 'Synthesizing...' : 'Generate'}</span>
          </button>
        </form>
      </div>

      {/* Automations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {automations.map(auto => {
          const Icon = auto.icon;
          return (
            <div
              key={auto.id}
              style={{
                background: 'rgba(30, 31, 40, 0.45)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--glass-border)',
                borderRadius: 18,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${auto.color}22`,
                    border: `1px solid ${auto.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: auto.color
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{auto.title}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>Trigger:</span> {auto.trigger}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>Action:</span> {auto.action}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleAutomation(auto.id)}
                style={{
                  width: 52,
                  height: 30,
                  borderRadius: 15,
                  background: auto.enabled ? '#10b981' : 'rgba(255,255,255,0.18)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 3,
                    left: auto.enabled ? 25 : 3,
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
