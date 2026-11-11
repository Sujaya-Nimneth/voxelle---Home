import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Icon } from '@astryxdesign/core/Icon';
import { HStack } from '@astryxdesign/core/Stack';
import { Plus, Sparkles, RotateCcw } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import { useToast } from './Toast';

interface QuickActionsProps {
  /** The header additionally exposes a demo-home reset; dashboard keeps it minimal. */
  showReset?: boolean;
}

/** Shared assistant + accessory actions used by the header and dashboard. */
export const QuickActions = ({ showReset = false }: QuickActionsProps) => {
  const { setIsAiModalOpen, resetHome } = useHome();
  const { notify } = useToast();

  return (
    <HStack gap={1.5} hAlign="end">
      <Button
        label="Ask Voxelle AI"
        variant="primary"
        size="sm"
        icon={<Icon icon={Sparkles} size="sm" />}
        onClick={() => setIsAiModalOpen(true)}
      />
      <IconButton
        icon={<Icon icon={Plus} size="sm" />}
        label="Add accessory"
        variant="secondary"
        size="sm"
        tooltip="Add Accessory / Scene"
        onClick={() =>
          notify('Accessory discovery is simulated in this demo build — no real hardware is scanned.')
        }
      />
      {showReset && (
        <IconButton
          icon={<Icon icon={RotateCcw} size="sm" />}
          label="Reset demo home"
          variant="secondary"
          size="sm"
          tooltip="Reset demo home to its initial state"
          onClick={() => {
            resetHome();
            notify('Demo home reset to its initial state.');
          }}
        />
      )}
    </HStack>
  );
};
