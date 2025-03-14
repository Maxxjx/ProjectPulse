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

export function BudgetComparisonChart({
  projects,
  timeEntries = [],
  height = 350,
  title = 'Budget vs. Actual Spending',
  description = 'Comparison of budgeted vs actual project costs'
}: BudgetComparisonChartProps) {
  
  // Helper function to calculate cost based on hours spent
  const calculateCost = (projectId: string | number): number => {
    const projectTimeEntries = timeEntries.filter(entry => 
      // Check for projectId (might be stored in taskId relation)
      (entry.projectId && entry.projectId.toString() === projectId.toString()) || 
      // If there's a task with a projectId that matches
      (entry.task && entry.task.projectId.toString() === projectId.toString())
    );
    
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
  const categories = projects.map(p => p.name);
  const budgetData = projects.map(p => p.budget || 0);
  const spentData = projects.map(p => calculateCost(p.id));

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
}