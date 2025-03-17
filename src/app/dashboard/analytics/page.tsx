'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Using simple date inputs instead of a complex date picker
const SimpleRangePicker = ({
  dateRange,
  setDateRange
}: {
  dateRange: any;
  setDateRange: (range: any) => void;
}) => (
  <div className="flex space-x-2 items-center">
    <label className="text-sm">From:</label>
    <input
      type="date"
      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
      value={dateRange?.from ? new Date(dateRange.from).toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const from = e.target.value ? new Date(e.target.value) : undefined;
        setDateRange({ ...dateRange, from });
      }}
    />
    <label className="text-sm">To:</label>
    <input
      type="date"
      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
      value={dateRange?.to ? new Date(dateRange.to).toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const to = e.target.value ? new Date(e.target.value) : undefined;
        setDateRange({ ...dateRange, to });
      }}
    />
  </div>
);
// Using inline PageTitle component instead of importing
const PageTitle = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-5">
    <h1 className="text-2xl font-bold">{title}</h1>
    {description && <p className="text-gray-400 mt-1">{description}</p>}
  </div>
);
import RoleBasedAnalytics from '@/components/dashboard/RoleBasedAnalytics';
import { fetchProjects, fetchTimeEntries, fetchTasks, fetchUsers } from '@/services/api';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
// Simple inline skeleton component
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-gray-700/20 ${className || ''}`}
    {...props}
  />
);
import { useSession } from 'next-auth/react';

export default function AnalyticsPage() {
  // Get user session and role
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'user';

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Fetch data
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const { data: timeEntries, isLoading: timeEntriesLoading, error: timeEntriesError } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: fetchTimeEntries,
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Check for errors
  if (projectsError || tasksError || timeEntriesError || usersError) {
    console.error('Error fetching data:', {
      projectsError,
      tasksError,
      timeEntriesError,
      usersError,
    });
  }

  // Loading states
  const isLoading = projectsLoading || tasksLoading || timeEntriesLoading || usersLoading;

  // Filter data based on date range
  const filteredTimeEntries = Array.isArray(timeEntries) ? timeEntries.filter((entry: any) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const entryDate = new Date(entry.date);
    return entryDate >= dateRange.from && entryDate <= dateRange.to;
  }) : [];
  
  
  const roleFilteredProjects = Array.isArray(projects) ? projects.filter((project: any) => {
    // For client role, only show their projects.
    if (userRole === 'client' && session?.user?.id) {
      return project.clientId === session.user.id;
    }
    // Admin and team see all projects
    return true;
  }) : [];
  

 // Filter tasks based on user role if needed
 const roleFilteredTasks = Array.isArray(tasks) ? tasks.filter((task: any) => {
  if (userRole === 'team' && session?.user?.id) {
    return task.assigneeId === session.user.id;
  }
  if (userRole === 'client' && session?.user?.id) {
    return roleFilteredProjects.some((p: any) => p.id === task.projectId);
  }
  return true;
}) : [];

  const safeFilteredTimeEntries = filteredTimeEntries || [];
  const safeRoleFilteredProjects = roleFilteredProjects || [];
  const safeRoleFilteredTasks = roleFilteredTasks || [];

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <PageTitle 
          title="Analytics Dashboard" 
          description={`Data visualizations ${userRole === 'admin' ? 'for all projects' : 
                       userRole === 'team' ? 'for your team activities' : 
                       'for your projects'}`}
        />
        <div className="flex items-center gap-2">
          <SimpleRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>

      {/* Role-based analytics dashboard */}
      <RoleBasedAnalytics
        role={userRole}
        projects={safeRoleFilteredProjects}
        tasks={safeRoleFilteredTasks}
        timeEntries={safeFilteredTimeEntries}
        users={users || []}
        isLoading={isLoading}
      />

      {/* Additional insights card - shown to all users */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Insights</CardTitle>
            <CardDescription>Summary of important metrics from your data</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Project completion trend */}
                <div className="pb-2 border-b">
                  <h3 className="font-medium">Project Health</h3>
                  <p className="text-sm text-muted-foreground">
                    {safeRoleFilteredProjects.filter((p: any) => p.status === 'COMPLETED').length} completed, 
                    {safeRoleFilteredProjects.filter((p: any) => p.status === 'IN_PROGRESS').length} in progress, 
                    {safeRoleFilteredProjects.filter((p: any) => p.status === 'ON_HOLD').length} on hold
                  </p>
                </div>

                {/* Task completion stats */}
                <div className="pb-2 border-b">
                  <h3 className="font-medium">Task Completion Rate</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((safeRoleFilteredTasks.filter((t: any) => t.status === 'COMPLETED').length / 
                    (safeRoleFilteredTasks.length || 1)) * 100)}% of tasks completed
                  </p>
                </div>

                {/* Time tracking insight */}
                {(userRole === 'admin' || userRole === 'team') && (
                  <div className="pb-2 border-b">
                    <h3 className="font-medium">Time Utilization</h3>
                    <p className="text-sm text-muted-foreground">                  
                      {Math.round(filteredTimeEntries.reduce((sum: number, entry: any) => {
                        const hours = 'hours' in entry 
                          ? Number(entry.hours) 
                          : Number(entry.minutes || 0) / 60;
                        return sum + hours;
                      }, 0))} hours tracked in selected period
                    </p>
                  </div>
                )}

                {/* Budget insight for admin and client */}
                {(userRole === 'admin' || userRole === 'client') && (
                  <div className="pb-2">
                    <h3 className="font-medium">Budget Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Total budget: ${safeRoleFilteredProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0).toLocaleString()}, 
                      Spent: ${safeRoleFilteredProjects.reduce((sum: number, p: any) => sum + (p.actualCost || 0), 0).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
