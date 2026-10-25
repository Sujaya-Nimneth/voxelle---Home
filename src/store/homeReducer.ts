import type {
  Automation,
  Camera,
  Device,
  DeviceCategory,
  DeviceFrame,
  DeviceUpdates,
  Scene,
  ViewId,
  Wallpaper
} from '../types';
import { SEED_DEVICES } from '../data/devices';
import { SEED_SCENES } from '../data/scenes';
import { SEED_CAMERAS } from '../data/cameras';
import { SEED_AUTOMATIONS } from '../data/automations';

export interface HomeState {
  devices: Device[];
  scenes: Scene[];
  cameras: Camera[];
  automations: Automation[];
  activeCategory: DeviceCategory | null;
  activeRoom: string;
  activeNav: ViewId;
  deviceFrame: DeviceFrame;
  wallpaper: Wallpaper;
  selectedDevice: Device | null;
  selectedCamera: Camera | null;
  isAiModalOpen: boolean;
}

export const createInitialHomeState = (): HomeState => ({
  devices: SEED_DEVICES,
  scenes: SEED_SCENES,
  cameras: SEED_CAMERAS,
  automations: SEED_AUTOMATIONS,
  activeCategory: null,
  activeRoom: 'All',
  activeNav: 'home',
  deviceFrame: 'mac',
  wallpaper: 'amber',
  selectedDevice: null,
  selectedCamera: null,
  isAiModalOpen: false
});

// ---------------------------------------------------------------------------
// Device transition helpers
// ---------------------------------------------------------------------------

const applyDeviceToggle = (device: Device): Device => {
  const nextState = !device.isOn;
  let newStatus = nextState ? 'On' : 'Off';
  let newValue = device.value;

  if (device.type === 'light') {
    newValue = nextState ? (device.value > 0 ? device.value : 80) : 0;
    newStatus = nextState ? `${newValue}%` : 'Off';
  } else if (device.type === 'lock') {
    newStatus = nextState ? 'Locked' : 'Unlocked';
    newValue = nextState ? 1 : 0;
  } else if (device.type === 'fan') {
    newValue = nextState ? (device.value > 0 ? device.value : 100) : 0;
    newStatus = nextState ? `${newValue}%` : 'Off';
  } else if (device.type === 'shade') {
    newValue = nextState ? 100 : 0;
    newStatus = nextState ? 'Open 100%' : 'Closed';
  } else if (device.type === 'speaker') {
    newStatus = nextState ? 'Playing' : 'Paused';
  }

  return { ...device, isOn: nextState, value: newValue, statusText: newStatus };
};

const applyDeviceUpdates = (device: Device, updates: DeviceUpdates): Device => {
  const updated = { ...device, ...updates };
  if (updates.value !== undefined && device.type === 'light') {
    updated.isOn = updates.value > 0;
    if (updates.statusText === undefined) {
      updated.statusText = updated.isOn ? `${updates.value}%` : 'Off';
    }
  } else if (updates.targetTemp !== undefined && device.type === 'thermostat') {
    if (updates.statusText === undefined) {
      updated.statusText = `${updates.targetTemp}° • ${updated.mode ?? 'Cooling'}`;
    }
    updated.value = updates.targetTemp;
  }
  return updated;
};

const updateDevices = (devices: Device[], id: string, transform: (device: Device) => Device): Device[] =>
  devices.map(device => (device.id === id ? transform(device) : device));

/** Re-syncs the open modal snapshot from the new device list after any mutation. */
const syncSelectedDevice = (state: HomeState, devices: Device[]): Device | null => {
  if (!state.selectedDevice) return null;
  return devices.find(d => d.id === state.selectedDevice?.id) ?? null;
};

// ---------------------------------------------------------------------------
// Scene definitions
// ---------------------------------------------------------------------------

type SceneDevicePatch = readonly [deviceId: string, updates: DeviceUpdates];

/** Scenes expressed as targeted device patches. */
const SCENE_DEVICE_PATCHES: Record<string, readonly SceneDevicePatch[]> = {
  'arrive-home': [
    ['entry-door', { isOn: false, statusText: 'Unlocked', value: 0 }],
    ['entry-sconces', { isOn: true, value: 85, statusText: '85%' }],
    ['lr-ceiling-lights', { isOn: true, value: 75, statusText: '75%' }],
    ['lr-thermostat', { targetTemp: 70, statusText: '70° • Comfort' }]
  ],
  'wake-up': [
    ['entry-shades', { isOn: true, value: 100, statusText: 'Open 100%' }],
    ['br-shades', { isOn: true, value: 100, statusText: 'Open 100%' }],
    ['kitchen-island', { isOn: true, value: 80, statusText: '80%' }],
    ['br-ac', { targetTemp: 72, statusText: '72° • Morning' }]
  ],
  'movie-night': [
    ['lr-ceiling-lights', { isOn: false, value: 0, statusText: 'Off' }],
    ['lr-accent-lights', { isOn: true, value: 25, color: '#c084fc', statusText: '25% • Cinema' }],
    ['lr-tv', { isOn: true, statusText: 'Playing • 4K HDR' }],
    ['entry-shades', { isOn: false, value: 0, statusText: 'Closed' }]
  ],
  'focus-mode': [
    ['lr-ceiling-lights', { isOn: true, value: 90, color: '#ffffff', statusText: '90% • Daylight' }],
    ['entry-fan', { isOn: true, value: 50, statusText: '50%' }]
  ]
};

