'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, TimeEntry, Task } from '@prisma/client';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TeamPerformanceChartProps {
  users: User[];
  timeEntries?: (TimeEntry & { hours?: number })[];
  tasks: Task[];
  height?: number;
  title?: string;
  description?: string;
}

export function TeamPerformanceChart({
  users,
  timeEntries = [],
  tasks,
  height = 350,
  title = 'Team Performance',
  description = 'Analysis of team performance metrics'
}: TeamPerformanceChartProps) {
  // Create a map of tasks by ID for quick lookup
  const taskMap = new Map<string, Task>();
  tasks.forEach(task => {
    taskMap.set(task.id, task);
  });

  // Ensure all time entries have hours calculated from minutes if not already present
  const entriesWithHours = timeEntries.map(entry => ({
    ...entry,
    hours: entry.hours || entry.minutes / 60
  }));

  // Calculate performance metrics for each user
  const performanceData = users.map(user => {
    // User's time entries
    const userTimeEntries = entriesWithHours.filter(entry => entry.userId === user.id);
    
    // Total hours logged
    const totalHours = userTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    // Tasks completed by user
    const completedTasks = tasks.filter(
      task => task.assignedToId === user.id && task.status === 'COMPLETED'
    ).length;
    
    // Tasks in progress by user
    const inProgressTasks = tasks.filter(
      task => task.assignedToId === user.id && 
      (task.status === 'IN_PROGRESS' || task.status === 'REVIEW')
    ).length;
    
    // Calculate productivity score (example metric)
    const productivity = completedTasks > 0 ? totalHours / completedTasks : 0;
    
    // Calculate task completion rate
    const totalAssignedTasks = tasks.filter(
      task => task.assignedToId === user.id
    ).length;
    
    const completionRate = totalAssignedTasks > 0 
      ? (completedTasks / totalAssignedTasks) * 100 
      : 0;
    
    return {
      name: user.name || 'Unknown',
      role: user.role || 'User',
      hoursLogged: Math.round(totalHours * 10) / 10,
      tasksCompleted: completedTasks,
      tasksInProgress: inProgressTasks,
      productivity: Math.round(productivity * 100) / 100,
      completionRate: Math.round(completionRate)
    };
  }).filter(data => data.hoursLogged > 0 || data.tasksCompleted > 0);

  // Chart options for hours logged vs tasks completed
  const hoursTasksOptions = {
    chart: {
      type: 'bar' as const,
      height: height,
      stacked: false,
      foreColor: '#64748b', // slate-500
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: performanceData.map(d => d.name),
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Hours Logged',
          style: {
            fontSize: '14px',
          },
        },
        min: 0,
      },
      {
        opposite: true,
        title: {
          text: 'Tasks Completed',
          style: {
            fontSize: '14px',
          },
        },
        min: 0,
      }
    ],
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '14px',
    },
    tooltip: {
      y: {
        formatter: function(val: number, { seriesIndex }: { seriesIndex: number }) {
          return seriesIndex === 0 ? `${val} hours` : `${val} tasks`;
        }
      }
    },
    colors: ['#60a5fa', '#34d399'], // Blue, Green
    theme: {
      mode: 'dark' as const,
    },
  };

  const hoursTasksSeries = [
    {
      name: 'Hours Logged',
      type: 'column',
      data: performanceData.map(d => d.hoursLogged),
    },
    {
      name: 'Tasks Completed',
      type: 'line',
      data: performanceData.map(d => d.tasksCompleted),
    }
  ];

  // Chart options for completion rate
  const completionRateOptions = {
    chart: {
      type: 'radialBar' as const,
      height: height,
      foreColor: '#64748b', // slate-500
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
            offsetY: -10,
          },
          value: {
            fontSize: '16px',
            formatter: function(val: number) {
              return val + '%';
            }
          },
          total: {
            show: true,
            label: 'Avg Completion',
            formatter: function(w: any) {
              const avg = Math.round(
                performanceData.reduce((sum, d) => sum + d.completionRate, 0) / 
                (performanceData.length || 1)
              );
              return avg + '%';
            }
          }
        },
        hollow: {
          size: '40%',
        },
      },
    },
    labels: performanceData.map(d => d.name),
    colors: performanceData.map((_, index) => {
      const colors = ['#60a5fa', '#34d399', '#f87171', '#a78bfa', '#f59e0b'];
      return colors[index % colors.length];
    }),
    theme: {
      mode: 'dark' as const,
    },
  };

  const completionRateSeries = performanceData.map(d => d.completionRate);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-3">Hours Logged vs Tasks Completed</h3>
          {typeof window !== 'undefined' && (
            <ApexChart
              options={hoursTasksOptions}
              series={hoursTasksSeries}
              type="line"
              height={height}
            />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Task Completion Rate</h3>
          {typeof window !== 'undefined' && (
            <ApexChart
              options={completionRateOptions}
              series={completionRateSeries}
              type="radialBar"
              height={height}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamPerformanceChart; 