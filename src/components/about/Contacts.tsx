import React from 'react';
import { mockContacts, mockPrayerLines } from '../../data/mockData';
import { Phone, Mail, Users, Heart } from 'lucide-react';

const Contacts: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Church Contacts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get in touch with our church leadership and departments. We're here to serve you and answer any questions you may have.
        </p>
      </div>

      {/* Church Leadership */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Church Leadership
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockContacts.map((contact) => (
            <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                <p className="text-blue-600 font-medium">{contact.positionName}</p>
                <p className="text-gray-600 text-sm">{contact.department}</p>
              </div>
              <div className="space-y-2">
                {contact.contacts.map((contactInfo: string, index: number) => (
                  <div key={index} className="flex items-center text-sm">
                    {contactInfo.includes('@') ? (
                      <>
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`mailto:${contactInfo}`} className="text-blue-600 hover:text-blue-800">
                          {contactInfo}
                        </a>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`tel:${contactInfo}`} className="text-blue-600 hover:text-blue-800">
                          {contactInfo}
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prayer Lines */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-600" />
          Prayer Lines
        </h2>
        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Need prayer? Our prayer team is available to pray with you and for you. 
            Don't hesitate to reach out during times of need, celebration, or when you simply need spiritual support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPrayerLines.map((prayerLine) => (
              <div key={prayerLine.id} className="flex items-center bg-white rounded-lg p-4">
                <Phone className="w-5 h-5 mr-3 text-red-600" />
                <a 
                  href={`tel:${prayerLine.contact}`} 
                  className="text-lg font-medium text-red-600 hover:text-red-800"
                >
                  {prayerLine.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-800 mb-4">Emergency Contacts</h2>
        <p className="text-yellow-700 mb-4">
          In case of spiritual emergency or urgent pastoral care needs, please contact:
        </p>
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-medium text-yellow-800">Senior Pastor Emergency Line: </span>
            <a href="tel:+1-234-567-8900" className="text-yellow-700 hover:text-yellow-900 ml-2">
              +1-234-567-8900
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-medium text-yellow-800">Emergency Email: </span>
            <a href="mailto:emergency@church.com" className="text-yellow-700 hover:text-yellow-900 ml-2">
              emergency@church.com
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter to receive updates about events, announcements, and church news.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="bg-blue-800 hover:bg-blue-600 px-6 py-2 rounded-md font-medium transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;