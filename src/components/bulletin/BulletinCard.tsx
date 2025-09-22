import React from 'react';
import { Calendar, MapPin, Clock, Edit, Trash2, Eye, Download, Send, FileText } from 'lucide-react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { dateUtils } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface BulletinCardProps {
  bulletin: ChurchBulletin;
  layoutType?: 'grid' | 'list';
  // isAdmin?: boolean;
  // onEdit?: (bulletin: ChurchBulletin) => void;
  // onDelete?: (id: string) => void;
  onView?: (bulletin: ChurchBulletin) => void;
  // onPublish?: (id: string) => void;
  onExportPdf?: (id: string, format: 'pdf') => Promise<void>;
  onGenerate?: ()=> void;
  // onDownloadPdf?: (bulletin: ChurchBulletin) => void;
  className?: string;
}

export const BulletinCard: React.FC<BulletinCardProps> = ({
  bulletin,
  layoutType = 'grid',
  onView,
  onExportPdf,
  onGenerate,
  className = '',
}) => {

  const handleExport = (format: string) => {
    onExportPdf?.(bulletin?.id, format);
  }
  const handleView = () => {
    onView?.(bulletin);
  };
  const handleGenerate = () => {
    onGenerate?.();
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group';

  if (layoutType === 'list' && false) {
    return (
      <div className={`${baseClasses} ${className}`} onClick={handleView}>
        <div className="flex p-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="flex-1 ml-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {bulletin?.cover?.documentName} - {dateUtils.formatDate(bulletin.bulletinDate)}
                  </h3>
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
                    {bulletin.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{bulletin?.cover?.welcomeMessage}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {dateUtils.formatDate(bulletin.bulletinDate)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {bulletin?.cover?.footerMessage}
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {bulletin.schedules.length} schedules
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} overflow-hidden ${className}`} onClick={handleView}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-12 bg-primary-100 rounded flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  Bulletin
                </h3>
                <p className="text-sm text-gray-600">{bulletin.title}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
              {bulletin.status}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{bulletin.cover?.welcomeMessage}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {dateUtils.formatDate(bulletin.bulletinDate)}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {bulletin.cover?.footerMessage}
          </div>
                {/* Schedules preview */}
                {bulletin.schedules && bulletin.schedules.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Services ({bulletin.schedules.length})
                    </h5>
                    <div className="space-y-1">
                      {bulletin.schedules.slice(0, 2).map((schedule, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <span className="font-medium">{schedule.title}</span>
                          <span className="ml-2">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                      ))}
                      {bulletin.schedules.length > 2 && (
                        <p className="text-xs text-gray-500">+{bulletin.schedules.length - 2} more services</p>
                      )}
                    </div>
                  </div>
                )}

          {/* Announcements preview */}
          {bulletin.announcements && bulletin.announcements.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">Announcements ({bulletin.announcements.length})</h5>
                    <div className="space-y-1">
                      {bulletin.announcements.slice(0, 2).map((announcement, index) => (
                        <div key={index} className="text-sm text-gray-600 truncate">
                          {announcement.title}
                        </div>
                      ))}
                      {bulletin.announcements.length > 2 && (
                        <p className="text-xs text-gray-500">+{bulletin.announcements.length - 2} more announcements</p>
                      )}
                    </div>
                  </div>
          )}
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            {bulletin.schedules.length} services, {bulletin.announcements.length} announcements
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView();
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport('pdf');
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
      </div>
    </div>
  );
};