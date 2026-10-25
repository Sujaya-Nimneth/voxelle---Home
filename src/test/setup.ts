import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Auto-cleanup requires framework globals, which this project disables in
// favor of explicit imports — run it manually instead.
afterEach(() => {
  cleanup();
});

// jsdom does not implement scrollIntoView; components rely on it for chat autoscroll.
if (typeof window !== 'undefined' && !window.Element.prototype.scrollIntoView) {
  window.Element.prototype.scrollIntoView = () => {};
}
