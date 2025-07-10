import React from 'react';
import { Calendar, MapPin, Clock, Edit, Trash2, Eye, Download, Send, FileText } from 'lucide-react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { dateUtils } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface BulletinCardProps {
  bulletin: ChurchBulletin;
  layoutType?: 'grid' | 'list';
  isAdmin?: boolean;
  onEdit?: (bulletin: ChurchBulletin) => void;
  onDelete?: (id: string) => void;
  onView?: (bulletin: ChurchBulletin) => void;
  onPublish?: (id: string) => void;
  onExportPdf?: (id: string) => void;
  onDownloadPdf?: (bulletin: ChurchBulletin) => void;
  className?: string;
}

export const BulletinCard: React.FC<BulletinCardProps> = ({
  bulletin,
  layoutType = 'grid',
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
  onPublish,
  onExportPdf,
  onDownloadPdf,
  className = '',
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(bulletin);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(bulletin.id);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPublish?.(bulletin.id);
  };

  const handleExportPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExportPdf?.(bulletin.id);
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadPdf?.(bulletin);
  };

  const handleView = () => {
    onView?.(bulletin);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group';

  if (layoutType === 'list') {
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
                    {bulletin.churchInfo.name} - {dateUtils.formatDate(bulletin.bulletinDate)}
                  </h3>
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
                    {bulletin.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{bulletin.coverContent.welcomeMessage}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {dateUtils.formatDate(bulletin.bulletinDate)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {bulletin.churchInfo.address}
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {bulletin.services.length} services
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" onClick={handleEdit} icon={Edit} />
                  {bulletin.status === 'draft' && (
                    <Button variant="ghost" size="sm" onClick={handlePublish} icon={Send} />
                  )}
                  <Button variant="ghost" size="sm" onClick={handleExportPdf} icon={Download} />
                  <Button variant="ghost" size="sm" onClick={handleDelete} icon={Trash2} />
                </div>
              )}
              {!isAdmin && (
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" onClick={handleDownloadPdf} icon={Download} />
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
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-12 bg-primary-100 rounded flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  Church Bulletin
                </h3>
                <p className="text-sm text-gray-600">{bulletin.churchInfo.name}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
              {bulletin.status}
            </span>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="ghost" size="sm" onClick={handleEdit} icon={Edit} />
              {bulletin.status === 'draft' && (
                <Button variant="ghost" size="sm" onClick={handlePublish} icon={Send} />
              )}
              <Button variant="ghost" size="sm" onClick={handleExportPdf} icon={Download} />
              <Button variant="ghost" size="sm" onClick={handleDelete} icon={Trash2} />
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{bulletin.coverContent.welcomeMessage}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {dateUtils.formatDate(bulletin.bulletinDate)}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {bulletin.churchInfo.address}
          </div>
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            {bulletin.services.length} services, {bulletin.announcements.length} announcements
          </div>
        </div>
        
        {!isAdmin && (
          <div className="mt-4 flex justify-between items-center">
            <Button variant="ghost" size="sm" icon={Eye}>
              View details
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadPdf} icon={Download}>
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};