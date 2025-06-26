import React from 'react';

interface ListLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ListLayout: React.FC<ListLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};