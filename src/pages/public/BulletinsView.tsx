import React, { useState, useEffect } from 'react';
import { ChurchBulletin, PublicationStatus } from '../../types/ChurchBulletin';
import { BulletinList } from '../../components/bulletin/BulletinList';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { bulletinService } from '../../services/bulletinService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';
import { Calendar, Clock, Users, Book, FileText, Eye, Download, Plus } from 'lucide-react';

export const BulletinsView: React.FC = () => {
  const [bulletins, setBulletins] = useState<ChurchBulletin[]>([]);
  const [selectedBulletin, setSelectedBulletin] = useState<ChurchBulletin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [layout, setLayout] = useState<LayoutType>('grid');

  useEffect(() => {
    fetchBulletins();
  }, []);
  // useEffect(() => {
  //   fetchBulletins();
  // }, [filters]);
  

  const fetchBulletins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bulletinService.getAll(filters);
      setBulletins(data);
    } catch (err) {
      setError('Failed to fetch bulletins');
      console.error('Error fetching bulletins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulletinClick = (bulletin: ChurchBulletin) => {
    setSelectedBulletin(bulletin);
    setShowModal(true);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleExport = async (bulletinId: string, format: 'pdf' | 'word') => {
    try {
      let blob: Blob;
      if (format === 'pdf') {
        blob = await bulletinService.exportToPdf(bulletinId);
      } else {
        blob = await bulletinService.exportToWord(bulletinId);
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin-${bulletinId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(`Error exporting ${format}:`, err);
    }
  };

  const getStatusColor = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case PublicationStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case PublicationStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchBulletins} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Church Bulletins</h1>
          <p className="text-gray-600 mt-2">View and manage church bulletins</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            variant="outline"
            size="sm"
          >
            {layout === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <DateFilterBar onFilterChange={handleFilterChange} />

      {/* Bulletins Grid/List */}
      {bulletins.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bulletins found</h3>
          <p className="text-gray-600">Create your first bulletin to get started.</p>
        </div>
      ) : (
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {bulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                layout === 'list' ? 'flex' : ''
              }`}
              onClick={() => handleBulletinClick(bulletin)}
            >
              {/* Cover/Header */}
              <div className={`bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 ${layout === 'list' ? 'w-1/3' : ''}`}>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{bulletin.title || 'Church Bulletin'}</h3>
                  <p className="text-blue-100 mb-2">
                    {new Date(bulletin.bulletinDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
                    {bulletin.status}
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div className={`p-6 ${layout === 'list' ? 'w-2/3' : ''}`}>
                {bulletin.cover && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{bulletin.cover.documentName}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{bulletin.cover.welcomeMessage}</p>
                  </div>
                )}

                {/* Schedules Preview */}
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

                {/* Announcements Preview */}
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

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBulletinClick(bulletin);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(bulletin.id, 'pdf');
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulletin Detail Modal */}
      {selectedBulletin && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedBulletin.title || 'Church Bulletin'}
          size="xl"
        >
          <div className="space-y-6">
            {/* Cover Section */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">{selectedBulletin.cover?.documentName || 'Church Bulletin'}</h2>
              <p className="text-blue-100 mb-4">
                {new Date(selectedBulletin.bulletinDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {selectedBulletin.cover?.welcomeMessage && (
                <p className="text-lg">{selectedBulletin.cover.welcomeMessage}</p>
              )}
            </div>

            {/* Schedules Section */}
            {selectedBulletin.schedules && selectedBulletin.schedules.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                  Order of Worship
                </h3>
                <div className="space-y-4">
                  {selectedBulletin.schedules.map((schedule, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">{schedule.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      </div>
                      
                      {/* Role Assignments */}
                      {schedule.roleAssignment && schedule.roleAssignment.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-700">Roles:</h5>
                          {schedule.roleAssignment.map((role, roleIndex) => (
                            <div key={roleIndex} className="flex items-center text-sm">
                              <Users className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="font-medium">{role.role}:</span>
                              <span className="ml-2">{role.participates.join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Activity Details */}
                      {schedule.activityDetails && Object.keys(schedule.activityDetails).length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h5 className="font-medium text-gray-700">Activities:</h5>
                          {Object.entries(schedule.activityDetails).map(([key, values]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span>
                              <span className="ml-2">{values.join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Announcements Section */}
            {selectedBulletin.announcements && selectedBulletin.announcements.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Announcements</h3>
                <div className="space-y-4">
                  {selectedBulletin.announcements.map((announcement, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{announcement.title}</h4>
                      <p className="text-gray-700">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* On Duty Section */}
            {selectedBulletin.onDutyList && selectedBulletin.onDutyList.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">On Duty Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBulletin.onDutyList.map((duty, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800">{duty.role}</h4>
                      {duty.activity && (
                        <p className="text-sm text-blue-600 mb-2">{duty.activity}</p>
                      )}
                      <p className="text-gray-700">{duty.participates.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => handleExport(selectedBulletin.id, 'pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport(selectedBulletin.id, 'word')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Word
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};