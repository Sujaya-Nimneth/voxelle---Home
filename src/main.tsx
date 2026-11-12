import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
// Figtree is self-hosted via a Vite alias of theme-neutral/fonts.css (zero CDN).
import './astryx-themes';
import { Theme } from '@astryxdesign/core/theme';
import { LayerProvider } from '@astryxdesign/core/Layer';
import { defaultThemeSlug, themes } from './astryx-themes';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme theme={themes[defaultThemeSlug]} mode="light">
      <LayerProvider toast={{ position: 'bottomEnd', maxVisible: 3 }}>
        <ErrorBoundary>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ErrorBoundary>
      </LayerProvider>
    </Theme>
  </StrictMode>
);
