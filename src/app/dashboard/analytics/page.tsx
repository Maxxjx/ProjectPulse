'use client';

import { useState } from 'react';
import { useSummaryAnalytics } from '@/lib/hooks/useAnalytics';
import ProjectStatusChart from '@/components/charts/ProjectStatusChart';
import TaskStatusChart from '@/components/charts/TaskStatusChart';
import UserTasksChart from '@/components/charts/UserTasksChart';

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useSummaryAnalytics();
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#1F2937] border border-gray-600 rounded text-sm px-3 py-2"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-2 rounded text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-gray-400 text-sm mb-2">Total Projects</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{analytics?.projects.total || 0}</span>
            <span className="text-green-500 text-sm mb-1">
              {analytics?.projects.completion || 0}% Complete
            </span>
          </div>
        </div>

        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-gray-400 text-sm mb-2">Total Tasks</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{analytics?.tasks.total || 0}</span>
            <span className="text-green-500 text-sm mb-1">
              {analytics?.tasks.completion || 0}% Complete
            </span>
          </div>
        </div>

        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-gray-400 text-sm mb-2">Budget Utilization</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">${(analytics?.budget.spent || 0).toLocaleString()}</span>
            <span className="text-green-500 text-sm mb-1">
              {analytics?.budget.utilization || 0}% Used
            </span>
          </div>
        </div>

        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-gray-400 text-sm mb-2">Team Members</h2>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{analytics?.users.team || 0}</span>
            <span className="text-blue-500 text-sm mb-1">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Projects by Status</h2>
          <ProjectStatusChart />
        </div>

        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Tasks by Status</h2>
          <TaskStatusChart />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Tasks by Team Member</h2>
        <UserTasksChart />
      </div>

      {/* Budget Overview */}
      <div className="bg-[#111827] rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Total Budget</span>
            <span>${(analytics?.budget.total || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Spent</span>
            <span>${(analytics?.budget.spent || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2 font-medium">
            <span>Remaining</span>
            <span>${(analytics?.budget.remaining || 0).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Budget Utilization</span>
            <span className="text-sm">{analytics?.budget.utilization || 0}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                (analytics?.budget.utilization || 0) > 90 ? 'bg-red-500' : 
                (analytics?.budget.utilization || 0) > 70 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`} 
              style={{ width: `${analytics?.budget.utilization || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
} 