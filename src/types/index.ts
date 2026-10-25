// ---------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------

export type DeviceCategory =
  | 'climate'
  | 'lights'
  | 'security'
  | 'speakers'
  | 'water'
  | 'fans'
  | 'shades';

export type DeviceType =
  | 'light'
  | 'lock'
  | 'fan'
  | 'thermostat'
  | 'speaker'
  | 'shade'
  | 'water';

export type DeviceTheme = 'amber' | 'emerald' | 'cyan' | 'purple';

export type ThermostatMode = 'Cool' | 'Heat' | 'Auto' | 'Eco';

export interface Device {
  id: string;
  name: string;
  room: string;
  category: DeviceCategory;
  type: DeviceType;
  isOn: boolean;
  /** Category-specific value: brightness %, fan speed %, lock 1/0, shade open %... */
  value: number;
  unit: string;
  color: string;
  theme: DeviceTheme;
  statusText: string;
  /** Thermostat-only fields */
  targetTemp?: number;
  currentTemp?: number;
  mode?: ThermostatMode;
}

export type DeviceUpdates = Partial<
  Pick<Device, 'isOn' | 'value' | 'statusText' | 'color' | 'targetTemp' | 'currentTemp' | 'mode'>
>;

// ---------------------------------------------------------------------------
// Scenes, cameras, automations
// ---------------------------------------------------------------------------

export interface Scene {
  id: string;
  label: string;
  /** Key into the scene icon registry in ScenesBar */
  icon: string;
  isActive: boolean;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  image: string;
  live: boolean;
  aiTag: string;
  recentEvents: string[];
}

export interface Automation {
  id: string;
  title: string;
  trigger: string;
  action: string;
  /** Key into the AUTOMATION_ICONS registry — kept as a string for JSON persistence */
  icon: string;
  enabled: boolean;
  color: string;
}

// ---------------------------------------------------------------------------
// Local AI engine
// ---------------------------------------------------------------------------

export type AiProviderId = 'voxelle-builtin' | 'ollama' | 'lmstudio';

export interface AiProviderInfo {
  id: AiProviderId;
  name: string;
  status: string;
  latency: string;
  offline: boolean;
}

export type AiActionType = 'scene' | 'camera_inspect' | 'device_update';

export interface AiAction {
  type: AiActionType;
  description: string;
  sceneId?: string;
  cameraId?: string;
  deviceId?: string;
  updates?: DeviceUpdates;
}

export interface AiResult {
  reply: string;
  sceneTrigger?: string;
  cameraCheck?: string;
  actions: AiAction[];
}

export interface ConnectionCheck {
  online: boolean;
  models: string[];
}

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------

export type ViewId = 'home' | 'automations' | 'discover';
export type DeviceFrame = 'mac' | 'ipad' | 'iphone';
export type Wallpaper = 'amber' | 'aurora' | 'midnight';

export interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  actions: AiAction[];
}
