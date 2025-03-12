'use client';

import React from 'react';
import ChartWrapper from './ChartWrapper';
import { ProjectProgressChartData, generateRandomData } from './types';

interface ProjectProgressChartProps {
  data?: ProjectProgressChartData;
  height?: number;
  title?: string;
  className?: string;
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ 
  data = generateRandomData.projectProgress(),
  height = 350,
  title = 'Project Progress',
  className = ''
}) => {
  const formattedData = data.projects.map(project => ({
    x: project.name,
    y: project.progress,
    status: project.status
  }));

  const series = [{
    name: 'Progress',
    data: formattedData
  }];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: height
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: false,
        dataLabels: {
          position: 'bottom'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val + '%';
      },
      offsetX: 30,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    colors: [
      function({ value, seriesIndex, dataPointIndex, w }: { value: any, seriesIndex: number, dataPointIndex: number, w: any }) {
        const status = data.projects[dataPointIndex].status;
        if (status === 'Completed') return '#10B981'; // green
        if (status === 'In Progress') return '#6366F1'; // indigo
        if (status === 'On Hold') return '#F59E0B'; // amber
        return '#94A3B8'; // gray
      }
    ],
    xaxis: {
      categories: data.projects.map(p => p.name),
      labels: {
        style: {
          colors: '#94A3B8'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94A3B8'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + '%';
        }
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const project = data.projects[dataPointIndex];
        return `
          <div class="bg-[#1F2937] p-2 rounded shadow-lg">
            <div class="text-white text-xs font-bold mb-1">${project.name}</div>
            <div class="text-gray-300 text-xs">Progress: ${project.progress}%</div>
            <div class="text-gray-300 text-xs">Status: ${project.status}</div>
          </div>
        `;
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#E5E7EB',
        fontWeight: 'bold'
      }
    }
  };

  return (
    <ChartWrapper
      type="bar"
      series={series}
      options={options}
      height={height}
      className={className}
    />
  );
};

export default ProjectProgressChart; 