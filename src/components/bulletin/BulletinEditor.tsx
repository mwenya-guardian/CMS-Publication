import React, { useState, useEffect } from 'react';
import { ChurchBulletin, PublicationStatus, Schedule, Announcement, OnDuty, Cover } from '../../types/ChurchBulletin';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ScheduleModal } from './ScheduleModal';
import { AnnouncementModal } from './AnnouncementModal';
import { OnDutyModal } from './OnDutyModal';
import { 
  Save, 
  Eye, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface BulletinEditorProps {
  bulletin?: ChurchBulletin;
  onSave: (bulletin: Partial<ChurchBulletin>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BulletinEditor: React.FC<BulletinEditorProps> = ({
  bulletin,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<ChurchBulletin>>({});
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isOnDutyModalOpen, setIsOnDutyModalOpen] = useState(false);
  
  // Selected items for editing
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | undefined>();
  const [selectedOnDuty, setSelectedOnDuty] = useState<OnDuty | undefined>();
  
  // Selected indices for editing
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<number | undefined>();
  const [selectedAnnouncementIndex, setSelectedAnnouncementIndex] = useState<number | undefined>();
  const [selectedOnDutyIndex, setSelectedOnDutyIndex] = useState<number | undefined>();

  // ---------- Helper functions to normalize/serialize scheduledActivities ----------
  // Accepts Map | object | array-of-pairs | array-of-objects and returns Map<string,string>
  function normalizeToMap(input: any): Map<string, string> {
    const map = new Map<string, string>();
    if (!input) return map;

    if (input instanceof Map) {
      input.forEach((v: string, k: string) => map.set(String(k), String(v ?? '')));
      return map;
    }

    if (Array.isArray(input)) {
      for (const el of input) {
        if (Array.isArray(el) && el.length >= 2) {
          map.set(String(el[0]), String(el[1] ?? ''));
        } else if (el && typeof el === 'object' && 'key' in el && 'value' in el) {
          map.set(String(el.key), String(el.value ?? ''));
        }
      }
      return map;
    }

    if (typeof input === 'object') {
      Object.entries(input).forEach(([k, v]) => {
        if (Object.prototype.hasOwnProperty.call(input, k)) {
          map.set(String(k), v == null ? '' : String(v));
        }
      });
      return map;
    }

    return map;
  }

  // Convert Map<string,string> to plain object for serialization (safe for JSON)
  function mapToObject(map: Map<string, string> | any): Record<string, string> {
    if (!map) return {};
    if (map instanceof Map) {
      return Object.fromEntries(Array.from(map.entries()));
    }
    // if already object, shallow copy
    if (typeof map === 'object') {
      return { ...map };
    }
    return {};
  }

  // Normalize incoming schedule object to ensure scheduledActivities is a Map
  function normalizeSchedule(schedule: Schedule): Schedule {
    return {
      ...schedule,
      scheduledActivities: normalizeToMap((schedule as any).scheduledActivities)
    };
  }

  // ---------- Initialize formData ----------
  useEffect(() => {
    if (bulletin) {
      // Normalize schedules' activities into Maps for stable editing in the UI
      const normalizedSchedules = (bulletin.schedules || []).map(s => normalizeSchedule(s));
      setFormData({
        ...bulletin,
        schedules: normalizedSchedules
      });
    } else {
      // Initialize with default structure
      setFormData({
        title: '',
        bulletinDate: new Date().toISOString().split('T')[0],
        content: '',
        status: PublicationStatus.DRAFT,
        cover: {
          documentName: 'Church Bulletin',
          welcomeMessage: '',
          footerMessage: ''
        },
        schedules: [],
        announcements: [],
        onDutyList: []
      });
    }
  }, [bulletin]);

  // ---------- Validation ----------
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.bulletinDate) {
      newErrors.bulletinDate = 'Bulletin date is required';
    }

    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Save flow ----------
  const handleSave = async () => {
    if (!validateForm()) return;

    // Before calling onSave, serialize Maps to plain objects so payload is JSON-friendly
    const payload: Partial<ChurchBulletin> = { ...formData };

    if (payload.schedules && Array.isArray(payload.schedules)) {
      payload.schedules = payload.schedules.map((s: any) => {
        const scheduledActivitiesMap = (s && (s as Schedule).scheduledActivities) ?? new Map();
        return {
          ...s,
          // serialized activities as plain object { timeOrLabel: activity }
          scheduledActivities: mapToObject(scheduledActivitiesMap)
        };
      }) as unknown as Schedule[];
    }

    // announcements and onDutyList are left as-is (they should already be serializable)
    await onSave(payload);
  };

  // ---------- Field handlers ----------
  const handleFieldChange = (field: keyof ChurchBulletin, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoverChange = (field: keyof Cover, value: string) => {
    setFormData(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        [field]: value
      } as Cover
    }));
  };

  // ---------- Schedule handlers ----------
  const handleAddSchedule = () => {
    setSelectedSchedule(undefined);
    setSelectedScheduleIndex(undefined);
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule, index: number) => {
    // Ensure we pass a normalized schedule to the modal (Map in scheduledActivities)
    setSelectedSchedule(normalizeSchedule(schedule));
    setSelectedScheduleIndex(index);
    setIsScheduleModalOpen(true);
  };

  const handleDeleteSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveSchedule = (schedule: Schedule) => {
    // normalize incoming schedule.scheduledActivities to Map
    const normalized = normalizeSchedule(schedule);

    if (selectedScheduleIndex !== undefined) {
      // Edit existing schedule
      setFormData(prev => ({
        ...prev,
        schedules: prev.schedules?.map((s, i) => 
          i === selectedScheduleIndex ? normalized : s
        ) || []
      }));
    } else {
      // Add new schedule
      setFormData(prev => ({
        ...prev,
        schedules: [...(prev.schedules || []), normalized]
      }));
    }

    // close modal
    setIsScheduleModalOpen(false);
    setSelectedSchedule(undefined);
    setSelectedScheduleIndex(undefined);
  };

  // ---------- Announcement handlers ----------
  const handleAddAnnouncement = () => {
    setSelectedAnnouncement(undefined);
    setSelectedAnnouncementIndex(undefined);
    setIsAnnouncementModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement, index: number) => {
    setSelectedAnnouncement(announcement);
    setSelectedAnnouncementIndex(index);
    setIsAnnouncementModalOpen(true);
  };

  const handleDeleteAnnouncement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      announcements: prev.announcements?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveAnnouncement = (announcement: Announcement) => {
    if (selectedAnnouncementIndex !== undefined) {
      // Edit existing announcement
      setFormData(prev => ({
        ...prev,
        announcements: prev.announcements?.map((a, i) => 
          i === selectedAnnouncementIndex ? announcement : a
        ) || []
      }));
    } else {
      // Add new announcement
      setFormData(prev => ({
        ...prev,
        announcements: [...(prev.announcements || []), announcement]
      }));
    }
    setIsAnnouncementModalOpen(false);
    setSelectedAnnouncement(undefined);
    setSelectedAnnouncementIndex(undefined);
  };

  // ---------- OnDuty handlers ----------
  const handleAddOnDuty = () => {
    setSelectedOnDuty(undefined);
    setSelectedOnDutyIndex(undefined);
    setIsOnDutyModalOpen(true);
  };

  const handleEditOnDuty = (onDuty: OnDuty, index: number) => {
    setSelectedOnDuty(onDuty);
    setSelectedOnDutyIndex(index);
    setIsOnDutyModalOpen(true);
  };

  const handleDeleteOnDuty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      onDutyList: prev.onDutyList?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveOnDuty = (onDuty: OnDuty) => {
    if (selectedOnDutyIndex !== undefined) {
      // Edit existing on duty
      setFormData(prev => ({
        ...prev,
        onDutyList: prev.onDutyList?.map((o, i) => 
          i === selectedOnDutyIndex ? onDuty : o
        ) || []
      }));
    } else {
      // Add new on duty
      setFormData(prev => ({
        ...prev,
        onDutyList: [...(prev.onDutyList || []), onDuty]
      }));
    }
    setIsOnDutyModalOpen(false);
    setSelectedOnDuty(undefined);
    setSelectedOnDutyIndex(undefined);
  };

  // ---------- Render helpers ----------
  const renderBasicInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulletin Title *
          </label>
          <Input
            type="text"
            value={formData.title || ''}
            onChange={(value) => handleFieldChange('title', value)}
            placeholder="Enter bulletin title"
            error={errors.title}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulletin Date *
          </label>
          <Input
            type="date"
            value={formData.bulletinDate || ''}
            onChange={(value) => handleFieldChange('bulletinDate', value)}
            error={errors.bulletinDate}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status || PublicationStatus.DRAFT}
          onChange={(e) => handleFieldChange('status', e.target.value as PublicationStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={PublicationStatus.DRAFT}>Draft</option>
          <option value={PublicationStatus.PUBLISHED}>Published</option>
          <option value={PublicationStatus.SCHEDULED}>Scheduled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          placeholder="Enter bulletin content..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.content && (
          <p className="text-red-600 text-sm mt-1">{errors.content}</p>
        )}
      </div>
    </div>
  );

  const renderCoverTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Name
        </label>
        <Input
          type="text"
          value={formData.cover?.documentName || ''}
          onChange={(value) => handleCoverChange('documentName', value)}
          placeholder="e.g., Church Bulletin"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Welcome Message
        </label>
        <textarea
          value={formData.cover?.welcomeMessage || ''}
          onChange={(e) => handleCoverChange('welcomeMessage', e.target.value)}
          placeholder="Enter welcome message..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Footer Message
        </label>
        <Input
          type="text"
          value={formData.cover?.footerMessage || ''}
          onChange={(value) => handleCoverChange('footerMessage', value)}
          placeholder="Enter footer message..."
        />
      </div>
    </div>
  );

  const renderSchedulesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Service Schedules</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddSchedule}
          icon={Plus}
        >
          Add Schedule
        </Button>
      </div>

      {formData.schedules && formData.schedules.length > 0 ? (
        <div className="space-y-3">
          {formData.schedules.map((schedule, index) => {
            // schedule may have scheduledActivities as Map - produce preview
            const activitiesPreview = (() => {
              try {
                const map = normalizeToMap((schedule as any).scheduledActivities);
                const entries = Array.from(map.entries()).slice(0, 3);
                if (entries.length === 0) return 'No activities';
                return entries.map(([k, v]) => `${k}: ${v}`).join(' • ');
              } catch {
                return '';
              }
            })();

            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                    <p className="text-sm text-gray-600">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {schedule.scheduledDate}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Activities:</strong> {activitiesPreview}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSchedule(schedule as Schedule, index)}
                      icon={Edit}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSchedule(index)}
                      icon={Trash2}
                      className="text-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No schedules added yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSchedule}
            className="mt-2"
          >
            Add First Schedule
          </Button>
        </div>
      )}
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddAnnouncement}
          icon={Plus}
        >
          Add Announcement
        </Button>
      </div>

      {formData.announcements && formData.announcements.length > 0 ? (
        <div className="space-y-3">
          {formData.announcements.map((announcement, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAnnouncement(announcement, index)}
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(index)}
                    icon={Trash2}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No announcements added yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAnnouncement}
            className="mt-2"
          >
            Add First Announcement
          </Button>
        </div>
      )}
    </div>
  );

  const renderOnDutyTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">On Duty Assignments</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddOnDuty}
          icon={Plus}
        >
          Add Assignment
        </Button>
      </div>

      {formData.onDutyList && formData.onDutyList.length > 0 ? (
        <div className="space-y-3">
          {formData.onDutyList.map((onDuty, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{onDuty.role}</h4>
                  {onDuty.activity && (
                    <p className="text-sm text-gray-600">{onDuty.activity}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Participants: {onDuty.participates.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {onDuty.date}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditOnDuty(onDuty, index)}
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOnDuty(index)}
                    icon={Trash2}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No duty assignments added yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOnDuty}
            className="mt-2"
          >
            Add First Assignment
          </Button>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'cover', label: 'Cover', icon: Eye },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'onDuty', label: 'On Duty', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'basic' && renderBasicInfoTab()}
        {activeTab === 'cover' && renderCoverTab()}
        {activeTab === 'schedules' && renderSchedulesTab()}
        {activeTab === 'announcements' && renderAnnouncementsTab()}
        {activeTab === 'onDuty' && renderOnDutyTab()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Bulletin'}
        </Button>
      </div>

      {/* Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedSchedule(undefined);
          setSelectedScheduleIndex(undefined);
        }}
        schedule={selectedSchedule}
        onSave={handleSaveSchedule}
      />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => {
          setIsAnnouncementModalOpen(false);
          setSelectedAnnouncement(undefined);
          setSelectedAnnouncementIndex(undefined);
        }}
        announcement={selectedAnnouncement}
        onSave={handleSaveAnnouncement}
      />

      <OnDutyModal
        isOpen={isOnDutyModalOpen}
        onClose={() => {
          setIsOnDutyModalOpen(false);
          setSelectedOnDuty(undefined);
          setSelectedOnDutyIndex(undefined);
        }}
        onDuty={selectedOnDuty}
        onSave={handleSaveOnDuty}
      />
    </div>
  );
};
  