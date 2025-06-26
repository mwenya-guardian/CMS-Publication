import React, { useState, useEffect } from 'react';
import { Quote, CreateQuoteRequest, UpdateQuoteRequest } from '../../types/Quote';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUploader } from '../common/ImageUploader';
import { Save, X } from 'lucide-react';

interface QuoteFormProps {
  quote?: Quote;
  onSubmit: (data: CreateQuoteRequest | UpdateQuoteRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  quote,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    source: '',
    category: '',
    imageUrl: '',
    featured: false,
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        text: quote.text,
        author: quote.author,
        source: quote.source || '',
        category: quote.category || '',
        imageUrl: quote.imageUrl || '',
        featured: quote.featured || false,
      });
    }
  }, [quote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      text: formData.text,
      author: formData.author,
      source: formData.source || undefined,
      category: formData.category || undefined,
      imageUrl: formData.imageUrl || undefined,
      featured: formData.featured,
    };

    if (quote) {
      await onSubmit({ ...submitData, id: quote.id });
    } else {
      await onSubmit(submitData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categoryOptions = [
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'love', label: 'Love' },
    { value: 'life', label: 'Life' },
    { value: 'success', label: 'Success' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Quote Text"
            type="textarea"
            value={formData.text}
            onChange={(value) => handleInputChange('text', value)}
            required
            placeholder="Enter the quote text"
            rows={4}
          />
        </div>

        <Input
          label="Author"
          value={formData.author}
          onChange={(value) => handleInputChange('author', value)}
          required
          placeholder="Enter author name"
        />

        <Input
          label="Source"
          value={formData.source}
          onChange={(value) => handleInputChange('source', value)}
          placeholder="Enter source (book, speech, etc.)"
        />

        <div className="md:col-span-2">
          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            options={categoryOptions}
            placeholder="Select a category"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Featured quote</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Image (Optional)
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
          {quote ? 'Update' : 'Create'} Quote
        </Button>
      </div>
    </form>
  );
};