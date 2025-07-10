import { BulletinTemplate, ServiceSchedule, RoleType } from '../types/ChurchBulletin';

export const defaultBulletinTemplate: BulletinTemplate = {
  id: 'default-sda-template',
  name: 'Standard SDA Church Bulletin',
  description: 'Standard Seventh-day Adventist church bulletin template with all required services',
  isDefault: true,
  defaultServices: [
    {
      label: 'SONG SERVICE',
      startTime: '09:00',
      endTime: '09:20',
      type: 'song_service',
      roles: [
        { role: 'pianist', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'chorister', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'opening_song', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'closing_song', assignedPerson: '', hymnNumber: '', songTitle: '' }
      ]
    },
    {
      label: 'SABBATH SCHOOL',
      startTime: '09:20',
      endTime: '09:50',
      type: 'sabbath_school',
      roles: [
        { role: 'superintendent', assignedPerson: '' },
        { role: 'opening_song', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'prayer', assignedPerson: '' },
        { role: 'mission_story', assignedPerson: '' },
        { role: 'testimony', assignedPerson: '' },
        { role: 'theme_emphasis', assignedPerson: '' },
        { role: 'closing_song', assignedPerson: '', hymnNumber: '', songTitle: '' }
      ]
    },
    {
      label: 'FIRST SERVICE',
      startTime: '07:30',
      endTime: '09:00',
      type: 'first_service',
      roles: [
        { role: 'pianist', assignedPerson: '' },
        { role: 'chorister', assignedPerson: '' },
        { role: 'opening_song', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'pulpit_manager', assignedPerson: '' },
        { role: 'invocation', assignedPerson: '' },
        { role: 'offertory_reading', assignedPerson: '' },
        { role: 'sign_language_interpreter', assignedPerson: '' },
        { role: 'children_story', assignedPerson: '' },
        { role: 'music', assignedPerson: '' },
        { role: 'sermon', assignedPerson: '', sermonTitle: '', keyText: '' },
        { role: 'closing_song', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'benediction', assignedPerson: '' }
      ]
    },
    {
      label: 'SABBATH SCHOOL LESSON STUDY',
      startTime: '10:00',
      endTime: '11:00',
      type: 'lesson_study',
      roles: []
    },
    {
      label: 'SECOND SERVICE',
      startTime: '11:00',
      endTime: '12:30',
      type: 'second_service',
      roles: [
        { role: 'pianist', assignedPerson: '' },
        { role: 'chorister', assignedPerson: '' },
        { role: 'opening_song', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'pulpit_manager', assignedPerson: '' },
        { role: 'invocation', assignedPerson: '' },
        { role: 'offertory_reading', assignedPerson: '' },
        { role: 'sign_language_interpreter', assignedPerson: '' },
        { role: 'children_story', assignedPerson: '' },
        { role: 'music', assignedPerson: '' },
        { role: 'sermon', assignedPerson: '', sermonTitle: '', keyText: '' },
        { role: 'closing_song', assignedPerson: '', hymnNumber: '', songTitle: '' },
        { role: 'benediction', assignedPerson: '' }
      ]
    },
    {
      label: 'DEPARTMENTAL TIME',
      startTime: '14:30',
      endTime: '15:30',
      type: 'departmental_time',
      roles: []
    },
    {
      label: 'AFTERNOON PROGRAMME',
      startTime: '15:30',
      endTime: '17:00',
      type: 'afternoon_programme',
      roles: []
    }
  ],
  defaultRoles: [
    'pianist',
    'chorister',
    'opening_song',
    'pulpit_manager',
    'invocation',
    'offertory_reading',
    'sign_language_interpreter',
    'children_story',
    'music',
    'sermon',
    'closing_song',
    'benediction',
    'superintendent',
    'prayer',
    'mission_story',
    'testimony',
    'theme_emphasis'
  ],
  faithPrinciples: [
    'The Holy Scriptures',
    'The Trinity',
    'The Father',
    'The Son',
    'The Holy Spirit',
    'Creation',
    'The Nature of Humanity',
    'The Great Controversy',
    'The Life, Death, and Resurrection of Christ',
    'The Experience of Salvation',
    'Growing in Christ',
    'The Church',
    'The Remnant and Its Mission',
    'Unity in the Body of Christ',
    'Baptism',
    'The Lord\'s Supper',
    'Spiritual Gifts and Ministries',
    'The Gift of Prophecy',
    'The Law of God',
    'The Sabbath',
    'Stewardship',
    'Christian Behavior',
    'Marriage and the Family',
    'Christ\'s Ministry in the Heavenly Sanctuary',
    'The Second Coming of Christ',
    'Death and Resurrection',
    'The Millennium and the End of Sin',
    'The New Earth'
  ]
};

