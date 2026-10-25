import { useHome } from '../context/HomeContext';
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

  return (
    <div className="home-actions-group">
      <button
        className="ai-trigger-orb-btn"
        onClick={() => setIsAiModalOpen(true)}
        title="Open Voxelle Local AI Neural Assistant"
      >
        <div className="glowing-orb">
          <Sparkles size={12} color="#ffffff" />
        </div>
        <span className="ai-trigger-text">Voxelle AI</span>
      </button>

      <button
        className="action-circle-btn"
        title="Add Accessory / Scene"
        onClick={() => alert('Add Accessory: Matter, Thread, and HomeKit auto-discovery scanning locally...')}
      >
        <Plus size={16} />
      </button>

      {showReset && (
        <button
          className="action-circle-btn"
          title="Reset demo home to its initial state"
          onClick={resetHome}
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};
