import React from 'react';
import { useHome } from '../context/HomeContext';
import { StatusPills } from './StatusPills';
import { CameraGrid } from './CameraGrid';
import { ScenesBar } from './ScenesBar';
import { AccessoryTile } from './AccessoryTile';
import { ChevronDown, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';

export const HomeDashboard = () => {
  const {
    devices,
    activeCategory,
    activeRoom,
    setActiveRoom,
    setIsAiModalOpen
  } = useHome();

  // Filter devices by category and room
  const filteredDevices = devices.filter(dev => {
    if (activeCategory && dev.category !== activeCategory) return false;
    if (activeRoom !== 'All' && dev.room !== activeRoom) return false;
    return true;
  });

  // Group filtered devices by room
  const roomsList = activeRoom !== 'All' 
    ? [activeRoom] 
    : ['Entry', 'Living Room', 'Kitchen', 'Bedroom', 'Backyard'];

  return (
    <div className="voxelle-content-area">
      {/* Top Header Row with Home Name & Quick Actions */}
      <div className="dashboard-top-bar">
        <div className="dashboard-title-row">
          <div className="home-name-dropdown">
            <span className="home-name-text">
              {activeRoom !== 'All' ? activeRoom : 'My Home'}
            </span>
            <ChevronDown size={22} color="rgba(255,255,255,0.7)" />
          </div>

          <div className="home-actions-group">
            <button
              className="ai-trigger-orb-btn"
              onClick={() => setIsAiModalOpen(true)}
              title="Open Voxelle Local AI Neural Assistant"
            >
              <div className="glowing-orb">
                <Sparkles size={12} color="#ffffff" />
              </div>
              <span className="ai-trigger-text">Voxelle AI</span>
            </button>

            <button
              className="action-circle-btn"
              title="Add Accessory"
              onClick={() => alert("Scanning local network for Matter, HomeKit, and Thread accessories...")}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Top Status Chips */}
        <StatusPills />
      </div>

      {/* Camera Grid (Only show when not filtered to specific narrow category, or when category is security) */}
      {(!activeCategory || activeCategory === 'security') && activeRoom === 'All' && (
        <CameraGrid />
      )}

      {/* Scenes Row */}
      {!activeCategory && activeRoom === 'All' && (
        <ScenesBar />
      )}

      {/* Room Device Grids */}
      {roomsList.map(room => {
        const roomDevices = filteredDevices.filter(d => d.room === room);
        if (roomDevices.length === 0) return null;

        // Find room climate if any
        const roomThermostat = devices.find(d => d.room === room && d.type === 'thermostat');

        return (
          <section key={room} className="room-section">
            <div className="room-header">
              <h2 className="room-title">{room}</h2>
              {roomThermostat && (
                <span className="room-temp-pill">
                  {roomThermostat.targetTemp || roomThermostat.value}°
                </span>
              )}
            </div>

            <div className="accessory-grid">
              {roomDevices.map(device => (
                <AccessoryTile key={device.id} device={device} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
