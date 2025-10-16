import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { RefreshCw, X } from 'lucide-react';

interface PWAUpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ onUpdate, onDismiss }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <RefreshCw className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            New version available
          </p>
          <p className="text-sm text-gray-500 mt-1">
            A new version of the app is available. Update now to get the latest features.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onUpdate}
          className="flex-1"
        >
          Update Now
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onDismiss}
          className="flex-1"
        >
          Later
        </Button>
      </div>
    </div>
  );
};
