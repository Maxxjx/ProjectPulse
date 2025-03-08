'use client';

import { useState, useEffect } from 'react';
import { DashboardWidget } from '@/lib/data/types';
import BaseWidget from './BaseWidget';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  tasksCompleted: number;
  tasksAssigned: number;
  productivity: number; // 0-100 score
  lastActiveDate: string;
}

interface TeamPerformanceWidgetProps {
  widget: DashboardWidget;
  isDragging?: boolean;
}

export default function TeamPerformanceWidget({ widget, isDragging }: TeamPerformanceWidgetProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetch from API
    const getTeamPerformance = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setTeamMembers([
        {
          id: '1',
          name: 'John Doe',
          avatar: '/avatars/john.jpg',
          tasksCompleted: 12,
          tasksAssigned: 15,
          productivity: 85,
          lastActiveDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        },
        {
          id: '2',
          name: 'Sarah Smith',
          avatar: '/avatars/sarah.jpg',
          tasksCompleted: 8,
          tasksAssigned: 10,
          productivity: 90,
          lastActiveDate: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        },
        {
          id: '3',
          name: 'Michael Chen',
          avatar: '/avatars/michael.jpg',
          tasksCompleted: 5,
          tasksAssigned: 8,
          productivity: 70,
          lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: '4',
          name: 'Emily Johnson',
          avatar: '/avatars/emily.jpg',
          tasksCompleted: 9,
          tasksAssigned: 9,
          productivity: 95,
          lastActiveDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        }
      ]);
      
      setIsLoading(false);
    };
    
    getTeamPerformance();
  }, []);
  
  // Format last active time
  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get color class based on productivity score
  const getProductivityColorClass = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Get avatar fallback with initials
  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };
  
  return (
    <BaseWidget widget={widget} isDragging={isDragging}>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-8 bg-gray-700 rounded-full w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white overflow-hidden mr-3">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Replace with fallback on error
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.textContent = getAvatarFallback(member.name);
                    }}
                  />
                ) : (
                  getAvatarFallback(member.name)
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{member.name}</h4>
                <div className="flex text-xs text-gray-400">
                  <span>{member.tasksCompleted}/{member.tasksAssigned} tasks</span>
                  <span className="mx-1">•</span>
                  <span>{formatLastActive(member.lastActiveDate)}</span>
                </div>
              </div>
              
              <div className="ml-2">
                <div className="text-sm font-medium text-center">
                  <span className={getProductivityColorClass(member.productivity)}>
                    {member.productivity}%
                  </span>
                </div>
                <div className="w-full h-1 mt-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProductivityBarColor(member.productivity)}`}
                    style={{ width: `${member.productivity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/team"
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm"
            >
              View team details
            </Link>
          </div>
        </div>
      )}
    </BaseWidget>
  );
}

function getProductivityBarColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 75) return 'bg-blue-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
} 