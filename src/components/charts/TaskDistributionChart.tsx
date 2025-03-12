'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, Project } from '@prisma/client';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TaskDistributionChartProps {
  tasks: Task[];
  projects: Project[];
  height?: number;
  title?: string;
  description?: string;
}

export function TaskDistributionChart({
  tasks,
  projects,
  height = 350,
  title = 'Task Distribution',
  description = 'Distribution of tasks by status across projects'
}: TaskDistributionChartProps) {
  // Prepare data for chart
  const projectMap = new Map<string, string>();
  projects.forEach(project => {
    projectMap.set(project.id, project.name);
  });

  // Count tasks by status
  const statusCounts = {
    'NOT_STARTED': 0,
    'IN_PROGRESS': 0,
    'REVIEW': 0,
    'COMPLETED': 0
  };

  tasks.forEach(task => {
    if (task.status in statusCounts) {
      statusCounts[task.status as keyof typeof statusCounts]++;
    }
  });

  // Prepare data for project-based distribution
  const projectTaskCounts = new Map<string, { [key: string]: number }>();
  
  projects.forEach(project => {
    projectTaskCounts.set(project.id, {
      'NOT_STARTED': 0,
      'IN_PROGRESS': 0,
      'REVIEW': 0,
      'COMPLETED': 0
    });
  });

  tasks.forEach(task => {
    if (task.projectId && projectTaskCounts.has(task.projectId)) {
      const projectCounts = projectTaskCounts.get(task.projectId);
      if (projectCounts && task.status in projectCounts) {
        projectCounts[task.status as keyof typeof statusCounts]++;
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

export default TaskDistributionChart; 