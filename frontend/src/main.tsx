import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import './lib/i18n';
import { applyLook, readStoredLook } from './lib/look';
import './styles/globals.css';

initAnalytics();
applyLook(readStoredLook());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
