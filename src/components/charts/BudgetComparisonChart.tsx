"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, TimeEntry } from '@/lib/data/types';
import { ApexOptions } from 'apexcharts';
import ChartWrapper from './ChartWrapper';

interface BudgetComparisonChartProps {
  projects: Project[];
  timeEntries?: TimeEntry[];
  height?: number;
  title?: string;
  description?: string;
}

const BudgetComparisonChart = ({
  projects,
  timeEntries = [],
  height = 350,
  title = 'Budget vs. Actual Spending',
  description = 'Comparison of budgeted vs actual project costs'
}: BudgetComparisonChartProps) => {
  
  const chartData = useMemo(() => {
      const calculateCost = (projectId: string | number): number => {
        const projectTimeEntries = timeEntries.filter(entry =>
          (entry.projectId && entry.projectId.toString() === projectId.toString()) ||
          (entry.task && entry.task.projectId.toString() === projectId.toString())
        );

        const totalHours = projectTimeEntries.reduce((sum, entry) => {
          if ('hours' in entry && typeof entry.hours === 'number') {
            return sum + entry.hours;
          }
          return sum + ((entry.minutes || 0) / 60);
        }, 0);

        const hourlyRate = 50;
        return totalHours * hourlyRate;
      };

      const categories = projects.map((p) => p.name);
      const budgetData = projects.map(p => p.budget || 0);
      const spentData = projects.map(p => calculateCost(p.id));
    
      return {
        categories,
        budgetData,
        spentData,
      };
    }, [projects, timeEntries]);

    const chartOptions: ApexOptions = {
      chart: {
        type: 'bar',
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
        categories: chartData.categories,
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
          formatter: function (val: number) {
            return '₹' + (val / 1000).toFixed(0) + 'k';
          }        },
      },
      fill: {
        opacity: 0.9,
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return '₹' + val.toLocaleString('en-IN');
          }
        }
      },
      legend: {
        position: 'top'
      },
    };

    const series = [
      {
      name: 'Budget',
      data: chartData.budgetData,
      type: 'bar'
      }, {
      name: 'Spent',
      data: chartData.spentData,
      type: 'bar'
      }
    ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartWrapper
          type='bar'
          series={series}
          options={chartOptions}
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
