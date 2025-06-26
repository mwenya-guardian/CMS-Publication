import { format, formatDistanceToNow, parseISO, startOfYear, endOfYear } from 'date-fns';

export const dateUtils = {
  formatDate: (date: string | Date, formatStr: string = 'PPP'): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  },

  formatDateTime: (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'PPP p');
  },

  formatYear: (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'yyyy');
  },

  formatMonth: (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMMM');
  },

  formatDay: (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'dd');
  },

  formatRelative: (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  },

  getYearRange: (date: string | Date): { start: Date; end: Date } => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return {
      start: startOfYear(parsedDate),
      end: endOfYear(parsedDate),
    };
  },

  getCurrentYear: (): number => {
    return new Date().getFullYear();
  },

  getYearsList: (startYear?: number, endYear?: number): number[] => {
    const currentYear = new Date().getFullYear();
    const start = startYear || currentYear - 10;
    const end = endYear || currentYear + 1;
    
    const years: number[] = [];
    for (let year = end; year >= start; year--) {
      years.push(year);
    }
    return years;
  },

  isValidDate: (date: string): boolean => {
    try {
      const parsed = parseISO(date);
      return !isNaN(parsed.getTime());
    } catch {
      return false;
    }
  },

  toISOString: (date: Date): string => {
    return date.toISOString();
  },

  fromISOString: (isoString: string): Date => {
    return parseISO(isoString);
  },
};