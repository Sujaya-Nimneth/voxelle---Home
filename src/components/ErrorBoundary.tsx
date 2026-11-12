import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { VStack } from '@astryxdesign/core/Stack';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/** Root crash guard: an Astryx-native fallback instead of a blank screen. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Voxelle Home crashed:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Center axis="both" role="alert" height="100vh">
        <Card padding={6} maxWidth={520}>
          <VStack gap={3} hAlign="center">
            <Heading level={1}>Voxelle hit an unexpected error</Heading>
            <Text type="supporting">{this.state.message || 'An unknown error interrupted the app.'}</Text>
            <Button label="Reload Voxelle" variant="primary" onClick={() => window.location.reload()} />
          </VStack>
        </Card>
      </Center>
    );
  }
}
