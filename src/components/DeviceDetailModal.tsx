import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Slider } from '@astryxdesign/core/Slider';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Switch } from '@astryxdesign/core/Switch';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { ToggleButton } from '@astryxdesign/core/ToggleButton';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Icon } from '@astryxdesign/core/Icon';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Lock, Unlock, Snowflake, Flame, Minus, Plus } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import type { ThermostatMode } from '../types';

/** Color temperature presets. Values are data, not CSS surface colors. */
const COLOR_SWATCHES = [
  { hex: '#fbbf24', name: 'Warm Amber 2700K' },
  { hex: '#f59e0b', name: 'Candlelight 2200K' },
  { hex: '#ffffff', name: 'Daylight 5000K' },
  { hex: '#a855f7', name: 'Sunset Purple' },
  { hex: '#3b82f6', name: 'Ocean Blue' },
  { hex: '#10b981', name: 'Emerald Relax' },
  { hex: '#f43f5e', name: 'Ruby Night' }
];

const THERMOSTAT_MODES: ThermostatMode[] = ['Cool', 'Heat', 'Auto', 'Eco'];
const FAN_SPEEDS = [0, 25, 50, 75, 100] as const;

export const DeviceDetailModal = () => {
  const { selectedDevice, setSelectedDevice, updateDevice, toggleDevice } = useHome();
  const device = selectedDevice;
  const close = () => setSelectedDevice(null);

  if (!device) return null;

  const isPowered = device.isOn;

  return (
    <Dialog isOpen onOpenChange={(open) => !open && close()} width={440}>
      <VStack gap={4}>
        <DialogHeader
          title={device.name}
          subtitle={`${device.room} · ${device.category}`}
          onOpenChange={close}
        />

        {device.type === 'thermostat' && (
          <VStack gap={3}>
            <HStack hAlign="center" gap={3}>
              <Heading level={2}>{device.targetTemp ?? device.value}°</Heading>
              <Text type="supporting">{device.mode ?? 'Cooling'}</Text>
            </HStack>
            <HStack hAlign="between" vAlign="center">
              <IconButton
                label="Lower target temperature"
                variant="secondary"
                icon={<Icon icon={Minus} size="sm" />}
                onClick={() =>
                  updateDevice(device.id, {
                    targetTemp: (device.targetTemp ?? device.value) - 1
                  })
                }
              />
              <Text type="supporting" hasTabularNumbers>
                Current {device.currentTemp ?? 69}°F
              </Text>
              <IconButton
                label="Raise target temperature"
                variant="secondary"
                icon={<Icon icon={Plus} size="sm" />}
                onClick={() =>
                  updateDevice(device.id, {
                    targetTemp: (device.targetTemp ?? device.value) + 1
                  })
                }
              />
            </HStack>
            <SegmentedControl
              label="Thermostat mode"
              value={device.mode ?? 'Cool'}
              onChange={(mode) => updateDevice(device.id, { mode: mode as ThermostatMode })}
              layout="fill"
            >
              {THERMOSTAT_MODES.map((mode) => (
                <SegmentedControlItem
                  key={mode}
                  value={mode}
                  label={mode}
                  icon={
                    mode === 'Cool' ? (
                      <Icon icon={Snowflake} size="sm" />
                    ) : mode === 'Heat' ? (
                      <Icon icon={Flame} size="sm" />
                    ) : undefined
                  }
                />
              ))}
            </SegmentedControl>
          </VStack>
        )}

        {device.type === 'light' && (
          <VStack gap={3}>
            <Slider
              label="Brightness"
              value={isPowered ? device.value : 0}
              onChange={(value: number) => updateDevice(device.id, { value })}
              min={0}
              max={100}
              step={1}
              valueDisplay="text"
              formatValue={(value) => (value === 0 ? 'Off' : `${value}%`)}
            />
            <VStack gap={1.5}>
              <Text type="label">Light atmosphere & spectrum</Text>
              <HStack gap={1} wrap="wrap">
                {COLOR_SWATCHES.map((swatch) => (
                  <ToggleButton
                    key={swatch.hex}
                    label={`Set light color to ${swatch.name}`}
                    isPressed={device.color === swatch.hex}
                    onPressedChange={() => updateDevice(device.id, { color: swatch.hex })}
                    size="sm"
                  >
                    {swatch.name.split(' ')[0]}
                  </ToggleButton>
                ))}
              </HStack>
            </VStack>
          </VStack>
        )}

        {device.type === 'fan' && (
          <VStack gap={2}>
            <Text type="label">Fan speed</Text>
            <SegmentedControl
              label="Fan speed"
              value={String(isPowered ? device.value : 0)}
              onChange={(speed) => {
                const value = Number(speed);
                updateDevice(device.id, {
                  isOn: value > 0,
                  value,
                  statusText: value > 0 ? `${value}%` : 'Off'
                });
              }}
              layout="fill"
            >
              {FAN_SPEEDS.map((speed) => (
                <SegmentedControlItem
                  key={speed}
                  value={String(speed)}
                  label={speed === 0 ? 'Off' : `${speed}%`}
                />
              ))}
            </SegmentedControl>
          </VStack>
        )}

        {device.type === 'lock' && (
          <VStack gap={3} hAlign="center">
            <StatusDot
              variant={isPowered ? 'success' : 'error'}
              label={isPowered ? 'Locked' : 'Unlocked'}
            />
            <Icon icon={isPowered ? Lock : Unlock} size="lg" />
            <Button
              label={isPowered ? 'Unlock door' : 'Lock door'}
              variant={isPowered ? 'destructive' : 'primary'}
              onClick={() => toggleDevice(device.id)}
            />
          </VStack>
        )}

        <HStack hAlign="between" vAlign="center">
          <Text type="label">Accessory power</Text>
          <Switch
            value={isPowered}
            onChange={() => toggleDevice(device.id)}
            label={`${device.name} power`}
            labelPosition="start"
          />
        </HStack>
      </VStack>
    </Dialog>
  );
};
