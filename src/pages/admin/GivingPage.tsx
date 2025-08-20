import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter } from 'lucide-react';
import givingService from '../../services/givingService';
import GivingList from '../../components/giving/GivingList';
import GivingForm from '../../components/giving/GivingForm';
import { Giving } from '../../types/Giving';
import { LayoutType, FilterOptions } from '../../types/Common';

export const GivingPage: React.FC = () => {
  const [givings, setGivings] = useState<Giving[]>([]);
  const [filteredGivings, setFilteredGivings] = useState<Giving[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedGiving, setSelectedGiving] = useState<Giving | undefined>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGivings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [givings, filters]);

  const fetchGivings = async () => {
    try {
      setIsLoading(true);
      const data = await givingService.getAll();
      setGivings(data ?? []);
    } catch (err) {
      console.error('Failed to fetch giving items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...givings];

    // search via filters.search (title / method)
    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        (g.method || []).some(m => m.toLowerCase().includes(q))
      );
    }

    // filter by method (exact match) if provided
    if (filters.category) {
      const category = String(filters.category).toLowerCase();
      list = list.filter(g => (g.method || []).map(m => m.toLowerCase()).includes(category));
    }

    setFilteredGivings(list);
  };

  const handleCreate = () => {
    setSelectedGiving(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (giving: Giving) => {
    setSelectedGiving(giving);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this giving entry?')) return;
    try {
      await givingService.delete(id);
      await fetchGivings();
    } catch (err) {
      console.error('Failed to delete giving:', err);
    }
  };

  const handleFormSubmit = async (payload: any) => {
    try {
      setIsSubmitting(true);

      // payload will be either GivingRequest or UpdateGivingRequest
      if ((payload as Giving).id) {
        // Update
        await givingService.update(payload as any);
      } else {
        // Create
        await givingService.create(payload as any);
      }

      setIsFormModalOpen(false);
      await fetchGivings();
    } catch (err) {
      console.error('Failed to save giving:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => setFilters({});

  const hasActiveFilters = Object.keys(filters).some(k => filters[k as keyof FilterOptions] !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giving</h1>
          <p className="text-gray-600 mt-1">Manage tithe & offering methods and giving arrangements</p>
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
            New Giving
          </Button>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mb-4 bg-white rounded-md p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search giving title or method..."
                value={String(filters.search ?? '')}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleClearFilters}>Clear</Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <GivingList
          givings={filteredGivings}
          isLoading={isLoading}
          isAdmin={true}
          onView={(g) => { /* optional view handler */ }}
          onEdit={handleEdit}
          onDelete={(id) => handleDelete(id)}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />
      </div>

      {!isLoading && filteredGivings.length === 0 && (
        <div className="text-center py-12">
          <Button variant="outline" onClick={handleCreate}>Add Giving Method</Button>
        </div>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedGiving ? 'Edit Giving' : 'Create Giving'}
        size="md"
      >
        <GivingForm
          giving={selectedGiving}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default GivingPage;
