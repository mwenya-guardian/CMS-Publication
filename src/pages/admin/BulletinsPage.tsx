import React, { useState, useEffect } from 'react';
import { ChurchBulletin, PublicationStatus } from '../../types/ChurchBulletin';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter, FileText, Calendar, Download, Edit, Trash2, Eye, EyeOff, Clock } from 'lucide-react';
import { bulletinService } from '../../services/bulletinService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { BulletinEditor } from '../../components/bulletin/BulletinEditor';

export const BulletinsPage: React.FC = () => {
  const [bulletins, setBulletins] = useState<ChurchBulletin[]>([]);
  const [filteredBulletins, setFilteredBulletins] = useState<ChurchBulletin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<ChurchBulletin | undefined>();
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBulletins();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bulletins, filters]);

  const fetchBulletins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bulletinService.getAll(filters);
      setBulletins(data);
    } catch (err) {
      setError('Failed to fetch bulletins');
      console.error('Failed to fetch bulletins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bulletins];

    if (filters.date) {
      filtered = filtered.filter(bulletin => 
        bulletin.bulletinDate === filters.date
      );
    }

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(bulletin => 
        bulletin.bulletinDate >= filters.startDate! && 
        bulletin.bulletinDate <= filters.endDate!
      );
    }

    if (filters.status) {
      filtered = filtered.filter(bulletin => 
        bulletin.status === filters.status as PublicationStatus
      );
    }

    if (filters.authorId) {
      filtered = filtered.filter(bulletin => 
        bulletin.author?.id === filters.authorId
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(bulletin => 
        bulletin.title?.toLowerCase().includes(searchTerm) ||
        bulletin.content?.toLowerCase().includes(searchTerm) ||
        bulletin.cover?.documentName?.toLowerCase().includes(searchTerm) ||
        bulletin.cover?.welcomeMessage?.toLowerCase().includes(searchTerm) ||
        bulletin.announcements.some(a => 
          a.title.toLowerCase().includes(searchTerm) ||
          a.content.toLowerCase().includes(searchTerm)
        )
      );
    }

    setFilteredBulletins(filtered);
  };

  const handleCreate = () => {
    setSelectedBulletin(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (bulletin: ChurchBulletin) => {
    setSelectedBulletin(bulletin);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bulletin? This action cannot be undone.')) {
      try {
        await bulletinService.delete(id);
        await fetchBulletins();
      } catch (error) {
        console.error('Failed to delete bulletin:', error);
        setError('Failed to delete bulletin');
      }
    }
  };

  const handleSave = async (data: Partial<ChurchBulletin>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (selectedBulletin) {
        await bulletinService.update(selectedBulletin.id, data);
      } else {
        await bulletinService.create(data);
      }
      setIsEditorOpen(false);
      await fetchBulletins();
    } catch (error) {
      console.error('Failed to save bulletin:', error);
      setError('Failed to save bulletin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await bulletinService.publish(id);
      await fetchBulletins();
    } catch (error) {
      console.error('Failed to publish bulletin:', error);
      setError('Failed to publish bulletin');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await bulletinService.unpublish(id);
      await fetchBulletins();
    } catch (error) {
      console.error('Failed to unpublish bulletin:', error);
      setError('Failed to unpublish bulletin');
    }
  };

  const handleExportPdf = async (id: string) => {
    try {
      const blob = await bulletinService.exportToPdf(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulletin-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      setError('Failed to export PDF');
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
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

  const getStatusIcon = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.PUBLISHED:
        return <Eye className="w-4 h-4" />;
      case PublicationStatus.DRAFT:
        return <FileText className="w-4 h-4" />;
      case PublicationStatus.SCHEDULED:
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterOptions] !== undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulletin Management</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage church bulletins</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={hasActiveFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}
          >
            Filters
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleCreate}
          >
            New Bulletin
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-100">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bulletins</p>
              <p className="text-2xl font-semibold text-gray-900">{bulletins.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bulletins.filter(b => b.status === PublicationStatus.PUBLISHED).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-100">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bulletins.filter(b => b.status === PublicationStatus.DRAFT).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bulletins.filter(b => b.status === PublicationStatus.SCHEDULED).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {isFiltersOpen && (
        <DateFilterBar onFilterChange={handleFilterChange} />
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search bulletins by title, content, or announcements..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Select
            value={filters.status || ''}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value || undefined }))}
            options={[
              { value: '', label: 'All Statuses' },
              { value: PublicationStatus.DRAFT, label: 'Draft' },
              { value: PublicationStatus.PUBLISHED, label: 'Published' },
              { value: PublicationStatus.SCHEDULED, label: 'Scheduled' }
            ]}
            className="w-48"
          />
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Layout Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant={layoutType === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setLayoutType('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={layoutType === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setLayoutType('list')}
          >
            List View
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Showing {filteredBulletins.length} of {bulletins.length} bulletins
        </p>
      </div>

      {/* Bulletins Grid/List */}
      {filteredBulletins.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'No bulletins match your filters' : 'No bulletins found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters ? 'Try adjusting your filters or create a new bulletin.' : 'Create your first bulletin to get started.'}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Bulletin
            </Button>
          )}
        </div>
      ) : (
        <div className={layoutType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredBulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                layoutType === 'list' ? 'flex' : ''
              }`}
            >
              {/* Cover/Header */}
              <div className={`bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 ${layoutType === 'list' ? 'w-1/3' : ''}`}>
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
                    {getStatusIcon(bulletin.status)}
                    <span className="ml-1">{bulletin.status}</span>
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div className={`p-6 ${layoutType === 'list' ? 'w-2/3' : ''}`}>
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
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(bulletin)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  
                  {bulletin.status === PublicationStatus.DRAFT && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish(bulletin.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  
                  {bulletin.status === PublicationStatus.PUBLISHED && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnpublish(bulletin.id)}
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Unpublish
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportPdf(bulletin.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(bulletin.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <Modal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={selectedBulletin ? 'Edit Bulletin' : 'Create New Bulletin'}
          size="xl"
          className="max-w-7xl"
        >
          <BulletinEditor
            bulletin={selectedBulletin}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

// Simple Select component for status filtering
const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}> = ({ value, onChange, options, className = '' }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);