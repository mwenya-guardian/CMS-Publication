import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedAdminRoutesProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoutes: React.FC<ProtectedAdminRoutesProps> = ({ children }) => {
  const {isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user?.role?.toUpperCase() !== 'ADMIN') {
    // Redirect to admin page with return url
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};