import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Settings,
  CreditCard,
  Contact,
  FileText,
  HeartHandshake
} from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AboutNavigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {

  const navigationItems = [
    { id: 'contacts', label: 'Contacts', icon: Contact, public: true },
    { id: 'giving', label: 'Tithe & Giving', icon: HeartHandshake, public: true }
  
  ];

  const filteredItems = navigationItems.filter(item => {
    return true;
  });

  return (
    <nav className="bg-white shadow-md ">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {filteredItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AboutNavigation;