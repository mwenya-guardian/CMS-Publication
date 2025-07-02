import React, { useState, useEffect } from 'react';
import { Publication } from '../../types/Publication';
import { PublicationList } from '../../components/publications/PublicationList';
import { PublicationForm } from '../../components/publications/PublicationForm';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter } from 'lucide-react';
import { publicationService } from '../../services/publicationService';
import { LayoutType, FilterOptions } from '../../types/Common';

export const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | undefined>();
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [publications, filters]);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const data = await publicationService.getAll();
      setPublications(data);
    } catch (error) {
      console.error('Failed to fetch publications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...publications];

    if (filters.year) {
      filtered = filtered.filter(pub => 
        new Date(pub.date).getFullYear() === filters.year
      );
    }

    if (filters.month) {
      filtered = filtered.filter(pub => 
        new Date(pub.date).getMonth() + 1 === filters.month
      );
    }

    if (filters.day) {
      filtered = filtered.filter(pub => 
        new Date(pub.date).getDate() === filters.day
      );
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(pub => pub.featured === filters.featured);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(searchTerm) ||
        pub.content.toLowerCase().includes(searchTerm) ||
        pub.author?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredPublications(filtered);
  };

  const handleCreate = () => {
    setSelectedPublication(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (publication: Publication) => {
    console.log("In Page: ", publication);
    setSelectedPublication(publication);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await publicationService.delete(id);
        await fetchPublications();
      } catch (error) {
        console.error('Failed to delete publication:', error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try { 
      setIsSubmitting(true);
      if (selectedPublication) {
        await publicationService.update(data);
      } else {
        await publicationService.create(data);
      }
      setIsFormModalOpen(false);
      await fetchPublications();
    } catch (error) {
      console.error('Failed to save publication:', error);
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
          <p className="text-gray-600 mt-1">Manage your publication content</p>
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
            New Publication
          </Button>
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

      {/* Publications List */}
      <PublicationList
        publications={filteredPublications}
        isLoading={isLoading}
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        layoutType={layoutType}
        onLayoutChange={setLayoutType}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedPublication ? 'Edit Publication' : 'Create Publication'}
        size="xl"
      >
        <PublicationForm
          publication={selectedPublication}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};