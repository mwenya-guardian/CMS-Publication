import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verificationService } from '../../services/verificationService';
import { userService, UserRegistrationRequest } from '../../services/userService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Mail, User, Lock, Calendar, CheckCircle, X } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Registration form state
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');

  // Verification form state
  const [verificationCode, setVerificationCode] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    resetMessages();

    // Basic form validation
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const formData: UserRegistrationRequest = {
        email: email.trim(),
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        password,
        dob: dob || undefined,
      };

      // registerUser returns ApiResponse<User> (see userService example)
      const resp = await userService.registerUser(formData);

      if (resp?.data) {
        setSuccess(resp.message || 'Registration successful! Please check your email for verification code.');
        setUserEmail(email.trim());
        setShowVerificationModal(true);

        // Optionally automatically send/resend code immediately
        // await verificationService.resendCode({ email: email.trim(), type: 'USER_REGISTRATION' });
      } else {
        setError(resp?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (isLoading) return;
    resetMessages();

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await userService.verifyUser(userEmail, verificationCode);

      // resp is ApiResponse<boolean>
      if (resp?.data === true) {
        setSuccess(resp.message || 'Email verified successfully! You can now login.');
        setShowVerificationModal(false);
        // navigate to login immediately after success
        navigate('/auth/login');
      } else {
        setError(resp?.message || 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.response?.data?.message || err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (emailOverride?: string) => {
    if (isLoading) return;
    resetMessages();
    setIsLoading(true);

    try {
      const targetEmail = (emailOverride ?? userEmail).trim();
      if (!targetEmail) {
        setError('No email to resend code to.');
        return;
      }
      const resp = await verificationService.resendCode({
        email: targetEmail,
        type: 'USER_REGISTRATION',
      });

      if (resp?.status === 'success') {
        setSuccess(resp.message || 'Verification code sent successfully!');
        setUserEmail(targetEmail); // keep it set
        setShowVerificationModal(true);
      } else {
        setError(resp?.message || 'Failed to resend code. Please try again.');
      }
    } catch (err: any) {
      console.error('Resend code error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    resetMessages();
    setVerificationCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-accent-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-6 lg:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={firstname}
                onChange={setFirstname}
                placeholder="Enter your first name"
                required
                className="w-full"
              />
              <Input
                label="Last Name"
                type="text"
                value={lastname}
                onChange={setLastname}
                placeholder="Enter your last name"
                required
                className="w-full"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              required
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Create a password"
              required
              icon={Lock}
            />
            <p className="text-xs text-gray-500 -mt-2">
              Password must be at least 6 characters long
            </p>

            <Input
              label="Date of Birth (Optional)"
              type="date"
              value={dob}
              onChange={setDob}
              icon={Calendar}
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                  {error.includes('Email already exists, but inactive') && (
                    <Button
                      variant="ghost"
                      className="ml-2 underline"
                      onClick={async () => {
                        setUserEmail(email);
                        setShowVerificationModal(true);
                        await handleResendCode(email);
                      }}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full flex justify-center items-center">
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Verification Modal */}
      <Modal isOpen={showVerificationModal} onClose={closeVerificationModal} title="Verify Your Email" size="md">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">We sent a 6-digit verification code to:</p>
            <p className="font-medium text-gray-900">{userEmail}</p>
            <p className="text-xs text-gray-500 mt-2">Please check your email and enter the code below.</p>
          </div>

          <Input
            label="Verification Code"
            type="text"
            value={verificationCode}
            onChange={(value: string) => {
              const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(digitsOnly);
            }}
            placeholder="Enter 6-digit code"
            required
            className="text-center text-2xl tracking-widest"
            // maxLength={6}
          />

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleVerify} disabled={isLoading || verificationCode.length !== 6} className="w-full">
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Verifying...</span>
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => handleResendCode()} disabled={isLoading} className="flex-1">
                Resend Code
              </Button>
              <Button variant="outline" onClick={closeVerificationModal} disabled={isLoading} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Register;
