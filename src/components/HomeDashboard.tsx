import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Section } from '@astryxdesign/core/Section';
import { List } from '@astryxdesign/core/List';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { useHome } from '../context/HomeContext';
import { StatusPills } from './StatusPills';
import { CameraGrid } from './CameraGrid';
import { ScenesBar } from './ScenesBar';
import { AccessoryTile } from './AccessoryTile';
import { QuickActions } from './QuickActions';
import { PHYSICAL_ROOMS } from '../data/rooms';

/** Home view: one question (is the house as I expect?) answered first. */
export const HomeDashboard = () => {
  const { devices, activeCategory, activeRoom } = useHome();

  const filteredDevices = devices.filter((device) => {
    if (activeCategory && device.category !== activeCategory) return false;
    if (activeRoom !== 'All' && device.room !== activeRoom) return false;
    return true;
  });

  const roomsList = activeRoom !== 'All' ? [activeRoom] : PHYSICAL_ROOMS;
  const title = activeRoom !== 'All' ? activeRoom : 'My Home';

  return (
    <VStack gap={5} width="100%">
      <HStack hAlign="between" vAlign="center" wrap="wrap" gap={2}>
        <VStack gap={0.5}>
          <Heading level={1}>{title}</Heading>
          <Text type="supporting">
            {filteredDevices.filter((d) => d.isOn).length} of {filteredDevices.length} devices on
          </Text>
        </VStack>
        <QuickActions />
      </HStack>

      <Section variant="muted" padding={3}>
        <StatusPills />
      </Section>

      {(!activeCategory || activeCategory === 'security') && activeRoom === 'All' && (
        <Section variant="transparent" padding={0}>
          <CameraGrid />
        </Section>
      )}

      {!activeCategory && activeRoom === 'All' && <ScenesBar />}

      {roomsList.map((room) => {
        const roomDevices = filteredDevices.filter((d) => d.room === room);
        if (roomDevices.length === 0) return null;
        const thermostat = devices.find((d) => d.room === room && d.type === 'thermostat');

        return (
          <Section key={room} variant="transparent" padding={0}>
            <VStack gap={1.5}>
              <HStack hAlign="between" vAlign="center">
                <Heading level={2}>{room}</Heading>
                {thermostat && (
                  <Text type="supporting" hasTabularNumbers>
                    {thermostat.targetTemp ?? thermostat.value}°
                  </Text>
                )}
              </HStack>
              <List density="balanced" hasDividers header={<Text type="label">Devices</Text>}>
                {roomDevices.map((device) => (
                  <AccessoryTile key={device.id} device={device} />
                ))}
              </List>
            </VStack>
          </Section>
        );
      })}
    </VStack>
  );
};
