import React from 'react';
import { Outlet } from 'react-router-dom';
// import Header from '../components/layout/Header'; // Header import removed

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout w-full h-screen overflow-hidden flex">
      <main className="auth-content w-full h-full">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AuthLayout;
