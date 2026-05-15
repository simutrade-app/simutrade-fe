import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './styles/dashboard.css';
import App from './App.tsx';

const webHost = import.meta.env.VITE_WEB_HOST;
if (webHost && window.location.hostname !== webHost) {
  const target = new URL(window.location.href);
  target.hostname = webHost;
  window.location.replace(target.toString());
}

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
