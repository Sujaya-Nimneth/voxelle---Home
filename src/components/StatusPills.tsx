import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Icon } from '@astryxdesign/core/Icon';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Badge } from '@astryxdesign/core/Badge';
import { Heading } from '@astryxdesign/core/Heading';
import { Thermometer, Lightbulb, Shield, ShieldAlert, Volume2, Droplets, Cpu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import type { DeviceCategory } from '../types';

interface StatusRow {
  id: DeviceCategory | 'ai';
  label: string;
  detail: string;
  icon: LucideIcon;
  status: 'success' | 'warning' | 'error' | 'accent' | 'neutral';
}

/** House-state summary as dense rows, not card-wrapped pills (AGENTS.md). */
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

  const rows: StatusRow[] = [
    {
      id: 'climate',
      label: 'Climate',
      detail: climateSummary,
      icon: Thermometer,
      status: 'neutral'
    },
    {
      id: 'lights',
      label: 'Lights',
      detail: `${activeLightsCount} on`,
      icon: Lightbulb,
      status: activeLightsCount > 0 ? 'accent' : 'neutral'
    },
    {
      id: 'security',
      label: 'Security',
      detail: unlockedDoorsCount > 0 ? `${unlockedDoorsCount} unlocked` : 'Armed & locked',
      icon: unlockedDoorsCount > 0 ? ShieldAlert : Shield,
      status: unlockedDoorsCount > 0 ? 'error' : 'success'
    },
    {
      id: 'speakers',
      label: 'Speakers & TVs',
      detail: `${playingSpeakersCount} playing`,
      icon: Volume2,
      status: playingSpeakersCount > 0 ? 'accent' : 'neutral'
    },
    {
      id: 'water',
      label: 'Water',
      detail: waterStatus,
      icon: Droplets,
      status: waterStatus === 'Active' ? 'accent' : 'neutral'
    },
    {
      id: 'ai',
      label: 'Local AI',
      detail: '100% private · on-device',
      icon: Cpu,
      status: 'success'
    }
  ];

  return (
    <List
      density="compact"
      hasDividers
      header={<Heading level={2}>House status</Heading>}
    >
      {rows.map((row) => {
        const isCategory = row.id !== 'ai';
        const isSelected = isCategory && activeCategory === row.id;
        return (
          <Item
            key={row.id}
            label={row.label}
            description={row.detail}
            isSelected={isSelected}
            onClick={() =>
              isCategory
                ? setActiveCategory(isSelected ? null : (row.id as DeviceCategory))
                : setIsAiModalOpen(true)
            }
            startContent={<Icon icon={row.icon} size="sm" color="secondary" />}
            endContent={
              isCategory ? (
                <StatusDot variant={row.status} label={`${row.label}: ${row.detail}`} />
              ) : (
                <Badge label="On-device" variant="success" />
              )
            }
          />
        );
      })}
    </List>
  );
};
