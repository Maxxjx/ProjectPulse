'use client';

import { useState, useEffect } from 'react';
import { DashboardWidget, ActivityLog } from '@/lib/data/types';
import BaseWidget from './BaseWidget';
import Link from 'next/link';

interface RecentActivityWidgetProps {
  widget: DashboardWidget;
  isDragging?: boolean;
}

export default function RecentActivityWidget({ widget, isDragging }: RecentActivityWidgetProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetch from API
    const getRecentActivities = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setActivities([
        {
          id: 1,
          userId: '1',
          userName: 'John Doe',
          action: 'created',
          entityType: 'task',
          entityId: 1,
          entityName: 'Implement Login Page',
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: 2,
          userId: '2',
          userName: 'Sarah Smith',
          action: 'updated',
          entityType: 'project',
          entityId: 1,
          entityName: 'Website Redesign',
          timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        },
        {
          id: 3,
          userId: '3',
          userName: 'Michael Chen',
          action: 'completed',
          entityType: 'task',
          entityId: 2,
          entityName: 'Design Navigation',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]);
      
      setIsLoading(false);
    };
    
    getRecentActivities();
  }, []);
  
  // Format activity date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get activity icon based on action
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'updated':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <BaseWidget widget={widget} isDragging={isDragging}>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-3">
                {getActivityIcon(activity.action)}
              </div>
              <div>
                <p className="text-sm">
                  {activity.userName} {activity.action} {activity.entityType}{' '}
                  <span className="text-[#8B5CF6]">{activity.entityName}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/activity"
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm"
            >
              View all activity
            </Link>
          </div>
        </div>
      )}
    </BaseWidget>
  );
} 