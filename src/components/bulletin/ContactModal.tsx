import React, { useState, useEffect } from 'react';
import { Contact, Department, PrayerLine } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Save, X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: any) => void;
  contact?: Contact | Department | PrayerLine;
  contactType: 'contact' | 'department' | 'prayerLine';
  isLoading?: boolean;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contact,
  contactType,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    description: '',
    type: 'phone' as 'phone' | 'email' | 'whatsapp',
    contact: '',
    hours: '',
    head: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (contact) {
      if (contactType === 'contact') {
        const c = contact as Contact;
        setFormData({
          name: c.name,
          role: c.role,
          phone: c.phone || '',
          email: c.email || '',
          description: '',
          type: 'phone',
          contact: '',
          hours: '',
          head: '',
        });
      } else if (contactType === 'department') {
        const d = contact as Department;
        setFormData({
          name: d.name,
          role: '',
          phone: d.phone || '',
          email: d.email || '',
          description: d.description || '',
          type: 'phone',
          contact: '',
          hours: '',
          head: d.head,
        });
      } else if (contactType === 'prayerLine') {
        const p = contact as PrayerLine;
        setFormData({
          name: '',
          role: '',
          phone: '',
          email: '',
          description: '',
          type: p.type,
          contact: p.contact,
          hours: p.hours || '',
          head: '',
        });
      }
    } else {
      resetForm();
    }
  }, [contact, contactType, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      description: '',
      type: 'phone',
      contact: '',
      hours: '',
      head: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (contactType === 'contact') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.role.trim()) {
        newErrors.role = 'Role is required';
      }
    } else if (contactType === 'department') {
      if (!formData.name.trim()) {
        newErrors.name = 'Department name is required';
      }
      if (!formData.head.trim()) {
        newErrors.head = 'Department head is required';
      }
    } else if (contactType === 'prayerLine') {
      if (!formData.contact.trim()) {
        newErrors.contact = 'Contact information is required';
      }
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      let submitData: any;

      if (contactType === 'contact') {
        submitData = {
          name: formData.name,
          role: formData.role,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
        };
      } else if (contactType === 'department') {
        submitData = {
          name: formData.name,
          head: formData.head,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          description: formData.description || undefined,
        };
      } else if (contactType === 'prayerLine') {
        submitData = {
          type: formData.type,
          contact: formData.contact,
          hours: formData.hours || undefined,
        };
      }

      onSave(submitData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTitle = () => {
    const action = contact ? 'Edit' : 'Add';
    switch (contactType) {
      case 'contact':
        return `${action} Contact`;
      case 'department':
        return `${action} Department`;
      case 'prayerLine':
        return `${action} Prayer Line`;
      default:
        return `${action} Contact`;
    }
  };

  const prayerLineTypeOptions = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {contactType === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              required
              placeholder="Enter person's name"
            />

            <Input
              label="Role/Position"
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
              error={errors.role}
              required
              placeholder="e.g., Admin Elder, Church Clerk"
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="Enter phone number"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              placeholder="Enter email address"
            />
          </div>
        )}

        {contactType === 'department' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Department Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              required
              placeholder="e.g., Youth Ministries, Music Department"
            />

            <Input
              label="Department Head"
              value={formData.head}
              onChange={(value) => handleInputChange('head', value)}
              error={errors.head}
              required
              placeholder="Enter department head's name"
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="Enter phone number"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              placeholder="Enter email address"
            />

            <div className="md:col-span-2">
              <Input
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Brief description of the department"
                rows={3}
              />
            </div>
          </div>
        )}

        {contactType === 'prayerLine' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Type"
              value={formData.type}
              onChange={(value) => handleInputChange('type', value)}
              options={prayerLineTypeOptions}
              required
            />

            <Input
              label="Contact Information"
              value={formData.contact}
              onChange={(value) => handleInputChange('contact', value)}
              error={errors.contact}
              required
              placeholder="Phone number, email, or WhatsApp"
            />

            <div className="md:col-span-2">
              <Input
                label="Available Hours"
                value={formData.hours}
                onChange={(value) => handleInputChange('hours', value)}
                placeholder="e.g., 24/7, Mon-Fri 9AM-5PM"
              />
            </div>
          </div>
        )}

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
            {contact ? 'Update' : 'Add'} {contactType === 'contact' ? 'Contact' : contactType === 'department' ? 'Department' : 'Prayer Line'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};