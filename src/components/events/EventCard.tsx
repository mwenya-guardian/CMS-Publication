import { Calendar, MapPin, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { Event } from '../../types/Event';
import { dateUtils } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface EventCardProps {
  event: Event;
  layoutType?: 'grid' | 'list';
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  onView?: (event: Event) => void;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  layoutType = 'grid',
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
  className = '',
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    console.log("Handle edit", event);
    e.stopPropagation();
    onEdit?.(event);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(event.id);
  };

  const handleView = () => {
    onView?.(event);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      wedding: 'bg-pink-100 text-pink-800',
      conference: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      social: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group';

  if (layoutType === 'list') {
    return (
      <div className={`${baseClasses} ${className}`} onClick={handleView}>
        <div className="flex p-6">
          {event.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-24 h-24 object-cover rounded-lg"
                loading='lazy'
              />
            </div>
          )}
          <div className={`flex-1 ${event.imageUrl ? 'ml-6' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {event.title}
                  </h3>
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {dateUtils.formatDate(event.startDate)}
                  </div>
                  {event.endDate && event.endDate !== event.startDate && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      to {dateUtils.formatDate(event.endDate)}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" onClick={handleEdit} icon={Edit} />
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
      {event.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
            loading='lazy'
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {event.title}
              </h3>
              {isAdmin && (
                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" onClick={handleEdit} icon={Edit} />
                  <Button variant="ghost" size="sm" onClick={handleDelete} icon={Trash2} />
                </div>
              )}
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {dateUtils.formatDate(event.startDate)}
            {event.endDate && event.endDate !== event.startDate && (
              <span className="ml-1">- {dateUtils.formatDate(event.endDate)}</span>
            )}
          </div>
          {event.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {event.location}
            </div>
          )}
        </div>
        {!isAdmin && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" icon={Eye}>
              View details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};