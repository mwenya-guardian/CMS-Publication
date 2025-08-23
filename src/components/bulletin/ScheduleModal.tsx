import React, { useEffect, useState } from 'react';
import { Schedule } from '../../types/ChurchBulletin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: Schedule;
  onSave: (schedule: Schedule) => void;
}

function normalizeToMap(input: any): Map<string, string> {
  const map = new Map<string, string>();
  if (!input) return map;

  // If it's already a Map
  if (input instanceof Map) {
    input.forEach((v: string, k: string) => map.set(k, v));
    return map;
  }

  // If it's an array of [key, value] pairs
  if (Array.isArray(input)) {
    for (const el of input) {
      if (Array.isArray(el) && el.length >= 2) {
        map.set(String(el[0]), String(el[1]));
      } else if (el && typeof el === 'object' && 'key' in el && 'value' in el) {
        map.set(String(el.key), String(el.value));
      }
    }
    return map;
  }

  // If it's an object with keys -> values
  if (typeof input === 'object') {
    Object.entries(input).forEach(([k, v]) => {
      // skip prototype props
      if (Object.prototype.hasOwnProperty.call(input, k)) {
        map.set(String(k), v == null ? '' : String(v));
      }
    });
    return map;
  }

  // otherwise return empty
  return map;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSave
}) => {
  const emptySchedule: Schedule = {
    title: '',
    startTime: '',
    endTime: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledActivities: new Map<string, string>(),
  };

  const [formData, setFormData] = useState<Schedule>(emptySchedule);

  // UI inputs for adding/editing activities
  const [activityKey, setActivityKey] = useState('');     // e.g. "09:00" or "9:00 AM" or "Opening"
  const [activityValue, setActivityValue] = useState(''); // e.g. "Song Service"
  const [editingActivityKey, setEditingActivityKey] = useState<string | null>(null);

  // Keep formData synchronized when `schedule` prop changes
  useEffect(() => {
    if (schedule) {
      // Normalize scheduledActivities to a Map if backend sent object/array
      const map = normalizeToMap((schedule as any).scheduledActivities);
      console.log('Normalized activities:', Array.from(map.entries()));
      setFormData({
        ...schedule,
        scheduledActivities: map,
      });
    } else {
      setFormData(emptySchedule);
    }

    // clear activity inputs when modal opens/changes
    setActivityKey('');
    setActivityValue('');
    setEditingActivityKey(null);
  }, [schedule, isOpen]); // also respond to open/close

  // Add or update a scheduled activity entry
  const handleAddOrUpdateActivity = () => {
    const key = activityKey.trim();
    const value = activityValue.trim();
    if (!key || !value) return;

    setFormData(prev => {
      // clone map to ensure state update
      console.log(`Previous activities:`, Array.from(prev.scheduledActivities.entries()));
      const newMap = new Map<string, string>(prev.scheduledActivities ?? []);
      newMap.set(key, value);
      console.log('Updated activities:', Array.from(newMap.entries()));
      return {
        ...prev,
        scheduledActivities: newMap,
      };
    });

    // reset inputs
    setActivityKey('');
    setActivityValue('');
    setEditingActivityKey(null);
  };

  // Remove activity by key
  const handleRemoveActivity = (key: string) => {
    setFormData(prev => {
      const newMap = new Map<string, string>(prev.scheduledActivities ?? []);
      newMap.delete(key);
      return {
        ...prev,
        scheduledActivities: newMap,
      };
    });
    // if we were editing that key, cancel edit
    if (editingActivityKey === key) {
      setActivityKey('');
      setActivityValue('');
      setEditingActivityKey(null);
    }
  };

  // Edit an existing activity - populate inputs
  const handleEditActivity = (key: string) => {
    const value = formData.scheduledActivities?.get(key) ?? '';
    setActivityKey(key);
    setActivityValue(value);
    setEditingActivityKey(key);
  };

  const handleSave = () => {
    // Basic validation to ensure required fields exist
    if (!formData.title?.trim()) {
      // Ideally show an inline validation message; for now simply return
      return;
    }
    if (!formData.startTime?.trim() || !formData.endTime?.trim()) {
      return;
    }
    // Ensure scheduledActivities is a Map (it already is in our state)
    const result: Schedule = {
      ...formData,
      scheduledActivities: new Map(formData.scheduledActivities ?? []),
    };
    console.log('Saving schedule:', result);

    onSave(result);
    onClose();
  };

  // derive entries to render (stable order: insertion order of Map)
  const activityEntries = Array.from(formData.scheduledActivities?.entries() ?? []);

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

        {/* Scheduled activities input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Activities</label>

          {/* Add / Edit inputs */}
          <div className="flex gap-2 items-start mb-3">
            <input
              type="text"
              value={activityKey}
              onChange={(e) => setActivityKey(e.target.value)}
              placeholder="Time or label (e.g., 09:00 or Opening)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOrUpdateActivity();
                }
              }}
            />
            <input
              type="text"
              value={activityValue}
              onChange={(e) => setActivityValue(e.target.value)}
              placeholder="Activity (e.g., Song Service)"
              className="flex-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOrUpdateActivity();
                }
              }}
            />
            <Button
              variant="outline"
              onClick={handleAddOrUpdateActivity}
              disabled={!activityKey.trim() || !activityValue.trim()}
            >
              {editingActivityKey ? 'Update' : 'Add'}
            </Button>
          </div>

          {/* Activities list */}
          <div className="space-y-2">
            {activityEntries.length === 0 && (
              <div className="text-sm text-gray-500">No scheduled activities added yet.</div>
            )}

            {activityEntries.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4 bg-gray-50 p-2 rounded-md">
                <div>
                  <div className="text-sm font-medium text-gray-800">{key}</div>
                  <div className="text-sm text-gray-600">{value}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => handleEditActivity(key)}>Edit</Button>
                  <Button variant="outline" onClick={() => handleRemoveActivity(key)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
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
