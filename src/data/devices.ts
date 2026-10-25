import type { Device } from '../types';

/**
 * Seed accessories for the demo home. Device `value` is category-specific:
 * brightness/fan speed percentage, lock 1|0, shade open percentage, etc.
 */
export const SEED_DEVICES: Device[] = [
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
