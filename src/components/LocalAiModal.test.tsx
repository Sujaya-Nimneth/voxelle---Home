import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeProvider, useHome } from '../context/HomeContext';
import { LocalAiModal } from './LocalAiModal';
import { ToastProvider } from './Toast';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

/** Opens the AI modal from inside the provider so the hook wiring is real. */
const Probe = () => {
  const { setIsAiModalOpen } = useHome();
  return (
    <>
      <button onClick={() => setIsAiModalOpen(true)}>open-ai</button>
      <LocalAiModal />
    </>
  );
};

const renderModal = () =>
  render(
    <HomeProvider>
      <ToastProvider>
        <Probe />
      </ToastProvider>
    </HomeProvider>
  );

describe('LocalAiModal', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs the built-in rule engine and executes returned device actions', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'open-ai' }));
    const input = screen.getByPlaceholderText(/Ask Voxelle/i);
    await user.type(input, 'lock the front door');
    await user.click(screen.getByRole('button', { name: 'Send command' }));

    const bubble = await screen.findByText(/Front Door has been securely locked/i);
    expect(bubble).toBeInTheDocument();
  });

  it('surfaces provider failures honestly instead of claiming success', async () => {
    // Regression: the old implementation caught every error and posted
    // "Local inference processed. Home state verified."
    vi.mocked(window.fetch).mockRejectedValueOnce(new TypeError('fetch failed'));

    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'open-ai' }));

    // Switch to the Ollama tab so the failing fetch is actually used
    await user.click(screen.getByRole('button', { name: /Ollama Bridge/i }));

    const input = screen.getByPlaceholderText(/Ask Voxelle/i);
    await user.type(input, 'turn on the lights');
    await user.click(screen.getByRole('button', { name: 'Send command' }));

    const errorBubble = await screen.findByText(/Ollama Bridge failed/i);
    expect(errorBubble).toBeInTheDocument();
    expect(screen.queryByText(/Home state verified/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Run with built-in engine/i })
    ).toBeInTheDocument();
  });

  it('falls back to the built-in engine from an error bubble', async () => {
    vi.mocked(window.fetch).mockRejectedValueOnce(new TypeError('fetch failed'));

    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'open-ai' }));
    await user.click(screen.getByRole('button', { name: /Ollama Bridge/i }));

    const input = screen.getByPlaceholderText(/Ask Voxelle/i);
    await user.type(input, 'lock the front door');
    await user.click(screen.getByRole('button', { name: 'Send command' }));

    await screen.findByText(/Ollama Bridge failed/i);
    await user.click(screen.getByRole('button', { name: /Run with built-in engine/i }));

    expect(await screen.findByText(/Front Door has been securely locked/i)).toBeInTheDocument();
  });

  it('hides completely when the modal is closed', () => {
    renderModal();

    expect(screen.queryByPlaceholderText(/Ask Voxelle/i)).not.toBeInTheDocument();
  });
});

// Keep act import referenced for future async assertions
void act;
