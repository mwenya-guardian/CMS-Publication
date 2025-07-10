import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementType } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Save, X } from 'lucide-react';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Partial<Announcement>) => void;
  announcement?: Announcement;
  isLoading?: boolean;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  announcement,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general' as AnnouncementType,
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    ageGroup: '',
    contactPerson: '',
    contactPhone: '',
    registrationLink: '',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    featured: false,
    paymentInfo: {
      amount: 0,
      currency: 'USD',
      paymentMethods: [] as string[],
      deadline: '',
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        description: announcement.description,
        type: announcement.type,
        startDate: announcement.startDate || '',
        endDate: announcement.endDate || '',
        time: announcement.time || '',
        location: announcement.location || '',
        ageGroup: announcement.ageGroup || '',
        contactPerson: announcement.contactPerson || '',
        contactPhone: announcement.contactPhone || '',
        registrationLink: announcement.registrationLink || '',
        deadline: announcement.deadline || '',
        priority: announcement.priority,
        featured: announcement.featured,
        paymentInfo: announcement.paymentInfo || {
          amount: 0,
          currency: 'USD',
          paymentMethods: [],
          deadline: '',
        },
      });
    } else {
      resetForm();
    }
  }, [announcement, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'general',
      startDate: '',
      endDate: '',
      time: '',
      location: '',
      ageGroup: '',
      contactPerson: '',
      contactPhone: '',
      registrationLink: '',
      deadline: '',
      priority: 'medium',
      featured: false,
      paymentInfo: {
        amount: 0,
        currency: 'USD',
        paymentMethods: [],
        deadline: '',
      },
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.contactPhone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone number format';
    }

    if (formData.registrationLink && !/^https?:\/\/.+/.test(formData.registrationLink)) {
      newErrors.registrationLink = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        id: announcement?.id || Math.random().toString(36).substr(2, 9),
        paymentInfo: formData.paymentInfo.amount > 0 ? formData.paymentInfo : undefined,
      };
      onSave(submitData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentInfoChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, [field]: value }
    }));
  };

  const announcementTypeOptions = [
    { value: 'event', label: 'Event' },
    { value: 'book_distribution', label: 'Book Distribution' },
    { value: 'membership', label: 'Membership' },
    { value: 'vbs', label: 'Vacation Bible School' },
    { value: 'trip', label: 'Trip' },
    { value: 'prayer_week', label: 'Prayer Week' },
    { value: 'general', label: 'General' },
    { value: 'duty_roster', label: 'Duty Roster' },
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={announcement ? 'Edit Announcement' : 'Add New Announcement'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Title"
              value={formData.title}
              onChange={(value) => handleInputChange('title', value)}
              error={errors.title}
              required
              placeholder="Enter announcement title"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              error={errors.description}
              required
              placeholder="Enter announcement description"
              rows={4}
            />
          </div>

          <Select
            label="Type"
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            options={announcementTypeOptions}
            required
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(value) => handleInputChange('priority', value)}
            options={priorityOptions}
            required
          />

          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(value) => handleInputChange('startDate', value)}
          />

          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(value) => handleInputChange('endDate', value)}
            error={errors.endDate}
          />

          <Input
            label="Time"
            value={formData.time}
            onChange={(value) => handleInputChange('time', value)}
            placeholder="e.g., 2:00 PM - 4:00 PM"
          />

          <Input
            label="Location"
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            placeholder="Enter location"
          />

          <Input
            label="Age Group"
            value={formData.ageGroup}
            onChange={(value) => handleInputChange('ageGroup', value)}
            placeholder="e.g., Ages 5-12, Adults"
          />

          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(value) => handleInputChange('deadline', value)}
          />

          <Input
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(value) => handleInputChange('contactPerson', value)}
            placeholder="Enter contact person name"
          />

          <Input
            label="Contact Phone"
            value={formData.contactPhone}
            onChange={(value) => handleInputChange('contactPhone', value)}
            error={errors.contactPhone}
            placeholder="Enter phone number"
          />

          <div className="md:col-span-2">
            <Input
              label="Registration Link"
              value={formData.registrationLink}
              onChange={(value) => handleInputChange('registrationLink', value)}
              error={errors.registrationLink}
              placeholder="https://example.com/register"
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Amount"
              type="number"
              value={formData.paymentInfo.amount.toString()}
              onChange={(value) => handlePaymentInfoChange('amount', parseFloat(value) || 0)}
              placeholder="0.00"
            />

            <Input
              label="Currency"
              value={formData.paymentInfo.currency}
              onChange={(value) => handlePaymentInfoChange('currency', value)}
              placeholder="USD"
            />

            <Input
              label="Payment Deadline"
              type="date"
              value={formData.paymentInfo.deadline}
              onChange={(value) => handlePaymentInfoChange('deadline', value)}
            />
          </div>
        </div>

        {/* Options */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Featured announcement</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            icon={X}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            icon={Save}
          >
            {announcement ? 'Update' : 'Add'} Announcement
          </Button>
        </div>
      </form>
    </Modal>
  );
};