import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const HomeContext = createContext(null);

const INITIAL_DEVICES = [
  // Entry
  {
    id: 'entry-sconces',
    name: 'Sconces',
    room: 'Entry',
    category: 'lights',
    isOn: true,
    value: 80,
    unit: '%',
    color: '#fbbf24',
    theme: 'amber',
    statusText: '80%',
    type: 'light'
  },
  {
    id: 'entry-door',
    name: 'Front Door',
    room: 'Entry',
    category: 'security',
    isOn: true,
    value: 1, // 1 = locked, 0 = unlocked
    unit: '',
    color: '#10b981',
    theme: 'emerald',
    statusText: 'Locked',
    type: 'lock'
  },
  {
    id: 'entry-overhead',
    name: 'Overhead',
    room: 'Entry',
    category: 'lights',
    isOn: false,
    value: 0,
    unit: '%',
    color: '#f59e0b',
    theme: 'amber',
    statusText: 'Off',
    type: 'light'
  },
  {
    id: 'entry-fan',
    name: 'Ceiling Fan',
    room: 'Entry',
    category: 'fans',
    isOn: true,
    value: 100,
    unit: '%',
    color: '#06b6d4',
    theme: 'cyan',
    statusText: '100%',
    type: 'fan'
  },
  {
    id: 'entry-pendant',
    name: 'Pendant',
    room: 'Entry',
    category: 'lights',
    isOn: true,
    value: 25,
    unit: '%',
    color: '#f59e0b',
    theme: 'amber',
    statusText: '25%',
    type: 'light'
  },
  {
    id: 'entry-shades',
    name: 'Shades',
    room: 'Entry',
    category: 'shades',
    isOn: false,
    value: 0, // closed
    unit: '%',
    color: '#94a3b8',
    theme: 'cyan',
    statusText: 'Closed',
    type: 'shade'
  },
  {
    id: 'entry-homepod',
    name: 'HomePod mini',
    room: 'Entry',
    category: 'speakers',
    isOn: false,
    value: 45,
    unit: '%',
    color: '#a855f7',
    theme: 'purple',
    statusText: 'Not Playing',
    type: 'speaker'
  },

  // Living Room
  {
    id: 'lr-thermostat',
    name: 'Thermostat',
    room: 'Living Room',
    category: 'climate',
    isOn: true,
    value: 68,
    targetTemp: 68,
    currentTemp: 69,
    mode: 'Cool',
    unit: '°',
    color: '#f59e0b',
    theme: 'amber',
    statusText: '68° • Cooling',
    type: 'thermostat'
  },
  {
    id: 'lr-ceiling-lights',
    name: 'Ceiling Lights',
    room: 'Living Room',
    category: 'lights',
    isOn: true,
    value: 85,
    unit: '%',
    color: '#fbbf24',
    theme: 'amber',
    statusText: '85%',
    type: 'light'
  },
  {
    id: 'lr-smart-fan',
    name: 'Smart Fan',
    room: 'Living Room',
    category: 'fans',
    isOn: false,
    value: 50,
    unit: '%',
    color: '#06b6d4',
    theme: 'cyan',
    statusText: 'Off',
    type: 'fan'
  },
  {
    id: 'lr-accent-lights',
    name: 'Accent Lights',
    room: 'Living Room',
    category: 'lights',
    isOn: true,
    value: 60,
    unit: '%',
    color: '#c084fc',
    theme: 'purple',
    statusText: '60% • Purple',
    type: 'light'
  },
  {
    id: 'lr-tv',
    name: 'Living Room TV',
    room: 'Living Room',
    category: 'speakers',
    isOn: true,
    value: 40,
    unit: '%',
    color: '#3b82f6',
    theme: 'purple',
    statusText: 'Playing • Apple TV 4K',
    type: 'speaker'
  },

  // Kitchen
  {
    id: 'kitchen-island',
    name: 'Island Lights',
    room: 'Kitchen',
    category: 'lights',
    isOn: true,
    value: 90,
    unit: '%',
    color: '#fbbf24',
    theme: 'amber',
    statusText: '90%',
    type: 'light'
  },
  {
    id: 'kitchen-cabinets',
    name: 'Cabinet LEDs',
    room: 'Kitchen',
    category: 'lights',
    isOn: true,
    value: 70,
    unit: '%',
    color: '#fbbf24',
    theme: 'amber',
    statusText: '70%',
    type: 'light'
  },
  {
    id: 'kitchen-faucet',
    name: 'Smart Faucet',
    room: 'Kitchen',
    category: 'water',
    isOn: false,
    value: 0,
    unit: 'gal',
    color: '#06b6d4',
    theme: 'cyan',
    statusText: 'Standby • 0 gal',
    type: 'water'
  },

  // Bedroom
  {
    id: 'br-lights',
    name: 'Bedside Lamps',
    room: 'Bedroom',
    category: 'lights',
    isOn: false,
    value: 40,
    unit: '%',
    color: '#f59e0b',
    theme: 'amber',
    statusText: 'Off',
    type: 'light'
  },
  {
    id: 'br-ac',
    name: 'Bedroom Climate',
    room: 'Bedroom',
    category: 'climate',
    isOn: true,
    value: 72,
    targetTemp: 72,
    currentTemp: 72,
    mode: 'Eco',
    unit: '°',
    color: '#06b6d4',
    theme: 'cyan',
    statusText: '72° • Eco',
    type: 'thermostat'
  },
  {
    id: 'br-shades',
    name: 'Blackout Shades',
    room: 'Bedroom',
    category: 'shades',
    isOn: false,
    value: 0,
    unit: '%',
    color: '#64748b',
    theme: 'cyan',
    statusText: 'Closed',
    type: 'shade'
  },

  // Backyard
  {
    id: 'backyard-sprinklers',
    name: 'Lawn Sprinklers',
    room: 'Backyard',
    category: 'water',
    isOn: false,
    value: 0,
    unit: 'gpm',
    color: '#06b6d4',
    theme: 'cyan',
    statusText: 'All Off',
    type: 'water'
  },
  {
    id: 'backyard-string-lights',
    name: 'Patio Strings',
    room: 'Backyard',
    category: 'lights',
    isOn: true,
    value: 100,
    unit: '%',
    color: '#fbbf24',
    theme: 'amber',
    statusText: '100%',
    type: 'light'
  }
];

