import React from 'react';
import { useHome } from '../context/HomeContext';
import { Plus, ChevronDown, Monitor, Tablet, Smartphone, Sparkles, SlidersHorizontal, Image } from 'lucide-react';

export const TopHeader = () => {
  const {
    deviceFrame,
    setDeviceFrame,
    wallpaper,
    setWallpaper,
    setIsAiModalOpen
  } = useHome();

  return (
    <header className="macos-window-header">
      {/* Left: macOS traffic lights */}
      <div className="macos-traffic-lights">
        <span className="traffic-light traffic-close" title="Close"></span>
        <span className="traffic-light traffic-min" title="Minimize"></span>
        <span className="traffic-light traffic-max" title="Full Screen"></span>
      </div>

      {/* Center: Window Title & Mode Switchers */}
      <div className="macos-app-title">
        <span className="macos-title-pill">
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>Voxelle</span> Home
        </span>

        {/* Device Switcher (Desktop Mac / iPad / iPhone) */}
        <div className="viewport-switchers" title="Switch device view layout">
          <button
            className={`viewport-btn ${deviceFrame === 'mac' ? 'active' : ''}`}
            onClick={() => setDeviceFrame('mac')}
            title="Mac Studio / Desktop View"
          >
            <Monitor size={12} />
            <span>Mac</span>
          </button>
          <button
            className={`viewport-btn ${deviceFrame === 'ipad' ? 'active' : ''}`}
            onClick={() => setDeviceFrame('ipad')}
            title="iPad Pro View"
          >
            <Tablet size={12} />
            <span>iPad</span>
          </button>
          <button
            className={`viewport-btn ${deviceFrame === 'iphone' ? 'active' : ''}`}
            onClick={() => setDeviceFrame('iphone')}
            title="iPhone 16 Pro View"
          >
            <Smartphone size={12} />
            <span>iPhone</span>
          </button>
        </div>

        {/* Ambient Wallpaper Theme Switcher */}
        <div className="viewport-switchers" title="Switch ambient backdrop theme">
          <button
            className={`viewport-btn ${wallpaper === 'amber' ? 'active' : ''}`}
            onClick={() => setWallpaper('amber')}
            title="Amber Sunset Wallpaper"
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span>Amber</span>
          </button>
          <button
            className={`viewport-btn ${wallpaper === 'aurora' ? 'active' : ''}`}
            onClick={() => setWallpaper('aurora')}
            title="Sonoma Aurora Wallpaper"
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>Aurora</span>
          </button>
          <button
            className={`viewport-btn ${wallpaper === 'midnight' ? 'active' : ''}`}
            onClick={() => setWallpaper('midnight')}
            title="Midnight Dark Wallpaper"
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span>Midnight</span>
          </button>
        </div>
      </div>

      {/* Right: Quick AI Orb and Actions */}
      <div className="home-actions-group">
        <button
          className="ai-trigger-orb-btn"
          onClick={() => setIsAiModalOpen(true)}
          title="Open Voxelle Local AI Neural Assistant"
        >
          <div className="glowing-orb">
            <Sparkles size={12} color="#ffffff" />
          </div>
          <span className="ai-trigger-text">Voxelle AI</span>
        </button>

        <button
          className="action-circle-btn"
          title="Add Accessory / Scene"
          onClick={() => alert("Add Accessory: Matter, Thread, and HomeKit auto-discovery scanning locally...")}
        >
          <Plus size={16} />
        </button>
      </div>
    </header>
  );
};
