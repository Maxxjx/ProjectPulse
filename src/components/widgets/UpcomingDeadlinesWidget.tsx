'use client';

import { useState, useEffect } from 'react';
import { DashboardWidget } from '@/lib/data/types';
import BaseWidget from './BaseWidget';
import Link from 'next/link';

interface DeadlineTask {
  id: number;
  title: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  project: string;
  projectId: number;
}

interface UpcomingDeadlinesWidgetProps {
  widget: DashboardWidget;
  isDragging?: boolean;
}

export default function UpcomingDeadlinesWidget({ widget, isDragging }: UpcomingDeadlinesWidgetProps) {
  const [deadlines, setDeadlines] = useState<DeadlineTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetch from API
    const getUpcomingDeadlines = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const today = new Date();
      
      // Generate random deadlines for demo
      setDeadlines([
        {
          id: 101,
          title: 'Complete user authentication',
          deadline: new Date(today.getTime() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
          priority: 'high',
          project: 'Website Redesign',
          projectId: 1
        },
        {
          id: 102,
          title: 'Design dashboard layout',
          deadline: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days later
          priority: 'medium',
          project: 'Admin Panel',
          projectId: 2
        },
        {
          id: 103,
          title: 'API integration',
          deadline: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days later
          priority: 'medium',
          project: 'Mobile App',
          projectId: 3
        },
        {
          id: 104,
          title: 'User testing sessions',
          deadline: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days later
          priority: 'low',
          project: 'Website Redesign',
          projectId: 1
        }
      ]);
      
      setIsLoading(false);
    };
    
    getUpcomingDeadlines();
  }, []);
  
  // Format deadline date
  const formatDeadlineDate = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    
    // Reset time part for accurate day comparison
    const deadlineDay = new Date(deadline.setHours(0, 0, 0, 0));
    const todayDay = new Date(today.setHours(0, 0, 0, 0));
    
    const diffTime = deadlineDay.getTime() - todayDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays < 7) {
      return `In ${diffDays} days`;
    } else {
      return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <BaseWidget widget={widget} isDragging={isDragging}>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-3 bg-gray-800 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No upcoming deadlines</p>
          ) : (
            deadlines.map(task => (
              <Link 
                href={`/dashboard/tasks/${task.id}`} 
                key={task.id}
                className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="mb-1 font-medium text-sm">
                  {task.title}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    <span className="text-[#8B5CF6]">{task.project}</span> • {formatDeadlineDate(task.deadline)}
                  </div>
                  <div>
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </Link>
            ))
          )}
          
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/tasks"
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm"
            >
              View all tasks
            </Link>
          </div>
        </div>
      )}
    </BaseWidget>
  );
} 