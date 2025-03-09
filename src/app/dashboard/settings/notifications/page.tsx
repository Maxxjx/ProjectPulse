'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Mock notification settings
const defaultNotificationSettings = {
  taskAssignments: true,
  taskComments: true,
  taskStatusChanges: true,
  projectUpdates: true,
  deadlineReminders: true,
  weeklySummary: true,
  dailyDigest: false,
  systemAnnouncements: true,
  teamChanges: true,
  inAppNotifications: true,
  emailNotifications: true,
  pushNotifications: false,
};

// Email notification types as a readable format
const notificationTypes = [
  { id: 'taskAssignments', label: 'Task Assignments', description: 'When you are assigned to a task' },
  { id: 'taskComments', label: 'Task Comments', description: 'When someone comments on your tasks' },
  { id: 'taskStatusChanges', label: 'Task Status Changes', description: 'When the status of a task you\'re involved with changes' },
  { id: 'projectUpdates', label: 'Project Updates', description: 'When there are updates to projects you\'re involved with' },
  { id: 'deadlineReminders', label: 'Deadline Reminders', description: 'Reminders for upcoming task deadlines' },
  { id: 'weeklySummary', label: 'Weekly Summary', description: 'A weekly summary of your tasks and progress' },
  { id: 'dailyDigest', label: 'Daily Digest', description: 'A daily summary of updates and changes' },
  { id: 'systemAnnouncements', label: 'System Announcements', description: 'Important announcements about ProjectPulse' },
  { id: 'teamChanges', label: 'Team Changes', description: 'When team members are added or removed' },
];

// Delivery methods
const deliveryMethods = [
  { id: 'inAppNotifications', label: 'In-App Notifications', description: 'Receive notifications in the application' },
  { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
  { id: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications on your mobile device (requires app installation)' },
];

export default function NotificationPreferencesPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState(defaultNotificationSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Simulate fetching user notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo, we'll use the default settings
        // In a real app, this would be fetched from an API
        setSettings(defaultNotificationSettings);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof prev]
    }));
    
    // Clear any previous success/error messages
    setSaveSuccess(false);
    setSaveError(null);
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);

        // Focus on the success message for screen readers
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
          successMessage.focus();
        }
      } else {
        setSaveError('An error occurred while saving your preferences. Please try again.');
        
        // Focus on the error message for screen readers
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
          errorMessage.focus();
        }
      }
    } catch (error) {
      setSaveError('An error occurred while saving your preferences. Please try again.');
      
      // Focus on the error message for screen readers
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.focus();
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDisableAll = () => {
    const updatedSettings = { ...settings };
    notificationTypes.forEach(type => {
      updatedSettings[type.id as keyof typeof settings] = false;
    });
    setSettings(updatedSettings);
    
    // Clear any previous success/error messages
    setSaveSuccess(false);
    setSaveError(null);
  };
  
  const handleEnableAll = () => {
    const updatedSettings = { ...settings };
    notificationTypes.forEach(type => {
      updatedSettings[type.id as keyof typeof settings] = true;
    });
    setSettings(updatedSettings);
    
    // Clear any previous success/error messages
    setSaveSuccess(false);
    setSaveError(null);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" id="page-title">Notification Preferences</h1>
          <p className="text-gray-400 mt-1" id="page-description">Customize how and when you receive notifications</p>
        </div>
        
        <Link 
          href="/dashboard/settings" 
          className="text-gray-400 hover:text-white flex items-center"
          aria-label="Back to Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Settings
        </Link>
      </div>
      
      {isLoading ? (
        <div 
          className="bg-[#1F2937] rounded-lg shadow-lg p-6 animate-pulse"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading notification preferences"
        >
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-700">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-10 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {saveSuccess && (
            <div 
              id="success-message"
              className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-4"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              Your notification preferences have been saved successfully.
            </div>
          )}
          
          {saveError && (
            <div 
              id="error-message"
              className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              {saveError}
            </div>
          )}
          
          <div 
            className="bg-[#1F2937] rounded-lg shadow-lg p-6 mb-6"
            role="region"
            aria-labelledby="notification-types-heading"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="notification-types-heading" className="text-lg font-medium">Notification Types</h2>
              <div className="space-x-2">
                <button 
                  onClick={handleDisableAll}
                  className="px-3 py-1 text-sm bg-[#111827] hover:bg-[#0B111E] active:bg-[#050a10] rounded-md border border-gray-700"
                  aria-label="Disable all notification types"
                >
                  Disable All
                </button>
                <button 
                  onClick={handleEnableAll}
                  className="px-3 py-1 text-sm bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 rounded-md"
                  aria-label="Enable all notification types"
                >
                  Enable All
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-700" role="list">
              {notificationTypes.map(type => (
                <div 
                  key={type.id} 
                  className="py-4 flex items-center justify-between"
                  role="listitem"
                >
                  <div id={`label-${type.id}`}>
                    <h3 className="font-medium">{type.label}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                  <label 
                    className="relative inline-flex items-center cursor-pointer"
                    htmlFor={`toggle-${type.id}`}
                  >
                    <input 
                      id={`toggle-${type.id}`}
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings[type.id as keyof typeof settings] || false}
                      onChange={() => handleToggle(type.id)}
                      aria-labelledby={`label-${type.id}`}
                    />
                    <div 
                      className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"
                      aria-hidden="true"
                    ></div>
                    <span className="sr-only">Toggle {type.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="bg-[#1F2937] rounded-lg shadow-lg p-6 mb-6"
            role="region"
            aria-labelledby="delivery-methods-heading"
          >
            <h2 id="delivery-methods-heading" className="text-lg font-medium mb-6">Delivery Methods</h2>
            
            <div className="divide-y divide-gray-700" role="list">
              {deliveryMethods.map(method => (
                <div 
                  key={method.id} 
                  className="py-4 flex items-center justify-between"
                  role="listitem"
                >
                  <div id={`label-${method.id}`}>
                    <h3 className="font-medium">{method.label}</h3>
                    <p className="text-sm text-gray-400">{method.description}</p>
                  </div>
                  <label 
                    className="relative inline-flex items-center cursor-pointer"
                    htmlFor={`toggle-${method.id}`}
                  >
                    <input 
                      id={`toggle-${method.id}`}
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings[method.id as keyof typeof settings] || false}
                      onChange={() => handleToggle(method.id)}
                      aria-labelledby={`label-${method.id}`}
                    />
                    <div 
                      className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"
                      aria-hidden="true"
                    ></div>
                    <span className="sr-only">Toggle {method.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-live="polite"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 