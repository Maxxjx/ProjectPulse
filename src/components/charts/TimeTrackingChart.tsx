'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeEntry, Project, User } from '@/lib/data/types';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import ChartWrapper from './ChartWrapper';

interface TimeTrackingChartProps {
  timeEntries: TimeEntry[];
  projects: Project[];
  users: User[];
  height?: number;
  title?: string;
  description?: string;
}

const TimeTrackingChart: React.FC<TimeTrackingChartProps> = ({
  timeEntries,
  projects,
  users,
  height = 350,
  title = 'Time Tracking',
  description = 'Analysis of time spent on projects'
}) => {
  // Safety check - handle case of missing data
  if (!timeEntries || !Array.isArray(timeEntries) || timeEntries.length === 0) {
    console.warn('TimeTrackingChart: No time entries provided');
  }
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    console.warn('TimeTrackingChart: No projects provided');
  }
  if (!users || !Array.isArray(users) || users.length === 0) {
    console.warn('TimeTrackingChart: No users provided');
  }

  // Ensure all time entries have hours calculated from minutes if not already present
  const entriesWithHours = (timeEntries || []).map(entry => {
    if (!entry) return null;
    
    // Handle possible null/undefined values
    const minutes = entry.minutes ? Number(entry.minutes) : 0;
    const hours = 'hours' in entry && entry.hours ? Number(entry.hours) : minutes / 60;
    
    // Extract projectId from either direct property or via task relation
    let projectId = entry.projectId;
    if (!projectId && entry.task && entry.task.projectId) {
      projectId = entry.task.projectId.toString();
    }
    
    return {
      ...entry,
      hours,
      projectId
    };
  }).filter(Boolean) as (TimeEntry & { hours: number, projectId?: string | number })[]; // Filter out null entries

  // Create maps for quick lookups with validation
  const projectMap = new Map<string | number, Project>();
  (projects || []).forEach(project => {
    if (project && project.id) {
      projectMap.set(project.id.toString(), project);
    }
  });

  const userMap = new Map<string, User>();
  (users || []).forEach(user => {
    if (user && user.id) {
      userMap.set(user.id.toString(), user);
    }
  });

  // Group time entries by project with validation
  const entriesByProject = new Map<string, typeof entriesWithHours>();
  
  // Initialize project entries
  (projects || []).forEach(project => {
    if (project && project.id) {
      entriesByProject.set(project.id.toString(), []);
    }
  });
  
  // Group entries by project with validation
  entriesWithHours.forEach(entry => {
    if (entry.projectId) {
      const projectIdStr = entry.projectId.toString();
      if (entriesByProject.has(projectIdStr)) {
        const projectEntries = entriesByProject.get(projectIdStr) || [];
        projectEntries.push(entry);
        entriesByProject.set(projectIdStr, projectEntries);
      }
    }
  });

  // Calculate total hours by project with validation
  const projectHours = Array.from(entriesByProject.entries())
    .map(([projectId, entries]) => {
      const project = projectMap.get(projectId);
      
      // If entries is undefined or not an array, default to empty array
      const validEntries = Array.isArray(entries) ? entries : [];
      
      // Calculate total hours safely
      const totalHours = validEntries.reduce((sum, entry) => {
        const hours = entry && typeof entry.hours === 'number' ? entry.hours : 0;
        return sum + hours;
      }, 0);
      
      return {
        projectId,
        projectName: project?.name || 'Unknown Project',
        totalHours,
      };
    })
    .filter(project => project.totalHours > 0) // Only include projects with hours
    .sort((a, b) => b.totalHours - a.totalHours);

  // Prepare data for the pie chart
  const pieChartOptions = {
    labels: projectHours.map(p => p.projectName),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
          return `${projectHours[seriesIndex].totalHours.toFixed(1)} hours`;
        }
      }
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  const pieSeries = projectHours.map(p => p.totalHours);

  // Group time entries by day for the last 7 days
  const today = new Date();
  const startDate = startOfWeek(today);
  const endDate = endOfWeek(today);
  
  const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Initialize data structure for daily hours
  const dailyHours = daysOfWeek.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return {
      date: dayStr,
      dayName: format(day, 'EEE'),
      hours: 0,
    };
  });

  // Fill in the hours data
  entriesWithHours.forEach(entry => {
    if (!entry.date) return;
    
    const entryDate = typeof entry.date === 'string' 
      ? parseISO(entry.date) 
      : new Date(entry.date);
    
    const dayStr = format(entryDate, 'yyyy-MM-dd');
    const dayIndex = dailyHours.findIndex(d => d.date === dayStr);
    
    if (dayIndex !== -1) {
      dailyHours[dayIndex].hours += (entry.hours || 0);
    }
  });

  // Prepare data for the area chart
  const areaChartOptions = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    xaxis: {
      categories: dailyHours.map(d => d.dayName),
    },
    yaxis: {
      title: {
        text: 'Hours',
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)} hours`,
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
  };

  const areaSeries = [
    {
      name: 'Hours Logged',
      data: dailyHours.map(d => Math.round(d.hours * 10) / 10),
    }
  ];

  // Calculate user-specific metrics
  const userMetrics = users.map(user => {
    const userEntries = entriesWithHours.filter(entry => entry.userId === user.id);
    const totalHours = userEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    
    // Get projects the user worked on
    const userProjects = new Set<string>();
    userEntries.forEach(entry => {
      if (entry.projectId) userProjects.add(entry.projectId.toString());
    });
    
    return {
      userId: user.id,
      userName: user.name || 'Unknown User',
      totalHours,
      projectCount: userProjects.size,
    };
  }).filter(metric => metric.totalHours > 0)
    .sort((a, b) => b.totalHours - a.totalHours);

  // Determine if we have valid data to display
  const hasTimeEntries = entriesWithHours.length > 0;
  const hasProjects = projectHours.length > 0;
  const hasUsers = userMetrics && userMetrics.length > 0;
  
  // Debug information for troubleshooting
  const debugData = {
    timeEntriesCount: timeEntries?.length || 0,
    validTimeEntriesCount: entriesWithHours.length,
    projectsCount: projects?.length || 0,
    usersCount: users?.length || 0,
    projectHoursCount: projectHours.length,
    dailyHoursWithData: dailyHours.filter(d => d.hours > 0).length,
    sampleTimeEntry: timeEntries && timeEntries.length > 0 ? timeEntries[0] : null,
    sampleProject: projects && projects.length > 0 ? projects[0] : null,
    sampleUser: users && users.length > 0 ? users[0] : null
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasTimeEntries ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium mb-3">Time Distribution by Project</h3>
                {hasProjects ? (
                  <ChartWrapper
                    type="pie"
                    series={pieSeries}
                    options={pieChartOptions}
                    height={height}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded">
                    <p className="text-gray-500">No project data available</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3">Weekly Time Tracking</h3>
                <ChartWrapper
                  type="area"
                  series={areaSeries}
                  options={areaChartOptions}
                  height={height}
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium mb-3">Top Contributors</h3>
              {hasUsers ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userMetrics.slice(0, 3).map(metric => (
                    <div key={metric.userId} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          {metric.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{metric.userName}</p>
                          <p className="text-sm text-gray-400">
                            {metric.projectCount} {metric.projectCount === 1 ? 'project' : 'projects'}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold mt-2">{metric.totalHours.toFixed(1)} hrs</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-gray-500">No user contribution data available</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Time Tracking Data Available</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Start logging time to tasks to see your time analytics.
              </p>
            </div>
          </div>
        )}
        
        {/* Debug information - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded text-xs">
            <details>
              <summary className="cursor-pointer text-amber-800 dark:text-amber-300 font-medium">Debug Information</summary>
              <div className="mt-2 bg-white dark:bg-gray-900 p-2 rounded overflow-auto max-h-[300px]">
                <pre className="text-gray-700 dark:text-gray-300">
                  {JSON.stringify(debugData, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeTrackingChart;