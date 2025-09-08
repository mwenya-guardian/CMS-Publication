import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname;
    if (from) {
      return <Navigate to={from} replace />;
    }
    // Redirect based on user role
    const user = (location.state as any)?.user;
    if (user?.role === 'USER') {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // Navigation will be handled by the redirect above
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access the admin dashboard to manage your content
          </p>
        </div>
      </div>

      <div className="mt-8 sm:max-w-md sm:mx-auto sm:w-full"> 
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6 border-none" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              required
              placeholder="Enter your email"
              disabled={isSubmitting}
            />

            <div className='flex flex-row items-center relative'>
              <div className="min-w-5/6 w-5/6">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                required
                placeholder="Enter your password"
                disabled={isSubmitting}
                
              />
              </div>
              <div className='w-1/6 flex justify-end'>
              <button
                type="button"
                className="relative inset-y-0 left-50 pr-3 flex items-center cursor-pointer h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
                style={{ top: '15px', bottom: '0px' }}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
              icon={LogIn}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-2">For demo purposes, use:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Email:</strong> admin@example.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};