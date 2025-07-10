import React, { useState, useEffect } from 'react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { BulletinList } from '../../components/bulletin/BulletinList';
import { BulletinEditor } from '../../components/bulletin/BulletinEditor';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Plus, Filter, FileText, Calendar, Download } from 'lucide-react';
import { bulletinService } from '../../services/bulletinService';
import { LayoutType, FilterOptions } from '../../types/Common';

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

  useEffect(() => {
    fetchBulletins();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bulletins, filters]);

  const fetchBulletins = async () => {
    try {
      setIsLoading(true);
      const data = await bulletinService.getAll();
      setBulletins(data);
    } catch (error) {
      console.error('Failed to fetch bulletins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bulletins];

    if (filters.year) {
      filtered = filtered.filter(bulletin => 
        new Date(bulletin.bulletinDate).getFullYear() === filters.year
      );
    }

    if (filters.month) {
      filtered = filtered.filter(bulletin => 
        new Date(bulletin.bulletinDate).getMonth() + 1 === filters.month
      );
    }

    if (filters.day) {
      filtered = filtered.filter(bulletin => 
        new Date(bulletin.bulletinDate).getDate() === filters.day
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(bulletin => 
        bulletin.churchInfo.name.toLowerCase().includes(searchTerm) ||
        bulletin.coverContent.welcomeMessage.toLowerCase().includes(searchTerm) ||
        bulletin.announcements.some(a => 
          a.title.toLowerCase().includes(searchTerm) ||
          a.description.toLowerCase().includes(searchTerm)
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
    if (window.confirm('Are you sure you want to delete this bulletin?')) {
      try {
        await bulletinService.delete(id);
        await fetchBulletins();
      } catch (error) {
        console.error('Failed to delete bulletin:', error);
      }
    }
  };

  const handleSave = async (data: Partial<ChurchBulletin>) => {
    try {
      setIsSubmitting(true);
      if (selectedBulletin) {
        await bulletinService.update(selectedBulletin.id, data);
      } else {
        await bulletinService.create(data);
      }
      setIsEditorOpen(false);
      await fetchBulletins();
    } catch (error) {
      console.error('Failed to save bulletin:', error);
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
    }
  };

  const handleFilterDate = (year?: number, month?: number, day?: number) => {
    setFilters(prev => ({ ...prev, year, month, day }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterOptions] !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Church Bulletins</h1>
          <p className="text-gray-600 mt-1">Manage weekly church bulletins and worship schedules</p>
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
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bulletins.filter(b => b.status === 'published').length}
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
                {bulletins.filter(b => b.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100">
              <Download className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Year</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bulletins.filter(b => new Date(b.bulletinDate).getFullYear() === new Date().getFullYear()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {isFiltersOpen && (
        <DateFilterBar
          year={filters.year}
          month={filters.month}
          day={filters.day}
          onYearChange={(year) => handleFilterDate(year, filters.month, filters.day)}
          onMonthChange={(month) => handleFilterDate(filters.year, month, filters.day)}
          onDayChange={(day) => handleFilterDate(filters.year, filters.month, day)}
          onClear={handleClearFilters}
        />
      )}

      {/* Bulletins List */}
      <BulletinList
        bulletins={filteredBulletins}
        isLoading={isLoading}
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onExportPdf={handleExportPdf}
        layoutType={layoutType}
        onLayoutChange={setLayoutType}
      />

      {/* Editor Modal */}
      {isEditorOpen && (
        <Modal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={selectedBulletin ? 'Edit Bulletin' : 'Create Bulletin'}
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