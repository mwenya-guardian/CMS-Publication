import { 
  ChurchDetail, 
  PastoralTeam, 
  ServiceActivity, 
  Announcement, 
  Event, 
  Publication, 
  Quote, 
  OnDuty, 
  GivingInfo, 
  ContactInfo, 
  PrayerLine 
} from '../types';

export const mockChurchDetails: ChurchDetail = {
  id: '1',
  name: 'Seventh-day Adventist Church',
  address: '123 Faith Street, Community Center',
  documentName: 'Weekly Bulletin',
  greeting: 'Welcome to our worship service',
  message: 'May God bless you and keep you',
  poBox: 'P.O. Box 123',
  city: 'Cityville',
  province: 'Province',
  country: 'Country',
  tel: '+1-234-567-8900',
  cell: '+1-234-567-8901',
  email: 'info@church.com',
  website: 'www.church.com'
};

export const mockPastoralTeam: PastoralTeam[] = [
  {
    id: '1',
    position: 'Senior Pastor',
    fullName: 'Elder John Smith',
    positionType: 'Ordained Minister'
  },
  {
    id: '2',
    position: 'Associate Pastor',
    fullName: 'Pastor Mary Johnson',
    positionType: 'Licensed Minister'
  },
  {
    id: '3',
    position: 'Youth Pastor',
    fullName: 'Pastor David Brown',
    positionType: 'Licensed Minister'
  }
];

export const mockServiceActivities: ServiceActivity[] = [
  {
    id: '1',
    title: 'First Service',
    period: '9:00 AM - 10:30 AM',
    role: 'Pastor',
    participants: ['Elder John Smith'],
    openingSong: 'Holy, Holy, Holy',
    closingSong: 'Blessed Assurance',
    keyText: 'John 3:16',
    childrenStory: 'Sister Sarah'
  },
  {
    id: '2',
    title: 'Song Service',
    period: '10:30 AM - 11:00 AM',
    role: 'Music Director',
    participants: ['Brother Michael']
  },
  {
    id: '3',
    title: 'Sabbath School',
    period: '11:00 AM - 12:00 PM',
    role: 'Sabbath School Superintendent',
    participants: ['Sister Jane'],
    theme: 'Walking with Jesus',
    openingSong: 'Jesus Loves Me',
    closingSong: 'This Little Light of Mine'
  },
  {
    id: '4',
    title: 'Second Service',
    period: '12:30 PM - 1:45 PM',
    role: 'Pastor',
    participants: ['Pastor Mary Johnson'],
    openingSong: 'Amazing Grace',
    closingSong: 'When We All Get to Heaven',
    keyText: 'Romans 8:28'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Prayer Meeting',
    message: 'Join us every Wednesday at 7:00 PM for our weekly prayer meeting.',
    bulletins: ['Bring your prayer requests', 'Light refreshments will be served'],
    createdAt: new Date(),
    reactions: { like: 15, notSure: 2, dislike: 0 }
  },
  {
    id: '2',
    title: 'Community Outreach',
    message: 'We are organizing a community feeding program this Saturday.',
    bulletins: ['Volunteers needed', 'Donations welcome'],
    createdAt: new Date(),
    reactions: { like: 25, notSure: 3, dislike: 1 }
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Youth Camp',
    description: 'Annual youth spiritual retreat',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-07-20'),
    createdAt: new Date(),
    reactions: { like: 45, notSure: 5, dislike: 2 }
  },
  {
    id: '2',
    name: 'Baptism Service',
    description: 'Special baptism ceremony',
    startDate: new Date('2024-06-28'),
    createdAt: new Date(),
    reactions: { like: 32, notSure: 1, dislike: 0 }
  }
];

export const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Quarter 2 Bible Study Guide',
    content: 'This quarter we will be studying the book of Romans with emphasis on salvation by faith.',
    schedule: 'Daily readings and Sabbath discussion',
    createdAt: new Date(),
    reactions: { like: 28, notSure: 4, dislike: 1 }
  }
];

export const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'Faith is taking the first step even when you don\'t see the whole staircase.',
    author: 'Martin Luther King Jr.',
    createdAt: new Date(),
    reactions: { like: 18, notSure: 1, dislike: 0 }
  }
];

export const mockOnDuty: OnDuty[] = [
  {
    id: '1',
    position: 'Deacon',
    activity: 'Communion',
    names: ['Brother Tom', 'Brother Paul']
  },
  {
    id: '2',
    position: 'Deaconess',
    activity: 'Ushering',
    names: ['Sister Mary', 'Sister Ruth']
  }
];

export const mockGivingInfo: GivingInfo = {
  id: '1',
  bankName: 'First National Bank',
  accountName: 'SDA Church Account',
  accountNumber: '1234567890',
  branchCode: '123456',
  branchName: 'Main Branch',
  mobileMoneyName: 'Church Mobile Money',
  mobileMoneyProcess: 'Dial *123# and select Church option'
};

export const mockContacts: ContactInfo[] = [
  {
    id: '1',
    department: 'Pastoral',
    positionName: 'Senior Pastor',
    name: 'Elder John Smith',
    contacts: ['+1-234-567-8900', 'pastor@church.com']
  },
  {
    id: '2',
    department: 'Administration',
    positionName: 'Church Clerk',
    name: 'Sister Linda',
    contacts: ['+1-234-567-8901', 'clerk@church.com']
  }
];

export const mockPrayerLines: PrayerLine[] = [
  { id: '1', contact: '+1-234-567-8902' },
  { id: '2', contact: '+1-234-567-8903' }
];

export const faithPrinciples: string[] = [
  'The Holy Scriptures are the infallible revelation of God\'s will.',
  'The Trinity: Father, Son, and Holy Spirit are one God.',
  'Jesus Christ is both divine and human.',
  'Salvation is by grace through faith alone.',
  'The Second Coming of Jesus is literal and visible.',
  'The dead sleep until the resurrection.',
  'The Sabbath is the seventh day of the week.',
  'Stewardship is a Christian responsibility.',
  'The gift of prophecy is manifested in the church.',
  'The church is the body of Christ.'
];