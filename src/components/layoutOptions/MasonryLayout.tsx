import React from 'react';

interface MasonryLayoutProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  children,
  className = '',
  columns = 3,
}) => {
  const childrenArray = React.Children.toArray(children);
  const columnArrays: React.ReactNode[][] = Array(columns).fill(null).map(() => []);

  // Distribute children across columns
  childrenArray.forEach((child, index) => {
    const columnIndex = index % columns;
    columnArrays[columnIndex].push(child);
  });

  return (
    <div className={`flex gap-4 ${className}`} style={{ alignItems: 'start' }}>
      {columnArrays.map((columnChildren, columnIndex) => (
        <div key={columnIndex} className="flex-1 space-y-4">
          {columnChildren}
        </div>
      ))}
    </div>
  );
};