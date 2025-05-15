import axios from 'axios';

// Configuration
const API_URL = 'https://api.simutrade.app';
export const AUTH_TOKEN_KEY = 'simutrade_token';
export const USER_DATA_KEY = 'simutrade_user';

// Toggle between real API calls and mock responses
let useMockApi = false; // Set to false to use real API

// Function to toggle API mode
export const toggleApiMode = (useMock: boolean) => {
  useMockApi = useMock;
  localStorage.setItem('useMockApi', useMock.toString());
  console.log(`Auth service using ${useMock ? 'MOCK' : 'REAL'} API mode`);
};

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  const storedMode = localStorage.getItem('useMockApi');
  if (storedMode !== null) {
    useMockApi = storedMode === 'true';
  }
  console.log(
    `Auth service initialized in ${useMockApi ? 'MOCK' : 'REAL'} API mode`
  );
}

// Helper for API requests with error handling
const apiRequest = async (
  endpoint: string,
  method: string,
  data: Record<string, unknown> | null = null
) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      data: data ? JSON.stringify(data) : undefined,
    };

    const response = await axios(url, options);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else if (error instanceof Error) {
      return {
        status: 'error',
        message: error.message || 'Network error',
        data: {},
      };
    } else {
      return {
        status: 'error',
        message: 'An unknown error occurred',
        data: {},
      };
    }
  }
};

// 1. Email Verification
export const verifyEmail = async (email: string) => {
  if (useMockApi) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate already verified email sometimes
    if (email === 'verified@example.com') {
      return {
        status: 'error',
        message: 'Email already verified',
        data: {},
      };
    }

    // Simulate countdown limitation
    const lastVerificationTime = localStorage.getItem(
      `last_verification_${email}`
    );
    if (lastVerificationTime) {
      const timeDiff = Date.now() - parseInt(lastVerificationTime);
      if (timeDiff < 60000) {
        // 1 minute
        const secondsLeft = Math.floor((60000 - timeDiff) / 1000);
        return {
          status: 'error',
          message: `Email verification already sent 0 minutes and ${secondsLeft} seconds ago. Please wait some time`,
          data: {},
        };
      }
    }

    // Store verification time
    localStorage.setItem(`last_verification_${email}`, Date.now().toString());

    // Generate mock verification token
    const mockToken = btoa(`mock_token_for_${email}`);
    const verificationUrl = `${window.location.origin}/verify-email?token=${mockToken}`;

    return {
      status: 'success',
      message: 'Email sent. Please check your inbox',
      data: {
        verificationCheck: verificationUrl,
      },
    };
  } else {
    // Real API implementation
    return apiRequest('/user/auth/email/verify', 'POST', { email });
  }
};

// 2. Check Email Verification Status
export const checkEmailVerification = async (token: string) => {
  if (useMockApi) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Extract email from mock token
    let email = '';
    try {
      email = atob(token).replace('mock_token_for_', '');
    } catch {
      email = 'unknown@example.com';
    }

    // Check if this email is marked as verified in localStorage
    const isVerified =
      localStorage.getItem(`verified_email_${email}`) === 'true';

    // If not yet verified, mark as verified 50% of the time
    let nowVerified = isVerified;
    if (!isVerified && Math.random() > 0.5) {
      localStorage.setItem(`verified_email_${email}`, 'true');
      nowVerified = true;
    }

    return {
      status: 'success',
      message: nowVerified ? 'User is verified' : 'User still not verified',
      data: {
        email,
        isVerified: nowVerified,
      },
    };
  } else {
    // Real API implementation - we need to use the full URL here
    return apiRequest(`/user/auth/email/activation?token=${token}`, 'GET');
  }
};

// 3. Register User
export const registerUser = async (email: string, password: string) => {
  if (useMockApi) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Check if email is verified
    const isVerified =
      localStorage.getItem(`verified_email_${email}`) === 'true';
    if (!isVerified) {
      return {
        status: 'error',
        message: 'Email is not yet verified',
        data: {},
      };
    }

    // Check if user is already registered
    const isRegistered = localStorage.getItem(`registered_${email}`) === 'true';
    if (isRegistered) {
      return {
        status: 'error',
        message: 'User is registered',
        data: {},
      };
    }

    // Register the user
    localStorage.setItem(`registered_${email}`, 'true');
    localStorage.setItem(`password_${email}`, password);

    return {
      status: 'success',
      message: 'User registered successfully',
      data: { email },
    };
  } else {
    // Real API implementation with direct axios.post
    try {
      const url = `${API_URL}/user/auth/email/register`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const requestBody = { email, password };
      const response = await axios.post(url, requestBody, { headers });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else if (error instanceof Error) {
        return {
          status: 'error',
          message: error.message || 'Network error or unexpected issue',
          data: {},
        };
      } else {
        return {
          status: 'error',
          message: 'An unknown error occurred during registration',
          data: {},
        };
      }
    }
  }
};

// 4. Login User
export const loginUser = async (email: string, password: string) => {
  if (useMockApi) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if user is registered
    const isRegistered = localStorage.getItem(`registered_${email}`) === 'true';
    if (!isRegistered) {
      return {
        status: 'error',
        message: 'Email not Found',
        data: {},
      };
    }

    // Check password
    const storedPassword = localStorage.getItem(`password_${email}`);
    if (storedPassword !== password) {
      return {
        status: 'error',
        message: 'Invalid password',
        data: {},
      };
    }

    // Generate mock token
    const token = `mock_jwt_token_${Date.now()}`;

    // Store auth data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    const userData = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'user',
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    return {
      status: 'success',
      message: 'Login Success',
      data: {
        email,
        token,
      },
    };
  } else {
    // Real API implementation
    const response = await apiRequest('/user/auth/email/login', 'POST', {
      email,
      password,
    });

    // If login successful, store token and user data
    if (response.status === 'success' && response.data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);

      // For real API, we would typically decode the JWT or make a separate API call
      // to get user details. Here we'll just store minimal info.
      const userData = {
        id: 'unknown', // Would normally come from JWT or profile API
        email: response.data.email,
        name: response.data.email.split('@')[0],
        role: 'user',
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }

    return response;
  }
};

// 5. Forgot Password
export const forgotPassword = async (email: string) => {
  if (useMockApi) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user is registered
    const isRegistered = localStorage.getItem(`registered_${email}`) === 'true';
    if (!isRegistered) {
      // Still return success to avoid leaking registration info
      return {
        status: 'success',
        message: 'Email sent. Please check your inbox',
        data: {},
      };
    }

    return {
      status: 'success',
      message: 'Email sent. Please check your inbox',
      data: {},
    };
  } else {
    // Real API implementation
    return apiRequest('/user/auth/email/forgot-password', 'POST', { email });
  }
};

// 6. Reset Password
export const resetPassword = async (password: string, token: string) => {
  if (useMockApi) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      status: 'success',
      message: 'Password changed successfully',
      data: {},
    };
  } else {
    // Real API implementation
    return apiRequest('/user/auth/email/change-password', 'POST', {
      password,
      token,
    });
  }
};

// 7. Logout
export const logoutUser = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  // Redirect to landing page
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// 8. Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// 9. Get current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

export default {
  toggleApiMode,
  verifyEmail,
  checkEmailVerification,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  isAuthenticated,
  getCurrentUser,
};
