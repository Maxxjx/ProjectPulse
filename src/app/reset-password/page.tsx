'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would call an API endpoint that sends an email
      // For demo purposes, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if it's a known demo email
      const demoEmails = [
        'demo@projectpulse.com',
        'admin@projectpulse.com',
        'team@projectpulse.com',
        'client@projectpulse.com'
      ];
      
      if (!demoEmails.includes(email)) {
        setError('Email not found. Please use one of the demo accounts.');
        setIsLoading(false);
        return;
      }
      
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
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
          <p className="text-gray-400 mt-2">
            {isSubmitted 
              ? 'Check your email for reset instructions' 
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {isSubmitted ? (
          <div className="bg-[#111827] p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-2">Check Your Email</h2>
              <p className="text-gray-400">
                We've sent a password reset link to <strong>{email}</strong>. 
                The link will expire in 30 minutes.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-400 text-center">
                Didn't receive an email? Check your spam folder or
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2 px-4 border border-gray-600 rounded-md shadow-sm text-white bg-[#1F2937] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                Try again
              </button>
              
              <div className="text-center pt-2">
                <Link href="/login" className="text-[#8B5CF6] hover:underline text-sm">
                  Return to login
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#111827] p-8 rounded-lg shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#1F2937] text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <Link href="/login" className="text-[#8B5CF6] hover:underline text-sm">
                Back to login
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password? <Link href="/login" className="text-[#8B5CF6] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 