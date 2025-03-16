'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, Project } from '@prisma/client';
import ChartDebug from './ChartDebug';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TaskDistributionChartProps {
  tasks: Task[];
  projects: Project[];
  height?: number;
  title?: string;
  description?: string;
}

function TaskDistributionChart({
  tasks,
  projects,
  height = 350,
  title = 'Task Distribution',
  description = 'Distribution of tasks by status across projects'
}: TaskDistributionChartProps) {
  // Prepare data for chart
  const projectMap = new Map<string, string>();
  projects.forEach(project => {
    if (project && project.id) {
      projectMap.set(project.id.toString(), project.name || 'Unnamed Project');
    }
  });

  // Count tasks by status
  const statusCounts = {
    'NOT_STARTED': 0,
    'IN_PROGRESS': 0,
    'REVIEW': 0,
    'COMPLETED': 0
  };

  // Map for normalizing status values from API
  const statusMap: Record<string, keyof typeof statusCounts> = {
    'not started': 'NOT_STARTED',
    'in progress': 'IN_PROGRESS',
    'review': 'REVIEW',
    'completed': 'COMPLETED',
    'Not Started': 'NOT_STARTED',
    'In Progress': 'IN_PROGRESS',
    'Review': 'REVIEW',
    'Completed': 'COMPLETED'
  };

  tasks.forEach(task => {
    if (!task || !task.status) return;
    
    // Normalize the status value
    const normalizedStatus = typeof task.status === 'string' 
      ? (statusMap[task.status] || task.status as keyof typeof statusCounts)
      : task.status;
      
    if (normalizedStatus in statusCounts) {
      statusCounts[normalizedStatus as keyof typeof statusCounts]++;
    }
  });

  // Prepare data for project-based distribution
  const projectTaskCounts = new Map<string, { [key: string]: number }>();
  
  projects.forEach(project => {
    if (project && project.id) {
      projectTaskCounts.set(project.id.toString(), {
        'NOT_STARTED': 0,
        'IN_PROGRESS': 0,
        'REVIEW': 0,
        'COMPLETED': 0
      });
    }
  });

  tasks.forEach(task => {
    if (!task || !task.projectId || !task.status) return;
    
    const projectId = task.projectId.toString();
    if (projectTaskCounts.has(projectId)) {
      const projectCounts = projectTaskCounts.get(projectId);
      if (!projectCounts) return;
      
      // Normalize the status value
      const normalizedStatus = typeof task.status === 'string' 
        ? (statusMap[task.status] || task.status as keyof typeof statusCounts)
        : task.status;
        
      if (normalizedStatus in projectCounts) {
        projectCounts[normalizedStatus as keyof typeof statusCounts]++;
      }
    }
  });

  // Chart configuration for donut chart
  const donutOptions = {
    chart: {
      type: 'donut' as const,
      foreColor: '#64748b', // slate-500
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              fontSize: '22px',
              formatter: (val: number) => val.toString(),
            },
            total: {
              show: true,
              label: 'Total Tasks',
              formatter: (w: any) => {
                return tasks.length.toString();
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '14px',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val} tasks`,
      },
    },
    theme: {
      mode: 'dark' as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const donutSeries = Object.values(statusCounts);
  const donutLabels = Object.keys(statusCounts).map(status => 
    status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  );

  // Chart configuration for bar chart
  const barOptions = {
    chart: {
      type: 'bar' as const,
      stacked: true,
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
      categories: Array.from(projectTaskCounts.keys()).map(id => projectMap.get(id) || 'Unknown'),
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Number of Tasks',
        style: {
          fontSize: '14px',
        },
      },
    },
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '14px',
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} tasks`,
      },
    },
    colors: ['#f472b6', '#60a5fa', '#fbbf24', '#34d399'], // Pink, Blue, Yellow, Green
    theme: {
      mode: 'dark' as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
  const statusLabels = [
    'Not Started',
    'In Progress',
    'Review',
    'Completed'
  ];

  const barSeries = statuses.map((status, index) => ({
    name: statusLabels[index],
    data: Array.from(projectTaskCounts.values()).map(counts => counts[status]),
  }));

  // Check if we have valid data for charts
  const hasValidData = tasks && tasks.length > 0 && projects && projects.length > 0;
  const hasTasks = tasks && tasks.length > 0;
  const hasProjects = projects && projects.length > 0;
  const hasTasksWithProjects = tasks && tasks.some(task => task.projectId);

  // Debug data to help troubleshoot
  const debugData = {
    taskCount: tasks?.length || 0,
    projectCount: projects?.length || 0,
    statusCounts,
    projectTaskCounts: Array.from(projectTaskCounts.entries()).map(([id, counts]) => ({
      projectId: id,
      projectName: projectMap.get(id) || 'Unknown',
      counts
    })),
    hasTasks,
    hasProjects,
    hasTasksWithProjects,
    sampleTask: tasks && tasks.length > 0 ? tasks[0] : null,
    sampleProject: projects && projects.length > 0 ? projects[0] : null,
    barSeries,
    donutSeries
  };

  useEffect(() => {
    const totalTasks = tasks?.length || 0;
    const computedStatusTotal = Object.values(statusCounts).reduce((acc, val) => acc + val, 0);
    if (totalTasks > 0 && computedStatusTotal === 0) {
      console.warn(`TaskDistributionChart: Received ${totalTasks} tasks, but computed status counts sum to zero. Check task status mapping.`);
    }
  }, [tasks, statusCounts]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasValidData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-3">Status Distribution</h3>
              {typeof window !== 'undefined' && (
                <ApexChart
                  options={{
                    ...donutOptions,
                    labels: donutLabels,
                  }}
                  series={donutSeries}
                  type="donut"
                  height={height}
                />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Project-wise Distribution</h3>
              {typeof window !== 'undefined' && (
                <ApexChart
                  options={barOptions}
                  series={barSeries}
                  type="bar"
                  height={height}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">No chart data available</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {!hasTasks && 'No tasks found. '}
                {!hasProjects && 'No projects found. '}
                {hasTasks && hasProjects && !hasTasksWithProjects && 'Tasks are not associated with projects. '}
                {hasTasks && hasProjects && 'Check data sources and filters.'}
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
}

export default TaskDistributionChart; 