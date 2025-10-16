import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const OfflinePage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <WifiOff className="h-12 w-12 text-gray-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          It looks like you're not connected to the internet. Please check your connection and try again.
        </p>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRefresh}
            icon={RefreshCw}
            className="w-full"
          >
            Try Again
          </Button>
          
          <p className="text-sm text-gray-500">
            Some features may still be available offline
          </p>
        </div>
      </div>
    </div>
  );
};
