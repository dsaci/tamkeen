
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { validateEnvironment } from './config/envValidation';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App';
import './index.css';

// Validate environment before app startup
try {
  validateEnvironment();
} catch (error: any) {
  console.error(error.message);
  // Show error in DOM if root exists
  const el = document.getElementById('root');
  if (el) {
    el.innerHTML = `<div style="padding:2rem;font-family:monospace;color:#dc2626;white-space:pre-wrap">${error.message}</div>`;
  }
  throw error;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
