'use client';

import React from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | ProjectPulse',
  description: 'Manage your ProjectPulse account settings',
};

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
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  // Handle keyboard navigation for the settings sections
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((index + 1) % settingsSections.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((index - 1 + settingsSections.length) % settingsSections.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(settingsSections.length - 1);
        break;
      default:
        break;
    }
  };

  // Focus on the active section when activeIndex changes
  React.useEffect(() => {
    if (activeIndex >= 0) {
      const activeElement = document.getElementById(`settings-section-${activeIndex}`);
      if (activeElement) {
        activeElement.focus();
      }
    }
  }, [activeIndex]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-200">Settings</h1>
        <p className="mt-1 text-sm text-gray-400" id="settings-description">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div 
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="navigation"
          aria-labelledby="settings-navigation"
        >
          <h2 id="settings-navigation" className="sr-only">Settings navigation</h2>
          
          {settingsSections.map((section, index) => (
            <Link
              key={section.id}
              href={section.href}
              id={`settings-section-${index}`}
              className="bg-[#1F2937] overflow-hidden rounded-lg shadow divide-y divide-gray-700 hover:bg-[#283548] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-labelledby={`section-name-${section.id}`}
              aria-describedby={`section-desc-${section.id}`}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setActiveIndex(index)}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[#374151] p-2 rounded-md">
                    <span className="text-purple-500" aria-hidden="true">
                      {section.icon}
                    </span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 
                      id={`section-name-${section.id}`}
                      className="text-lg font-medium text-gray-200 truncate"
                    >
                      {section.title}
                    </h3>
                    <p 
                      id={`section-desc-${section.id}`}
                      className="mt-1 text-sm text-gray-400"
                    >
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 