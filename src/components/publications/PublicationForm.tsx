import React, { useState, useEffect } from 'react';
import { Publication, CreatePublicationRequest, UpdatePublicationRequest } from '../../types/Publication';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUploader } from '../common/ImageUploader';
import { Save, X } from 'lucide-react';

interface PublicationFormProps {
  publication?: Publication;
  onSubmit: (data: CreatePublicationRequest | UpdatePublicationRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PublicationForm: React.FC<PublicationFormProps> = ({
  publication,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().slice(0, 10),
    layoutType: 'grid' as 'grid' | 'list' | 'masonry' | 'GRID' | 'LIST' | 'MASONRY',
    author: '',
    tags: '',
    featured: false,
  });

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title,
        content: publication.content,
        imageUrl: publication.imageUrl || '',
        date: publication.date.slice(0, 10),
        layoutType: publication.layoutType.toUpperCase() as 'grid' | 'list' | 'masonry' | 'GRID' | 'LIST' | 'MASONRY',
        author: publication.author || '',
        tags: publication.tags?.join(', ') || '',
        featured: publication.featured || false,
      });
    }
  }, [publication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl || undefined,
      date: formData.date,
      layoutType: formData.layoutType,
      author: formData.author || undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      featured: formData.featured,
    };

    if (publication) {
      await onSubmit({ ...submitData, id: publication.id });
    } else {
      await onSubmit(submitData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const layoutOptions = [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'list', label: 'List Layout' },
    { value: 'masonry', label: 'Masonry Layout' },
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
            placeholder="Enter publication title"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Content"
            type="textarea"
            value={formData.content}
            onChange={(value) => handleInputChange('content', value)}
            required
            placeholder="Enter publication content"
            rows={6}
          />
        </div>

        <Input
          label="Date"
          type="datetime-local"
          value={formData.date}
          onChange={(value) => handleInputChange('date', value)}
          required
        />

        <Select
          label="Layout Type"
          value={formData.layoutType}
          onChange={(value) => handleInputChange('layoutType', value)}
          options={layoutOptions}
          required
        />

        <Input
          label="Author"
          value={formData.author}
          onChange={(value) => handleInputChange('author', value)}
          placeholder="Enter author name"
        />

        <Input
          label="Tags"
          value={formData.tags}
          onChange={(value) => handleInputChange('tags', value)}
          placeholder="Enter tags separated by commas"
        />

        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Featured publication</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
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
          {publication ? 'Update' : 'Create'} Publication
        </Button>
      </div>
    </form>
  );
};