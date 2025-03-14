'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectProgressChart from '@/components/charts/ProjectProgressChart';
import BudgetComparisonChart from '@/components/charts/BudgetComparisonChart';
import TaskDistributionChart from '@/components/charts/TaskDistributionChart';
import TimeTrackingChart from '@/components/charts/TimeTrackingChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Project, Task, TimeEntry, User } from '@/lib/data/types';

interface RoleBasedAnalyticsProps {
  role: string;
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  users: User[];
  isLoading: boolean;
}

const RoleBasedAnalytics: React.FC<RoleBasedAnalyticsProps> = ({
  role,
  projects,
  tasks,
  timeEntries,
  users,
  isLoading
}) => {
  const [view, setView] = useState<string>(getDefaultViewForRole(role));

  // Helper to get default view based on role
  function getDefaultViewForRole(role: string): string {
    switch (role) {
      case 'admin':
        return 'overview';
      case 'team':
        return 'tasks';
      case 'client':
        return 'progress';
      default:
        return 'overview';
    }
  }

  // Helper to get available tabs based on role
  function getTabsForRole(role: string) {
    const tabs = [];
    
    // All roles see overview
    tabs.push({ id: 'overview', label: 'Overview' });
    
    // Admin sees everything
    if (role === 'admin') {
      tabs.push(
        { id: 'progress', label: 'Project Progress' },
        { id: 'budget', label: 'Budget' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'team', label: 'Team' },
        { id: 'time', label: 'Time Tracking' }
      );
    }
    
    // Team sees tasks, time tracking, and progress
    else if (role === 'team') {
      tabs.push(
        { id: 'tasks', label: 'Tasks' },
        { id: 'time', label: 'Time Tracking' },
        { id: 'progress', label: 'Project Progress' }
      );
    }
    
    // Client sees progress, budget, and simplified tasks
    else if (role === 'client') {
      tabs.push(
        { id: 'progress', label: 'Project Progress' },
        { id: 'budget', label: 'Budget' },
        { id: 'tasks', label: 'Task Summary' }
      );
    }
    
    return tabs;
  }

  // Get metrics for overview based on role
  const getOverviewMetrics = () => {
    const metrics = [];

    // Project completion - all roles see this
    metrics.push({
      title: 'Project Completion',
      value: `${Math.round(
        projects.reduce((sum, project) => sum + (project.progress || 0), 0) / 
        (projects.length || 1)
      )}%`,
      description: 'Average completion rate'
    });

    // Task status - all roles see this
    metrics.push({
      title: 'Task Status',
      value: `${tasks.filter(task => task.status === 'COMPLETED').length} / ${tasks.length}`,
      description: 'Completed tasks'
    });

    // Time logged - admin and team see this
    if (role === 'admin' || role === 'team') {
      metrics.push({
        title: 'Time Logged',
        value: `${Math.round(timeEntries.reduce((sum, entry) => {
          const hours = 'hours' in entry 
            ? Number(entry.hours) 
            : Number(entry.minutes || 0) / 60;
          return sum + hours;
        }, 0))} hrs`,
        description: 'Total hours tracked'
      });
    }

    // Budget - admin and client see this
    if (role === 'admin' || role === 'client') {
      metrics.push({
        title: 'Budget Utilization',
        value: `${Math.round(
          (projects.reduce((sum, project) => sum + (project.actualCost || 0), 0) /
          projects.reduce((sum, project) => sum + (project.budget || 1), 1)) * 100
        )}%`,
        description: 'Of total budget utilized'
      });
    }

    // Team size - admin sees this
    if (role === 'admin') {
      metrics.push({
        title: 'Team Size',
        value: `${users.filter(user => user.role === 'team').length}`,
        description: 'Active team members'
      });
    }

    return metrics;
  };

  const tabs = getTabsForRole(role);

  return (
    <div className="space-y-4">
      <Tabs defaultValue={view} onValueChange={(v) => setView(v)} className="w-full">
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* Overview tab - customized for each role */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{role === 'admin' ? 'Administration' : role === 'team' ? 'Team' : 'Client'} Dashboard</CardTitle>
              <CardDescription>Key metrics relevant to your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[100px] w-full" />
                  ))
                ) : (
                  getOverviewMetrics().map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium">{metric.title}</h3>
                      <p className="text-3xl font-bold mt-2">{metric.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Project Progress tab */}
        <TabsContent value="progress" className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <ProjectProgressChart 
              projects={projects} 
              height={350}
              title={role === 'client' ? 'Your Project Progress' : 'Project Progress'}
              description={
                role === 'client' 
                  ? 'Current status of your ongoing projects' 
                  : 'Completion status of all projects'
              }
            />
          )}
        </TabsContent>

        {/* Budget tab */}
        <TabsContent value="budget" className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <BudgetComparisonChart 
              projects={projects} 
              timeEntries={timeEntries} 
              height={350}
              title={role === 'client' ? 'Project Budget Status' : 'Budget Analysis'}
              description={
                role === 'client' 
                  ? 'Budget vs actual spending for your projects' 
                  : 'Comparing budgeted vs actual costs'
              }
            />
          )}
        </TabsContent>

        {/* Tasks tab */}
        <TabsContent value="tasks" className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <TaskDistributionChart 
              tasks={tasks} 
              projects={projects} 
              height={350}
              title={role === 'team' ? 'Team Task Distribution' : 'Task Status'}
              description={
                role === 'team' 
                  ? 'Current task assignment and status' 
                  : role === 'client'
                  ? 'Summary of task completion status'
                  : 'Distribution of tasks by status and project'
              }
            />
          )}
        </TabsContent>

        {/* Team tab - only for admin */}
        {role === 'admin' && (
          <TabsContent value="team" className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Productivity</CardTitle>
                    <CardDescription>Performance metrics for team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users
                        .filter(user => user.role === 'team')
                        .slice(0, 5)
                        .map(user => {
                          const userTasks = tasks.filter(task => task.assigneeId === user.id);
                          const completedTasks = userTasks.filter(task => task.status === 'COMPLETED');
                          const completionRate = userTasks.length ? (completedTasks.length / userTasks.length) * 100 : 0;
                          
                          return (
                            <div key={user.id} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{userTasks.length} assigned tasks</p>
                              </div>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${completionRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{Math.round(completionRate)}%</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Allocation</CardTitle>
                    <CardDescription>Hours tracked by team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users
                        .filter(user => user.role === 'team')
                        .slice(0, 5)
                        .map(user => {
                          const userEntries = timeEntries.filter(entry => entry.userId === user.id);
                          const totalHours = userEntries.reduce((sum, entry) => {
                            const hours = 'hours' in entry 
                              ? Number(entry.hours) 
                              : Number(entry.minutes || 0) / 60;
                            return sum + hours;
                          }, 0);
                          
                          return (
                            <div key={user.id} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{userEntries.length} time entries</p>
                              </div>
                              <div>
                                <span className="text-lg font-bold">{Math.round(totalHours * 10) / 10} hrs</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        )}

        {/* Time Tracking tab - for admin and team */}
        {(role === 'admin' || role === 'team') && (
          <TabsContent value="time" className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <TimeTrackingChart 
                timeEntries={timeEntries} 
                projects={projects} 
                users={users}
                height={400}
                title={role === 'team' ? 'Your Time Tracking' : 'Team Time Tracking'}
                description={
                  role === 'team' 
                    ? 'Analysis of time spent on your assigned projects' 
                    : 'Overview of time allocation across all projects'
                }
              />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default RoleBasedAnalytics;
