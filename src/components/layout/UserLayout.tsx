import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calendar, 
  Quote, 
  BookOpen, 
  Menu, 
  X, 
  CircleUserRoundIcon, 
  Settings,
  Heart,
  Image,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/user', icon: Home },
  { name: 'Media Posts', href: '/user/posts', icon: Image },
  { name: 'Bulletins', href: '/user/bulletins', icon: BookOpen },
  { name: 'Liked Posts', href: '/user/liked', icon: Heart },
  { name: 'Settings', href: '/user/settings', icon: Settings },
];

export const UserLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and User Info */}
            <div className="flex items-center">
              <Link to="/user" className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.firstname?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-gray-900">
                      {user?.firstname} {user?.lastname}
                    </h1>
                    <p className="text-sm text-gray-500">Welcome back!</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-2">
              {/* Admin link for admin/editor users */}
              {(user?.role == 'ADMIN' || user?.role == 'EDITOR') && (
                <Link
                  to="/admin"
                  className="sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <CircleUserRoundIcon className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              )}
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* Admin link for mobile */}
                {(user?.role == 'ADMIN' || user?.role == 'EDITOR') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <CircleUserRoundIcon className="mr-3 h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};
