'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@prisma/client';
import ChartWrapper from './ChartWrapper';

interface ProjectProgressChartProps {
  projects: Project[];
  height?: number;
  title?: string;
  description?: string;
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({
  projects,
  height = 350,
  title = 'Project Progress',
  description = 'Visual overview of project completion status'
}) => {
  
  // Format data for the chart
  const formattedData = projects.map(project => ({
    x: project.name,
    y: project.progress || 0,
    status: project.status
  }));

  // Color mapping based on project status
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'NOT_STARTED': return '#94A3B8'; // gray
      case 'IN_PROGRESS': return '#6366F1'; // indigo
      case 'ON_HOLD': return '#F59E0B'; // amber
      case 'COMPLETED': return '#10B981'; // green
      default: return '#8B5CF6'; // purple
    }
  };

  // Chart options
  const options = {
    chart: {
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: false,
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    colors: projects.map(project => getStatusColor(project.status)),
    dataLabels: {
      enabled: true,
      formatter: function(val: number) {
        return val + '%';
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      background: {
        enabled: false
      }
    },
    xaxis: {
      categories: projects.map(project => project.name),
      labels: {
        formatter: function(val: string) {
          return val;
        }
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: function(val: number) {
          return val + '%';
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return val + '% completed';
        }
      }
    }
  };

  const series = [{
    name: 'Progress',
    data: projects.map(project => project.progress || 0)
  }];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartWrapper
          type="bar"
          series={series}
          options={options}
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectProgressChart;