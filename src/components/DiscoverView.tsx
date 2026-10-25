import { ShieldCheck, Cpu, Wifi, Sparkles } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Cpu,
    iconBackground: 'rgba(16, 185, 129, 0.2)',
    iconColor: '#10b981',
    title: 'Local Neural Models',
    description: 'Plug and play with Ollama, LM Studio, or the built-in rule engine for natural language home control.'
  },
  {
    icon: Wifi,
    iconBackground: 'rgba(59, 130, 246, 0.2)',
    iconColor: '#3b82f6',
    title: 'Matter 1.3 & Thread',
    description: 'Seamless cross-platform interoperability with Apple HomeKit, Google Home, and Home Assistant accessories.'
  },
  {
    icon: ShieldCheck,
    iconBackground: 'rgba(245, 158, 11, 0.2)',
    iconColor: '#f59e0b',
    title: 'Zero Cloud Outbound',
    description: 'Camera feeds are processed with local bounding box neural detection. No video leaves your local network.'
  }
];

export const DiscoverView = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="dashboard-title-row">
        <div>
          <h1 className="home-name-text">Discover Voxelle</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Next-generation privacy-first home automation architecture.
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(6, 182, 212, 0.18))',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: 28,
          backdropFilter: 'blur(30px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f59e0b', fontWeight: 700 }}>
          <Sparkles size={18} />
          <span>VOXELLE PRIVACY ARCHITECTURE</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginTop: 8, marginBottom: 12 }}>
          Your home data stays on your hardware. Forever.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, maxWidth: 650 }}>
          Unlike traditional smart homes that send camera feeds, voice recordings, and device usage
          to remote cloud servers, Voxelle Home runs completely offline. Vision analysis,
          natural language scene orchestration, and device state reasoning execute inside your browser
          and local Ollama/LM Studio instances.
        </p>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {FEATURE_CARDS.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              style={{
                background: 'rgba(30, 31, 40, 0.45)',
                border: '1px solid var(--glass-border)',
                borderRadius: 20,
                padding: 22,
                backdropFilter: 'blur(20px)'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: card.iconBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.iconColor, marginBottom: 14 }}>
                <Icon size={22} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                {card.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
