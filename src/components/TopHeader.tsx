import { TopNav } from '@astryxdesign/core/TopNav';
import { Text } from '@astryxdesign/core/Text';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { HStack } from '@astryxdesign/core/Stack';
import { useHome } from '../context/HomeContext';
import { QuickActions } from './QuickActions';

/** Astryx-native product-level navigation. Replaces the macOS window chrome. */
export const TopHeader = () => {
  const { unlockedDoorsCount, activeLightsCount, waterStatus } = useHome();

  const finding =
    unlockedDoorsCount > 0
      ? `${unlockedDoorsCount} ${unlockedDoorsCount === 1 ? 'door' : 'doors'} unlocked`
      : `${activeLightsCount} lights on · Water ${waterStatus.toLowerCase()}`;

  return (
    <TopNav
      label="Voxelle Home"
      heading={<Text type="label" weight="bold">Voxelle Home</Text>}
      startContent={
        <HStack gap={1.5} vAlign="center" aria-live="polite" aria-atomic="true">
          <StatusDot
            variant={unlockedDoorsCount > 0 ? 'warning' : 'success'}
            label={unlockedDoorsCount > 0 ? 'Attention needed' : 'House is as expected'}
          />
          <Text type="supporting">{finding}</Text>
        </HStack>
      }
      endContent={<QuickActions showReset />}
    />
  );
};
