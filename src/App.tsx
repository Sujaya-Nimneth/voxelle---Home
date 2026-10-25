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
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { ViewId } from './types';

/** All three chassis mount the same global modal stack. */
const GlobalModals = () => (
  <>
    <DeviceDetailModal />
    <CameraDetailModal />
    <LocalAiModal />
  </>
);

const IPHONE_TABS: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'automations', label: 'Automation', icon: Clock },
  { id: 'discover', label: 'Discover', icon: Compass }
];

const TAB_BAR_STYLE: CSSProperties = {
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
};

const TAB_BUTTON_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  fontSize: 10.5,
  fontWeight: 600
};

const IPhoneTabBar = () => {
  const { activeNav, setActiveNav, setIsAiModalOpen } = useHome();

  return (
    <nav style={TAB_BAR_STYLE} aria-label="Primary">
      {IPHONE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeNav === tab.id;
        return (
          <button
            key={tab.id}
            style={{ ...TAB_BUTTON_STYLE, color: isActive ? '#f59e0b' : 'rgba(255,255,255,0.6)' }}
            onClick={() => setActiveNav(tab.id)}
          >
            <Icon size={19} />
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button style={{ ...TAB_BUTTON_STYLE, color: '#fbbf24' }} onClick={() => setIsAiModalOpen(true)}>
        <Sparkles size={19} />
        <span>Voxelle AI</span>
      </button>
    </nav>
  );
};

const MAIN_STYLE: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column' };

const AppContent = () => {
  const { deviceFrame, wallpaper, activeNav } = useHome();

  const renderActiveView = (): ReactNode => {
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

  const viewportRoot = `voxelle-app-viewport wallpaper-${wallpaper}`;

  // 1. MAC DESKTOP MODE
  if (deviceFrame === 'mac') {
    return (
      <div className={viewportRoot}>
        <div className="ambient-lighting-layer" />

        <div className="device-frame-mac">
          <TopHeader />
          <div className="voxelle-main-layout">
            <Sidebar />
            <main style={{ ...MAIN_STYLE, overflow: 'hidden' }}>{renderActiveView()}</main>
          </div>
        </div>

        <GlobalModals />
      </div>
    );
  }

  // 2. IPAD PRO MODE
  if (deviceFrame === 'ipad') {
    return (
      <div className={viewportRoot}>
        <div className="ambient-lighting-layer" />

        <div style={{ width: '100%', padding: '0 24px' }}>
          <TopHeader />
        </div>

        <div className="device-frame-ipad">
          <div className="voxelle-main-layout">
            <Sidebar />
            <main style={{ ...MAIN_STYLE, overflow: 'hidden' }}>{renderActiveView()}</main>
          </div>
        </div>

        <GlobalModals />
      </div>
    );
  }

  // 3. IPHONE 16 PRO MODE
  return (
    <div className={viewportRoot}>
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
            <main style={{ ...MAIN_STYLE, overflowY: 'auto' }}>{renderActiveView()}</main>
          </div>

          <IPhoneTabBar />

          {/* iPhone Home Indicator Swipe Bar */}
          <div className="iphone-home-bar" />
        </div>
      </div>

      <GlobalModals />
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
