'use client';

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AUTH_TOKEN_KEY = 'simutrade_token';
const USER_DATA_KEY = 'simutrade_user';

// Helper function to parse JWT. IMPORTANT: This is for reading claims client-side
// and NOT for verifying the token's signature. Verification must happen server-side.
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
};

const OAuthCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Attempt to parse the token to get user email for USER_DATA_KEY
      // This is a simplified approach. Ideally, you'd have an endpoint to get user details with the token.
      const decodedToken = parseJwt(token);
      let userEmail = 'user@example.com'; // Default email
      let userName = 'User'; // Default name

      if (decodedToken && decodedToken.email) {
        userEmail = decodedToken.email;
        userName = decodedToken.email.split('@')[0];
      }

      const userData = {
        id: decodedToken?.sub || Date.now().toString(), // Use 'sub' if available, or generate an ID
        email: userEmail,
        name: userName,
        role: 'user', // Assuming 'user' role after OAuth
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in via OAuth.',
        variant: 'success',
      });
      navigate('/dashboard', { replace: true });
    } else {
      toast({
        title: 'OAuth Error',
        description: 'No token found in callback. Please try logging in again.',
        variant: 'destructive',
      });
      navigate('/login', { replace: true });
    }
  }, [location, navigate, toast]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-xl font-semibold text-foreground">
          Processing authentication...
        </p>
        <p className="text-muted-foreground">
          Please wait while we securely log you in.
        </p>
        {/* Optional: Add a spinner here */}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
