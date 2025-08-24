import React, { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ChurchDetails, CreateChurchDetailsRequest, UpdateChurchDetailsRequest } from '../../types/ChurchDetails';

interface ChurchDetailsFormProps {
  details?: ChurchDetails;
  onSubmit: (payload: CreateChurchDetailsRequest | UpdateChurchDetailsRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ChurchDetailsForm: React.FC<ChurchDetailsFormProps> = ({
  details,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [form, setForm] = useState<CreateChurchDetailsRequest>({
    name: '',
    address: '',
    poBox: '',
    city: '',
    province: '',
    country: '',
    tel: '',
    cell: [],
    email: '',
    website: ''
  });

  const [cellInput, setCellInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (details) {
      setForm({
        name: details.name ?? '',
        address: details.address ?? '',
        poBox: details.poBox ?? '',
        city: details.city ?? '',
        province: details.province ?? '',
        country: details.country ?? '',
        tel: details.tel ?? '',
        cell: details.cell ?? [],
        email: details.email ?? '',
        website: details.website ?? ''
      });
    } else {
      setForm({
        name: '',
        address: '',
        poBox: '',
        city: '',
        province: '',
        country: '',
        tel: '',
        cell: [],
        email: '',
        website: ''
      });
    }
  }, [details]);

  const handleChange = (field: keyof CreateChurchDetailsRequest, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const handleAddCell = () => {
    const trimmed = cellInput.trim();
    if (!trimmed) return;
    setForm(prev => ({ ...prev, cell: [...(prev.cell || []), trimmed] }));
    setCellInput('');
  };

  const handleRemoveCell = (idx: number) => {
    setForm(prev => ({ ...prev, cell: (prev.cell || []).filter((_, i) => i !== idx) }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.address?.trim()) e.address = 'Address is required';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;

    try {
      if ((details && (details.id || details.id === '')) || (details && details.id === undefined && (details as any)._id)) {
        // update flow
        const payload: UpdateChurchDetailsRequest = {
          id: (details as ChurchDetails).id as string,
          ...form
        };
        await onSubmit(payload);
      } else {
        // create flow
        const payload: CreateChurchDetailsRequest = { ...form };
        await onSubmit(payload);
      }
    } catch (err) {
      // let parent handle errors; optionally display generic
      console.error('Save church details error', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-8xl w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(v) => handleChange('name', v)}
          placeholder="Church name"
          error={errors.name}
        />

        <Input
          label="Address"
          required
          value={form.address}
          onChange={(v) => handleChange('address', v)}
          placeholder="Street, area, zip"
          error={errors.address}
        />

        <Input
          label="P.O. Box"
          value={form.poBox || ''}
          onChange={(v) => handleChange('poBox', v)}
          placeholder="P.O. Box"
        />

        <Input
          label="City"
          value={form.city || ''}
          onChange={(v) => handleChange('city', v)}
          placeholder="City"
        />

        <Input
          label="Province/State"
          value={form.province || ''}
          onChange={(v) => handleChange('province', v)}
          placeholder="Province or state"
        />

        <Input
          label="Country"
          value={form.country || ''}
          onChange={(v) => handleChange('country', v)}
          placeholder="Country"
        />

        <Input
          label="Telephone"
          value={form.tel || ''}
          onChange={(v) => handleChange('tel', v)}
          placeholder="+260 96..."
        />

        <Input
          label="Email"
          type="email"
          value={form.email || ''}
          onChange={(v) => handleChange('email', v)}
          placeholder="contact@example.org"
          error={errors.email}
        />

        <Input
          label="Website"
          value={form.website || ''}
          onChange={(v) => handleChange('website', v)}
          placeholder="https://example.org"
        />

        {/* Cells (dynamic list) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cell (mobile numbers)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={cellInput}
              onChange={(e) => setCellInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCell(); } }}
              placeholder="Add mobile number and press Enter or click Add"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" variant="outline" onClick={handleAddCell}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(form.cell || []).map((c, i) => (
              <div key={i} className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                <span className="text-sm text-gray-700">{c}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCell(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  remove
                </button>
              </div>
            ))}
            {(form.cell || []).length === 0 && (
              <div className="text-sm text-gray-500">No mobile numbers added</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} icon={X}>Cancel</Button>
        <Button type="submit" variant="primary" loading={isLoading} icon={Save}>
          {details ? 'Update Details' : 'Create Details'}
        </Button>
      </div>
    </form>
  );
};

export default ChurchDetailsForm;
