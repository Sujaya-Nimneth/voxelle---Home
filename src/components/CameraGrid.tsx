import { memo } from 'react';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Item } from '@astryxdesign/core/Item';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Badge } from '@astryxdesign/core/Badge';
import { Heading } from '@astryxdesign/core/Heading';
import { VStack } from '@astryxdesign/core/Stack';
import { Maximize2 } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import type { Camera } from '../types';

/** Memoized: a card re-renders only when its camera object changes. */
const CameraCard = memo(function CameraCard({
  camera,
  onOpen
}: {
  camera: Camera;
  onOpen: (camera: Camera) => void;
}) {
  return (
    <Card padding={0} variant="default">
      <AspectRatio ratio={16 / 9} fit="cover">
        <img
          src={camera.image}
          alt={`${camera.name} still frame, ${camera.location}`}
          width={1376}
          height={768}
          loading="lazy"
          decoding="async"
        />
      </AspectRatio>
      <Item
        label={camera.name}
        description={camera.location}
        onClick={() => onOpen(camera)}
        startContent={<Badge label="Demo" variant="warning" />}
        endContent={
          <IconButton
            icon={<Icon icon={Maximize2} size="sm" />}
            label={`Open ${camera.name}`}
            variant="ghost"
            size="sm"
            onClick={() => onOpen(camera)}
          />
        }
      />
    </Card>
  );
});

export const CameraGrid = () => {
  const { cameras, setSelectedCamera } = useHome();

  return (
    <VStack gap={2}>
      <Heading level={2}>Cameras</Heading>
      <Grid columns={{ minWidth: 240 }} gap={3}>
        {cameras.map((camera) => (
          <CameraCard key={camera.id} camera={camera} onOpen={setSelectedCamera} />
        ))}
      </Grid>
    </VStack>
  );
};
