import { useEffect, useState } from 'react';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { ToggleButton } from '@astryxdesign/core/ToggleButton';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Mic, ShieldAlert, Camera, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { useHome } from '../context/HomeContext';

export const CameraDetailModal = () => {
  const { selectedCamera, setSelectedCamera } = useHome();
  const [isTalking, setIsTalking] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString());

  // Ticking overlay clock so the "live" stamp is not frozen at mount.
  useEffect(() => {
    const tick = window.setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!snapshotTaken) return;
    const timer = window.setTimeout(() => setSnapshotTaken(false), 2500);
    return () => window.clearTimeout(timer);
  }, [snapshotTaken]);

  const camera = selectedCamera;
  const close = () => setSelectedCamera(null);

  if (!camera) return null;

  return (
    <Dialog isOpen onOpenChange={(open) => !open && close()} width={720} padding={0}>
      <VStack gap={0}>
        <DialogHeader
          title={camera.name}
          subtitle={`${camera.location} · demo feed · simulated detection overlay`}
          onOpenChange={close}
        />

        <VStack gap={3} padding={4}>
          <AspectRatio ratio={16 / 9} fit="cover">
            <img
              src={camera.image}
              alt={`${camera.name} still frame, ${camera.location}`}
              width={1376}
              height={768}
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AspectRatio>

          <HStack hAlign="between" vAlign="center" wrap="wrap" gap={2}>
            <HStack gap={1.5} vAlign="center">
              <Badge label="Demo" variant="warning" />
              <Text type="supporting" hasTabularNumbers>
                {clock}
              </Text>
              <Badge label={camera.aiTag} variant="info" />
            </HStack>
            {snapshotTaken && (
              <HStack gap={1} vAlign="center">
                <Icon icon={CheckCircle2} size="sm" color="success" />
                <Text type="supporting">Snapshot saved to camera roll</Text>
              </HStack>
            )}
          </HStack>

          <HStack gap={1.5} wrap="wrap" vAlign="center">
            <ToggleButton
              label={isTalking ? 'Stop talking' : 'Push to talk'}
              isPressed={isTalking}
              onPressedChange={setIsTalking}
              size="sm"
              icon={<Icon icon={Mic} size="sm" />}
            />
            <ToggleButton
              label={isSirenActive ? 'Stop siren' : 'Trigger siren'}
              isPressed={isSirenActive}
              onPressedChange={setIsSirenActive}
              size="sm"
              icon={<Icon icon={ShieldAlert} size="sm" />}
            />
            <Button
              label="Capture snapshot"
              variant="secondary"
              size="sm"
              icon={<Icon icon={Camera} size="sm" />}
              onClick={() => setSnapshotTaken(true)}
            />
            <HStack gap={1} vAlign="center">
              <StatusDot variant="success" label="Vision engine active" />
              <Icon icon={Sparkles} size="sm" color="secondary" />
              <Text type="supporting">Vision engine active</Text>
            </HStack>
          </HStack>

          <VStack gap={1.5}>
            <Heading level={3}>Recent neural timeline</Heading>
            <List density="compact" hasDividers>
              {camera.recentEvents.map((event, index) => (
                <Item
                  key={`${event}-${index}`}
                  label={event}
                  startContent={<Icon icon={Activity} size="sm" color="accent" />}
                />
              ))}
            </List>
          </VStack>
        </VStack>
      </VStack>
    </Dialog>
  );
};
