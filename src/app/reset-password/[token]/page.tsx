'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SetNewPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { token } = params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, this would call an API endpoint to reset the password
      // For our demo, we'll simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResetComplete(true);
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Set New Password</h1>
          <p className="text-gray-400 mt-2">Create a new password for your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {resetComplete ? (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-4">
            <p className="mb-2">Password reset complete!</p>
            <p className="text-sm">Your password has been successfully reset. You can now log in with your new password.</p>
            <div className="mt-4">
              <Link 
                href="/login" 
                className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded inline-block"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters long</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full py-2 px-4 bg-[#8B5CF6] hover:bg-opacity-90 transition rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-[#8B5CF6] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 