import { useState, useEffect, useCallback } from 'react';
import { authService, apiUtils } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for external authentication tokens from main app
  useEffect(() => {
    const handleExternalAuth = (event: MessageEvent) => {
      if (event.data.type === 'set-auth-token' && event.data.token) {
        console.log('Received external auth token from main app');
        apiUtils.setToken(event.data.token);
        checkAuthStatus();
      }
      
      if (event.data.type === 'set-user-data' && event.data.user) {
        console.log('Received external user data from main app');
        setAuthState({
          user: event.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }
    };

    window.addEventListener('message', handleExternalAuth);
    return () => window.removeEventListener('message', handleExternalAuth);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Since users are already authenticated by main SyncHubb app,
      // we'll try to get user data from localStorage first
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('authToken');
      
      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return;
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
        }
      }

      // If no localStorage data, try API call
      const apiToken = apiUtils.getToken();
      if (apiToken) {
        const response = await authService.getProfile();
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return;
      }

      // If no token found, assume user is authenticated anyway (embedded mode)
      // This prevents login page from showing when user is already authenticated by main app
      setAuthState({
        user: null,
        isAuthenticated: true, // Always true in embedded mode
        isLoading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Even if API fails, assume user is authenticated (embedded mode)
      setAuthState({
        user: null,
        isAuthenticated: true, // Always true in embedded mode
        isLoading: false,
        error: null
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Login not needed - user already authenticated by main app
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // Registration not needed - user already authenticated by main app
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiUtils.removeToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const response = await authService.updateProfile(data);
      setAuthState(prev => ({
        ...prev,
        user: response.data.user
      }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleError(error);
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      await authService.resetPassword(token, password);
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);
      setAuthState(prev => ({
        ...prev,
        user: response.data.user
      }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = apiUtils.handleError(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    clearError,
    checkAuthStatus
  };
}; 