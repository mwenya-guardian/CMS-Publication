import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'datetime-local';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: LucideIcon;
  className?: string;
  rows?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  rows = 4,
  maxlength,
  min,
  max,
}) => {
  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200  focus:outline-none focus:ring-0 sm:text-sm p-3';
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';

  const inputElement = type === 'textarea' ? (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      maxLength={maxlength}
      rows={rows}
      className={`${baseClasses} ${errorClasses} ${className}`}
    />
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className={`${baseClasses} ${errorClasses} ${className}`}
      max={max}
      maxLength={max}
      min={min}
      minLength={min}
    />
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <div className={Icon ? 'pl-10' : ''}>
          {inputElement}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};