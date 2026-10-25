import { Sun, Moon, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Automation } from '../types';

/** Registry mapping serializable icon keys to Lucide components. */
export const AUTOMATION_ICONS: Record<string, LucideIcon> = {
  sun: Sun,
  mapPin: MapPin,
  moon: Moon,
  shieldAlert: ShieldAlert,
  sparkles: Sparkles
};

export const SEED_AUTOMATIONS: Automation[] = [
  {
    id: 'sunset',
    title: 'Sunset Ambiance',
    trigger: 'Every day at Sunset',
    action: 'Turn on Patio Strings and dim Living Room Accent Lights to 60% purple',
    icon: 'sun',
    enabled: true,
    color: '#f59e0b'
  },
  {
    id: 'geofence',
    title: 'Arrive Home Geo-Trigger',
    trigger: 'When your iPhone enters home perimeter',
    action: 'Unlock Front Door, set Living Room Thermostat to 70°F, and turn on Entry Sconces',
    icon: 'mapPin',
    enabled: true,
    color: '#06b6d4'
  },
  {
    id: 'goodnight',
    title: 'Goodnight Security & Darken',
    trigger: 'Every night at 11:00 PM',
    action: 'Lock all doors, close blackout shades, turn off all indoor lights, arm cameras',
    icon: 'moon',
    enabled: true,
    color: '#a855f7'
  },
  {
    id: 'sentry',
    title: 'Porch AI Detection Sentry',
    trigger: 'When Porch Camera AI detects person between 12:00 AM - 6:00 AM',
    action: 'Turn Entry Overhead to 100%, send local notification to Mac & iPhone',
    icon: 'shieldAlert',
    enabled: false,
    color: '#ef4444'
  }
];

/** Icon key used for automations generated at runtime by the synthesizer. */
export const GENERATED_AUTOMATION_ICON = 'sparkles';
