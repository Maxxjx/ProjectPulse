'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRecentActivity } from '@/lib/hooks/useAnalytics';
import Link from 'next/link';
import { DashboardFilters, DashboardFilters as FilterTypes } from '@/components/dashboard/DashboardFilters';
import { DateRange } from 'react-day-picker';

export default function ActivityView() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [filters, setFilters] = useState<FilterTypes>({});
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters based on filters
        const queryParams = new URLSearchParams();
        if (filters.projectId) queryParams.append('projectId', filters.projectId);
        if (filters.status) queryParams.append('type', filters.status); // Using status filter for activity type
        if (filters.dateRange?.from) queryParams.append('fromDate', filters.dateRange.from.toISOString());
        if (filters.dateRange?.to) queryParams.append('toDate', filters.dateRange.to.toISOString());
        
        // Use hook with fallback to sample data
        const { data, isLoading: fetchLoading } = useRecentActivity(20, queryParams.toString());
        
        if (data) {
          setActivities(data);
        } else {
          // Sample data as fallback
          setActivities([
            {
              id: 1,
              userName: 'John Doe',
              action: 'created',
              entityType: 'task',
              entityName: 'Implement Dashboard',
              projectName: 'Website Redesign',
              timestamp: new Date().toISOString(),
              details: null
            },
            {
              id: 2,
              userName: 'Jane Smith',
              action: 'updated',
              entityType: 'project',
              entityName: 'Mobile App Development',
              projectName: null,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              details: 'Changed status from "Not Started" to "In Progress"'
            },
            {
              id: 3,
              userName: 'Robert Chen',
              action: 'completed',
              entityType: 'task',
              entityName: 'Create API Documentation',
              projectName: 'Mobile App Development',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              details: null
            },
            {
              id: 4,
              userName: 'Lisa Brown',
              action: 'deleted',
              entityType: 'task',
              entityName: 'Unused Task',
              projectName: 'Marketing Campaign',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              details: null
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [filters]);
  
  // Fetch projects for project filter
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        // Format projects for the filter dropdown
        const formattedProjects = Array.isArray(data) ? 
          data.map((project: any) => ({
            id: project.id.toString(),
            name: project.name
          })) : [];
          
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use sample projects if API fails
        setProjects([
          { id: '1', name: 'Website Redesign' },
          { id: '2', name: 'Mobile App Development' },
          { id: '3', name: 'Marketing Campaign' },
          { id: '4', name: 'Product Launch' },
          { id: '5', name: 'Customer Research' }
        ]);
      }
    };
    
    fetchProjects();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterTypes) => {
    setFilters(newFilters);
  };

  // Filter activities based on selected filter
  const filteredActivities = activities?.filter((activity: any) => {
    // Basic filter
    const matchesActionFilter = filter === 'all' || activity.action === filter;
    
    // Project filter from DashboardFilters
    const matchesProjectFilter = !filters.projectId || 
      activity.projectName?.toLowerCase().replace(/\s+/g, '-') === 
      projects.find(p => p.id === filters.projectId)?.name.toLowerCase().replace(/\s+/g, '-');
    
    // Activity type filter - map status to action
    const matchesTypeFilter = !filters.status || 
      (filters.status === 'all' ? true : 
      activity.action === filters.status.replace('-', ' '));
    
    // Date filter
    let matchesDateFilter = true;
    if (filters.dateRange?.from) {
      const activityDate = new Date(activity.timestamp);
      const fromDate = filters.dateRange.from;
      const toDate = filters.dateRange.to || new Date();
      
      matchesDateFilter = activityDate >= fromDate && activityDate <= toDate;
    }
    
    return matchesActionFilter && matchesProjectFilter && matchesTypeFilter && matchesDateFilter;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recent Activity</h1>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Filters</h2>
          <button 
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
            className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] flex items-center"
          >
            {isAdvancedFiltersOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Hide Advanced Filters
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Show Advanced Filters
              </>
            )}
          </button>
        </div>
        
        {/* Basic Filter - Always visible */}
        <div className="mb-4">
          <label htmlFor="activityFilter" className="block text-sm font-medium text-gray-400 mb-1">
            Activity Type
          </label>
          <select
            id="activityFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          >
            <option value="all">All Activities</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        {/* Advanced Filters - Toggle */}
        {isAdvancedFiltersOpen && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-300 mb-3">Advanced Filters</h3>
            <DashboardFilters
              projects={projects}
              onFilterChange={handleFilterChange}
              showDateFilter={true}
              statuses={[
                { value: 'all', label: 'All Types' },
                { value: 'created', label: 'Created' },
                { value: 'updated', label: 'Updated' },
                { value: 'completed', label: 'Completed' },
                { value: 'deleted', label: 'Deleted' },
              ]}
            />
          </div>
        )}
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