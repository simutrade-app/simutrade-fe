'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

// Import from AuthService
import {
  AUTH_TOKEN_KEY,
  USER_DATA_KEY,
  isAuthenticated,
} from '@/services/AuthService';

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
  const [processStatus, setProcessStatus] = useState(
    'Processing authentication...'
  );
  const iconRef = useRef<HTMLImageElement>(null);

  // Set up the animation
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

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuth callback initiated');
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        console.log('Token from URL:', token ? 'Found' : 'Not found');

        if (!token) {
          setProcessStatus('No token found');
          toast({
            title: 'OAuth Error',
            description:
              'No token found in callback. Please try logging in again.',
            variant: 'destructive',
          });
          navigate('/login', { replace: true });
          return;
        }

        // Store token in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        console.log('Token stored in localStorage');

        // Attempt to parse the token to get user email for USER_DATA_KEY
        const decodedToken = parseJwt(token);
        console.log('Decoded token:', decodedToken ? 'Success' : 'Failed');

        let userEmail = 'user@example.com'; // Default email
        let userName = 'User'; // Default name

        if (decodedToken && decodedToken.email) {
          userEmail = decodedToken.email;
          userName = decodedToken.email.split('@')[0];
          console.log('User email from token:', userEmail);
        }

        const userData = {
          id: decodedToken?.sub || Date.now().toString(), // Use 'sub' if available, or generate an ID
          email: userEmail,
          name: userName,
          role: 'user', // Assuming 'user' role after OAuth
        };

        // Store user data
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        console.log('User data stored in localStorage');

        // Verify authentication state
        const isUserAuthenticated = isAuthenticated();
        console.log(
          'Authentication check after storing token:',
          isUserAuthenticated ? 'Authenticated' : 'Not authenticated'
        );

        if (isUserAuthenticated) {
          setProcessStatus('Authentication successful');
          toast({
            title: 'Login Successful',
            description: 'You have been successfully logged in via OAuth.',
            variant: 'success',
          });

          // Ensure we redirect to dashboard immediately
          console.log('Redirecting to dashboard...');
          try {
            navigate('/dashboard', { replace: true });

            // Add a fallback in case navigation fails
            setTimeout(() => {
              // If we're still on the callback page after timeout, use direct redirection
              if (window.location.pathname.includes('oauth-callback')) {
                console.log('Fallback redirection to dashboard');
                window.location.href = '/dashboard';
              }
            }, 1000);
          } catch (error) {
            console.error('Navigation error, using direct redirection', error);
            window.location.href = '/dashboard';
          }
        } else {
          setProcessStatus('Authentication failed');
          toast({
            title: 'Authentication Error',
            description: 'Failed to authenticate. Please try logging in again.',
            variant: 'destructive',
          });
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setProcessStatus('Error occurred');
        toast({
          title: 'OAuth Error',
          description: 'An error occurred during authentication.',
          variant: 'destructive',
        });
        navigate('/login', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [location, navigate, toast]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img
            ref={iconRef}
            src="/icon-nograd.svg"
            alt="Loading..."
            className="h-20 w-20"
          />
        </div>
        <p className="text-xl font-semibold text-primary mt-4">
          {processStatus}
        </p>
        <p className="text-gray-600 mt-2">
          Please wait while we securely log you in.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
