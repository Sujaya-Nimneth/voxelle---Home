/**
 * Canonical room list for the demo home. 'All' is the unfiltered sentinel;
 * the remaining entries drive the dashboard grouping and the sidebar room filter.
 */
export const ROOMS = ['All', 'Entry', 'Living Room', 'Kitchen', 'Bedroom', 'Backyard'] as const;

export type RoomFilter = (typeof ROOMS)[number];

/** Rooms excluding the 'All' sentinel — used for dashboard section grouping. */
export const PHYSICAL_ROOMS: readonly string[] = ROOMS.filter(room => room !== 'All');
