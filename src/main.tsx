import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted variable fonts — keeps the zero-CDN privacy promise
import '@fontsource-variable/inter'
import '@fontsource-variable/outfit'
import '@fontsource-variable/jetbrains-mono'
import './styles/tokens.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/dashboard.css'
import './styles/cameras.css'
import './styles/scenes.css'
import './styles/accessories.css'
import './styles/modals.css'
import './styles/toast.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)
