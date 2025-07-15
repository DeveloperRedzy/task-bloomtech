import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { router } from './lib/router';
import { ToastProvider } from './components/ui';
import { PageErrorBoundary } from './components/common';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </PageErrorBoundary>
  </StrictMode>
);
