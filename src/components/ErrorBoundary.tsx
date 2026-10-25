import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Root crash guard. Renders a styled fallback instead of a blank screen
 * when a render-time error escapes the component tree.
 */
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
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          background: '#121316',
          color: '#fff',
          fontFamily: 'inherit',
          padding: 24,
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: 40 }}>🏡</div>
        <h1 style={{ fontSize: 22, margin: 0 }}>Voxelle hit an unexpected error</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 480, margin: 0 }}>
          {this.state.message || 'An unknown error interrupted the app.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 8,
            padding: '10px 24px',
            borderRadius: 9999,
            border: 'none',
            background: '#f59e0b',
            color: '#111',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Reload Voxelle
        </button>
      </div>
    );
  }
}
