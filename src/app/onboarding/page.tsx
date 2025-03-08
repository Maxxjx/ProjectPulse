'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the onboarding steps
const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to ProjectPulse',
    description: 'The modern project management tool designed to boost your productivity. Let\'s get you set up in just a few steps.',
    image: '/onboarding/welcome.svg',
  },
  {
    id: 'projects',
    title: 'Manage Your Projects',
    description: 'Create and manage projects, set deadlines, track progress, and collaborate with your team in real-time.',
    image: '/onboarding/projects.svg',
    features: [
      'Create multiple projects and organize them into categories',
      'Set project objectives, milestones, and deadlines',
      'Track project progress with visual dashboards',
      'Collaborate with team members in real-time'
    ]
  },
  {
    id: 'tasks',
    title: 'Task Management',
    description: 'Break down projects into manageable tasks, assign them to team members, and track their status.',
    image: '/onboarding/tasks.svg',
    features: [
      'Create tasks with descriptions, due dates, and priorities',
      'Assign tasks to team members and track ownership',
      'Organize tasks with labels and categories',
      'Move tasks through custom workflows'
    ]
  },
  {
    id: 'calendar',
    title: 'Calendar & Deadlines',
    description: 'Never miss a deadline again with our comprehensive calendar view that syncs across all devices.',
    image: '/onboarding/calendar.svg',
    features: [
      'Get a clear overview of all project deadlines',
      'Receive timely reminders for upcoming due dates',
      'Sync with your favorite calendar apps',
      'Manage your schedule with daily, weekly, and monthly views'
    ]
  },
  {
    id: 'notifications',
    title: 'Stay Updated with Notifications',
    description: 'Get notified about important updates, mentions, and approaching deadlines so you never miss a thing.',
    image: '/onboarding/notifications.svg',
    features: [
      'Receive real-time notifications for task assignments and updates',
      'Customize your notification preferences',
      'Get daily or weekly summaries of your tasks and deadlines',
      'Stay informed with email and push notifications'
    ]
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'re now ready to start using ProjectPulse and boost your productivity. Dive in and explore all the features!',
    image: '/onboarding/complete.svg',
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    sendNotifications: true,
    weeklyDigest: true,
    showTips: true,
  });
  
  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  
  const handleNext = () => {
    if (isLastStep) {
      // Save preferences and redirect to dashboard
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      router.push('/dashboard');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSkip = () => {
    // Mark onboarding as complete with default preferences
    localStorage.setItem('onboardingComplete', 'true');
    router.push('/dashboard');
  };
  
  const handlePreferenceChange = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };
  
  return (
    <div className="min-h-screen bg-[#1F2937] flex flex-col justify-between">
      {/* Header */}
      <header className="bg-[#111827] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center mr-2">
            <span className="font-bold text-white">P</span>
          </div>
          <span className="font-bold text-xl">ProjectPulse</span>
        </div>
        
        {currentStep < onboardingSteps.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white text-sm"
          >
            Skip Onboarding
          </button>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-[#111827] rounded-lg shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-700">
            <div 
              className="h-full bg-[#8B5CF6]" 
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Text */}
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h1>
                <p className="text-gray-400 mb-6">{step.description}</p>
                
                {step.features && (
                  <div className="space-y-3 mb-6">
                    {step.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-[#8B5CF6] mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* User Preferences Form (only on the last step) */}
                {isLastStep && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium">Customize Your Experience</h3>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.sendNotifications}
                          onChange={() => handlePreferenceChange('sendNotifications')}
                        />
                        <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5CF6] relative"></div>
                        <span className="ml-3 text-sm">Send me notifications about task updates</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.weeklyDigest}
                          onChange={() => handlePreferenceChange('weeklyDigest')}
                        />
                        <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5CF6] relative"></div>
                        <span className="ml-3 text-sm">Send me weekly project digest emails</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={preferences.showTips}
                          onChange={() => handlePreferenceChange('showTips')}
                        />
                        <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5CF6] relative"></div>
                        <span className="ml-3 text-sm">Show me tips and best practices</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Image */}
              <div className="flex items-center justify-center">
                <img 
                  src={step.image || '/placeholder-image.svg'} 
                  alt={step.title}
                  className="max-w-full max-h-64"
                  // Placeholder for when images aren't available
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="bg-[#1A2030] p-4 flex justify-between">
            <button
              onClick={handlePrevious}
              className={`px-4 py-2 hover:bg-[#111827] rounded-md transition ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center">
              {onboardingSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentStep ? 'bg-[#8B5CF6]' : 'bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-[#8B5CF6] hover:bg-opacity-90 rounded-md transition"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#111827] p-4 text-center text-sm text-gray-400">
        <p>ProjectPulse © {new Date().getFullYear()} - All rights reserved</p>
      </footer>
    </div>
  );
} 