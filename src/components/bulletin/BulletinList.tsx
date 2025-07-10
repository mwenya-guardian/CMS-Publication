import React, { useState, useEffect } from 'react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { BulletinCard } from './BulletinCard';
import { GridLayout } from '../layoutOptions/GridLayout';
import { ListLayout } from '../layoutOptions/ListLayout';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { Grid, List, FileText } from 'lucide-react';
import { FilterOptions, LayoutType } from '../../types/Common';

interface BulletinListProps {
  bulletins: ChurchBulletin[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onEdit?: (bulletin: ChurchBulletin) => void;
  onDelete?: (id: string) => void;
  onView?: (bulletin: ChurchBulletin) => void;
  onPublish?: (id: string) => void;
  onExportPdf?: (id: string) => void;
  onDownloadPdf?: (bulletin: ChurchBulletin) => void;
  filters?: FilterOptions;
  layoutType?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
  className?: string;
}

export const BulletinList: React.FC<BulletinListProps> = ({
  bulletins,
  isLoading = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
  onPublish,
  onExportPdf,
  onDownloadPdf,
  layoutType = 'grid',
  onLayoutChange,
  className = '',
}) => {
  const [groupedBulletins, setGroupedBulletins] = useState<{ [year: string]: ChurchBulletin[] }>({});

  useEffect(() => {
    const grouped = bulletins.reduce((acc, bulletin) => {
      const year = new Date(bulletin.bulletinDate).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(bulletin);
      return acc;
    }, {} as { [year: string]: ChurchBulletin[] });

    // Sort bulletins within each year by date (newest first)
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => new Date(b.bulletinDate).getTime() - new Date(a.bulletinDate).getTime());
    });

    setGroupedBulletins(grouped);
  }, [bulletins]);

  const renderBulletins = (bulletinList: ChurchBulletin[]) => {
    const cards = bulletinList.map((bulletin) => (
      <BulletinCard
        key={bulletin.id}
        bulletin={bulletin}
        layoutType={layoutType === 'masonry' ? 'grid' : layoutType}
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onPublish={onPublish}
        onExportPdf={onExportPdf}
        onDownloadPdf={onDownloadPdf}
      />
    ));

    if (layoutType === 'list') {
      return <ListLayout>{cards}</ListLayout>;
    } else {
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

  if (bulletins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FileText className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bulletins found</h3>
        <p className="text-gray-600">
          {isAdmin ? 'Create your first bulletin to get started.' : 'No bulletins match your current filters.'}
        </p>
      </div>
    );
  }

  const years = Object.keys(groupedBulletins).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className={className}>
      {onLayoutChange && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {bulletins.length} Bulletin{bulletins.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Layout:</span>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={layoutType === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('grid')}
                icon={Grid}
                children={<Grid />}
              />
              <Button
                variant={layoutType === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('list')}
                icon={List}
                children={<List />}
              />
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
                {groupedBulletins[year].length} bulletin{groupedBulletins[year].length !== 1 ? 's' : ''}
              </span>
            </div>
            {renderBulletins(groupedBulletins[year])}
          </div>
        ))}
      </div>
    </div>
  );
};