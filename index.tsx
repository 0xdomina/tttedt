import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { logger } from './utils/logger';

logger.log("index.tsx", "Application script loading.");

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        logger.log('ServiceWorker', 'Registration successful, scope is:', registration.scope);
      })
      .catch(error => {
        logger.error('ServiceWorker', 'Registration failed:', error);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error("index.tsx", "Could not find root element to mount to. App cannot start.");
  throw new Error("Could not find root element to mount to");
}

logger.log("index.tsx", "Found root element. Creating React root.");
const root = ReactDOM.createRoot(rootElement);

// Create a client
const queryClient = new QueryClient();

logger.log("index.tsx", "Rendering App component within Providers.");
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

logger.log("index.tsx", "Initial render complete.");