import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const showToast = vi.fn();

vi.mock('@astryxdesign/core/Toast', () => ({
  useToast: () => showToast
}));

import { ToastProvider, useToast } from './Toast';

const NotifyButton = ({ message }: { message: string }) => {
  const { notify } = useToast();
  return <button onClick={() => notify(message)}>notify</button>;
};

const renderToast = (message = 'Saved to camera roll') =>
  render(
    <ToastProvider>
      <NotifyButton message={message} />
    </ToastProvider>
  );

describe('ToastProvider', () => {
  beforeEach(() => showToast.mockClear());

  it('forwards a notification to Astryx useToast with an auto-hide info toast', () => {
    renderToast();

    fireEvent.click(screen.getByRole('button', { name: 'notify' }));

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        body: 'Saved to camera roll',
        type: 'info',
        autoHideDuration: 3200
      })
    );
  });

  it('deduplicates repeated identical notifications', () => {
    renderToast();

    const trigger = screen.getByRole('button', { name: 'notify' });
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(showToast).toHaveBeenCalledTimes(2);
    expect(showToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ uniqueID: 'Saved to camera roll', collisionBehavior: 'overwrite' })
    );
  });

  it('preserves the caller-provided message', () => {
    renderToast('Accessory discovery is simulated');

    fireEvent.click(screen.getByRole('button', { name: 'notify' }));

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ body: 'Accessory discovery is simulated' })
    );
  });

  it('throws when useToast is used outside the provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Orphan = () => {
      useToast();
      return null;
    };
    expect(() => render(<Orphan />)).toThrow(/within a ToastProvider/);
    consoleSpy.mockRestore();
  });
});