/** Scenes expressed as a transform over every device (bulk lockdown scenes). */
const BULK_SCENE_TRANSFORMS: Record<string, (device: Device) => Device> = {
  'leave-home': device => {
    if (device.type === 'light') return { ...device, isOn: false, value: 0, statusText: 'Off' };
    if (device.type === 'lock') return { ...device, isOn: true, value: 1, statusText: 'Locked' };
    if (device.type === 'speaker') return { ...device, isOn: false, statusText: 'Paused' };
    return device;
  },
  goodnight: device => {
    if (device.type === 'light') return { ...device, isOn: false, value: 0, statusText: 'Off' };
    if (device.type === 'lock') return { ...device, isOn: true, value: 1, statusText: 'Locked' };
    if (device.type === 'shade') return { ...device, isOn: false, value: 0, statusText: 'Closed' };
    return device;
  }
};

// ---------------------------------------------------------------------------
// Actions & reducer
// ---------------------------------------------------------------------------

export type HomeAction =
  | { type: 'TOGGLE_DEVICE'; id: string }
  | { type: 'UPDATE_DEVICE'; id: string; updates: DeviceUpdates }
  | { type: 'APPLY_SCENE'; sceneId: string }
  | { type: 'ADD_AUTOMATION'; automation: Automation }
  | { type: 'TOGGLE_AUTOMATION'; id: string }
  | { type: 'SET_ACTIVE_CATEGORY'; category: DeviceCategory | null }
  | { type: 'SET_ACTIVE_ROOM'; room: string }
  | { type: 'SET_ACTIVE_NAV'; nav: ViewId }
  | { type: 'SET_DEVICE_FRAME'; frame: DeviceFrame }
  | { type: 'SET_WALLPAPER'; wallpaper: Wallpaper }
  | { type: 'SELECT_DEVICE'; device: Device | null }
  | { type: 'SELECT_CAMERA'; camera: Camera | null }
  | { type: 'SET_AI_MODAL_OPEN'; open: boolean }
  | { type: 'RESET_HOME' };

export function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'TOGGLE_DEVICE': {
      const devices = updateDevices(state.devices, action.id, applyDeviceToggle);
      return { ...state, devices, selectedDevice: syncSelectedDevice(state, devices) };
    }

    case 'UPDATE_DEVICE': {
      const devices = updateDevices(state.devices, action.id, device =>
        applyDeviceUpdates(device, action.updates)
      );
      return { ...state, devices, selectedDevice: syncSelectedDevice(state, devices) };
    }

    case 'APPLY_SCENE': {
      const scenes = state.scenes.map(s => ({ ...s, isActive: s.id === action.sceneId }));

      let devices = state.devices;
      const patches = SCENE_DEVICE_PATCHES[action.sceneId];
      if (patches) {
        for (const [id, updates] of patches) {
          devices = updateDevices(devices, id, device => applyDeviceUpdates(device, updates));
        }
      }
      const bulk = BULK_SCENE_TRANSFORMS[action.sceneId];
      if (bulk) {
        devices = devices.map(bulk);
      }

      return { ...state, scenes, devices, selectedDevice: syncSelectedDevice(state, devices) };
    }

    case 'ADD_AUTOMATION':
      return { ...state, automations: [action.automation, ...state.automations] };

    case 'TOGGLE_AUTOMATION':
      return {
        ...state,
        automations: state.automations.map(a =>
          a.id === action.id ? { ...a, enabled: !a.enabled } : a
        )
      };

    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.category };

    case 'SET_ACTIVE_ROOM':
      return { ...state, activeRoom: action.room };

    case 'SET_ACTIVE_NAV':
      return { ...state, activeNav: action.nav };

    case 'SET_DEVICE_FRAME':
      return { ...state, deviceFrame: action.frame };

    case 'SET_WALLPAPER':
      return { ...state, wallpaper: action.wallpaper };

    case 'SELECT_DEVICE':
      return { ...state, selectedDevice: action.device };

    case 'SELECT_CAMERA':
      return { ...state, selectedCamera: action.camera };

    case 'SET_AI_MODAL_OPEN':
      return { ...state, isAiModalOpen: action.open };

    case 'RESET_HOME':
      return createInitialHomeState();

    default:
      return state;
  }
}
