import React, { createContext, useContext, useState, useEffect } from 'react';
import { pwaService } from '../services/pwaService';
import { PWAUpdatePrompt } from '../components/common/PWAUpdatePrompt';

interface PWAContextType {
  isUpdateAvailable: boolean;
  updateApp: () => void;
  dismissUpdate: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    pwaService.register();
    
    pwaService.onUpdateAvailable(() => {
      setIsUpdateAvailable(true);
    });
  }, []);

  const updateApp = () => {
    pwaService.update();
  };

  const dismissUpdate = () => {
    pwaService.dismissUpdate();
    setIsUpdateAvailable(false);
  };

  const value = {
    isUpdateAvailable,
    updateApp,
    dismissUpdate,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
      {isUpdateAvailable && (
        <PWAUpdatePrompt
          onUpdate={updateApp}
          onDismiss={dismissUpdate}
        />
      )}
    </PWAContext.Provider>
  );
};
