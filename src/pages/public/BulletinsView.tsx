import React, { useState, useEffect } from 'react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { BulletinList } from '../../components/bulletin/BulletinList';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
// import { Search, Filter, X, FileText, Calendar, Download, Eye } from 'lucide-react';
import { bulletinService } from '../../services/bulletinService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';
import { mockChurchDetails, mockServiceActivities, mockAnnouncements, mockOnDuty, faithPrinciples } from '../../data/mockData';
import { Calendar, Clock, Users, Book } from 'lucide-react';

export const BulletinsView: React.FC = () => { 
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  return(   
  <div className="space-y-8 m-3">
    {/* Cover Page */}
    <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-lg p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">{mockChurchDetails.name}</h1>
      <p className="text-blue-100 mb-4">{mockChurchDetails.address}</p>
      <h2 className="text-2xl font-semibold mb-2">{mockChurchDetails.documentName}</h2>
      <p className="text-blue-100 mb-4">{currentDate}</p>
      <p className="text-lg mb-2">{mockChurchDetails.greeting}</p>
      <p className="text-blue-100">{mockChurchDetails.message}</p>
    </div>

    {/* Order of Worship */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-600" />
        Order of Worship
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockServiceActivities.map((activity) => (
          <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {activity.period}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">{activity.role}:</span>
                <span className="ml-2">{activity.participants.join(', ')}</span>
              </div>
              {activity.theme && (
                <div className="flex items-center">
                  <Book className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Theme:</span>
                  <span className="ml-2">{activity.theme}</span>
                </div>
              )}
              {activity.keyText && (
                <div className="flex items-center">
                  <Book className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Key Text:</span>
                  <span className="ml-2">{activity.keyText}</span>
                </div>
              )}
              {activity.openingSong && (
                <p><span className="font-medium">Opening Song:</span> {activity.openingSong}</p>
              )}
              {activity.closingSong && (
                <p><span className="font-medium">Closing Song:</span> {activity.closingSong}</p>
              )}
              {activity.childrenStory && (
                <p><span className="font-medium">Children's Story:</span> {activity.childrenStory}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Announcements */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Announcements</h2>
      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
            {announcement.title && (
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{announcement.title}</h3>
            )}
            <p className="text-gray-700 mb-2">{announcement.message}</p>
            {announcement.bulletins && announcement.bulletins.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {announcement.bulletins.map((bullet: string, index: number) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* On Duty Today */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">On Duty Today</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockOnDuty.map((duty) => (
          <div key={duty.id} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800">{duty.position}</h3>
            {duty.activity && (
              <p className="text-sm text-blue-600 mb-2">{duty.activity}</p>
            )}
            <p className="text-gray-700">{duty.names.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};