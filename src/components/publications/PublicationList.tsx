import React, { useState, useEffect } from 'react';
import { Publication } from '../../types/Publication';
import { PublicationCard } from './PublicationCard';
import { GridLayout } from '../layoutOptions/GridLayout';
import { ListLayout } from '../layoutOptions/ListLayout';
import { MasonryLayout } from '../layoutOptions/MasonryLayout';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { Grid, List, Grid3X3, Filter } from 'lucide-react';
import { FilterOptions, LayoutType } from '../../types/Common';

interface PublicationListProps {
  publications: Publication[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onEdit?: (publication: Publication) => void;
  onDelete?: (id: string) => void;
  onView?: (publication: Publication) => void;
  filters?: FilterOptions;
  layoutType?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
  className?: string;
}

export const PublicationList: React.FC<PublicationListProps> = ({
  publications,
  isLoading = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
  layoutType = 'grid',
  onLayoutChange,
  className = '',
}) => {
  const [groupedPublications, setGroupedPublications] = useState<{ [year: string]: Publication[] }>({});

  useEffect(() => {
    const grouped = publications.reduce((acc, publication) => {
      const year = new Date(publication.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(publication);
      return acc;
    }, {} as { [year: string]: Publication[] });

    // Sort publications within each year by date (newest first)
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    setGroupedPublications(grouped);
  }, [publications]);

  const renderPublications = (pubs: Publication[]) => {
    const cards = pubs.map((publication) => (
      <PublicationCard
        key={publication.id}
        publication={publication}
        layoutType={layoutType}
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ));

    switch (layoutType) {
      case 'list':
        return <ListLayout>{cards}</ListLayout>;
      case 'masonry':
        return <MasonryLayout columns={3}>{cards}</MasonryLayout>;
      case 'grid':
      default:
        return <GridLayout columns={3}>{cards}</GridLayout>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Grid className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
        <p className="text-gray-600">
          {isAdmin ? 'Create your first publication to get started.' : 'No publications match your current filters.'}
        </p>
      </div>
    );
  }

  const years = Object.keys(groupedPublications).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className={className}>
      {onLayoutChange && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {publications.length} Publication{publications.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Layout:</span>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={layoutType === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('grid')}
                icon={Grid} children={undefined}              />
              <Button
                variant={layoutType === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('list')}
                icon={List} children={undefined}              />
              <Button
                variant={layoutType === 'masonry' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('masonry')}
                icon={Grid3X3} children={undefined}              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {years.map((year) => (
          <div key={year}>
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{year}</h3>
              <div className="ml-4 flex-1 h-px bg-gray-200" />
              <span className="ml-4 text-sm text-gray-600">
                {groupedPublications[year].length} publication{groupedPublications[year].length !== 1 ? 's' : ''}
              </span>
            </div>
            {renderPublications(groupedPublications[year])}
          </div>
        ))}
      </div>
    </div>
  );
};