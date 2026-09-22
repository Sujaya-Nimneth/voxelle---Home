import React from 'react';
import { useHome } from '../context/HomeContext';
import { Thermometer, Lightbulb, Shield, ShieldAlert, Volume2, Droplets, Cpu } from 'lucide-react';

export const StatusPills = () => {
  const {
    activeCategory,
    setActiveCategory,
    activeLightsCount,
    unlockedDoorsCount,
    playingSpeakersCount,
    waterStatus,
    climateSummary,
    setIsAiModalOpen
  } = useHome();

  const handlePillClick = (cat) => {
    setActiveCategory(prev => prev === cat ? null : cat);
  };

  return (
    <div className="status-pills-row">
      {/* Climate Pill */}
      <button
        className={`status-pill ${activeCategory === 'climate' ? 'active' : ''}`}
        onClick={() => handlePillClick('climate')}
      >
        <span className="status-pill-icon" style={{ color: '#06b6d4' }}>
          <Thermometer size={15} />
        </span>
        <span className="status-pill-title">Climate</span>
        <span className="status-pill-sub">{climateSummary}</span>
      </button>

      {/* Lights Pill */}
      <button
        className={`status-pill ${activeCategory === 'lights' ? 'active' : ''}`}
        onClick={() => handlePillClick('lights')}
      >
        <span className="status-pill-icon" style={{ color: '#f59e0b' }}>
          <Lightbulb size={15} />
        </span>
        <span className="status-pill-title">Lights</span>
        <span className="status-pill-sub">{activeLightsCount} On</span>
      </button>

      {/* Security Pill */}
      <button
        className={`status-pill ${activeCategory === 'security' ? 'active' : ''}`}
        onClick={() => handlePillClick('security')}
      >
        <span className="status-pill-icon" style={{ color: unlockedDoorsCount > 0 ? '#ef4444' : '#10b981' }}>
          {unlockedDoorsCount > 0 ? <ShieldAlert size={15} /> : <Shield size={15} />}
        </span>
        <span className="status-pill-title">Security</span>
        <span className="status-pill-sub">
          {unlockedDoorsCount > 0 ? `${unlockedDoorsCount} Unlocked` : 'Armed & Locked'}
        </span>
      </button>

      {/* Speakers & TVs Pill */}
      <button
        className={`status-pill ${activeCategory === 'speakers' ? 'active' : ''}`}
        onClick={() => handlePillClick('speakers')}
      >
        <span className="status-pill-icon" style={{ color: '#a855f7' }}>
          <Volume2 size={15} />
        </span>
        <span className="status-pill-title">Speakers & TVs</span>
        <span className="status-pill-sub">{playingSpeakersCount} Playing</span>
      </button>

      {/* Water Pill */}
      <button
        className={`status-pill ${activeCategory === 'water' ? 'active' : ''}`}
        onClick={() => handlePillClick('water')}
      >
        <span className="status-pill-icon" style={{ color: '#38bdf8' }}>
          <Droplets size={15} />
        </span>
        <span className="status-pill-title">Water</span>
        <span className="status-pill-sub">{waterStatus}</span>
      </button>

      {/* Local AI Offline Neural Indicator Pill */}
      <button
        className="status-pill"
        onClick={() => setIsAiModalOpen(true)}
        style={{ borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.12)' }}
        title="100% Local Inference • Zero Cloud Telemetry"
      >
        <span className="status-pulse-dot" style={{ background: '#34d399' }} />
        <span className="status-pill-icon" style={{ color: '#fbbf24' }}>
          <Cpu size={15} />
        </span>
        <span className="status-pill-title">Local AI</span>
        <span className="status-pill-sub" style={{ color: '#34d399', fontWeight: 600 }}>100% Private</span>
      </button>
    </div>
  );
};
