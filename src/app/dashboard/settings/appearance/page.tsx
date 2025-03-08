'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Mock theme options
const themeOptions = [
  { id: 'dark', name: 'Dark (Default)', description: 'Dark background with light text' },
  { id: 'light', name: 'Light', description: 'Light background with dark text' },
  { id: 'system', name: 'System', description: 'Follow your system preferences' },
];

// Mock accent color options
const accentColorOptions = [
  { id: 'purple', name: 'Purple (Default)', color: '#8B5CF6' },
  { id: 'blue', name: 'Blue', color: '#3B82F6' },
  { id: 'green', name: 'Green', color: '#10B981' },
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'orange', name: 'Orange', color: '#F59E0B' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
];

// Mock font size options
const fontSizeOptions = [
  { id: 'small', name: 'Small', scale: 0.875 },
  { id: 'medium', name: 'Medium (Default)', scale: 1 },
  { id: 'large', name: 'Large', scale: 1.125 },
  { id: 'xl', name: 'Extra Large', scale: 1.25 },
];

// Mock animation options
const animationOptions = [
  { id: 'enabled', name: 'Enabled (Default)', description: 'Show animations throughout the interface' },
  { id: 'reduced', name: 'Reduced', description: 'Show fewer and simpler animations' },
  { id: 'disabled', name: 'Disabled', description: 'Disable all non-essential animations' },
];

export default function AppearanceSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    theme: 'dark',
    accentColor: 'purple',
    fontSize: 'medium',
    animations: 'enabled',
    sidebarCollapsed: false,
    denseMode: false,
    showAvatars: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Simulate fetching user appearance settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        // For demo, we'll use the default settings
      } catch (error) {
        console.error('Error fetching appearance settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSettingChange = (settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
    
    // Clear any previous success/error messages
    setSaveSuccess(false);
    setSaveError(null);
  };
  
  const handleToggleSetting = (settingId: string) => {
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
        // Apply the theme immediately (this is just for demo)
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.add(`${settings.theme}-theme`);
        
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError('An error occurred while saving your preferences. Please try again.');
      }
    } catch (error) {
      setSaveError('An error occurred while saving your preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Appearance Settings</h1>
          <p className="text-gray-400 mt-1">Customize the look and feel of the application</p>
        </div>
        
        <Link 
          href="/dashboard/settings" 
          className="text-gray-400 hover:text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Settings
        </Link>
      </div>
      
      {isLoading ? (
        <div className="bg-[#1F2937] rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="mb-6">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-16 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {saveSuccess && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-4">
              Your appearance settings have been saved successfully.
            </div>
          )}
          
          {saveError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
              {saveError}
            </div>
          )}
          
          <div className="space-y-8">
            {/* Theme Selection */}
            <div className="bg-[#1F2937] rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">Theme</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {themeOptions.map(theme => (
                  <div
                    key={theme.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      settings.theme === theme.id
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleSettingChange('theme', theme.id)}
                  >
                    <div className={`h-6 rounded-full w-6 mr-2 inline-flex items-center justify-center ${
                      settings.theme === theme.id ? 'bg-[#8B5CF6] text-white' : 'bg-gray-700'
                    }`}>
                      {settings.theme === theme.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{theme.name}</span>
                    <p className="text-sm text-gray-400 mt-1">{theme.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Accent Color Selection */}
            <div className="bg-[#1F2937] rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">Accent Color</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {accentColorOptions.map(color => (
                  <div
                    key={color.id}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                      settings.accentColor === color.id
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleSettingChange('accentColor', color.id)}
                  >
                    <div 
                      className="h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <span className="text-sm">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Font Size Selection */}
            <div className="bg-[#1F2937] rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">Font Size</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {fontSizeOptions.map(option => (
                  <div
                    key={option.id}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                      settings.fontSize === option.id
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleSettingChange('fontSize', option.id)}
                  >
                    <div 
                      className="font-medium mb-1"
                      style={{ fontSize: `${option.scale}rem` }}
                    >
                      Aa
                    </div>
                    <span className="text-sm">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Animation Settings */}
            <div className="bg-[#1F2937] rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">Animation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {animationOptions.map(option => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      settings.animations === option.id
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleSettingChange('animations', option.id)}
                  >
                    <div className={`h-6 rounded-full w-6 mr-2 inline-flex items-center justify-center ${
                      settings.animations === option.id ? 'bg-[#8B5CF6] text-white' : 'bg-gray-700'
                    }`}>
                      {settings.animations === option.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{option.name}</span>
                    <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional UI Options */}
            <div className="bg-[#1F2937] rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">Interface Options</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sidebar Collapsed by Default</h3>
                    <p className="text-sm text-gray-400">Start with the sidebar collapsed when you log in</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.sidebarCollapsed}
                      onChange={() => handleToggleSetting('sidebarCollapsed')}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dense Mode</h3>
                    <p className="text-sm text-gray-400">Reduce spacing to show more content on screen</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.denseMode}
                      onChange={() => handleToggleSetting('denseMode')}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show User Avatars</h3>
                    <p className="text-sm text-gray-400">Display user profile pictures throughout the interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.showAvatars}
                      onChange={() => handleToggleSetting('showAvatars')}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-4 py-2 bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : 'Save Preferences'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 