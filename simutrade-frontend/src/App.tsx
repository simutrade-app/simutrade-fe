import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
