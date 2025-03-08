'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordToken({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { token } = params;

  useEffect(() => {
    // Validate token on component mount
    // In a real app, this would call an API to validate the token
    // For our demo, we'll simulate a valid token for a specific format
    const validateToken = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple token validation (for demo)
        // In a real app, you would verify this token against your database
        const isValid = token && token.length >= 20;
        setIsTokenValid(isValid);
      } catch (err) {
        setIsTokenValid(false);
      }
    };
    
    validateToken();
  }, [token]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would call an API to reset the password
      // For our demo, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Medium';
    if (passwordStrength === 3) return 'Strong';
    return 'Very Strong';
  };
  
  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-red-500';
    if (passwordStrength === 1) return 'bg-orange-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#1F2937] text-white p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center mr-2">
                <span className="font-bold text-white">P</span>
              </div>
              <span className="font-bold text-xl">ProjectPulse</span>
            </Link>
            <h1 className="text-3xl font-bold">Invalid or Expired Link</h1>
            <p className="text-gray-400 mt-2">
              This password reset link is invalid or has expired.
            </p>
          </div>
          
          <div className="bg-[#111827] p-8 rounded-lg shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-4">Link Not Valid</h2>
            <p className="text-gray-400 mb-6">
              Your password reset link has expired or is invalid. Please request a new password reset link.
            </p>
            <Link 
              href="/reset-password" 
              className="w-full inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#1F2937] text-white p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center mr-2">
                <span className="font-bold text-white">P</span>
              </div>
              <span className="font-bold text-xl">ProjectPulse</span>
            </Link>
            <h1 className="text-3xl font-bold">Password Reset Successful</h1>
            <p className="text-gray-400 mt-2">
              Your password has been successfully reset.
            </p>
          </div>
          
          <div className="bg-[#111827] p-8 rounded-lg shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-4">Password Updated!</h2>
            <p className="text-gray-400 mb-6">
              Your password has been updated successfully. You will be redirected to the login page in a few seconds.
            </p>
            <Link 
              href="/login" 
              className="w-full inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1F2937] text-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center mr-2">
              <span className="font-bold text-white">P</span>
            </div>
            <span className="font-bold text-xl">ProjectPulse</span>
          </Link>
          <h1 className="text-3xl font-bold">New Password</h1>
          <p className="text-gray-400 mt-2">
            Create a new password for your account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="bg-[#111827] p-8 rounded-lg shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-medium text-gray-400">
                      Password Strength: <span className={`${
                        passwordStrength === 0 ? 'text-red-500' :
                        passwordStrength === 1 ? 'text-orange-500' :
                        passwordStrength === 2 ? 'text-yellow-500' :
                        passwordStrength === 3 ? 'text-blue-500' :
                        'text-green-500'
                      }`}>{getStrengthLabel()}</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li className={password.length >= 8 ? 'text-green-500' : ''}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-500' : ''}>
                      • At least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-green-500' : ''}>
                      • At least one number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''}>
                      • At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-[#8B5CF6]'
                } rounded-md bg-[#1F2937] text-white focus:outline-none focus:ring-2`}
                placeholder="Confirm new password"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword || passwordStrength < 2}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/login" className="text-[#8B5CF6] hover:underline text-sm">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 