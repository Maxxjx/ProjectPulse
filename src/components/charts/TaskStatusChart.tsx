'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTaskStatusAnalytics } from '@/lib/hooks/useAnalytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TaskStatusChart() {
  const { data: analytics, isLoading } = useTaskStatusAnalytics();
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Tasks',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (analytics?.data) {
      setChartData({
        labels: analytics.data.map((item) => item.status),
        datasets: [
          {
            label: 'Tasks',
            data: analytics.data.map((item) => item.count),
            backgroundColor: analytics.data.map((item) => `${item.color}80`), // Add transparency
            borderColor: analytics.data.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  if (!analytics?.data || analytics.data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-400">No task status data available.</p>
      </div>
    );
  }

  return (
    <div className="relative h-64">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#111827',
              titleColor: '#ededed',
              bodyColor: '#ededed',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = Math.round((value as number / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
          },
          scales: {
            x: {
              grid: {
                color: '#374151',
              },
              ticks: {
                color: '#ededed',
              },
            },
            y: {
              grid: {
                color: '#374151',
              },
              ticks: {
                color: '#ededed',
                precision: 0,
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
} 