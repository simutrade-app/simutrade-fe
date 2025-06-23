import './App.css';
import './styles/leaflet-map.css';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
