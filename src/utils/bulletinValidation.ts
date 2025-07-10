import { ChurchBulletin, ServiceSchedule, Announcement, DutyScheduleEntry } from '../types/ChurchBulletin';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export class BulletinValidator {
  static validate(bulletin: Partial<ChurchBulletin>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields validation
    if (!bulletin.bulletinDate) {
      errors.push({
        field: 'bulletinDate',
        message: 'Bulletin date is required',
        severity: 'error'
      });
    }

    if (!bulletin.churchInfo?.name) {
      errors.push({
        field: 'churchInfo.name',
        message: 'Church name is required',
        severity: 'error'
      });
    }

    if (!bulletin.coverContent?.welcomeMessage) {
      errors.push({
        field: 'coverContent.welcomeMessage',
        message: 'Welcome message is required',
        severity: 'error'
      });
    }

    // Date validation
    if (bulletin.bulletinDate) {
      const bulletinDate = new Date(bulletin.bulletinDate);
      const today = new Date();
      
      if (bulletinDate < today) {
        errors.push({
          field: 'bulletinDate',
          message: 'Bulletin date should not be in the past',
          severity: 'warning'
        });
      }

      // Check if it's a Saturday (Sabbath)
      if (bulletinDate.getDay() !== 6) {
        errors.push({
          field: 'bulletinDate',
          message: 'Bulletin date should be a Saturday (Sabbath)',
          severity: 'warning'
        });
      }
    }

    // Service schedule validation
    if (bulletin.services) {
      errors.push(...this.validateServices(bulletin.services));
    }

    // Announcements validation
    if (bulletin.announcements) {
      errors.push(...this.validateAnnouncements(bulletin.announcements));
    }

    // Duty schedule validation
    if (bulletin.dutySchedule) {
      errors.push(...this.validateDutySchedule(bulletin.dutySchedule));
    }

    // Contact information validation
    if (bulletin.contacts) {
      errors.push(...this.validateContacts(bulletin.contacts));
    }

    return errors;
  }

  private static validateServices(services: ServiceSchedule[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for required services
    const requiredServices = ['song_service', 'sabbath_school', 'first_service'];
    const serviceTypes = services.map(s => s.type);

    requiredServices.forEach(required => {
      if (!serviceTypes.includes(required as any)) {
        errors.push({
          field: 'services',
          message: `Required service '${required}' is missing`,
          severity: 'error'
        });
      }
    });

    // Check for time conflicts
    services.forEach((service, index) => {
      const startTime = this.parseTime(service.startTime);
      const endTime = this.parseTime(service.endTime);

      if (startTime >= endTime) {
        errors.push({
          field: `services[${index}].endTime`,
          message: 'End time must be after start time',
          severity: 'error'
        });
      }

      // Check for overlaps with other services
      services.forEach((otherService, otherIndex) => {
        if (index !== otherIndex) {
          const otherStart = this.parseTime(otherService.startTime);
          const otherEnd = this.parseTime(otherService.endTime);

          if ((startTime < otherEnd && endTime > otherStart)) {
            errors.push({
              field: `services[${index}]`,
              message: `Service overlaps with ${otherService.label}`,
              severity: 'warning'
            });
          }
        }
      });

      // Check for missing key roles
      const keyRoles = ['pulpit_manager', 'pianist'];
      keyRoles.forEach(role => {
        const hasRole = service.roles.some(r => r.role === role && r.assignedPerson);
        if (!hasRole) {
          errors.push({
            field: `services[${index}].roles`,
            message: `Missing assignment for ${role}`,
            severity: 'warning'
          });
        }
      });
    });

    return errors;
  }

  private static validateAnnouncements(announcements: Announcement[]): ValidationError[] {
    const errors: ValidationError[] = [];

    announcements.forEach((announcement, index) => {
      if (!announcement.title?.trim()) {
        errors.push({
          field: `announcements[${index}].title`,
          message: 'Announcement title is required',
          severity: 'error'
        });
      }

      if (!announcement.description?.trim()) {
        errors.push({
          field: `announcements[${index}].description`,
          message: 'Announcement description is required',
          severity: 'error'
        });
      }

      // Date validation for events
      if (announcement.startDate && announcement.endDate) {
        const start = new Date(announcement.startDate);
        const end = new Date(announcement.endDate);

        if (start > end) {
          errors.push({
            field: `announcements[${index}].endDate`,
            message: 'End date must be after start date',
            severity: 'error'
          });
        }
      }

      // Contact validation for events requiring registration
      if (announcement.registrationLink && !announcement.contactPerson) {
        errors.push({
          field: `announcements[${index}].contactPerson`,
          message: 'Contact person required for events with registration',
          severity: 'warning'
        });
      }

      // Payment validation
      if (announcement.paymentInfo) {
        if (!announcement.paymentInfo.amount || announcement.paymentInfo.amount <= 0) {
          errors.push({
            field: `announcements[${index}].paymentInfo.amount`,
            message: 'Valid payment amount is required',
            severity: 'error'
          });
        }
      }
    });

    return errors;
  }

  private static validateDutySchedule(dutySchedule: DutyScheduleEntry[]): ValidationError[] {
    const errors: ValidationError[] = [];

    dutySchedule.forEach((entry, index) => {
      if (!entry.date) {
        errors.push({
          field: `dutySchedule[${index}].date`,
          message: 'Duty schedule date is required',
          severity: 'error'
        });
      }

      // Check for required roles
      const requiredRoles = ['pulpit_manager', 'opening_prayer'];
      requiredRoles.forEach(role => {
        const hasRole = entry.assignments.some(a => a.role === role);
        if (!hasRole) {
          errors.push({
            field: `dutySchedule[${index}].assignments`,
            message: `Missing assignment for ${role}`,
            severity: 'warning'
          });
        }
      });

      // Check for duplicate assignments
      const assignmentKeys = entry.assignments.map(a => `${a.role}-${a.service}`);
      const duplicates = assignmentKeys.filter((key, i) => assignmentKeys.indexOf(key) !== i);
      if (duplicates.length > 0) {
        errors.push({
          field: `dutySchedule[${index}].assignments`,
          message: 'Duplicate role assignments found',
          severity: 'error'
        });
      }
    });

    return errors;
  }

  private static validateContacts(contacts: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate pastor information
    if (!contacts.pastors || contacts.pastors.length === 0) {
      errors.push({
        field: 'contacts.pastors',
        message: 'At least one pastor contact is required',
        severity: 'error'
      });
    }

    // Validate phone number formats
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    
    contacts.pastors?.forEach((pastor: any, index: number) => {
      if (pastor.phone && !phoneRegex.test(pastor.phone)) {
        errors.push({
          field: `contacts.pastors[${index}].phone`,
          message: 'Invalid phone number format',
          severity: 'warning'
        });
      }
    });

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    contacts.pastors?.forEach((pastor: any, index: number) => {
      if (pastor.email && !emailRegex.test(pastor.email)) {
        errors.push({
          field: `contacts.pastors[${index}].email`,
          message: 'Invalid email format',
          severity: 'warning'
        });
      }
    });

    return errors;
  }

  private static parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Utility methods for specific validations
  static validateBulletinDate(date: string): boolean {
    const bulletinDate = new Date(date);
    return bulletinDate.getDay() === 6; // Saturday
  }

  static validateTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}