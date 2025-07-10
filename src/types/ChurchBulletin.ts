// Core Church Bulletin Types
export interface ChurchBulletin {
    id: string;
    bulletinDate: string; // ISO date format
    status: 'draft' | 'published' | 'archived';
    churchInfo: ChurchInfo;
    coverContent: CoverContent;
    services: ServiceSchedule[];
    announcements: Announcement[];
    dutySchedule: DutyScheduleEntry[];
    healthCorner?: HealthCornerArticle;
    faithPrinciples: string[];
    contacts: ContactInformation;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  }
  
  // Page 1: Cover & Welcome
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
    bulletinTitle: string; // e.g., "Church Bulletin"
    motto: string; // e.g., "More Like Jesus – HAPPY SABBATH"
    welcomeMessage: string; // Multi-paragraph welcome text
    liveStreamNote?: string;
    pastors: Pastor[];
  }
  
  export interface Pastor {
    name: string;
    title: 'Senior Pastor' | 'Associate Pastor' | 'Assistant Pastor';
    phone?: string;
    email?: string;
  }
  
  // Pages 2-4: Service Schedules & Order of Worship
  export interface ServiceSchedule {
    id: string;
    label: string; // "SONG SERVICE", "SABBATH SCHOOL", etc.
    startTime: string; // "09:00"
    endTime: string; // "09:20"
    type: ServiceType;
    roles: ServiceRole[];
    theme?: string; // For themed services like "JOYFUL LIKE JESUS"
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
    hymnNumber?: string; // For songs
    songTitle?: string;
    keyText?: string; // For sermons
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
  
  // Page 5: Announcements
  export interface Announcement {
    id: string;
    title: string;
    description: string;
    type: AnnouncementType;
    startDate?: string;
    endDate?: string;
    time?: string;
    location?: string;
    ageGroup?: string;
    paymentInfo?: PaymentInfo;
    contactPerson?: string;
    contactPhone?: string;
    registrationLink?: string;
    deadline?: string;
    priority: 'high' | 'medium' | 'low';
    featured: boolean;
  }
  
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
  
  // Page 6: Duty Schedule
  export interface DutyScheduleEntry {
    date: string; // ISO date
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
  
  // Page 7: Health Corner & Faith Principles
  export interface HealthCornerArticle {
    title: string;
    content: string;
    author?: string;
    category: 'nutrition' | 'exercise' | 'mental_health' | 'substance_abuse' | 'general';
    references?: string[];
  }
  
  // Page 8: Contacts & Departments
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
  
  // Template and Validation Types
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