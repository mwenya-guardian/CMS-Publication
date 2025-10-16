import React, { Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyLoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoadingWrapper: React.FC<LazyLoadingWrapperProps> = ({ 
  children, 
  fallback = <LoadingSpinner size="lg" />
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          {fallback}
        </div>
      }>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
