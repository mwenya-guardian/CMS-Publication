import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter } from 'lucide-react';
import { churchDetailsService } from '../../services/churchDetailsService';
import { ChurchDetailsList } from '../../components/churchDetails/ChurchDetailsList';
import { ChurchDetailsForm } from '../../components/churchDetails/ChurchDetailsForm';
import { ChurchDetails } from '../../types/ChurchDetails';
import { LayoutType, FilterOptions } from '../../types/Common';

export const ChurchDetailsPage: React.FC = () => {
  const [details, setDetails] = useState<ChurchDetails[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<ChurchDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ChurchDetails | undefined>();
  // const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [details, filters]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const data = await churchDetailsService.getAll();
      setDetails(data ?? []);
    } catch (err) {
      console.error('Failed to fetch church details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...details];

    // search via filters.search (name / address / city)
    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      list = list.filter(d =>
        (d.name || '').toLowerCase().includes(q) ||
        (d.address || '').toLowerCase().includes(q) ||
        (d.city || '').toLowerCase().includes(q)
      );
    }

    setFilteredDetails(list);
  };

  const handleCreate = () => {
    setSelectedDetail(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (detail: ChurchDetails) => {
    setSelectedDetail(detail);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await churchDetailsService.delete(id);
      await fetchDetails();
    } catch (err) {
      console.error('Failed to delete church detail:', err);
    }
  };

  const handleFormSubmit = async (payload: any) => {
    try {
      setIsSubmitting(true);

      // payload will be either CreateChurchDetailsRequest or UpdateChurchDetailsRequest
      if ((payload as ChurchDetails).id) {
        // Update
        await churchDetailsService.update(payload as any);
      } else {
        // Create
        await churchDetailsService.create(payload as any);
      }

      setIsFormModalOpen(false);
      await fetchDetails();
    } catch (err) {
      console.error('Failed to save church details:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => setFilters({});

  const hasActiveFilters = Object.keys(filters).some(k => filters[k as keyof FilterOptions] !== undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Church Details</h1>
          <p className="text-gray-600 mt-1">Manage church location, contact information and website</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* <Button
            variant="outline"
            icon={Filter}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={hasActiveFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}
          >
            Filters
          </Button> */}

          <Button
            variant="primary"
            icon={Plus}
            onClick={handleCreate}
          >
            New Details
          </Button>
        </div>
      </div>
{/* 
      {isFiltersOpen && (
        <div className="mb-4 bg-white rounded-md p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search name, address or city..."
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
      )} */}

      <div>
        <ChurchDetailsList
          {...{
            details: filteredDetails,
            isLoading,
            isAdmin: true,
            onEdit: handleEdit,
            onDelete: handleDelete,
            layoutType,
            onLayoutChange: setLayoutType
          } as any}
        />
      </div>

      {!isLoading && filteredDetails.length === 0 && (
        <div className="text-center py-12">
          <Button variant="outline" onClick={handleCreate}>Add Church Details</Button>
        </div>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedDetail ? 'Edit Church Details' : 'Create Church Details'}
        size="xl"
      >
        <ChurchDetailsForm
          details={selectedDetail}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ChurchDetailsPage;
