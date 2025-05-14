import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isAuthenticated,
  login as authLogin,
  logout as authLogout,
  getUserData,
} from '../utils/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    // Check if user is authenticated
    const checkAuthStatus = () => {
      setLoading(true);
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        setUser(getUserData());
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const success = await authLogin(email, password);

    if (success) {
      setIsLoggedIn(true);
      setUser(getUserData());
    }

    setLoading(false);
    return success;
  };

  // Logout function
  const logout = () => {
    authLogout();
    setIsLoggedIn(false);
    setUser(null);
  };

  // Context value
  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
