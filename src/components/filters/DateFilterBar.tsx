import React from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { X } from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';

interface DateFilterBarProps {
  year?: number;
  month?: number;
  day?: number;
  onYearChange: (year: number | undefined) => void;
  onMonthChange: (month: number | undefined) => void;
  onDayChange: (day: number | undefined) => void;
  onClear: () => void;
  className?: string;
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
  onClear,
  className = '',
}) => {
  const years = dateUtils.getYearsList();
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const getDayOptions = () => {
    if (!year || !month) return [];
    
    const daysInMonth = getDaysInMonth(year, month);
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        value: i.toString(),
        label: i.toString().padStart(2, '0'),
      });
    }
    return days;
  };

  const hasActiveFilters = year || month || day;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            placeholder="Select year"
            value={year?.toString() || ''}
            onChange={(value) => onYearChange(value ? parseInt(value) : undefined)}
            options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
          />
          
          <Select
            placeholder="Select month"
            value={month?.toString() || ''}
            onChange={(value) => onMonthChange(value ? parseInt(value) : undefined)}
            options={months}
            disabled={!year}
          />
          
          <Select
            placeholder="Select day"
            value={day?.toString() || ''}
            onChange={(value) => onDayChange(value ? parseInt(value) : undefined)}
            options={getDayOptions()}
            disabled={!year || !month}
          />
        </div>
        
        {hasActiveFilters && (
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={onClear}
              icon={X}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {year && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Year: {year}
              <button
                onClick={() => onYearChange(undefined)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {month && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Month: {months.find(m => m.value === month.toString())?.label}
              <button
                onClick={() => onMonthChange(undefined)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {day && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Day: {day.toString().padStart(2, '0')}
              <button
                onClick={() => onDayChange(undefined)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};