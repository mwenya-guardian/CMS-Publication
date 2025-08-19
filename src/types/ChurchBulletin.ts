// Core Church Bulletin Types - Updated to match backend structure
export interface ChurchBulletin {
  id?: string;
  title: string;
  bulletinDate: string; // ISO date format
  content: string;
  status: PublicationStatus;
  scheduledPublishAt?: string;
  cover?: Cover;
  schedules: Schedule[];
  announcements: Announcement[];
  onDutyList: OnDuty[];
  createdAt?: string;
  updatedAt?: string;
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Cover {
  documentName: string;
  welcomeMessage: string;
  footerMessage?: string;
}

export interface Schedule {
  id?: string;
  title: string;
  scheduledActivities: Map<string, string>;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  scheduledDate: string; // ISO date format
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  // bulletin?: ChurchBulletin;
}

export interface OnDuty {
  role: string;
  activity: string;
  participates: string[];
  date: string; // ISO date format
}

// Legacy types for backward compatibility (can be removed later)
export interface ChurchInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
}

export interface CoverContent {
  bulletinTitle: string;
  motto: string;
  welcomeMessage: string;
  liveStreamNote?: string;
  pastors: Pastor[];
}

export interface Pastor {
  name: string;
  title: 'Senior Pastor' | 'Associate Pastor' | 'Assistant Pastor';
  phone?: string;
  email?: string;
}

export interface ServiceSchedule {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  type: ServiceType;
  roles: ServiceRole[];
  theme?: string;
  specialNotes?: string;
}

export type ServiceType = 
  | 'song_service'
  | 'sabbath_school'
  | 'first_service'
  | 'second_service'
  | 'afternoon_programme'
  | 'departmental_time'
  | 'lesson_study';

export interface ServiceRole {
  role: RoleType;
  assignedPerson?: string;
  hymnNumber?: string;
  songTitle?: string;
  keyText?: string;
  sermonTitle?: string;
  notes?: string;
}

export type RoleType =
  | 'pianist'
  | 'chorister'
  | 'opening_song'
  | 'pulpit_manager'
  | 'invocation'
  | 'offertory_reading'
  | 'sign_language_interpreter'
  | 'children_story'
  | 'music'
  | 'sermon'
  | 'closing_song'
  | 'benediction'
  | 'superintendent'
  | 'prayer'
  | 'mission_story'
  | 'testimony'
  | 'theme_emphasis';

export type AnnouncementType =
  | 'event'
  | 'book_distribution'
  | 'membership'
  | 'vbs'
  | 'trip'
  | 'prayer_week'
  | 'general'
  | 'duty_roster';

export interface PaymentInfo {
  amount: number;
  currency: string;
  paymentMethods: string[];
  deadline?: string;
}

export interface DutyScheduleEntry {
  date: string;
  assignments: DutyAssignment[];
}

export interface DutyAssignment {
  role: DutyRole;
  service: 'first' | 'second';
  assignedPerson: string;
}

export type DutyRole =
  | 'pulpit_manager'
  | 'opening_prayer'
  | 'closing_prayer'
  | 'offertory'
  | 'ushers'
  | 'sound_system'
  | 'security';

export interface HealthCornerArticle {
  title: string;
  content: string;
  author?: string;
  category: 'nutrition' | 'exercise' | 'mental_health' | 'substance_abuse' | 'general';
  references?: string[];
}

export interface ContactInformation {
  pastors: Pastor[];
  adminElder?: Contact;
  departments: Department[];
  prayerLines: PrayerLine[];
  emergencyContacts?: Contact[];
}

export interface Contact {
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

export interface Department {
  name: string;
  head: string;
  phone?: string;
  email?: string;
  description?: string;
}

export interface PrayerLine {
  type: 'phone' | 'email' | 'whatsapp';
  contact: string;
  hours?: string;
}

export interface BulletinTemplate {
  id: string;
  name: string;
  description: string;
  defaultServices: Partial<ServiceSchedule>[];
  defaultRoles: RoleType[];
  faithPrinciples: string[];
  isDefault: boolean;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  message: string;
  pattern?: string;
  min?: number;
  max?: number;
}