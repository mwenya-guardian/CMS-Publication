import React from 'react';

interface GridLayoutProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  className = '',
  columns = 3,
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridClasses[columns]} ${className}`}>
      {children}
    </div>
  );
};