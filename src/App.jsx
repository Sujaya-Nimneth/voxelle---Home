import React from 'react';
import { HomeProvider, useHome } from './context/HomeContext';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { AutomationsView } from './components/AutomationsView';
import { DiscoverView } from './components/DiscoverView';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { CameraDetailModal } from './components/CameraDetailModal';
import { LocalAiModal } from './components/LocalAiModal';
import { Home, Clock, Compass, Sparkles } from 'lucide-react';

const AppContent = () => {
  const {
    deviceFrame,
    wallpaper,
    activeNav,
    setActiveNav,
    setIsAiModalOpen
  } = useHome();

  const renderActiveView = () => {
    switch (activeNav) {
      case 'automations':
        return <AutomationsView />;
      case 'discover':
        return <DiscoverView />;
      case 'home':
      default:
        return <HomeDashboard />;
    }
  };

  // 1. MAC DESKTOP MODE
  if (deviceFrame === 'mac') {
    return (
      <div className={`voxelle-app-viewport wallpaper-${wallpaper}`}>
        <div className="ambient-lighting-layer" />

        <div className="device-frame-mac">
          <TopHeader />
          <div className="voxelle-main-layout">
            <Sidebar />
            <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {renderActiveView()}
            </main>
          </div>
        </div>

        {/* Global Modals */}
        <DeviceDetailModal />
        <CameraDetailModal />
        <LocalAiModal />
      </div>
    );
  }

  // 2. IPAD PRO MODE
  if (deviceFrame === 'ipad') {
    return (
      <div className={`voxelle-app-viewport wallpaper-${wallpaper}`}>
        <div className="ambient-lighting-layer" />

        <div style={{ width: '100%', padding: '0 24px' }}>
          <TopHeader />
        </div>

        <div className="device-frame-ipad">
          <div className="voxelle-main-layout">
            <Sidebar />
            <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {renderActiveView()}
            </main>
          </div>
        </div>

        {/* Global Modals */}
        <DeviceDetailModal />
        <CameraDetailModal />
        <LocalAiModal />
      </div>
    );
  }

  // 3. IPHONE 16 PRO MODE
  return (
    <div className={`voxelle-app-viewport wallpaper-${wallpaper}`}>
      <div className="ambient-lighting-layer" />

      <div style={{ width: '100%', padding: '0 24px' }}>
        <TopHeader />
      </div>

      <div className="device-frame-iphone-wrapper">
        <div className="device-frame-iphone">
          {/* Dynamic Island */}
          <div className="dynamic-island">
            <div className="dynamic-island-sensor" />
            <div className="dynamic-island-camera" />
          </div>

          {/* iPhone Main Scrollable Content */}
          <div className="voxelle-main-layout">
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {renderActiveView()}
            </main>
          </div>

          {/* iPhone Bottom Tab Bar */}
          <nav
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 68,
              background: 'rgba(20, 21, 28, 0.75)',
              backdropFilter: 'blur(30px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingBottom: 16,
              zIndex: 80
            }}
          >
            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: activeNav === 'home' ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                fontSize: 10.5,
                fontWeight: 600
              }}
              onClick={() => setActiveNav('home')}
            >
              <Home size={19} />
              <span>Home</span>
            </button>

            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: activeNav === 'automations' ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                fontSize: 10.5,
                fontWeight: 600
              }}
              onClick={() => setActiveNav('automations')}
            >
              <Clock size={19} />
              <span>Automation</span>
            </button>

            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: activeNav === 'discover' ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                fontSize: 10.5,
                fontWeight: 600
              }}
              onClick={() => setActiveNav('discover')}
            >
              <Compass size={19} />
              <span>Discover</span>
            </button>

            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: '#fbbf24',
                fontSize: 10.5,
                fontWeight: 600
              }}
              onClick={() => setIsAiModalOpen(true)}
            >
              <Sparkles size={19} />
              <span>Voxelle AI</span>
            </button>
          </nav>

          {/* iPhone Home Indicator Swipe Bar */}
          <div className="iphone-home-bar" />
        </div>
      </div>

      {/* Global Modals */}
      <DeviceDetailModal />
      <CameraDetailModal />
      <LocalAiModal />
    </div>
  );
};

export default function App() {
  return (
    <HomeProvider>
      <AppContent />
    </HomeProvider>
  );
}
