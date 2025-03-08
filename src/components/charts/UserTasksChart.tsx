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
import { useUserTasksAnalytics } from '@/lib/hooks/useAnalytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserTasksChart() {
  const { data: analytics, isLoading } = useUserTasksAnalytics();
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      stack: string;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (analytics?.data) {
      setChartData({
        labels: analytics.data.map((item) => item.user.name),
        datasets: [
          {
            label: 'Completed',
            data: analytics.data.map((item) => item.completedTasks),
            backgroundColor: '#10B981',
            borderColor: '#10B981',
            borderWidth: 1,
            stack: 'Stack 0',
          },
          {
            label: 'In Progress',
            data: analytics.data.map((item) => item.inProgressTasks),
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
            borderWidth: 1,
            stack: 'Stack 0',
          },
          {
            label: 'Other',
            data: analytics.data.map((item) => 
              item.totalTasks - item.completedTasks - item.inProgressTasks
            ),
            backgroundColor: '#6B7280',
            borderColor: '#6B7280',
            borderWidth: 1,
            stack: 'Stack 0',
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
        <p className="text-gray-400">No user tasks data available.</p>
      </div>
    );
  }

  return (
    <div className="relative h-80">
      <Bar
        data={chartData}
        options={{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#ededed',
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              backgroundColor: '#111827',
              titleColor: '#ededed',
              bodyColor: '#ededed',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                color: '#374151',
              },
              ticks: {
                color: '#ededed',
                precision: 0,
              },
              beginAtZero: true,
            },
            y: {
              stacked: true,
              grid: {
                color: '#374151',
              },
              ticks: {
                color: '#ededed',
              },
            },
          },
        }}
      />
    </div>
  );
} 