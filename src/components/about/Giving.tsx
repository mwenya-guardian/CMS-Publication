import React from 'react';
import { mockGivingInfo } from '../../data/mockData';
import { CreditCard, Building, Phone, Heart } from 'lucide-react';

const Giving: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Giving</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your generous contributions help support our church ministries, community outreach, 
          and the spreading of God's love. Thank you for your faithful stewardship.
        </p>
      </div>

      {/* Tithe and Offering */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-600" />
          Tithe and Offering
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Bank Transfer
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium">{mockGivingInfo.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">{mockGivingInfo.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium font-mono">{mockGivingInfo.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch Code:</span>
                <span className="font-medium">{mockGivingInfo.branchCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch Name:</span>
                <span className="font-medium">{mockGivingInfo.branchName}</span>
              </div>
            </div>
          </div>

          {/* Mobile Money */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Mobile Money
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 block mb-1">Service Name:</span>
                <span className="font-medium">{mockGivingInfo.mobileMoneyName}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Process:</span>
                <span className="font-medium">{mockGivingInfo.mobileMoneyProcess}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giving Purposes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Giving Supports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Church Operations</h3>
            <p className="text-sm text-gray-600">Supporting daily church operations and facility maintenance</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Community Outreach</h3>
            <p className="text-sm text-gray-600">Feeding programs and community service initiatives</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Mission Work</h3>
            <p className="text-sm text-gray-600">Supporting local and global mission activities</p>
          </div>
        </div>
      </div>

      {/* Scripture */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-6 text-center">
        <blockquote className="text-lg italic mb-4">
          "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
        </blockquote>
        <p className="text-blue-100">— 2 Corinthians 9:7</p>
      </div>
    </div>
  );
};

export default Giving;