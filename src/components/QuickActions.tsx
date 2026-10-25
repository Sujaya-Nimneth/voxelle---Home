import { useHome } from '../context/HomeContext';
import { useToast } from './Toast';
import { Plus, Sparkles, RotateCcw } from 'lucide-react';

interface QuickActionsProps {
  /** The header additionally exposes a demo-home reset; dashboard keeps it minimal. */
  showReset?: boolean;
}

/**
 * Shared AI orb + accessory actions used by both the window header and the
 * dashboard title row (previously duplicated verbatim in both).
 */
export const QuickActions = ({ showReset = false }: QuickActionsProps) => {
  const { setIsAiModalOpen, resetHome } = useHome();
  const { notify } = useToast();

  return (
    <div className="home-actions-group">
      <button
        className="ai-trigger-orb-btn"
        onClick={() => setIsAiModalOpen(true)}
        title="Open Voxelle Local AI Assistant"
      >
        <div className="glowing-orb">
          <Sparkles size={12} color="#ffffff" />
        </div>
        <span className="ai-trigger-text">Voxelle AI</span>
      </button>

      <button
        className="action-circle-btn"
        title="Add Accessory / Scene"
        onClick={() =>
          notify('Accessory discovery is simulated in this demo build — no real hardware is scanned.')
        }
      >
        <Plus size={16} />
      </button>

      {showReset && (
        <button
          className="action-circle-btn"
          title="Reset demo home to its initial state"
          onClick={() => {
            resetHome();
            notify('Demo home reset to its initial state.');
          }}
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};
