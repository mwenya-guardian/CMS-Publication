import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onRemove,
  className = '',
  accept = 'image/*',
  maxSize = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // For demo purposes, we'll create a local URL
      // In a real app, you'd upload to your server/cloud storage
      const url = URL.createObjectURL(file);
      onChange(url);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (value) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors duration-200 cursor-pointer"
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary-600 mb-2" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-full p-3 mb-4">
              <ImageIcon className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an image</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop an image here, or click to select
            </p>
            <Button variant="outline" icon={Upload}>
              Choose File
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};