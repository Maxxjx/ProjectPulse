'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, TimeEntry } from '@/lib/data/types';
import ChartWrapper from './ChartWrapper';

interface BudgetComparisonChartProps {
  projects: Project[];
  timeEntries?: TimeEntry[];
  height?: number;
  title?: string;
  description?: string;
}

function BudgetComparisonChart({
  projects,
  timeEntries = [],
  height = 350,
  title = 'Budget vs. Actual Spending',
  description = 'Comparison of budgeted vs actual project costs'
}: BudgetComparisonChartProps) {
  
  // Helper function to calculate cost based on hours spent
  const calculateCost = (projectId: string | number): number => {
    if (!timeEntries || timeEntries.length === 0) return 0;
    
    const projectTimeEntries = timeEntries.filter(entry => {
      if (!entry) return false;
      
      // Check for projectId (might be stored in taskId relation)
      const directMatch = entry.projectId && entry.projectId.toString() === projectId.toString();
      
      // If there's a task with a projectId that matches
      const taskMatch = entry.task && entry.task.projectId && entry.task.projectId.toString() === projectId.toString();
      
      return directMatch || taskMatch;
    });
    
    // Convert minutes to hours if needed
    const totalHours = projectTimeEntries.reduce((sum, entry) => {
      // If hours is directly available, use it
      if ('hours' in entry && typeof entry.hours === 'number') {
        return sum + entry.hours;
      }
      // Otherwise convert minutes to hours (divide by 60)
      return sum + ((entry.minutes || 0) / 60);
    }, 0);
    
    const hourlyRate = 50; // Example hourly rate in currency units
    return totalHours * hourlyRate;
  };

  // Format data for chart
  const categories = projects.filter(p => p && p.id).map(p => p.name || 'Unnamed Project');
  const budgetData = projects.filter(p => p && p.id).map(p => p.budget || 0);
  const spentData = projects.filter(p => p && p.id).map(p => calculateCost(p.id));

  // Chart options
  const options = {
    chart: {
      type: 'bar' as const,
      stacked: false,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        endingShape: 'rounded',
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
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Amount (₹)',
        style: {
          fontSize: '14px',
        },
      },
      labels: {
        formatter: function(val: number) {
          return '₹' + (val / 1000).toFixed(0) + 'k';
        },
      },
    },
    fill: {
      opacity: 0.9,
    },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return '₹' + val.toLocaleString('en-IN');
        },
      },
    },
  };

  const series = [
    {
      name: 'Budget',
      data: budgetData,
    },
    {
      name: 'Spent',
      data: spentData,
    },
  ];

  // Check if we have valid data for the chart
  const hasValidData = projects && projects.length > 0 && categories.length > 0;
  
  // Debug data to help troubleshoot
  const debugData = {
    projectCount: projects?.length || 0,
    timeEntryCount: timeEntries?.length || 0,
    categories,
    budgetData,
    spentData,
    sampleProject: projects && projects.length > 0 ? projects[0] : null,
    sampleTimeEntry: timeEntries && timeEntries.length > 0 ? timeEntries[0] : null
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasValidData ? (
          <ChartWrapper 
            type="bar"
            series={series}
            options={options}
            height={height}
          />
        ) : (
          <div className="h-full min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">No budget data available</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {!projects || projects.length === 0 ? 'No projects found. ' : ''}
                {!timeEntries || timeEntries.length === 0 ? 'No time entries found. ' : ''}
                Check data sources and filters.
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

export default BudgetComparisonChart;