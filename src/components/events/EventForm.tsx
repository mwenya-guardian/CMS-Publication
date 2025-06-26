import React, { useState, useEffect } from 'react';
import { Event, CreateEventRequest, UpdateEventRequest } from '../../types/Event';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUploader } from '../common/ImageUploader';
import { Save, X } from 'lucide-react';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventRequest | UpdateEventRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    location: '',
    category: 'other' as 'wedding' | 'conference' | 'workshop' | 'social' | 'other',
    featured: false,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl || '',
        startDate: event.startDate.split('T')[0],
        endDate: event.endDate?.split('T')[0] || '',
        location: event.location || '',
        category: event.category,
        featured: event.featured || false,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      location: formData.location || undefined,
      category: formData.category,
      featured: formData.featured,
    };

    if (event) {
      await onSubmit({ ...submitData, id: event.id });
    } else {
      await onSubmit(submitData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categoryOptions = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Title"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            required
            placeholder="Enter event title"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            required
            placeholder="Enter event description"
            rows={6}
          />
        </div>

        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(value) => handleInputChange('startDate', value)}
          required
        />

        <Input
          label="End Date (Optional)"
          type="date"
          value={formData.endDate}
          onChange={(value) => handleInputChange('endDate', value)}
        />

        <Input
          label="Location"
          value={formData.location}
          onChange={(value) => handleInputChange('location', value)}
          placeholder="Enter event location"
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={categoryOptions}
          required
        />

        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Featured event</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => handleInputChange('imageUrl', url)}
            onRemove={() => handleInputChange('imageUrl', '')}
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          icon={X}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          icon={Save}
        >
          {event ? 'Update' : 'Create'} Event
        </Button>
      </div>
    </form>
  );
};