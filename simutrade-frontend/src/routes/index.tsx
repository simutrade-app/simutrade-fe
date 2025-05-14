import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

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
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const StockDetailPage = lazy(() => import('@/pages/dashboard/StockDetailPage'));

// Fallback loading component
const LoadingFallback = () => (
  <div className="loading-container">
    <p>Loading...</p>
  </div>
);

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

        {/* Auth Routes - Updated */}
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

          {/* Dynamic Route Params Example */}
          <Route path="stock/:symbol" element={<StockDetailPage />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
