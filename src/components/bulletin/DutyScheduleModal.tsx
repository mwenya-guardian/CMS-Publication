import React, { useState, useEffect } from 'react';
import { DutyScheduleEntry, DutyAssignment, DutyRole } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface DutyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dutyEntry: Partial<DutyScheduleEntry>) => void;
  dutyEntry?: DutyScheduleEntry;
  isLoading?: boolean;
}

export const DutyScheduleModal: React.FC<DutyScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dutyEntry,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    date: '',
    assignments: [] as DutyAssignment[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (dutyEntry) {
      setFormData({
        date: dutyEntry.date,
        assignments: dutyEntry.assignments || [],
      });
    } else {
      resetForm();
    }
  }, [dutyEntry, isOpen]);

  const resetForm = () => {
    setFormData({
      date: '',
      assignments: [],
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    // Check for duplicate role-service combinations
    const combinations = formData.assignments.map(a => `${a.role}-${a.service}`);
    const duplicates = combinations.filter((combo, index) => combinations.indexOf(combo) !== index);
    if (duplicates.length > 0) {
      newErrors.assignments = 'Duplicate role assignments found';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addAssignment = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, {
        role: 'pulpit_manager' as DutyRole,
        service: 'first' as 'first' | 'second',
        assignedPerson: '',
      }]
    }));
  };

  const removeAssignment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const updateAssignment = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map((assignment, i) => 
        i === index ? { ...assignment, [field]: value } : assignment
      )
    }));
  };

  const roleOptions = [
    { value: 'pulpit_manager', label: 'Pulpit Manager' },
    { value: 'opening_prayer', label: 'Opening Prayer' },
    { value: 'closing_prayer', label: 'Closing Prayer' },
    { value: 'offertory', label: 'Offertory' },
    { value: 'ushers', label: 'Ushers' },
    { value: 'sound_system', label: 'Sound System' },
    { value: 'security', label: 'Security' },
  ];

  const serviceOptions = [
    { value: 'first', label: 'First Service' },
    { value: 'second', label: 'Second Service' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dutyEntry ? 'Edit Duty Schedule' : 'Add Duty Schedule'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(value) => handleInputChange('date', value)}
            error={errors.date}
            required
          />
        </div>

        {/* Assignments Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Duty Assignments</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAssignment}
              icon={Plus}
            >
              Add Assignment
            </Button>
          </div>

          {errors.assignments && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.assignments}</p>
            </div>
          )}

          <div className="space-y-4">
            {formData.assignments.map((assignment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <Select
                    label="Role"
                    value={assignment.role}
                    onChange={(value) => updateAssignment(index, 'role', value)}
                    options={roleOptions}
                    required
                  />

                  <Select
                    label="Service"
                    value={assignment.service}
                    onChange={(value) => updateAssignment(index, 'service', value)}
                    options={serviceOptions}
                    required
                  />

                  <Input
                    label="Assigned Person"
                    value={assignment.assignedPerson}
                    onChange={(value) => updateAssignment(index, 'assignedPerson', value)}
                    placeholder="Enter person's name"
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAssignment(index)}
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {formData.assignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No assignments added yet. Click "Add Assignment" to get started.</p>
              </div>
            )}
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
            {dutyEntry ? 'Update' : 'Add'} Duty Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};