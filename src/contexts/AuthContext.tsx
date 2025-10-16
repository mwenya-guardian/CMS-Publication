import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, LoginRequest } from '../types/User';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // tokenMemo: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [accessToken, setAccessToken] = useState<string | null>(null);


  // const tokenMemo = useMemo(
  //   () => ({ accessToken, setAccessToken }),
  //   [accessToken]
  // );
  

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated() && !authService.isExpired()) {
          const storedUser = authService.getStoredUser();
          const token = localStorage.getItem('authToken');
          if (storedUser && token) {
            setUser(storedUser);
            // Optionally refresh user data from server
            try {
              const currentUser = await authService.getCurrentUser();
              setUser(currentUser);
              localStorage.setItem('user', JSON.stringify(currentUser));
            } catch (error) {
              console.warn('Failed to refresh user data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("credentials", credentials);
      const loginResponse = await authService.login(credentials);
      authService.storeAuthData(loginResponse);
      setUser(loginResponse.user);
      // setAccessToken(loginResponse.token);
      
      // Redirect based on user role after successful login
      if (loginResponse.user.role === 'USER') {
        window.location.href = '/user';
      } else {
        window.location.href = '/admin';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      // setAccessToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server request fails
      setUser(null);
      // setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    // tokenMemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};