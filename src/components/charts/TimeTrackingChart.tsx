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
  // Ensure all time entries have hours calculated from minutes if not already present
  const entriesWithHours = timeEntries.map(entry => ({
    ...entry,
    hours: 'hours' in entry ? Number(entry.hours) : Number(entry.minutes) / 60,
    // Ensure projectId is set for grouping purposes
    projectId: entry.projectId || (entry.task && entry.task.projectId ? entry.task.projectId.toString() : undefined)
  }));

  // Create maps for quick lookups
  const projectMap = new Map<string | number, Project>();
  projects.forEach(project => {
    projectMap.set(project.id, project);
  });

  const userMap = new Map<string, User>();

if (Array.isArray(users)) {
  users.forEach(user => {
    userMap.set(user.id, user);
  });
} else {
  console.error('Expected users to be an array but got:', users);
}


  // Group time entries by project
  const entriesByProject = new Map<string, typeof entriesWithHours>();
  
  projects.forEach(project => {
    entriesByProject.set(project.id.toString(), []);
  });
  
  entriesWithHours.forEach(entry => {
    if (entry.projectId && entriesByProject.has(entry.projectId.toString())) {
      const projectEntries = entriesByProject.get(entry.projectId.toString()) || [];
      projectEntries.push(entry);
      entriesByProject.set(entry.projectId.toString(), projectEntries);
    }
  });

  // Calculate total hours by project
  const projectHours = Array.from(entriesByProject.entries()).map(([projectId, entries]) => {
    const project = projectMap.get(projectId);
    const totalHours = entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    
    return {
      projectId,
      projectName: project?.name || 'Unknown Project',
      totalHours,
    };
  }).sort((a, b) => b.totalHours - a.totalHours);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-3">Time Distribution by Project</h3>
            <ChartWrapper
              type="pie"
              series={pieSeries}
              options={pieChartOptions}
              height={height}
            />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTrackingChart;