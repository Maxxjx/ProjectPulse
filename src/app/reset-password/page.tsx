'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PasswordResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would call an API endpoint to send a reset link
      // For our demo, we'll simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResetSent(true);
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
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-gray-400 mt-2">Enter your email to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {resetSent ? (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-4">
            <p className="mb-2">Password reset link sent!</p>
            <p className="text-sm">We've sent a password reset link to your email. Please check your inbox and follow the instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-2 px-4 bg-[#8B5CF6] hover:bg-opacity-90 transition rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
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