export class BulletinTemplateManager {
  static createBulletinFromTemplate(
    template: BulletinTemplate, 
    bulletinDate: string,
    churchInfo: any
  ): Partial<any> {
    return {
      bulletinDate,
      status: 'draft',
      churchInfo,
      coverContent: {
        bulletinTitle: 'Church Bulletin',
        motto: 'More Like Jesus – HAPPY SABBATH',
        welcomeMessage: 'Welcome to our worship service. We are delighted to have you join us in worship today.',
        liveStreamNote: 'This service is being live-streamed on Facebook and YouTube.',
        pastors: []
      },
      services: template.defaultServices.map(service => ({
        ...service,
        id: this.generateId(),
        roles: service.roles?.map(role => ({ ...role })) || []
      })),
      announcements: [],
      dutySchedule: this.generateDutyScheduleTemplate(bulletinDate),
      faithPrinciples: [...template.faithPrinciples],
      contacts: {
        pastors: [],
        departments: this.getDefaultDepartments(),
        prayerLines: []
      }
    };
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static generateDutyScheduleTemplate(startDate: string): any[] {
    const schedule = [];
    const start = new Date(startDate);
    
    // Generate 8 weeks of duty schedule
    for (let i = 0; i < 8; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + (i * 7));
      
      schedule.push({
        date: date.toISOString().split('T')[0],
        assignments: [
          { role: 'pulpit_manager', service: 'first', assignedPerson: '' },
          { role: 'pulpit_manager', service: 'second', assignedPerson: '' },
          { role: 'opening_prayer', service: 'first', assignedPerson: '' },
          { role: 'opening_prayer', service: 'second', assignedPerson: '' }
        ]
      });
    }
    
    return schedule;
  }

  private static getDefaultDepartments(): any[] {
    return [
      { name: 'Church Clerk', head: '', phone: '', email: '' },
      { name: 'Church Treasurer', head: '', phone: '', email: '' },
      { name: 'Head Deacon', head: '', phone: '', email: '' },
      { name: 'Head Deaconess', head: '', phone: '', email: '' },
      { name: 'Sabbath School Superintendent', head: '', phone: '', email: '' },
      { name: 'Youth Leader', head: '', phone: '', email: '' },
      { name: 'Women\'s Ministries Leader', head: '', phone: '', email: '' },
      { name: 'Men\'s Ministries Leader', head: '', phone: '', email: '' },
      { name: 'Children\'s Ministries Leader', head: '', phone: '', email: '' },
      { name: 'Music Director', head: '', phone: '', email: '' },
      { name: 'Community Services Leader', head: '', phone: '', email: '' },
      { name: 'Health Ministries Leader', head: '', phone: '', email: '' }
    ];
  }

  static validateTemplate(template: BulletinTemplate): string[] {
    const errors: string[] = [];

    if (!template.name?.trim()) {
      errors.push('Template name is required');
    }

    if (!template.defaultServices || template.defaultServices.length === 0) {
      errors.push('Template must have at least one service');
    }

    // Validate service times
    template.defaultServices.forEach((service, index) => {
      if (!service.startTime || !service.endTime) {
        errors.push(`Service ${index + 1}: Start and end times are required`);
      }

      if (service.startTime && service.endTime) {
        const start = this.parseTime(service.startTime);
        const end = this.parseTime(service.endTime);
        
        if (start >= end) {
          errors.push(`Service ${index + 1}: End time must be after start time`);
        }
      }
    });

    return errors;
  }

  private static parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}