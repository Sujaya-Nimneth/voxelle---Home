import React from 'react';
import { useHome } from '../context/HomeContext';
import {
  Home,
  Clock,
  Compass,
  Thermometer,
  Lightbulb,
  Shield,
  Volume2,
  Droplets,
  Sparkles,
  Layers,
  ArrowRight,
  Cpu
} from 'lucide-react';

const CATEGORIES = [
  { id: 'climate', name: 'Climate', icon: Thermometer, color: '#06b6d4' },
  { id: 'lights', name: 'Lights', icon: Lightbulb, color: '#f59e0b' },
  { id: 'security', name: 'Security', icon: Shield, color: '#10b981' },
  { id: 'speakers', name: 'Speakers & TVs', icon: Volume2, color: '#a855f7' },
  { id: 'water', name: 'Water', icon: Droplets, color: '#38bdf8' }
];

const ROOMS = [
  'All',
  'Entry',
  'Living Room',
  'Kitchen',
  'Bedroom',
  'Backyard'
];

export const Sidebar = () => {
  const {
    activeNav,
    setActiveNav,
    activeCategory,
    setActiveCategory,
    activeRoom,
    setActiveRoom,
    devices,
    setIsAiModalOpen
  } = useHome();

  const getCategoryCount = (catId) => {
    return devices.filter(d => d.category === catId).length;
  };

  const getRoomCount = (roomName) => {
    if (roomName === 'All') return devices.length;
    return devices.filter(d => d.room === roomName).length;
  };

  return (
    <aside className="voxelle-sidebar">
      {/* Brand */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Home size={18} color="#ffffff" />
          </div>
          <span className="brand-name">Voxelle</span>
        </div>
        <span className="brand-badge">Neural</span>
      </div>

      {/* Primary Navigation */}
      <div className="sidebar-section">
        <div
          className={`sidebar-nav-item ${activeNav === 'home' && !activeCategory ? 'active' : ''}`}
          onClick={() => {
            setActiveNav('home');
            setActiveCategory(null);
          }}
        >
          <div className="sidebar-nav-item-left">
            <Home size={17} />
            <span>Home</span>
          </div>
        </div>

        <div
          className={`sidebar-nav-item ${activeNav === 'automations' ? 'active' : ''}`}
          onClick={() => setActiveNav('automations')}
        >
          <div className="sidebar-nav-item-left">
            <Clock size={17} />
            <span>Automation</span>
          </div>
          <span className="sidebar-count-badge">4</span>
        </div>

        <div
          className={`sidebar-nav-item ${activeNav === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveNav('discover')}
        >
          <div className="sidebar-nav-item-left">
            <Compass size={17} />
            <span>Discover</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Categories</div>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isCatActive = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              className={`sidebar-nav-item ${isCatActive ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('home');
                setActiveCategory(isCatActive ? null : cat.id);
              }}
            >
              <div className="sidebar-nav-item-left">
                <Icon size={17} style={{ color: cat.color }} />
                <span>{cat.name}</span>
              </div>
              <span className="sidebar-count-badge">{getCategoryCount(cat.id)}</span>
            </div>
          );
        })}
      </div>

      {/* Rooms */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Rooms</div>
        {ROOMS.map(room => {
          const isRoomActive = activeRoom === room && !activeCategory;
          return (
            <div
              key={room}
              className={`sidebar-nav-item ${isRoomActive ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('home');
                setActiveCategory(null);
                setActiveRoom(room);
              }}
            >
              <div className="sidebar-nav-item-left">
                <Layers size={17} />
                <span>{room}</span>
              </div>
              <span className="sidebar-count-badge">{getRoomCount(room)}</span>
            </div>
          );
        })}
      </div>

      {/* Local AI Intelligence Card */}
      <div className="sidebar-ai-card">
        <div className="ai-card-glow" />
        <div className="ai-card-header">
          <div className="ai-card-status">
            <span className="status-pulse-dot" />
            <span>100% On-Device</span>
          </div>
          <Cpu size={14} color="#fbbf24" />
        </div>
        <div className="ai-card-title">Voxelle Neural Model</div>
        <div className="ai-card-desc">
          Zero data leaves your local network. Offline semantic home automation active.
        </div>
        <button
          className="ai-card-button"
          onClick={() => setIsAiModalOpen(true)}
        >
          <Sparkles size={13} color="#f59e0b" />
          <span>Launch AI Assistant</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </aside>
  );
};
