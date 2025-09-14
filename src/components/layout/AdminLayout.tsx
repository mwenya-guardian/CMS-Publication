import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import sdalogo from "../../assets/icons/sdalogobluewhite.jpg";
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Calendar, 
  Quote, 
  BookOpen,
  LogOut,
  User,
  HandHeart,
  UserCog,
  Church
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

let navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Publications', href: '/admin/publications', icon: FileText },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Quotes', href: '/admin/quotes', icon: Quote },
];


export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if(user == null || user.role == 'VIEWER' || user.role == 'USER') {
      navigate('/');
  }

  if (user?.role?.toUpperCase() == 'ADMIN') {
      navigation = [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Publications', href: '/admin/publications', icon: FileText },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Quotes', href: '/admin/quotes', icon: Quote },   
        { name: 'Bulletins', href: '/admin/bulletins', icon: BookOpen },
        { name: 'Members', href: '/admin/members', icon: User },
        { name: 'Users', href: '/admin/users', icon: UserCog },
        { name: 'Giving', href: '/admin/giving', icon: HandHeart },
        // { name: 'Settings', href: '/admin/settings', icon: Settings },
        { name: 'Church', href: '/admin/church-details', icon: Church },];
    }



  useEffect(() => {
    
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 flex w-64 transform transition duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-900">CMS</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Scrollable content area */}
            <div className="flex-1 flex flex-col min-h-0">
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Fixed bottom section */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.firstname} {user?.lastname}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/user"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <User className="mr-3 h-4 w-4" />
                    User Dashboard
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    icon={LogOut}
                    className="w-full justify-start"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">CMS Administration</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.firstname} {user?.lastname}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link
                to="/user"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <User className="mr-3 h-4 w-4" />
                User Dashboard
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={LogOut}
                className="w-full justify-start"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <h2 className="text-lg font-medium text-gray-900">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <img src={sdalogo} alt="client" className="h-10 object-contain" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};