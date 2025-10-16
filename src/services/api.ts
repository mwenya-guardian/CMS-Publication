import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom hook to setup API interceptors
export const useApiInterceptors = () => {
  const { logout } = useAuth(); // tokenMemo,
  const interceptorsSetup = useRef(false);

  useEffect(() => {
    if (interceptorsSetup.current) return;

    // Request interceptor to add auth token
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // const token = tokenMemo.accessToken;
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const status = error?.response?.status;
        const requestUrl: string = error?.config?.url || '';
        const isLogoutRequest = requestUrl.includes('/auth/logout');

        if (status === 401 && !isLogoutRequest) {
          // Clear local storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('expiresAt');

          // Logout user
          logout();
          
          // Redirect to login if on admin pages
          if (window.location.href.includes("admin")) {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );

    interceptorsSetup.current = true;

    // Cleanup function to remove interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
      interceptorsSetup.current = false;
    };
  }, [logout]); //tokenMemo.accessToken,
};

export default api;