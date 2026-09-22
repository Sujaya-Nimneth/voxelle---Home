import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { X, Power, Minus, Plus, Lock, Unlock, SunMedium, Fan, Flame, Snowflake } from 'lucide-react';

const COLOR_SWATCHES = [
  '#fbbf24', // Warm Amber 2700K
  '#f59e0b', // Candlelight 2200K
  '#ffffff', // Daylight 5000K
  '#a855f7', // Sunset Purple
  '#3b82f6', // Ocean Blue
  '#10b981', // Emerald Relax
  '#f43f5e'  // Ruby Night
];

export const DeviceDetailModal = () => {
  const { selectedDevice, setSelectedDevice, updateDevice, toggleDevice } = useHome();

  if (!selectedDevice) return null;

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    updateDevice(selectedDevice.id, { value: val });
  };

  const handleTempAdjust = (delta) => {
    const newTemp = (selectedDevice.targetTemp || selectedDevice.value) + delta;
    updateDevice(selectedDevice.id, { targetTemp: newTemp });
  };

  const handleColorChange = (hex) => {
    updateDevice(selectedDevice.id, { color: hex });
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedDevice(null)}>
      <div
        className="detail-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="detail-modal-header">
          <div>
            <div className="detail-modal-title">{selectedDevice.name}</div>
            <div className="detail-modal-subtitle">
              {selectedDevice.room} • {selectedDevice.category.toUpperCase()}
            </div>
          </div>
          <button className="ai-modal-close-btn" onClick={() => setSelectedDevice(null)}>
            <X size={18} />
          </button>
        </div>

        {/* 1. THERMOSTAT CONTROLS */}
        {selectedDevice.type === 'thermostat' && (
          <div className="thermostat-dial-wrapper">
            <div className="thermostat-dial-circle">
              <span className="dial-temp-text">{selectedDevice.targetTemp || selectedDevice.value}°</span>
              <span className="dial-mode-text">{selectedDevice.mode || 'Cooling'}</span>
            </div>

            <div className="thermostat-controls-row">
              <button className="temp-adjust-btn" onClick={() => handleTempAdjust(-1)}>
                <Minus size={18} />
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Current Temp</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedDevice.currentTemp || 69}°F</div>
              </div>
              <button className="temp-adjust-btn" onClick={() => handleTempAdjust(1)}>
                <Plus size={18} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="viewport-switchers" style={{ marginTop: 8 }}>
              {['Cool', 'Heat', 'Auto', 'Eco'].map(mode => (
                <button
                  key={mode}
                  className={`viewport-btn ${selectedDevice.mode === mode ? 'active' : ''}`}
                  onClick={() => updateDevice(selectedDevice.id, { mode })}
                >
                  {mode === 'Cool' && <Snowflake size={12} />}
                  {mode === 'Heat' && <Flame size={12} />}
                  <span>{mode}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. LIGHT CONTROLS (Vertical Apple-style Dimmer Slider & Color Swatches) */}
        {selectedDevice.type === 'light' && (
          <div className="apple-slider-container">
            <div className="apple-slider-value-badge">
              {selectedDevice.isOn ? `${selectedDevice.value}%` : 'Off'}
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedDevice.isOn ? selectedDevice.value : 0}
                onChange={handleSliderChange}
                style={{
                  width: '100%',
                  accentColor: selectedDevice.color || '#f59e0b',
                  height: 12,
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Color swatches */}
            <div style={{ marginTop: 8, width: '100%' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center' }}>
                Light Atmosphere & Spectrum
              </div>
              <div className="color-swatches-row">
                {COLOR_SWATCHES.map(color => (
                  <button
                    key={color}
                    className={`color-swatch-dot ${selectedDevice.color === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. FAN SPEED CONTROLS */}
        {selectedDevice.type === 'fan' && (
          <div className="apple-slider-container">
            <div className="apple-slider-value-badge">
              {selectedDevice.isOn ? `${selectedDevice.value}% Speed` : 'Off'}
            </div>

            <div className="viewport-switchers" style={{ width: '100%', justifyContent: 'space-around', padding: '6px' }}>
              {[0, 25, 50, 75, 100].map(speed => (
                <button
                  key={speed}
                  className={`viewport-btn ${selectedDevice.isOn && selectedDevice.value === speed ? 'active' : ''}`}
                  onClick={() => updateDevice(selectedDevice.id, { isOn: speed > 0, value: speed, statusText: speed > 0 ? `${speed}%` : 'Off' })}
                >
                  <span>{speed === 0 ? 'Off' : `${speed}%`}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. DOOR LOCK CONTROLS */}
        {selectedDevice.type === 'lock' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: selectedDevice.isOn ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                border: `2px solid ${selectedDevice.isOn ? '#10b981' : '#ef4444'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectedDevice.isOn ? '#10b981' : '#ef4444',
                boxShadow: `0 0 24px ${selectedDevice.isOn ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
              }}
            >
              {selectedDevice.isOn ? <Lock size={36} /> : <Unlock size={36} />}
            </div>

            <button
              className="viewport-btn active"
              style={{
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 700,
                background: selectedDevice.isOn ? '#ef4444' : '#10b981'
              }}
              onClick={() => toggleDevice(selectedDevice.id)}
            >
              {selectedDevice.isOn ? 'Tap to Unlock' : 'Tap to Lock'}
            </button>
          </div>
        )}

        {/* Power Toggle Button at footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Accessory Power</span>
          <button
            className={`action-circle-btn ${selectedDevice.isOn ? 'active' : ''}`}
            style={{
              background: selectedDevice.isOn ? '#f59e0b' : 'rgba(255,255,255,0.1)',
              color: selectedDevice.isOn ? '#111' : '#fff'
            }}
            onClick={() => toggleDevice(selectedDevice.id)}
          >
            <Power size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
