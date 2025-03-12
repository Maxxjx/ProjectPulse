'use client';

import React, { useState } from 'react';
import {
  ProjectProgressChart,
  TaskDistributionChart,
  TimeTrackingChart,
  BudgetComparisonChart,
  TeamPerformanceChart,
  generateRandomData
} from '../charts';

const ReportCharts: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('week');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  
  // This would come from API in real implementation
  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: 'project1', name: 'Mumbai Metro Line Integration' },
    { id: 'project2', name: 'SmartFarmer Agricultural App' },
    { id: 'project3', name: 'Aadhaar Integration System' }
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date Range</label>
            <select 
              className="bg-[#1F2937] border border-gray-700 rounded py-2 px-3 w-full sm:w-auto"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Project</label>
            <select 
              className="bg-[#1F2937] border border-gray-700 rounded py-2 px-3 w-full sm:w-auto"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Project Progress Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Project Progress</h3>
        <ProjectProgressChart 
          title="" 
          height={400} 
        />
      </div>
      
      {/* Task Distribution Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Task Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskDistributionChart 
            title="Task Status Distribution" 
            height={350} 
          />
          <div>
            <h4 className="text-lg font-medium mb-3">Task Insights</h4>
            <div className="space-y-4">
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Total Tasks</div>
                <div className="text-2xl font-bold">124</div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Completion Rate</div>
                <div className="text-2xl font-bold text-green-500">76%</div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Avg. Resolution Time</div>
                <div className="text-2xl font-bold">3.2 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Tracking Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Time Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TimeTrackingChart 
              title="Time Logged Over Time" 
              height={350} 
            />
          </div>
          <div>
            <h4 className="text-lg font-medium mb-3">Time Summary</h4>
            <div className="space-y-4">
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Total Hours</div>
                <div className="text-2xl font-bold">187</div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Billable Hours</div>
                <div className="text-2xl font-bold">142</div>
              </div>
              <div className="bg-[#1F2937] p-4 rounded">
                <div className="text-sm text-gray-400">Productivity</div>
                <div className="text-2xl font-bold text-purple-500">83%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Budget Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Budget Analysis</h3>
        <BudgetComparisonChart 
          title="" 
          height={400} 
        />
      </div>
      
      {/* Team Performance Section */}
      <div className="bg-[#111827] rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Team Performance</h3>
        <TeamPerformanceChart 
          title="" 
          height={400} 
        />
      </div>
    </div>
  );
};

export default ReportCharts; 