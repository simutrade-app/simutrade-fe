// Utility functions for authentication
// This is a simplified version for demonstration purposes
// In a real app, you'd implement more robust authentication

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('simutrade_token');
  return !!token;
};

// Get user data (simplified)
export const getUserData = () => {
  const userData = localStorage.getItem('simutrade_user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Login user (simplified)
export const login = (email: string, password: string): Promise<boolean> => {
  // This is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you would validate credentials with an API
      if (email && password) {
        // Mock user data and token
        const user = {
          id: '123',
          email,
          name: 'Demo User',
          role: 'user',
        };

        // Store in localStorage (would be JWT in real app)
        localStorage.setItem('simutrade_token', 'mock_jwt_token');
        localStorage.setItem('simutrade_user', JSON.stringify(user));

        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('simutrade_token');
  localStorage.removeItem('simutrade_user');
};
