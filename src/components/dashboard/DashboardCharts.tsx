'use client';

import React, { useState, useEffect } from 'react';
import {
  ProjectProgressChart,
  TaskDistributionChart,
  TimeTrackingChart,
  BudgetComparisonChart,
  TeamPerformanceChart
} from '../charts';
import { useProjects } from '@/lib/hooks/useProjects';
import { useTasks } from '@/lib/hooks/useTasks';
import { useTimeEntriesInRange } from '@/lib/hooks/useTimeTracking';
import { useUsers } from '@/lib/hooks/useUsers';
import { format, subDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

const DashboardCharts: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'user';
  const userId = session?.user?.id;

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get data for charts
  const today = new Date();
  const startDate = format(subDays(today, 30), 'yyyy-MM-dd');
  const endDate = format(today, 'yyyy-MM-dd');
  
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
  const { data: timeEntries = [], isLoading: isLoadingTimeEntries } = useTimeEntriesInRange(startDate, endDate);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  // Transform time entries data (convert minutes to hours)
  const transformedTimeEntries = timeEntries.map(entry => ({
    ...entry,
    // Convert minutes to hours for charts that expect hours
    hours: entry.minutes / 60
  }));

  // Filter data based on user role
  const roleFilteredProjects = projects.filter((project) => {
    // For client role, only show their projects
    if (userRole === 'client' && userId) {
      return project.clientId === userId;
    }
    // Admin and team see all projects
    return true;
  });

  // Filter tasks based on user role
  const roleFilteredTasks = tasks.filter((task) => {
    // For team members, prioritize their assigned tasks
    if (userRole === 'team' && userId) {
      return task.assigneeId === userId;
    }
    // For clients, only show tasks for their projects
    if (userRole === 'client' && userId) {
      return roleFilteredProjects.some(p => p.id === task.projectId);
    }
    // Admin sees all tasks
    return true;
  });

  // Filter time entries based on user role
  const roleFilteredTimeEntries = transformedTimeEntries.filter((entry) => {
    if (userRole === 'team' && userId) {
      return entry.userId === userId;
    }
    if (userRole === 'client' && userId) {
      const projectId = entry.projectId || (entry.task && entry.task.projectId);
      return roleFilteredProjects.some(p => p.id === projectId);
    }
    return true;
  });

  // Show loading state if data is not ready
  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingTimeEntries || isLoadingUsers;

  // If we're still on the server or loading data, return a loading placeholder
  if (!isClient || isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-[300px] bg-slate-800 rounded"></div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-[350px] bg-slate-800 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Get charts based on user role
  const getCharts = () => {
    const charts = {
      topRow: [],
      bottomRow: []
    };

    // Admin gets all charts
    if (userRole === 'admin') {
      charts.topRow = [
        <Card key="task-distribution">
          <CardContent className="p-4">
            <TaskDistributionChart 
              title="Task Status" 
              height={300}
              tasks={roleFilteredTasks}
              projects={roleFilteredProjects}
            />
          </CardContent>
        </Card>,
        <Card key="time-tracking">
          <CardContent className="p-4">
            <TimeTrackingChart 
              title="Weekly Hours" 
              height={300}
              timeEntries={roleFilteredTimeEntries}
              projects={roleFilteredProjects}
              users={users}
            />
          </CardContent>
        </Card>,
        <Card key="team-performance">
          <CardContent className="p-4">
            <TeamPerformanceChart 
              title="Team Overview" 
              height={300}
              tasks={roleFilteredTasks}
              users={users}
              timeEntries={roleFilteredTimeEntries}
            />
          </CardContent>
        </Card>
      ];
      
      charts.bottomRow = [
        <Card key="project-progress">
          <CardContent className="p-4">
            <ProjectProgressChart 
              title="Project Status" 
              height={350}
              projects={roleFilteredProjects}
            />
          </CardContent>
        </Card>,
        <Card key="budget-comparison">
          <CardContent className="p-4">
            <BudgetComparisonChart 
              title="Budget Overview" 
              height={350}
              projects={roleFilteredProjects}
              timeEntries={roleFilteredTimeEntries}
            />
          </CardContent>
        </Card>
      ];
    }
    
    // Team member gets task-focused charts
    else if (userRole === 'team') {
      charts.topRow = [
        <Card key="task-distribution">
          <CardContent className="p-4">
            <TaskDistributionChart 
              title="My Tasks" 
              description="Distribution of your assigned tasks"
              height={300}
              tasks={roleFilteredTasks}
              projects={roleFilteredProjects}
            />
          </CardContent>
        </Card>,
        <Card key="time-tracking">
          <CardContent className="p-4">
            <TimeTrackingChart 
              title="My Time Tracking" 
              description="Your logged hours by project"
              height={300}
              timeEntries={roleFilteredTimeEntries}
              projects={roleFilteredProjects}
              users={users}
            />
          </CardContent>
        </Card>
      ];
      
      charts.bottomRow = [
        <Card key="project-progress">
          <CardContent className="p-4">
            <ProjectProgressChart 
              title="Project Progress" 
              description="Status of projects you're working on"
              height={350}
              projects={roleFilteredProjects}
            />
          </CardContent>
        </Card>
      ];
    }
    
    // Client gets project-focused charts
    else if (userRole === 'client') {
      charts.topRow = [
        <Card key="project-progress">
          <CardContent className="p-4">
            <ProjectProgressChart 
              title="Your Projects" 
              description="Current progress of your projects"
              height={300}
              projects={roleFilteredProjects}
            />
          </CardContent>
        </Card>,
        <Card key="task-distribution">
          <CardContent className="p-4">
            <TaskDistributionChart 
              title="Project Tasks" 
              description="Status of tasks across your projects"
              height={300}
              tasks={roleFilteredTasks}
              projects={roleFilteredProjects}
            />
          </CardContent>
        </Card>
      ];
      
      charts.bottomRow = [
        <Card key="budget-comparison">
          <CardContent className="p-4">
            <BudgetComparisonChart 
              title="Budget Status" 
              description="Budget vs actual spending on your projects"
              height={350}
              projects={roleFilteredProjects}
              timeEntries={roleFilteredTimeEntries}
            />
          </CardContent>
        </Card>
      ];
    }
    
    return charts;
  };

  const charts = getCharts();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {userRole === 'admin' ? 'Administrator Dashboard' : 
         userRole === 'team' ? 'Team Member Dashboard' : 
         'Client Dashboard'}
      </h2>
      
      {/* Top row with charts based on role */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.topRow}
      </div>
      
      {/* Bottom row with charts based on role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.bottomRow}
      </div>
    </div>
  );
};

export default DashboardCharts;