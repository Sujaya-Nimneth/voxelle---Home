import { memo } from 'react';
import { useHome } from '../context/HomeContext';
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
import type { Device } from '../types';

/** Memoized: tiles only re-render when their own device object changes. */
export const AccessoryTile = memo(function AccessoryTile({ device }: { device: Device }) {
  const { toggleDevice, setSelectedDevice } = useHome();

  const getIcon = () => {
    switch (device.type) {
      case 'light':
        return <Lightbulb size={18} />;
      case 'lock':
        return device.isOn ? <Lock size={18} /> : <Unlock size={18} />;
      case 'fan':
        return (
          <Fan
            size={18}
            style={{
              animation: device.isOn ? 'spin 1.5s linear infinite' : 'none'
            }}
          />
        );
      case 'thermostat':
        return <Thermometer size={18} />;
      case 'speaker':
        return device.name.includes('TV') ? <Tv size={18} /> : <Music size={18} />;
      case 'water':
        return <Droplets size={18} />;
      default:
        return <Lightbulb size={18} />;
    }
  };

  const handleTileClick = () => {
    // If it's a thermostat, open detail modal directly on tap
    if (device.type === 'thermostat') {
      setSelectedDevice(device);
      return;
    }
    toggleDevice(device.id);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDevice(device);
  };

  const handleTileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTileClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${device.name}, ${device.room}: ${device.statusText}. Activate to toggle.`}
      className={`accessory-tile ${device.isOn ? `is-active theme-${device.theme}` : ''}`}
      onClick={handleTileClick}
      onKeyDown={handleTileKeyDown}
    >
      {/* Top row: Icon and Detail Trigger */}
      <div className="accessory-top-row">
        <div className="accessory-icon-circle">
          {getIcon()}
        </div>
        <button
          className="accessory-more-dots"
          onClick={handleDetailClick}
          title="Open fine-grained controls (dimmer, thermostat dial, color swatches)"
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {/* Bottom info */}
      <div className="accessory-info">
        <span className="accessory-name">{device.name}</span>
        <span className="accessory-state">{device.statusText}</span>
      </div>
    </div>
  );
});
