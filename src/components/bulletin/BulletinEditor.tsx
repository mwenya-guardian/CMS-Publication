import React, { useState, useEffect } from 'react';
import { ChurchBulletin, ServiceSchedule, Announcement, Contact, Department, PrayerLine, DutyScheduleEntry } from '../../types/ChurchBulletin';
import { BulletinValidator, ValidationError } from '../../utils/bulletinValidation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AnnouncementModal } from './AnnouncementModal';
import { ContactModal } from './ContactModal';
import { DutyScheduleModal } from './DutyScheduleModal';
import { 
  Save, 
  Eye, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings,
  AlertTriangle,
  CheckCircle
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
    const [activeTab, setActiveTab] = useState<string>('cover');
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    
    // Modal states
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDutyModalOpen, setIsDutyModalOpen] = useState(false);
    
    // Selected items for editing
    const [selectedService, setSelectedService] = useState<ServiceSchedule | undefined>();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | undefined>();
    const [selectedContact, setSelectedContact] = useState<Contact | Department | PrayerLine | undefined>();
    const [selectedDutyEntry, setSelectedDutyEntry] = useState<DutyScheduleEntry | undefined>();
    const [contactType, setContactType] = useState<'contact' | 'department' | 'prayerLine'>('contact');
  

  useEffect(() => {
    if (bulletin) {
      setFormData(bulletin);
    } else {
      // Initialize with default structure
      setFormData({
        bulletinDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        churchInfo: {
          name: '',
          address: '',
          phone: '',
          email: '',
          website: ''
        },
        coverContent: {
          bulletinTitle: 'Church Bulletin',
          motto: 'More Like Jesus – HAPPY SABBATH',
          welcomeMessage: '',
          pastors: []
        },
        services: [],
        announcements: [],
        dutySchedule: [],
        faithPrinciples: [],
        contacts: {
          pastors: [],
          departments: [],
          prayerLines: []
        }
      });
    }
  }, [bulletin]);

  const handleValidation = async () => {
    setIsValidating(true);
    const errors = BulletinValidator.validate(formData);
    setValidationErrors(errors);
    setIsValidating(false);
    return errors.filter(e => e.severity === 'error').length === 0;
  };

  const handleSave = async () => {
    const isValid = await handleValidation();
    if (isValid) {
      await onSave(formData);
    }
  };

  const handleFieldChange = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const tabs = [
    { id: 'cover', label: 'Cover & Welcome', icon: FileText },
    { id: 'services', label: 'Services', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'duties', label: 'Duty Schedule', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Settings }
  ];

  const renderValidationSummary = () => {
    if (validationErrors.length === 0) return null;

    const errors = validationErrors.filter(e => e.severity === 'error');
    const warnings = validationErrors.filter(e => e.severity === 'warning');

    return (
      <div className="mb-6 space-y-2">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="text-sm font-medium text-red-800">
                {errors.length} Error{errors.length !== 1 ? 's' : ''} Found
              </h4>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}
        
        {warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h4 className="text-sm font-medium text-yellow-800">
                {warnings.length} Warning{warnings.length !== 1 ? 's' : ''} Found
              </h4>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>• {warning.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderCoverTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Bulletin Date"
          type="date"
          value={formData.bulletinDate || ''}
          onChange={(value) => handleFieldChange('bulletinDate', value)}
          required
        />
        
        <Input
          label="Church Name"
          value={formData.churchInfo?.name || ''}
          onChange={(value) => handleFieldChange('churchInfo.name', value)}
          required
        />
        
        <div className="md:col-span-2">
          <Input
            label="Church Address"
            value={formData.churchInfo?.address || ''}
            onChange={(value) => handleFieldChange('churchInfo.address', value)}
          />
        </div>
        
        <Input
          label="Phone"
          value={formData.churchInfo?.phone || ''}
          onChange={(value) => handleFieldChange('churchInfo.phone', value)}
        />
        
        <Input
          label="Email"
          type="email"
          value={formData.churchInfo?.email || ''}
          onChange={(value) => handleFieldChange('churchInfo.email', value)}
        />
        
        <Input
          label="Website"
          value={formData.churchInfo?.website || ''}
          onChange={(value) => handleFieldChange('churchInfo.website', value)}
        />
        
        <Input
          label="Motto"
          value={formData.coverContent?.motto || ''}
          onChange={(value) => handleFieldChange('coverContent.motto', value)}
        />
        
        <div className="md:col-span-2">
          <Input
            label="Welcome Message"
            type="textarea"
            value={formData.coverContent?.welcomeMessage || ''}
            onChange={(value) => handleFieldChange('coverContent.welcomeMessage', value)}
            rows={6}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Live Stream Note"
            value={formData.coverContent?.liveStreamNote || ''}
            onChange={(value) => handleFieldChange('coverContent.liveStreamNote', value)}
            placeholder="This service is being live-streamed on Facebook and YouTube."
          />
        </div>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Service Schedule</h3>
        <Button
          variant="outline"
          onClick={() => {
            setIsServiceModalOpen(true);
          }}
        >
          Add Service
        </Button>
      </div>
      
      {formData.services?.map((service, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Service Name"
              value={service.label}
              onChange={(value) => handleFieldChange(`services.${index}.label`, value)}
            />
            <Input
              label="Start Time"
              value={service.startTime}
              onChange={(value) => handleFieldChange(`services.${index}.startTime`, value)}
              placeholder="09:00"
            />
            <Input
              label="End Time"
              value={service.endTime}
              onChange={(value) => handleFieldChange(`services.${index}.endTime`, value)}
              placeholder="09:20"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Role Assignments</h4>
            {service.roles?.map((role, roleIndex) => (
              <div key={roleIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="font-medium text-gray-700 capitalize flex items-center">
                  {role.role.replace('_', ' ')}
                </div>
                <Input
                  placeholder="Assigned Person"
                  value={role.assignedPerson || ''}
                  onChange={(value) => 
                    handleFieldChange(`services.${index}.roles.${roleIndex}.assignedPerson`, value)
                  }
                />
                {(role.role.includes('song') || role.role === 'music') && (
                  <Input
                    placeholder="Hymn Number / Song Title"
                    value={role.hymnNumber || role.songTitle || ''}
                    onChange={(value) => 
                      handleFieldChange(`services.${index}.roles.${roleIndex}.hymnNumber`, value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
        <Button
          variant="outline"
          onClick={() => {
            setIsAnnouncementModalOpen(true);
          }}
        >
          Add Announcement
        </Button>
      </div>
      
      {formData.announcements?.map((announcement, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={announcement.title}
              onChange={(value) => handleFieldChange(`announcements.${index}.title`, value)}
              required
            />
            <Input
              label="Type"
              value={announcement.type}
              onChange={(value) => handleFieldChange(`announcements.${index}.type`, value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Description"
                type="textarea"
                value={announcement.description}
                onChange={(value) => handleFieldChange(`announcements.${index}.description`, value)}
                rows={4}
                required
              />
            </div>
            <Input
              label="Start Date"
              type="date"
              value={announcement.startDate || ''}
              onChange={(value) => handleFieldChange(`announcements.${index}.startDate`, value)}
            />
            <Input
              label="End Date"
              type="date"
              value={announcement.endDate || ''}
              onChange={(value) => handleFieldChange(`announcements.${index}.endDate`, value)}
            />
            <Input
              label="Contact Person"
              value={announcement.contactPerson || ''}
              onChange={(value) => handleFieldChange(`announcements.${index}.contactPerson`, value)}
            />
            <Input
              label="Contact Phone"
              value={announcement.contactPhone || ''}
              onChange={(value) => handleFieldChange(`announcements.${index}.contactPhone`, value)}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {bulletin ? 'Edit Bulletin' : 'Create Bulletin'}
          </h1>
          <p className="text-gray-600 mt-1">
            {formData.bulletinDate && `Sabbath, ${new Date(formData.bulletinDate).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
            icon={Eye}
          >
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isLoading}
            icon={Save}
          >
            Save Bulletin
          </Button>
        </div>
      </div>

      {/* Validation Summary */}
      {renderValidationSummary()}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        {activeTab === 'cover' && renderCoverTab()}
        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'announcements' && renderAnnouncementsTab()}
        {/* Add other tab renderers */}
      </div>

      {/* Validation Button */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={handleValidation}
          loading={isValidating}
          icon={validationErrors.length === 0 ? CheckCircle : AlertTriangle}
          className={validationErrors.length === 0 ? 'text-green-600 border-green-300' : ''}
        >
          {isValidating ? 'Validating...' : 'Validate Bulletin'}
        </Button>
      </div>
    </div>
  );
};