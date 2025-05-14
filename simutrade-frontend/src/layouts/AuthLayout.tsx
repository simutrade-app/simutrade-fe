import React from 'react';
import { Outlet } from 'react-router-dom';
// import Header from '../components/layout/Header'; // Header import removed

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout min-h-screen flex flex-col">
      {/* <Header /> Header component removed */}
      <main className="auth-content flex-grow flex flex-col">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AuthLayout;