const INITIAL_SCENES = [
  { id: 'arrive-home', label: 'Arrive Home', icon: 'SunMedium', isActive: false },
  { id: 'wake-up', label: 'Wake Up', icon: 'Sunrise', isActive: false },
  { id: 'leave-home', label: 'Leave Home', icon: 'DoorClosed', isActive: false },
  { id: 'movie-night', label: 'Movie Night', icon: 'Film', isActive: false },
  { id: 'goodnight', label: 'Goodnight', icon: 'Moon', isActive: false },
  { id: 'focus-mode', label: 'Focus Work', icon: 'Zap', isActive: false }
];

const INITIAL_CAMERAS = [
  {
    id: 'pool',
    name: 'Pool & Deck',
    location: 'Backyard',
    image: '/assets/camera_pool.jpg',
    live: true,
    aiTag: 'AI: Clear • 82°F water',
    recentEvents: ['Water circulation active', 'No motion detected in last 45m']
  },
  {
    id: 'driveway',
    name: 'Garage & Driveway',
    location: 'Driveway',
    image: '/assets/camera_driveway.jpg',
    live: true,
    aiTag: 'AI: Vehicle Secured',
    recentEvents: ['Car parked at 14:32', 'Bicycles detected in garage']
  },
  {
    id: 'livingroom',
    name: 'Interior Lounge',
    location: 'Living Room',
    image: '/assets/camera_livingroom.jpg',
    live: true,
    aiTag: 'AI: Motion 2m ago',
    recentEvents: ['Ambient daylight detected', 'Pet movement at 14:36']
  },
  {
    id: 'porch',
    name: 'Front Doorbell',
    location: 'Entry',
    image: '/assets/camera_porch.jpg',
    live: true,
    aiTag: 'AI: Package Delivered (99%)',
    recentEvents: ['Amazon delivery box at doorstep', 'Person departed 5m ago']
  }
];

