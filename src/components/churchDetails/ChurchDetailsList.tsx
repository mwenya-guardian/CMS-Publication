import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { churchDetailsService } from '../../services/churchDetailsService';
import { ChurchDetails } from '../../types/ChurchDetails';
import ChurchDetailsForm from './ChurchDetailsForm';

export const ChurchDetailsList: React.FC = () => {
  const [items, setItems] = useState<ChurchDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selected, setSelected] = useState<ChurchDetails | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await churchDetailsService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load church details', err);
      setError('Failed to load church details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelected(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: ChurchDetails) => {
    setSelected(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: ChurchDetails) => {
    if (!window.confirm('Delete this church details entry?')) return;
    try {
      await churchDetailsService.delete(item.id as string);
      await fetchAll();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (payload: any) => {
    try {
      setIsSubmitting(true);
      if (payload.id) {
        await churchDetailsService.update(payload);
      } else {
        await churchDetailsService.create(payload);
      }
      setIsFormOpen(false);
      await fetchAll();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save church details');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Church Details</h1>
          <p className="text-sm text-gray-600">Manage church location and contact information</p>
        </div>
        <div>
          <Button variant="primary" icon={Plus} onClick={handleCreate}>New Details</Button>
        </div>
      </div> */}

      {error && (
        <div className="text-red-600">{error}</div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center text-gray-600">
          No church details created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.address}</p>
                  {item.city && <p className="text-sm text-gray-500">City: {item.city}</p>}
                  {item.province && <p className="text-sm text-gray-500">Province: {item.province}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEdit(item)} />
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600" onClick={() => handleDelete(item)} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                {item.tel && <div><strong>Tel:</strong> <span className="ml-2">{item.tel}</span></div>}
                {item.email && <div><strong>Email:</strong> <span className="ml-2">{item.email}</span></div>}
                {item.website && <div><strong>Website:</strong> <span className="ml-2">{item.website}</span></div>}
                {item.poBox && <div><strong>P.O. Box:</strong> <span className="ml-2">{item.poBox}</span></div>}
                {item.cell && item.cell.length > 0 && (
                  <div className="sm:col-span-2">
                    <strong>Mobile(s):</strong>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {item.cell.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selected ? 'Edit Church Details' : 'Create Church Details'}
        size="xl"
      >
        <ChurchDetailsForm
          details={selected}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
          // className='max-w-8xl min-w-2xl'
        />
      </Modal>
    </div>
  );
};

export default ChurchDetailsList;
