import React from 'react';
import { useApiInterceptors } from '../../services/api';

export const ApiInterceptorSetup: React.FC = () => {
  useApiInterceptors();
  return null; // This component doesn't render anything
};


