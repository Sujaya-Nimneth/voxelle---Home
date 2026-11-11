import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Section } from '@astryxdesign/core/Section';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Icon } from '@astryxdesign/core/Icon';
import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Stack';
import { ShieldCheck, Cpu, Wifi, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useToast } from './Toast';

interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: Cpu,
    title: 'Local neural models',
    description:
      'Plug and play with Ollama, LM Studio, or the built-in rule engine for natural language home control.'
  },
  {
    icon: Wifi,
    title: 'Matter 1.3 & Thread',
    description:
      'Cross-platform interoperability with Apple HomeKit, Google Home, and Home Assistant accessories.'
  },
  {
    icon: ShieldCheck,
    title: 'Zero cloud outbound',
    description:
      'Vision analysis and device reasoning run locally. No camera feed leaves your network.'
  }
];

export const DiscoverView = () => {
  const { notify } = useToast();

  return (
    <VStack gap={5} width="100%">
      <VStack gap={0.5}>
        <Heading level={1}>Discover Voxelle</Heading>
        <Text type="supporting">
          Next-generation privacy-first home automation architecture.
        </Text>
      </VStack>

      <Card padding={5} variant="muted">
        <VStack gap={2}>
          <Icon icon={Sparkles} size="md" color="accent" />
          <Heading level={2}>Your home data stays on your hardware</Heading>
          <Text>
            Unlike traditional smart homes that send camera feeds, voice recordings, and device usage
            to remote servers, Voxelle Home runs offline. Vision analysis, natural language scene
            orchestration, and device state reasoning execute inside your browser and local
            Ollama/LM Studio instances.
          </Text>
        </VStack>
      </Card>

      <Section variant="transparent" padding={0}>
        <VStack gap={2}>
          <Heading level={2}>Capabilities</Heading>
          <Grid columns={{ minWidth: 260 }} gap={3}>
            {CAPABILITIES.map((capability) => (
              <Card key={capability.title} padding={4}>
                <VStack gap={1.5}>
                  <Icon icon={capability.icon} size="md" color="secondary" />
                  <Text type="label" weight="semibold">
                    {capability.title}
                  </Text>
                  <Text type="supporting">{capability.description}</Text>
                </VStack>
              </Card>
            ))}
          </Grid>
        </VStack>
      </Section>

      <Section variant="transparent" padding={0}>
        <EmptyState
          title="No accessories found"
          description="Accessory discovery is simulated in this demo build. No real hardware is scanned."
          icon={<Icon icon={Wifi} size="lg" />}
          actions={
            <Button
              label="Scan for accessories"
              variant="secondary"
              onClick={() =>
                notify('Accessory discovery is simulated in this demo build — no real hardware is scanned.')
              }
            />
          }
        />
      </Section>
    </VStack>
  );
};
