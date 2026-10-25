import type { Scene } from '../types';

export const SEED_SCENES: Scene[] = [
  { id: 'arrive-home', label: 'Arrive Home', icon: 'SunMedium', isActive: false },
  { id: 'wake-up', label: 'Wake Up', icon: 'Sunrise', isActive: false },
  { id: 'leave-home', label: 'Leave Home', icon: 'DoorClosed', isActive: false },
  { id: 'movie-night', label: 'Movie Night', icon: 'Film', isActive: false },
  { id: 'goodnight', label: 'Goodnight', icon: 'Moon', isActive: false },
  { id: 'focus-mode', label: 'Focus Work', icon: 'Zap', isActive: false }
];
