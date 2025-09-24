import React from 'react';
import { User, Calendar, Quote as QuoteIcon, Edit, Trash2, Eye } from 'lucide-react';
import { Quote } from '../../types/Quote';
import { dateUtils } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface QuoteCardProps {
  quote: Quote;
  layoutType?: 'grid' | 'list' | 'masonry';
  isAdmin?: boolean;
  onEdit?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
  onView?: (quote: Quote) => void;
  showReadMore?: boolean;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  layoutType = 'list',
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
  showReadMore = true,
  className = '',
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(quote);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(quote.id);
  };

  const handleView = () => {
    onView?.(quote);
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      inspirational: 'bg-primary-100 text-primary-800',
      motivational: 'bg-secondary-100 text-secondary-800',
      wisdom: 'bg-purple-100 text-purple-800',
      love: 'bg-pink-100 text-pink-800',
      life: 'bg-yellow-100 text-yellow-800',
      success: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group';

  if (layoutType === 'list') {
    return (
      <div className={`${baseClasses} ${className}`} onClick={handleView}>
        <div className="flex p-6">
          {quote.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={quote.imageUrl}
                alt={quote.author}
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>
          )}
          <div className={`flex-1 ${quote.imageUrl ? 'ml-6' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <QuoteIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-800 italic text-lg leading-relaxed">
                    "{quote.text}"
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4 mt-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {quote.author}
                  </div>
                  {quote.source && (
                    <span className="text-gray-500">— {quote.source}</span>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {dateUtils.formatDate(quote.createdAt)}
                  </div>
                  {quote.category && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(quote.category)}`}>
                      {quote.category}
                    </span>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit({} as React.MouseEvent)} icon={Edit}></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete({} as React.MouseEvent)} icon={Trash2}></Button>
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
      {quote.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={quote.imageUrl}
            alt={quote.author}
            className="w-full h-32 object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            <QuoteIcon className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
            <p className="text-gray-800 italic text-base leading-relaxed">
              "{quote.text}"
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="ghost" size="sm" onClick={() => handleEdit({} as React.MouseEvent)} icon={Edit} />
              <Button variant="ghost" size="sm" onClick={() => handleDelete({} as React.MouseEvent)} icon={Trash2} />
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center text-sm font-medium text-gray-900">
              <User className="w-4 h-4 mr-1" />
              {quote.author}
            </div>
            {quote.source && (
              <span className="text-sm text-gray-500">— {quote.source}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {dateUtils.formatDate(quote.createdAt)}
            </div>
            {quote.category && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(quote.category)}`}>
                {quote.category}
              </span>
            )}
          </div>
        </div>
        
        {!isAdmin && showReadMore && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" icon={Eye}>
              View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};