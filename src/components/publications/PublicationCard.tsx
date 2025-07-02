import React from 'react';
import { Calendar, User, Eye, Edit, Trash2 } from 'lucide-react';
import { Publication } from '../../types/Publication';
import { dateUtils } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface PublicationCardProps {
  publication: Publication;
  layoutType?: 'grid' | 'list' | 'masonry';
  isAdmin?: boolean;
  onEdit?: (publication: Publication) => void;
  onDelete?: (id: string) => void;
  onView?: (publication: Publication) => void;
  className?: string;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  layoutType = 'grid',
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
  className = '',
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    console.log("In card: ", publication);
    console.log("In card: event - ", e)
    e.stopPropagation();
    onEdit?.(publication);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(publication.id);
  };

  const handleView = () => {
    onView?.(publication);
  };

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group';

  if (layoutType === 'list') {
    return (
      <div className={`${baseClasses} ${className}`} onClick={handleView}>
        <div className="flex p-6">
          {publication.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={publication.imageUrl}
                alt={publication.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <div className={`flex-1 ${publication.imageUrl ? 'ml-6' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {publication.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{publication.content}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {dateUtils.formatDate(publication.date)}
                  </div>
                  {publication.author && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {publication.author}
                    </div>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" onClick={handleEdit} icon={Edit}  />
                  <Button variant="ghost" size="sm" onClick={handleDelete} icon={Trash2} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} overflow-hidden ${className}`} onClick={handleView}>
      {publication.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={publication.imageUrl}
            alt={publication.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
            {publication.title}
          </h3>
          {isAdmin && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="ghost" size="sm" onClick={handleEdit} icon={Edit} />
              <Button variant="ghost" size="sm" onClick={handleDelete} icon={Trash2} />
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{publication.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {dateUtils.formatDate(publication.date)}
            </div>
            {publication.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {publication.author}
              </div>
            )}
          </div>
          {!isAdmin && (
            <Button variant="ghost" size="sm" icon={Eye}>
              Read more
            </Button>
          )}
        </div>
        {publication.tags && publication.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {publication.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};