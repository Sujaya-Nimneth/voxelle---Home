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
import type { DeviceCategory } from '../types';
import type { LucideIcon } from 'lucide-react';
import { ROOMS } from '../data/rooms';

interface CategoryDef {
  id: DeviceCategory;
  name: string;
  icon: LucideIcon;
  color: string;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'climate', name: 'Climate', icon: Thermometer, color: '#06b6d4' },
  { id: 'lights', name: 'Lights', icon: Lightbulb, color: '#f59e0b' },
  { id: 'security', name: 'Security', icon: Shield, color: '#10b981' },
  { id: 'speakers', name: 'Speakers & TVs', icon: Volume2, color: '#a855f7' },
  { id: 'water', name: 'Water', icon: Droplets, color: '#38bdf8' }
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
    automationCount,
    setIsAiModalOpen
  } = useHome();

  const getCategoryCount = (catId: DeviceCategory) => {
    return devices.filter((d) => d.category === catId).length;
  };

  const getRoomCount = (roomName: string) => {
    if (roomName === 'All') return devices.length;
    return devices.filter((d) => d.room === roomName).length;
  };

  return (
    <aside className="voxelle-sidebar" aria-label="Home navigation">
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
        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'home' && !activeCategory ? 'active' : ''}`}
          onClick={() => {
            setActiveNav('home');
            setActiveCategory(null);
          }}
        >
          <span className="sidebar-nav-item-left">
            <Home size={17} />
            <span>Home</span>
          </span>
        </button>

        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'automations' ? 'active' : ''}`}
          onClick={() => setActiveNav('automations')}
        >
          <span className="sidebar-nav-item-left">
            <Clock size={17} />
            <span>Automation</span>
          </span>
          <span className="sidebar-count-badge">{automationCount}</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveNav('discover')}
        >
          <span className="sidebar-nav-item-left">
            <Compass size={17} />
            <span>Discover</span>
          </span>
        </button>
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Categories</div>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isCatActive = activeCategory === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              className={`sidebar-nav-item ${isCatActive ? 'active' : ''}`}
              aria-pressed={isCatActive}
              onClick={() => {
                setActiveNav('home');
                setActiveCategory(isCatActive ? null : cat.id);
              }}
            >
              <span className="sidebar-nav-item-left">
                <Icon size={17} style={{ color: cat.color }} />
                <span>{cat.name}</span>
              </span>
              <span className="sidebar-count-badge">{getCategoryCount(cat.id)}</span>
            </button>
          );
        })}
      </div>

      {/* Rooms */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Rooms</div>
        {ROOMS.map((room) => {
          const isRoomActive = activeRoom === room && !activeCategory;
          return (
            <button
              type="button"
              key={room}
              className={`sidebar-nav-item ${isRoomActive ? 'active' : ''}`}
              aria-pressed={isRoomActive}
              onClick={() => {
                setActiveNav('home');
                setActiveCategory(null);
                setActiveRoom(room);
              }}
            >
              <span className="sidebar-nav-item-left">
                <Layers size={17} />
                <span>{room}</span>
              </span>
              <span className="sidebar-count-badge">{getRoomCount(room)}</span>
            </button>
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
        <button className="ai-card-button" onClick={() => setIsAiModalOpen(true)}>
          <Sparkles size={13} color="#f59e0b" />
          <span>Launch AI Assistant</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </aside>
  );
};
