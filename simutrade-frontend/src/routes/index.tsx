import React, { lazy, Suspense, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { gsap } from 'gsap';

// Layouts
import LandingLayout from '@/layouts/LandingLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Regular imports
import NotFoundPage from '@/pages/NotFoundPage';

// Lazy loaded components
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/auth/OAuthCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const PlaygroundPage = lazy(() => import('@/pages/playground/PlaygroundPage'));
const StrategiesPage = lazy(() => import('@/pages/strategies/StrategiesPage'));
const TradeMissionsPage = lazy(() => import('@/pages/missions'));
// const MentorPage = lazy(() => import('@/pages/mentor')); // Mentor page import commented out

// Fallback loading component
const LoadingFallback = () => {
  const iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        y: -25,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5', // Optional: a light background
      }}
      className="loading-container"
    >
      <img
        ref={iconRef}
        src="/icon-nograd.svg"
        alt="Loading..."
        style={{ width: '100px', height: '100px' }}
      />
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <LandingLayout>
              <HomePage />
            </LandingLayout>
          }
        />

        {/* OAuth Callback Route - Standalone outside of any layout */}
        <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route
            path="portfolio"
            element={<div>Portfolio Page (Coming Soon)</div>}
          />
          <Route path="market" element={<div>Market Page (Coming Soon)</div>} />
          <Route
            path="transactions"
            element={<div>Transactions Page (Coming Soon)</div>}
          />
          <Route
            path="settings"
            element={<div>Settings Page (Coming Soon)</div>}
          />
        </Route>

        {/* Playground Route */}
        <Route
          path="/playground"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaygroundPage />} />
        </Route>

        {/* Strategies Route */}
        <Route
          path="/strategies"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StrategiesPage />} />
        </Route>

        {/* Missions Route */}
        <Route
          path="/missions"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TradeMissionsPage />} />
        </Route>

        {/* Mentor Route - Commented out */}
        {/* <Route
          path="/mentor"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<MentorPage />} /> 
        </Route> */}

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
