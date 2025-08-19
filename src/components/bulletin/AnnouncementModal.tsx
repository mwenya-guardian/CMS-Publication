import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: Announcement;
  onSave: (announcement: Announcement) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcement,
  onSave
}) => {
  const [formData, setFormData] = useState<Announcement>({
    id: '',
    title: '',
    content: ''
  });

  useEffect(() => {
    if (announcement) {
      setFormData(announcement);
    } else {
      setFormData({
        id: '',
        title: '',
        content: ''
      });
    }
  }, [announcement]);

  const handleSave = () => {
    if (formData.title && formData.content) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={announcement ? 'Edit Announcement' : 'Add Announcement'}
      size="md"
    >
      <div className="space-y-4">
                 <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Title *
           </label>
           <input
             type="text"
             value={formData.title}
             onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
             placeholder="Enter announcement title"
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => { 
              console.log(e.target.value);
              return { ...prev, content: e.target.value } 
            })}
            placeholder="Enter announcement content..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Announcement
          </Button>
        </div>
      </div>
    </Modal>
  );
};