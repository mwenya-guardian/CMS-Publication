import React, { useState, useEffect } from 'react';
import { OnDuty } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface OnDutyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDuty?: OnDuty;
  onSave: (onDuty: OnDuty) => void;
}

export const OnDutyModal: React.FC<OnDutyModalProps> = ({
  isOpen,
  onClose,
  onDuty,
  onSave
}) => {
  console.log('OnDutyModal props:', { isOpen, onDuty });
  const [formData, setFormData] = useState<OnDuty>({
    role: '',
    activity: '',
    participates: [],
    date: new Date().toISOString().split('T')[0]
  });

  const [participantInput, setParticipantInput] = useState('');

  useEffect(() => {
    if (onDuty) {
      setFormData(onDuty);
    } else {
      setFormData({
        role: '',
        activity: '',
        participates: [],
        date: new Date().toISOString().split('T')[0]
      });
    }
    setParticipantInput('');
  }, [onDuty]);

  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      setFormData(prev => ({
        ...prev,
        participates: [...prev.participates, participantInput.trim()]
      }));
      setParticipantInput('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participates: prev.participates.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('OnDutyModal handleSave called with:', formData);
    if (formData.role && formData.participates.length > 0) {
      onSave(formData);
      onClose();
    } else {
      console.log('Validation failed: role or participants missing');
    }
  };

    return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={onDuty ? 'Edit Duty Assignment' : 'Add Duty Assignment'}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., Deacon, Pianist"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity
          </label>
          <input
            type="text"
            value={formData.activity}
            onChange={(e) => setFormData(prev => ({ ...prev, activity: e.target.value }))}
            placeholder="e.g., First Service, Music"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Participants *
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
              placeholder="Enter participant name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              variant="outline"
              onClick={handleAddParticipant}
              disabled={!participantInput.trim()}
            >
              Add
            </Button>
          </div>
          
          {formData.participates.length > 0 && (
            <div className="space-y-2">
              {formData.participates.map((participant, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm">{participant}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveParticipant(index)}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Assignment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
