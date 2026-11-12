import { AppShell } from '@astryxdesign/core/AppShell';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { HomeProvider, useHome } from './context/HomeContext';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { AutomationsView } from './components/AutomationsView';
import { DiscoverView } from './components/DiscoverView';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { CameraDetailModal } from './components/CameraDetailModal';
import { LocalAiModal } from './components/LocalAiModal';
import type { ReactNode } from 'react';

/** All views share the same global modal stack. */
const GlobalModals = () => (
  <>
    <DeviceDetailModal />
    <CameraDetailModal />
    <LocalAiModal />
  </>
);

const VIEW_TITLES: Record<string, string> = {
  home: 'Home',
  automations: 'Automation',
  discover: 'Discover'
};

const AppContent = () => {
  const { activeNav } = useHome();

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

  return (
    <>
      <AppShell height="fill" variant="wash" contentPadding={4} topNav={<TopHeader />} sideNav={<Sidebar />}>
        <Layout height="fill">
          <LayoutContent label={VIEW_TITLES[activeNav]}>{renderActiveView()}</LayoutContent>
        </Layout>
      </AppShell>
      <GlobalModals />
    </>
  );
};

export default function App() {
  return (
    <HomeProvider>
      <AppContent />
    </HomeProvider>
  );
}
