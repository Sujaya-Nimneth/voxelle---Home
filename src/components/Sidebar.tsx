import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection
} from '@astryxdesign/core/SideNav';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { NavIcon } from '@astryxdesign/core/NavIcon';
import { Icon } from '@astryxdesign/core/Icon';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/Stack';
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
  Cpu
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import type { DeviceCategory, ViewId } from '../types';
import { ROOMS } from '../data/rooms';

interface CategoryDef {
  id: DeviceCategory;
  name: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'climate', name: 'Climate', icon: Thermometer },
  { id: 'lights', name: 'Lights', icon: Lightbulb },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'speakers', name: 'Speakers & TVs', icon: Volume2 },
  { id: 'water', name: 'Water', icon: Droplets }
];

const VIEWS: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'automations', label: 'Automation', icon: Clock },
  { id: 'discover', label: 'Discover', icon: Compass }
];

/** Astryx-native application side navigation. Replaces the glass sidebar. */
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

  const categoryCount = (id: DeviceCategory) => devices.filter((d) => d.category === id).length;
  const roomCount = (room: string) =>
    room === 'All' ? devices.length : devices.filter((d) => d.room === room).length;

  return (
    <SideNav
      collapsible
      resizable={{ defaultWidth: 230, minWidth: 210, maxWidth: 292 }}
      header={
        <SideNavHeading
          heading="Voxelle"
          superheading="Smart Home"
          icon={<NavIcon icon={<Icon icon={Home} size="sm" />} />}
        />
      }
      footer={
        <SideNavSection title="Assistant" isHeaderHidden>
          <VStack gap={2} padding={2}>
            <Text type="label" weight="semibold">
              On-device AI
            </Text>
            <Text type="supporting">
              Zero data leaves your local network. Offline semantic home automation is active.
            </Text>
            <Button
              label="Ask Voxelle AI"
              variant="primary"
              size="sm"
              icon={<Icon icon={Sparkles} size="sm" />}
              onClick={() => setIsAiModalOpen(true)}
            />
          </VStack>
        </SideNavSection>
      }
    >
      <SideNavSection title="Views" isHeaderHidden>
        {VIEWS.map((view) => (
          <SideNavItem
            key={view.id}
            label={view.label}
            icon={view.icon}
            isSelected={activeNav === view.id && !activeCategory}
            onClick={() => {
              setActiveNav(view.id);
              setActiveCategory(null);
            }}
            endContent={
              view.id === 'automations' ? (
                <Badge label={automationCount} variant="neutral" />
              ) : undefined
            }
          />
        ))}
      </SideNavSection>

      <Divider />

      <SideNavSection title="Categories">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <SideNavItem
              key={category.id}
              label={category.name}
              icon={category.icon}
              isSelected={isActive}
              onClick={() => {
                setActiveNav('home');
                setActiveCategory(isActive ? null : category.id);
              }}
              endContent={
                <Badge label={categoryCount(category.id)} variant={isActive ? 'info' : 'neutral'} />
              }
            />
          );
        })}
      </SideNavSection>

      <Divider />

      <SideNavSection title="Rooms">
        {ROOMS.map((room) => {
          const isActive = activeRoom === room && !activeCategory;
          return (
            <SideNavItem
              key={room}
              label={room}
              icon={Layers}
              isSelected={isActive}
              onClick={() => {
                setActiveNav('home');
                setActiveCategory(null);
                setActiveRoom(room);
              }}
              endContent={<Badge label={roomCount(room)} variant={isActive ? 'info' : 'neutral'} />}
            />
          );
        })}
      </SideNavSection>

      <Divider />

      <SideNavSection title="Local AI status" isHeaderHidden>
        <SideNavItem
          label="Neural model ready"
          icon={Cpu}
          isDisabled
          endContent={<StatusDot variant="success" label="On-device engine ready" />}
        />
      </SideNavSection>
    </SideNav>
  );
};
