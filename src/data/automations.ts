import { Sun, Moon, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import type { Automation } from '../types';

export const SEED_AUTOMATIONS: Automation[] = [
  {
    id: 'sunset',
    title: 'Sunset Ambiance',
    trigger: 'Every day at Sunset',
    action: 'Turn on Patio Strings and dim Living Room Accent Lights to 60% purple',
    icon: Sun,
    enabled: true,
    color: '#f59e0b'
  },
  {
    id: 'geofence',
    title: 'Arrive Home Geo-Trigger',
    trigger: 'When your iPhone enters home perimeter',
    action: 'Unlock Front Door, set Living Room Thermostat to 70°F, and turn on Entry Sconces',
    icon: MapPin,
    enabled: true,
    color: '#06b6d4'
  },
  {
    id: 'goodnight',
    title: 'Goodnight Security & Darken',
    trigger: 'Every night at 11:00 PM',
    action: 'Lock all doors, close blackout shades, turn off all indoor lights, arm cameras',
    icon: Moon,
    enabled: true,
    color: '#a855f7'
  },
  {
    id: 'sentry',
    title: 'Porch AI Detection Sentry',
    trigger: 'When Porch Camera AI detects person between 12:00 AM - 6:00 AM',
    action: 'Turn Entry Overhead to 100%, send local notification to Mac & iPhone',
    icon: ShieldAlert,
    enabled: false,
    color: '#ef4444'
  }
];

/** Icon used for automations generated at runtime by the natural-language synthesizer. */
export const GENERATED_AUTOMATION_ICON = Sparkles;
