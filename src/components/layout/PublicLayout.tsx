import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Calendar, Quote, BookOpen ,Menu, X, CircleUserRoundIcon, Info} from 'lucide-react';
import { useState } from 'react';
import { faithPrinciples } from '../../data/mockData';
const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Publications', href: '/publications', icon: FileText },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Quotes', href: '/quotes', icon: Quote },
  { name: 'Bulletins', href: '/bulletins', icon: BookOpen },
  {name: "About", href: "/about", icon: Info},
];

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 border-b-2 border-primary-600">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-white to-accent-50 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center mr-auto">
            <div className="flex justify-start">
              <Link to="/auth/login" className="flex-shrink-0 border-r-1 border-primary-1 pr-4">
                <CircleUserRoundIcon className="h-8 w-8 text-primary-600 border-r-20" />
              </Link>
            </div>
              <Link to="/" className="flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-2xl text-primary-600 font-bold">CAS</h1>
                    <p className="text-blue-600">Seventh-day Adventist Church</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'text-primary-700 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-accent-50 border-t border-gray-200 m-3 rounded-lg">
      {/* Principles of Our Faith */}
      <div className="bg-blue-80 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Principles of Our Faith</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faithPrinciples.map((principle, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                {index + 1}
              </span>
              <p className="text-gray-700">{principle}</p>
            </div>
          ))}
        </div>
      </div>
      </footer>
    </div>
  );
};