import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Section } from '@astryxdesign/core/Section';
import { Heading } from '@astryxdesign/core/Heading';
import { Icon } from '@astryxdesign/core/Icon';
import { VStack } from '@astryxdesign/core/Stack';
import { SunMedium, Sunrise, DoorClosed, Film, Moon, Zap, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHome } from '../context/HomeContext';

const SCENE_ICONS: Record<string, LucideIcon> = {
  SunMedium,
  Sunrise,
  DoorClosed,
  Film,
  Moon,
  Zap
};

/** Scenes as one segmented control; the active scene is the selected segment. */
export const ScenesBar = () => {
  const { scenes, triggerScene } = useHome();
  const active = scenes.find((scene) => scene.isActive)?.id ?? '';

  return (
    <Section variant="transparent" padding={0}>
      <VStack gap={2}>
        <Heading level={2}>Scenes</Heading>
        <SegmentedControl
          label="Run a scene"
          value={active}
          onChange={(id) => triggerScene(id)}
          layout="fill"
        >
          {scenes.map((scene) => (
            <SegmentedControlItem
              key={scene.id}
              value={scene.id}
              label={scene.label}
              icon={<Icon icon={SCENE_ICONS[scene.icon] ?? Sparkles} size="sm" />}
            />
          ))}
        </SegmentedControl>
      </VStack>
    </Section>
  );
};
