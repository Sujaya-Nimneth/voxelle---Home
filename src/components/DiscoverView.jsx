import React from 'react';
import { ShieldCheck, Cpu, Wifi, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

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
        <div
          style={{
            background: 'rgba(30, 31, 40, 0.45)',
            border: '1px solid var(--glass-border)',
            borderRadius: 20,
            padding: 22,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 14 }}>
            <Cpu size={22} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Local Neural Models</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Plug and play with Ollama, LM Studio, or built-in fast WebGPU execution for natural language home control.
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 31, 40, 0.45)',
            border: '1px solid var(--glass-border)',
            borderRadius: 20,
            padding: 22,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: 14 }}>
            <Wifi size={22} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Matter 1.3 & Thread</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Seamless cross-platform interoperability with Apple HomeKit, Google Home, and Home Assistant accessories.
          </div>
        </div>

        <div
          style={{
            background: 'rgba(30, 31, 40, 0.45)',
            border: '1px solid var(--glass-border)',
            borderRadius: 20,
            padding: 22,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: 14 }}>
            <ShieldCheck size={22} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Zero Cloud Outbound</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Camera feeds are processed with local bounding box neural detection. No video leaves your local network.
          </div>
        </div>
      </div>
    </div>
  );
};
