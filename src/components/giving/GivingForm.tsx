import React, { useEffect, useState } from 'react';
import { Giving, GivingRequest, UpdateGivingRequest } from '../../types/Giving';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface GivingFormProps {
  giving?: Giving;
  onSubmit: (data: GivingRequest | UpdateGivingRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GivingForm: React.FC<GivingFormProps> = ({
  giving,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState<string>('');
  const [methods, setMethods] = useState<string[]>([]);
  const [methodInput, setMethodInput] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; methods?: string } | {}>({});

  // initialize when editing
  useEffect(() => {
    if (giving) {
      setTitle(giving.title || '');
      setMethods(Array.isArray(giving.method) ? giving.method.slice() : []);
    } else {
      setTitle('');
      setMethods([]);
    }
    setMethodInput('');
    setErrors({});
  }, [giving?.id]);

  const addMethod = () => {
    const trimmed = methodInput.trim();
    if (!trimmed) return;
    // avoid duplicates
    if (!methods.includes(trimmed)) {
      setMethods(prev => [...prev, trimmed]);
    }
    setMethodInput('');
    setErrors(prev => ({ ...(prev as any), methods: '' }));
  };

  const handleMethodKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMethod();
    }
  };

  const removeMethod = (index: number) => {
    setMethods(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; methods?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!methods.length) newErrors.methods = 'Add at least one method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const payload: GivingRequest = {
      title: title.trim(),
      method: methods.map(m => m.trim()).filter(Boolean),
    };

    try {
      if (giving && giving.id) {
        await onSubmit({ ...payload, id: giving.id } as UpdateGivingRequest);
      } else {
        await onSubmit(payload);
      }
    } catch (err) {
      // Let parent handle error display — optionally show a generic message here
      console.error('Failed to save giving', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <Input
            value={title}
            onChange={(v) => {
              setTitle(String(v));
              if ((errors as any).title) setErrors(prev => ({ ...(prev as any), title: '' }));
            }}
            placeholder="e.g., Tithes & Offerings"
            required
          />
          {(errors as any).title && (
            <p className="text-red-600 text-sm mt-1">{(errors as any).title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Methods *</label>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={methodInput}
              onChange={(e) => setMethodInput(e.target.value)}
              onKeyDown={handleMethodKey}
              placeholder="Add method (press Enter or click Add)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Add method"
            />
            <button
              type="button"
              onClick={addMethod}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {methods.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {methods.map((m, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  <span>{m}</span>
                  <button
                    type="button"
                    onClick={() => removeMethod(idx)}
                    className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-200"
                    aria-label={`Remove ${m}`}
                  >
                    <Trash2 className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No methods added yet.</p>
          )}

          {(errors as any).methods && (
            <p className="text-red-600 text-sm mt-1">{(errors as any).methods}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} icon={X}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} icon={Save}>
          {giving ? 'Update' : 'Create'} Giving
        </Button>
      </div>
    </form>
  );
};

export default GivingForm;
