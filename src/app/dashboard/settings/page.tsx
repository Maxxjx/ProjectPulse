'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    description: 'Update your personal information, email, and avatar',
    href: '/dashboard/settings/profile',
  },
  {
    id: 'account',
    title: 'Account Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Manage your password, two-factor authentication, and account security',
    href: '/dashboard/settings/account',
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    description: 'Control what notifications you receive and how they are delivered',
    href: '/dashboard/settings/notifications',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    description: 'Customize the look and feel of the application',
    href: '/dashboard/settings/appearance',
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    description: 'Control your privacy settings and data usage preferences',
    href: '/dashboard/settings/privacy',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    description: 'Connect your account with other services and applications',
    href: '/dashboard/settings/integrations',
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="bg-[#1F2937] rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {session?.user?.name?.[0] || "U"}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-medium">{session?.user?.name || "User"}</h2>
            <p className="text-gray-400">{session?.user?.email || "user@example.com"}</p>
            <p className="text-sm text-[#8B5CF6] capitalize mt-1">{session?.user?.role || "user"} Account</p>
          </div>
          
          <div>
            <Link 
              href="/dashboard/settings/profile" 
              className="inline-flex items-center px-4 py-2 bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 rounded-md transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="bg-[#1F2937] hover:bg-[#283548] active:bg-[#1a2536] rounded-lg p-6 transition-colors"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#111827] rounded-lg flex items-center justify-center mr-3 text-[#8B5CF6]">
                {section.icon}
              </div>
              <h2 className="text-lg font-medium">{section.title}</h2>
            </div>
            <p className="text-gray-400 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 bg-[#1F2937] rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium mb-4">Danger Zone</h2>
        <p className="text-gray-400 mb-4">
          Permanently delete your account and all of your content from ProjectPulse. This action cannot be undone.
        </p>
        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md text-white transition">
          Delete Account
        </button>
      </div>
    </div>
  );
} 