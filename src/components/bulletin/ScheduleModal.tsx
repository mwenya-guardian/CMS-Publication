import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: Schedule;
  onSave: (schedule: Schedule) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSave
}) => {
  const [formData, setFormData] = useState<Schedule>({
    title: '',
    startTime: '',
    endTime: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    roleAssignment: [],
    activityAssignment: [],
    activityDetails: {}
  });

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    } else {
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        roleAssignment: [],
        activityAssignment: [],
        activityDetails: {}
      });
    }
  }, [schedule]);

  const handleSave = () => {
    if (formData.title && formData.startTime && formData.endTime) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? 'Edit Schedule' : 'Add Schedule'}
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
             placeholder="e.g., Song Service"
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>

                 <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Start Time *
             </label>
             <input
               type="time"
               value={formData.startTime}
               onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               End Time *
             </label>
             <input
               type="time"
               value={formData.endTime}
               onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>
         </div>

                 <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Date
           </label>
           <input
             type="date"
             value={formData.scheduledDate}
             onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};
