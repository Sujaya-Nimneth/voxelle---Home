import { memo } from 'react';
import { Item } from '@astryxdesign/core/Item';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Switch } from '@astryxdesign/core/Switch';
import {
  Lightbulb,
  Lock,
  Unlock,
  Fan,
  Thermometer,
  Tv,
  Music,
  Droplets,
  SlidersHorizontal
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import type { Device } from '../types';

const deviceIcon = (device: Device): LucideIcon => {
  switch (device.type) {
    case 'light':
      return Lightbulb;
    case 'lock':
      return device.isOn ? Lock : Unlock;
    case 'fan':
      return Fan;
    case 'thermostat':
      return Thermometer;
    case 'speaker':
      return device.name.includes('TV') ? Tv : Music;
    case 'water':
      return Droplets;
    default:
      return Lightbulb;
  }
};

/** Memoized: a device row re-renders only when its own device object changes. */
export const AccessoryTile = memo(function AccessoryTile({ device }: { device: Device }) {
  const { toggleDevice, setSelectedDevice } = useHome();
  const DeviceIcon = deviceIcon(device);
  const isThermostat = device.type === 'thermostat';

  return (
    <Item
      label={device.name}
      description={device.statusText}
      onClick={() => setSelectedDevice(device)}
      startContent={<Icon icon={DeviceIcon} size="sm" color={device.isOn ? 'accent' : 'secondary'} />}
      endContent={
        <>
          <Switch
            value={device.isOn}
            onChange={() => toggleDevice(device.id)}
            label={`${device.name} power`}
            isLabelHidden
            isDisabled={isThermostat}
          />
          <IconButton
            icon={<Icon icon={SlidersHorizontal} size="sm" />}
            label={`Open ${device.name} controls`}
            variant="ghost"
            size="sm"
            tooltip="Fine-grained controls"
            onClick={() => setSelectedDevice(device)}
          />
        </>
      }
    />
  );
});
