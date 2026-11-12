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

// jsdom does not implement matchMedia; the scene trigger checks reduced motion.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    }) as unknown as MediaQueryList;
}

// jsdom does not implement the native <dialog> API that Astryx Dialog uses.
// Mirror just the open/close contract so modal content remains queryable.
if (typeof window !== 'undefined') {
  const proto = window.HTMLDialogElement?.prototype;
  if (proto) {
    if (!proto.showModal) {
      proto.showModal = function showModal() {
        this.open = true;
      };
    }
    if (!proto.close) {
      proto.close = function close() {
        this.open = false;
      };
    }
  }
}
