'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecentActivity } from '@/lib/hooks/useAnalytics';
import Link from 'next/link';

export default function ActivityView() {
  const { data: session } = useSession();
  const { data: activities, isLoading } = useRecentActivity(20); // Get more activities
  const [filter, setFilter] = useState('all');
  // Filter activities based on selected filter
  const filteredActivities = activities?.filter((activity: any) => {
    if (filter === 'all') return true;
    return activity.action === filter;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recent Activity</h1>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1F2937] border border-gray-600 rounded text-sm px-3 py-2"
          >
            <option value="all">All Activities</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111827] rounded-lg p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredActivities && filteredActivities.length > 0 ? (
              filteredActivities.map((activity :any) => (
                <div key={activity.id} className="flex items-start border-b border-gray-700 pb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm mr-4 ${
                    activity.action === 'created' ? 'bg-green-500' : 
                    activity.action === 'updated' ? 'bg-blue-500' : 
                    activity.action === 'deleted' ? 'bg-red-500' :
                    activity.action === 'completed' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}>
                    {activity.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base">
                      <span className="font-medium">{activity.userName}</span> {activity.action} {activity.entityType} 
                      <span className="text-[#8B5CF6] font-medium"> {activity.entityName}</span>
                      {activity.projectName && (
                        <span className="text-gray-400"> in project </span>
                      )}
                      {activity.projectName && (
                        <span className="text-[#8B5CF6] font-medium">{activity.projectName}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    {activity.details && (
                      <p className="text-sm mt-2 text-gray-300">{activity.details}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-10">No activities found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 