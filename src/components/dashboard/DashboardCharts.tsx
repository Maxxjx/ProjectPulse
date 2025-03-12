'use client';

import React from 'react';
import {
  ProjectProgressChart,
  TaskDistributionChart,
  TimeTrackingChart,
  BudgetComparisonChart,
  TeamPerformanceChart
} from '../charts';

const DashboardCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      {/* Top row with 3 charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskDistributionChart 
          title="Task Status" 
          height={300} 
        />
        
        <TimeTrackingChart 
          title="Weekly Hours" 
          height={300} 
        />
        
        <TeamPerformanceChart 
          title="Team Tasks" 
          height={300} 
        />
      </div>
      
      {/* Bottom row with 2 charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectProgressChart 
          title="Project Status" 
          height={350} 
        />
        
        <BudgetComparisonChart 
          title="Budget Overview" 
          height={350} 
        />
      </div>
    </div>
  );
};

export default DashboardCharts; 