import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Search, Filter, X, FileText, Calendar, User } from 'lucide-react';
import AboutNavigation from '../../components/about/AboutNavigation';
import Giving from '../../components/about/Giving';
import Contacts from '../../components/about/Contacts';

export const AboutView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('giving');
  const renderSection = () => {
    switch (activeSection) {
      case 'giving':
        return <Giving />;
      case 'contacts':
        return <Contacts />;
      default:
        return <Giving />;
    }
  };
  return (
    <div>
        <AboutNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex justify-center px-5 py-5 w-full">
          { renderSection() }
        </main>
    </div>
  );
};