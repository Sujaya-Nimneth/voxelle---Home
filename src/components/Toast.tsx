import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useToast as useAstryxToast } from '@astryxdesign/core/Toast';

interface ToastContextValue {
  /** Show a transient non-blocking notification. */
  notify: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Adapter preserving the app's simple notify(message) API over Astryx toasts. */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = useAstryxToast();

  const notify = useCallback(
    (message: string) => {
      showToast({
        body: message,
        type: 'info',
        autoHideDuration: 3200,
        uniqueID: message,
        collisionBehavior: 'overwrite'
      });
    },
    [showToast]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