export const HomeProvider = ({ children }) => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [scenes, setScenes] = useState(INITIAL_SCENES);
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [activeCategory, setActiveCategory] = useState(null); // null = all
  const [activeRoom, setActiveRoom] = useState('All');
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'automations' | 'discover' | 'ai-studio'
  const [deviceFrame, setDeviceFrame] = useState('mac'); // 'mac' | 'ipad' | 'iphone'
  const [wallpaper, setWallpaper] = useState('amber'); // 'amber' | 'aurora' | 'midnight'

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Toggle device on/off directly
  const toggleDevice = (id) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        const nextState = !dev.isOn;
        let newStatus = nextState ? 'On' : 'Off';
        let newValue = dev.value;

        if (dev.type === 'light') {
          newValue = nextState ? (dev.value > 0 ? dev.value : 80) : 0;
          newStatus = nextState ? `${newValue}%` : 'Off';
        } else if (dev.type === 'lock') {
          newStatus = nextState ? 'Locked' : 'Unlocked';
          newValue = nextState ? 1 : 0;
        } else if (dev.type === 'fan') {
          newValue = nextState ? (dev.value > 0 ? dev.value : 100) : 0;
          newStatus = nextState ? `${newValue}%` : 'Off';
        } else if (dev.type === 'shade') {
          newValue = nextState ? 100 : 0;
          newStatus = nextState ? 'Open 100%' : 'Closed';
        } else if (dev.type === 'speaker') {
          newStatus = nextState ? 'Playing' : 'Paused';
        }

        return {
          ...dev,
          isOn: nextState,
          value: newValue,
          statusText: newStatus
        };
      }
      return dev;
    }));
  };

  // Update specific device parameters (brightness, temp, color, etc.)
  const updateDevice = (id, updates) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        const updated = { ...dev, ...updates };
        if (updates.value !== undefined && dev.type === 'light') {
          updated.isOn = updates.value > 0;
          updated.statusText = updated.isOn ? `${updates.value}%` : 'Off';
        } else if (updates.targetTemp !== undefined && dev.type === 'thermostat') {
          updated.statusText = `${updates.targetTemp}° • ${updated.mode || 'Cooling'}`;
          updated.value = updates.targetTemp;
        }
        return updated;
      }
      return dev;
    }));

    // Also update selected device modal if open
    if (selectedDevice && selectedDevice.id === id) {
      setSelectedDevice(prev => ({ ...prev, ...updates }));
    }
  };

  // Trigger Scene with micro-animation celebration
  const triggerScene = (sceneId) => {
    setScenes(prev => prev.map(s => ({
      ...s,
      isActive: s.id === sceneId
    })));

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#fbbf24', '#06b6d4', '#10b981']
    });

    if (sceneId === 'arrive-home') {
      updateDevice('entry-door', { isOn: false, statusText: 'Unlocked', value: 0 });
      updateDevice('entry-sconces', { isOn: true, value: 85, statusText: '85%' });
      updateDevice('lr-ceiling-lights', { isOn: true, value: 75, statusText: '75%' });
      updateDevice('lr-thermostat', { targetTemp: 70, statusText: '70° • Comfort' });
    } else if (sceneId === 'wake-up') {
      updateDevice('entry-shades', { isOn: true, value: 100, statusText: 'Open 100%' });
      updateDevice('br-shades', { isOn: true, value: 100, statusText: 'Open 100%' });
      updateDevice('kitchen-island', { isOn: true, value: 80, statusText: '80%' });
      updateDevice('br-ac', { targetTemp: 72, statusText: '72° • Morning' });
    } else if (sceneId === 'leave-home') {
      setDevices(prev => prev.map(dev => {
        if (dev.type === 'light') return { ...dev, isOn: false, value: 0, statusText: 'Off' };
        if (dev.type === 'lock') return { ...dev, isOn: true, value: 1, statusText: 'Locked' };
        if (dev.type === 'speaker') return { ...dev, isOn: false, statusText: 'Paused' };
        return dev;
      }));
    } else if (sceneId === 'movie-night') {
      updateDevice('lr-ceiling-lights', { isOn: false, value: 0, statusText: 'Off' });
      updateDevice('lr-accent-lights', { isOn: true, value: 25, color: '#c084fc', statusText: '25% • Cinema' });
      updateDevice('lr-tv', { isOn: true, statusText: 'Playing • 4K HDR' });
      updateDevice('entry-shades', { isOn: false, value: 0, statusText: 'Closed' });
    } else if (sceneId === 'goodnight') {
      setDevices(prev => prev.map(dev => {
        if (dev.type === 'light') return { ...dev, isOn: false, value: 0, statusText: 'Off' };
        if (dev.type === 'lock') return { ...dev, isOn: true, value: 1, statusText: 'Locked' };
        if (dev.type === 'shade') return { ...dev, isOn: false, value: 0, statusText: 'Closed' };
        return dev;
      }));
    } else if (sceneId === 'focus-mode') {
      updateDevice('lr-ceiling-lights', { isOn: true, value: 90, color: '#ffffff', statusText: '90% • Daylight' });
      updateDevice('entry-fan', { isOn: true, value: 50, statusText: '50%' });
    }
  };

  // Status summaries for top chips
  const activeLightsCount = devices.filter(d => d.category === 'lights' && d.isOn).length;
  const unlockedDoorsCount = devices.filter(d => d.category === 'security' && !d.isOn).length;
  const playingSpeakersCount = devices.filter(d => d.category === 'speakers' && d.isOn).length;
  const waterStatus = devices.some(d => d.category === 'water' && d.isOn) ? 'Active' : 'All Off';
  const climateSummary = '68° - 72°';

  return (
    <HomeContext.Provider
      value={{
        devices,
        scenes,
        cameras,
        activeCategory,
        setActiveCategory,
        activeRoom,
        setActiveRoom,
        activeNav,
        setActiveNav,
        deviceFrame,
        setDeviceFrame,
        wallpaper,
        setWallpaper,
        selectedDevice,
        setSelectedDevice,
        selectedCamera,
        setSelectedCamera,
        isAiModalOpen,
        setIsAiModalOpen,
        toggleDevice,
        updateDevice,
        triggerScene,
        activeLightsCount,
        unlockedDoorsCount,
        playingSpeakersCount,
        waterStatus,
        climateSummary
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
