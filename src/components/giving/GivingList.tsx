import React from 'react';
import { Edit, Trash2, Tag, CreditCard, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Giving } from '../../types/Giving';
import { LayoutType } from '../../types/Common';

interface GivingListProps {
  givings: Giving[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onView?: (giving: Giving) => void;
  onEdit?: (giving: Giving) => void;
  onDelete?: (id: string) => void;
  layoutType?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

export default function GivingList({
  givings = [],
  isLoading = false,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
  layoutType = 'grid',
  onLayoutChange
}: GivingListProps): JSX.Element {
  const renderEmpty = () => (
    <div className="text-center py-12 text-gray-600">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No giving methods found</h3>
      <p className="text-gray-600">Create a new giving arrangement to display it here.</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!givings || givings.length === 0) {
    return renderEmpty();
  }

  const GivingCard: React.FC<{ giving: Giving; layout: LayoutType }> = ({ giving, layout }) => {
    const methodsPreview = (giving.method || []).slice(0, 3).join(' • ');
    return (
      <article
        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
          layout === 'list' ? 'flex items-center' : ''
        }`}
      >
        <div className={`p-4 flex items-center justify-center ${layout === 'list' ? 'w-1/4' : ''}`}>
          <div className="w-20 h-20 rounded-md bg-gray-50 flex items-center justify-center border">
            <CreditCard className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className={`${layout === 'list' ? 'w-3/4 p-4' : 'p-4'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{giving.title}</h4>
              <div className="text-sm text-gray-600 mt-1">{methodsPreview || 'No methods specified'}</div>
              {giving.method && giving.method.length > 3 && (
                <div className="text-xs text-gray-500 mt-1">+{giving.method.length - 3} more</div>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-start gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(giving);
                  }}
                  icon={Edit}
                >
                  {/* Edit */}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete && giving.id) onDelete(giving.id);
                  }}
                  icon={Trash2}
                  className="text-red-600"
                >
                  {/* Delete */}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span>{giving.method ? `${giving.method.length} method(s)` : '0 methods'}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-4">
      {/* layout controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {givings.length} giving item{givings.length !== 1 ? 's' : ''}</div>

        {onLayoutChange && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLayoutChange('grid')}
              className={`px-2 py-1 rounded ${layoutType === 'grid' ? 'bg-gray-100' : ''}`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              onClick={() => onLayoutChange('list')}
              className={`px-2 py-1 rounded ${layoutType === 'list' ? 'bg-gray-100' : ''}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* list/grid */}
      {layoutType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {givings.map((giving) => (
            <div key={giving.id} onClick={() => onView && onView(giving)}>
              <GivingCard giving={giving} layout="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {givings.map((giving) => (
            <div key={giving.id} onClick={() => onView && onView(giving)}>
              <GivingCard giving={giving} layout="list" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
