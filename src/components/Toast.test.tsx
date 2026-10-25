import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
  it('renders a toast inside a polite live region when notified', () => {
    renderToast();

    fireEvent.click(screen.getByRole('button', { name: 'notify' }));

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Saved to camera roll')).toBeInTheDocument();
  });

  it('caps the visible stack at three toasts', () => {
    renderToast();

    const trigger = screen.getByRole('button', { name: 'notify' });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(screen.getAllByRole('status')).toHaveLength(1); // single live region container
    expect(screen.getAllByText(/Saved to camera roll/)).toHaveLength(3); // capped stack
  });

  it('dismisses on click and auto-dismisses after the TTL', () => {
    vi.useFakeTimers();
    try {
      renderToast();
      const trigger = screen.getByRole('button', { name: 'notify' });

      // Early dismissal by clicking the toast itself
      fireEvent.click(trigger);
      fireEvent.click(screen.getByText('Saved to camera roll'));
      expect(screen.queryByText('Saved to camera roll')).not.toBeInTheDocument();

      // Auto-dismissal via timer
      fireEvent.click(trigger);
      expect(screen.getByText('Saved to camera roll')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.queryByText('Saved to camera roll')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
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
