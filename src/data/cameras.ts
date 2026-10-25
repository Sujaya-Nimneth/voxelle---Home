import type { Camera } from '../types';

/**
 * Camera feeds are simulated with still imagery for the demo build.
 * Detection tags and timelines are static sample data.
 */
export const SEED_CAMERAS: Camera[] = [
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
