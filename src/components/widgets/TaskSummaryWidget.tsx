'use client';

import { useState, useEffect } from 'react';
import { DashboardWidget, TaskStatus } from '@/lib/data/types';
import BaseWidget from './BaseWidget';
import Link from 'next/link';

interface TaskSummaryWidgetProps {
  widget: DashboardWidget;
  isDragging?: boolean;
}

export default function TaskSummaryWidget({ widget, isDragging }: TaskSummaryWidgetProps) {
  // In a real app, this would fetch from an API
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    underReview: 0,
    onHold: 0
  });
  
  useEffect(() => {
    // Simulate fetch from API
    const getTaskStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTaskStats({
        total: 24,
        completed: 8,
        inProgress: 10,
        notStarted: 3,
        underReview: 2,
        onHold: 1
      });
    };
    
    getTaskStats();
  }, []);
  
  // Calculate percentages
  const calculatePercentage = (value: number) => {
    return taskStats.total > 0 ? Math.round((value / taskStats.total) * 100) : 0;
  };
  
  // Render a progress bar
  const ProgressBar = ({ value, color }: { value: number; color: string }) => {
    const percentage = calculatePercentage(value);
    return (
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };
  
  return (
    <BaseWidget widget={widget} isDragging={isDragging}>
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Total Tasks</span>
          <span className="text-sm">{taskStats.total}</span>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Completed</span>
            <span className="text-sm">{taskStats.completed}</span>
          </div>
          <ProgressBar value={taskStats.completed} color="bg-green-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">In Progress</span>
            <span className="text-sm">{taskStats.inProgress}</span>
          </div>
          <ProgressBar value={taskStats.inProgress} color="bg-blue-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Not Started</span>
            <span className="text-sm">{taskStats.notStarted}</span>
          </div>
          <ProgressBar value={taskStats.notStarted} color="bg-gray-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Under Review</span>
            <span className="text-sm">{taskStats.underReview}</span>
          </div>
          <ProgressBar value={taskStats.underReview} color="bg-purple-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">On Hold</span>
            <span className="text-sm">{taskStats.onHold}</span>
          </div>
          <ProgressBar value={taskStats.onHold} color="bg-yellow-500" />
        </div>
        
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/tasks"
            className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm"
          >
            View all tasks
          </Link>
        </div>
      </div>
    </BaseWidget>
  );
} 