import { useEffect, useRef, useState } from 'react';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Section } from '@astryxdesign/core/Section';
import { Card } from '@astryxdesign/core/Card';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Switch } from '@astryxdesign/core/Switch';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '@astryxdesign/core/Icon';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Sparkles } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import { AUTOMATION_ICONS, GENERATED_AUTOMATION_ICON } from '../data/automations';
import type { Automation } from '../types';

export const AutomationsView = () => {
  const { automations, addAutomation, toggleAutomation, setIsAiModalOpen } = useHome();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const generateTimer = useRef<number | null>(null);

  // Clear any in-flight synthesis timer when navigating away.
  useEffect(
    () => () => {
      if (generateTimer.current !== null) window.clearTimeout(generateTimer.current);
    },
    []
  );

  const handleCreateWithAi = () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    generateTimer.current = window.setTimeout(() => {
      const newAuto: Automation = {
        id: `auto-${Date.now()}`,
        title: `${aiPrompt.slice(0, 30)}...`,
        trigger: 'AI Semantic Rule: Triggered by user condition',
        action: aiPrompt,
        icon: GENERATED_AUTOMATION_ICON,
        enabled: true,
        color: 'var(--color-text-success)'
      };
      addAutomation(newAuto);
      setAiPrompt('');
      setIsGenerating(false);
      generateTimer.current = null;
    }, 600);
  };

  return (
    <VStack gap={5} width="100%">
      <HStack hAlign="between" vAlign="center" wrap="wrap" gap={2}>
        <VStack gap={0.5}>
          <Heading level={1}>Automations</Heading>
          <Text type="supporting">
            Local event triggers executed on-device with zero cloud delay.
          </Text>
        </VStack>
        <Button
          label="Ask AI to build an automation"
          variant="primary"
          icon={<Icon icon={Sparkles} size="sm" />}
          onClick={() => setIsAiModalOpen(true)}
        />
      </HStack>

      <Card padding={4} variant="muted">
        <VStack gap={2}>
          <HStack gap={1.5} vAlign="center">
            <Icon icon={Sparkles} size="sm" color="accent" />
            <Text type="label" weight="semibold">
              Natural language automation synthesizer
            </Text>
          </HStack>
          <Text type="supporting">
            Describe a condition in plain language. The rule is stored locally; triggers do not
            execute on real events in this demo.
          </Text>
          <HStack gap={2} vAlign="end" wrap="wrap">
            <TextInput
              label="Describe an automation"
              isLabelHidden
              placeholder="e.g. Turn on backyard lights if the pool gate opens after 9 PM"
              value={aiPrompt}
              onChange={setAiPrompt}
              onEnter={handleCreateWithAi}
              hasClear
              width="100%"
            />
            <Button
              label={isGenerating ? 'Synthesizing' : 'Generate'}
              variant="primary"
              isLoading={isGenerating}
              isDisabled={!aiPrompt.trim() || isGenerating}
              onClick={handleCreateWithAi}
            />
          </HStack>
        </VStack>
      </Card>

      <Section variant="transparent" padding={0}>
        <VStack gap={2}>
          <Heading level={2}>Your automations</Heading>
          {automations.length === 0 ? (
            <EmptyState
              title="No automations yet"
              description="Describe a rule above or ask the assistant to build one."
              actions={
                <Button
                  label="Ask Voxelle AI"
                  variant="secondary"
                  onClick={() => setIsAiModalOpen(true)}
                />
              }
            />
          ) : (
            <List density="spacious" hasDividers>
              {automations.map((auto) => {
                const AutoIcon = AUTOMATION_ICONS[auto.icon] ?? Sparkles;
                return (
                  <Item
                    key={auto.id}
                    label={auto.title}
                    description={`Trigger: ${auto.trigger} · Action: ${auto.action}`}
                    startContent={<Icon icon={AutoIcon} size="sm" color="secondary" />}
                    endContent={
                      <Switch
                        value={auto.enabled}
                        onChange={() => toggleAutomation(auto.id)}
                        label={`${auto.enabled ? 'Disable' : 'Enable'} ${auto.title}`}
                        isLabelHidden
                      />
                    }
                  />
                );
              })}
            </List>
          )}
        </VStack>
      </Section>
    </VStack>
  );
};
