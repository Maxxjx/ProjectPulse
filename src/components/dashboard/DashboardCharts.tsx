'use client';

import React, { useState, useEffect } from 'react';
import { ProjectProgressChart } from '../charts';
import { useProjects } from '@/lib/hooks/useProjects';
import { useTasks } from '@/lib/hooks/useTasks';
import { useTimeEntriesInRange } from '@/lib/hooks/useTimeTracking';
import { useUsers } from '@/lib/hooks/useUsers';
import { format, subDays, isWithinInterval } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { DashboardFilters, DashboardFilters as FilterTypes } from './DashboardFilters';

interface DashboardChartsProps {
  filters?: FilterTypes;
  showFilters?: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  filters = {}, 
  showFilters = false 
}) => {
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'user';
  const userId = session?.user?.id;
  const [localFilters, setLocalFilters] = useState<FilterTypes>(filters);
  const [projects, setProjects] = useState<any[]>([]);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update local filters when parent filters change
  useEffect(() => {
    // Deep equality check to prevent unnecessary re-renders
    const isEqual = JSON.stringify(localFilters) === JSON.stringify(filters);
    if (!isEqual) {
      setLocalFilters(filters);
    }
  }, [filters]);

  // Get data for charts
  const today = new Date();
  // Use date range from filters or default to last 30 days
  const dateFrom = localFilters.dateRange?.from || subDays(today, 30);
  const dateTo = localFilters.dateRange?.to || today;
  const startDate = format(dateFrom, 'yyyy-MM-dd');
  const endDate = format(dateTo, 'yyyy-MM-dd');
  
  const { data: allProjects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
  const { data: timeEntries = [], isLoading: isLoadingTimeEntries } = useTimeEntriesInRange(startDate, endDate);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  // Transform time entries data (convert minutes to hours) with validation
  const transformedTimeEntries = (timeEntries || []).map((entry: any) => {
    if (!entry) return null;
    
    return {
      ...entry,
      // Convert minutes to hours for charts that expect hours (safely handle undefined)
      hours: entry.minutes ? entry.minutes / 60 : 0,
      // Ensure date is in proper format
      date: entry.date || (entry.createdAt ? new Date(entry.createdAt).toISOString().split('T')[0] : format(today, 'yyyy-MM-dd'))
    };
  }).filter(Boolean); // Remove any null entries

  // Format projects for filter dropdown
  useEffect(() => {
    if (allProjects && allProjects.length > 0) {
      const formattedProjects = allProjects.map((project: any) => ({
        id: project.id.toString(),
        name: project.name
      }));
      setProjects(formattedProjects);
    }
  }, [allProjects]);

  // Handle filter changes from the DashboardFilters component
  const handleFilterChange = (newFilters: FilterTypes) => {
    setLocalFilters(newFilters);
  };

  // Filter data based on user role with safety checks
  const roleFilteredProjects = (allProjects || []).filter((project: any) => {
    if (!project) return false;
    
    // For client role, only show their projects
    if (userRole === 'client' && userId) {
      return project.clientId === userId;
    }
    // Admin and team see all projects
    return true;
  });

  // Apply dashboard filters to projects
  const filteredProjects = roleFilteredProjects.filter((project: any) => {
    if (!project) return false;
    
    // Filter by project ID if specified
    if (localFilters.projectId && project.id.toString() !== localFilters.projectId) {
      return false;
    }
    
    // Filter by status if specified
    if (localFilters.status && localFilters.status !== 'all') {
      const formattedProjectStatus = project.status?.toLowerCase().replace(/\s+/g, '-');
      if (formattedProjectStatus !== localFilters.status) {
        return false;
      }
    }
    
    // Filter by department if specified
    if (localFilters.departmentId && project.departmentId?.toString() !== localFilters.departmentId) {
      return false;
    }
    
    return true;
  });

  // Filter tasks based on user role with safety checks
  const roleFilteredTasks = (tasks || []).filter((task: any) => {
    if (!task) return false;
    
    // For team members, prioritize their assigned tasks
    if (userRole === 'team' && userId) {
      return task.assigneeId === userId;
    }
    // For clients, only show tasks for their projects
    if (userRole === 'client' && userId && task.projectId) {
      return roleFilteredProjects.some((p: any) => p && p.id === task.projectId);
    }
    // Admin sees all tasks
    return true;
  });

  // Apply dashboard filters to tasks
  const filteredTasks = roleFilteredTasks.filter((task: any) => {
    if (!task) return false;
    
    // Filter by project ID if specified
    if (localFilters.projectId && task.projectId?.toString() !== localFilters.projectId) {
      return false;
    }
    
    // Filter by status if specified
    if (localFilters.status && localFilters.status !== 'all') {
      const formattedTaskStatus = task.status?.toLowerCase().replace(/\s+/g, '-');
      if (formattedTaskStatus !== localFilters.status) {
        return false;
      }
    }
    
    // Filter by date range if specified
    if (localFilters.dateRange?.from) {
      try {
        const taskDate = new Date(task.deadline || task.dueDate || task.createdAt);
        const fromDate = localFilters.dateRange.from;
        const toDate = localFilters.dateRange.to || today;
        
        if (!isWithinInterval(taskDate, { start: fromDate, end: toDate })) {
          return false;
        }
      } catch (error) {
        // If date parsing fails, keep the task (don't filter it out)
        console.warn('Failed to parse date for task:', task.id);
      }
    }
    
    return true;
  });

  // Filter time entries based on user role with safety checks
  const roleFilteredTimeEntries = transformedTimeEntries.filter((entry: any) => {
    if (!entry) return false;
    
    if (userRole === 'team' && userId) {
      return entry.userId === userId;
    }
    
    if (userRole === 'client' && userId) {
      const projectId = entry.projectId || (entry.task && entry.task.projectId);
      if (!projectId) return false;
      
      return roleFilteredProjects.some((p: any) => p && p.id === projectId);
    }
    
    return true;
  });

  // Apply dashboard filters to time entries
  const filteredTimeEntries = roleFilteredTimeEntries.filter((entry: any) => {
    if (!entry) return false;
    
    // Filter by project ID if specified
    const projectId = entry.projectId || (entry.task && entry.task.projectId);
    if (localFilters.projectId && projectId?.toString() !== localFilters.projectId) {
      return false;
    }
    
    // Filter by date range if specified
    if (localFilters.dateRange?.from) {
      try {
        const entryDate = new Date(entry.date || entry.createdAt);
        const fromDate = localFilters.dateRange.from;
        const toDate = localFilters.dateRange.to || today;
        
        if (!isWithinInterval(entryDate, { start: fromDate, end: toDate })) {
          return false;
        }
      } catch (error) {
        // If date parsing fails, keep the entry (don't filter it out)
        console.warn('Failed to parse date for time entry');
      }
    }
    
    return true;
  });

  // Show loading state if data is not ready
  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingTimeEntries || isLoadingUsers;

  // Enhanced debug logging to help investigate chart data issues
  useEffect(() => {
    if (isClient && !isLoading) {
      console.log('Dashboard data debug:', {
        // Input data
        projects: allProjects?.length || 0,
        tasks: tasks?.length || 0,
        timeEntries: timeEntries?.length || 0,
        users: users?.length || 0,
        
        // Filtered data
        roleFilteredProjects: roleFilteredProjects?.length || 0,
        filteredProjects: filteredProjects?.length || 0,
        roleFilteredTasks: roleFilteredTasks?.length || 0,
        filteredTasks: filteredTasks?.length || 0,
        roleFilteredTimeEntries: roleFilteredTimeEntries?.length || 0,
        filteredTimeEntries: filteredTimeEntries?.length || 0,
        
        // Filters applied
        filters: localFilters,
        
        // Time range
        startDate,
        endDate,
      });
    }
  }, [isClient, isLoading, allProjects, tasks, timeEntries, users, roleFilteredProjects, filteredProjects, roleFilteredTasks, filteredTasks, roleFilteredTimeEntries, filteredTimeEntries, localFilters, startDate, endDate]);

  // If we're still on the server or loading data, return a loading placeholder
  if (!isClient || isLoading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 mb-6"></div>
              <div className="h-[300px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 mb-6"></div>
              <div className="h-[350px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show only project status chart
  const hasProjects = filteredProjects && filteredProjects.length > 0;

  // If we're still on the server or loading data, return a loading placeholder
  if (!isClient || isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 mb-6"></div>
          <div className="h-[300px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <DashboardFilters
          onFilterChange={handleFilterChange}
          projects={projects}
          showProjectFilter={true}
          showStatusFilter={true}
          showDepartmentFilter={true}
          showDateRange={false}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          <ProjectProgressChart
            title="Project Status"
            height={350}
            projects={filteredProjects}
            isLoading={isLoadingProjects}
          />
          {!hasProjects && (
            <div className="text-center text-gray-500 mt-4">
              No projects available to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  ); 
    // Client gets project-focused charts
    else if (userRole === 'client') {
      charts.topRow = [
        <div key="project-progress" className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-light to-primary"></div>
          <ProjectProgressChart 
            title="Your Projects" 
            description="Current progress of your projects"
            height={300}
            projects={filteredProjects}
          />
        </div>,
        <div key="task-distribution" className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
          <TaskDistributionChart 
            title="Project Tasks" 
            description="Status of tasks across your projects"
            height={300}
            tasks={filteredTasks}
            projects={filteredProjects}
          />
        </div>
      ];
      
      charts.bottomRow = [
        <div key="budget-comparison" className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
          <BudgetComparisonChart 
            title="Budget Status" 
            description="Budget vs actual spending on your projects"
            height={350}
            projects={filteredProjects}
            timeEntries={filteredTimeEntries}
          />
        </div>
      ];
    }
    
    return charts;
  };

  const charts = getCharts();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Analytics Dashboard
        </h2>
        
        {/* Toggle for filters visibility */}
        {showFilters && (
          <div className="mt-4 md:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium mb-3">Filter Dashboard</h3>
              <DashboardFilters
                projects={projects}
                onFilterChange={handleFilterChange}
                initialFilters={filters}
                showDateFilter={true}
                statuses={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'not-started', label: 'Not Started' },
                ]}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Indicator for active filters */}
      {(localFilters.projectId || localFilters.status || localFilters.departmentId || localFilters.dateRange) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-700 dark:text-blue-300">
            Showing filtered data based on {[
              localFilters.projectId && 'project',
              localFilters.status && 'status',
              localFilters.departmentId && 'department',
              localFilters.dateRange && 'date range'
            ].filter(Boolean).join(', ')}
          </span>
        </div>
      )}

      {/* Display warning if no data is available after filtering */}
      {filteredProjects.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">No projects match your filter criteria</h3>
          </div>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
            Try changing your filter settings to view project data.
          </p>
        </div>
      )}

      {/* Project and Task charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.topRow.map((chart, index) => (
          <React.Fragment key={`top-chart-${index}`}>
            {chart}
          </React.Fragment>
        ))}
      </div>

      {/* Larger charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.bottomRow.map((chart, index) => (
          <React.Fragment key={`bottom-chart-${index}`}>
            {chart}
          </React.Fragment>
        ))}
      </div>
      
      {/* Development mode debug panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-8 bg-gray-50 dark:bg-gray-800/50">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Debug Information (Development Only)
            </summary>
            <div className="text-xs font-mono whitespace-pre-wrap mt-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-auto max-h-96">
              <div>User Role: {userRole}</div>
              <div>Date Range: {startDate} to {endDate}</div>
              <div>Projects (Filtered/Total): {filteredProjects.length}/{allProjects.length}</div>
              <div>Tasks (Filtered/Total): {filteredTasks.length}/{tasks.length}</div>
              <div>Time Entries (Filtered/Total): {filteredTimeEntries.length}/{timeEntries.length}</div>
              <div>Applied Filters: {JSON.stringify(localFilters, null, 2)}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;