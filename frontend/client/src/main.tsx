import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ignore noisy browser extension errors (e.g. Grammarly, password manager message channel errors)
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    typeof event.reason.message === 'string' &&
    (event.reason.message.includes('message channel closed') ||
     event.reason.message.includes('listener indicated an asynchronous response'))
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
