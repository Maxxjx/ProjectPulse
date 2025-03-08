import { NextRequest, NextResponse } from 'next/server';
import { 
  projectService, 
  taskService, 
  userService, 
  activityService 
} from '@/lib/data/mockDataService';
import { ProjectStatus, TaskStatus, Project, Task } from '@/lib/data/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    
    switch (type) {
      case 'summary':
        return getSummaryAnalytics();
      case 'project-status':
        return getProjectStatusAnalytics();
      case 'task-status':
        return getTaskStatusAnalytics();
      case 'user-tasks':
        return getUserTasksAnalytics();
      case 'recent-activity':
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
        return getRecentActivityAnalytics(limit);
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in GET /api/analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Get summary analytics
function getSummaryAnalytics() {
  const projects = projectService.getProjects();
  const tasks = taskService.getTasks();
  const users = userService.getUsers();
  
  // Calculate project stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
  const inProgressProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const overdueTasks = tasks.filter(t => 
    t.status !== TaskStatus.COMPLETED && 
    new Date(t.deadline) < new Date()
  ).length;
  
  // Calculate budget stats
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Calculate user stats
  const totalUsers = users.length;
  const teamMembers = users.filter(u => u.role === 'team').length;
  const clients = users.filter(u => u.role === 'client').length;
  
  return NextResponse.json({
    analytics: {
      projects: {
        total: totalProjects,
        completed: completedProjects,
        inProgress: inProgressProjects,
        completion: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
        completion: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      budget: {
        total: totalBudget,
        spent: totalSpent,
        remaining: totalBudget - totalSpent,
        utilization: Math.round(budgetUtilization)
      },
      users: {
        total: totalUsers,
        team: teamMembers,
        clients: clients
      }
    }
  }, { status: 200 });
}

// Get project status distribution
function getProjectStatusAnalytics() {
  const projects = projectService.getProjects();
  
  // Count projects by status
  const statusCounts: Record<string, number> = {};
  const statusColors: Record<string, string> = {
    [ProjectStatus.NOT_STARTED]: '#6B7280',
    [ProjectStatus.IN_PROGRESS]: '#3B82F6',
    [ProjectStatus.ON_HOLD]: '#F59E0B',
    [ProjectStatus.COMPLETED]: '#10B981',
    [ProjectStatus.CANCELLED]: '#EF4444',
    [ProjectStatus.ALMOST_COMPLETE]: '#8B5CF6'
  };
  
  Object.values(ProjectStatus).forEach(status => {
    statusCounts[status] = projects.filter(p => p.status === status).length;
  });
  
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    color: statusColors[status] || '#6B7280'
  }));
  
  return NextResponse.json({
    analytics: {
      data,
      total: projects.length
    }
  }, { status: 200 });
}

// Get task status distribution
function getTaskStatusAnalytics() {
  const tasks = taskService.getTasks();
  
  // Count tasks by status
  const statusCounts: Record<string, number> = {};
  const statusColors: Record<string, string> = {
    [TaskStatus.NOT_STARTED]: '#6B7280',
    [TaskStatus.IN_PROGRESS]: '#3B82F6',
    [TaskStatus.UNDER_REVIEW]: '#8B5CF6',
    [TaskStatus.ON_HOLD]: '#F59E0B',
    [TaskStatus.COMPLETED]: '#10B981'
  };
  
  Object.values(TaskStatus).forEach(status => {
    statusCounts[status] = tasks.filter(t => t.status === status).length;
  });
  
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    color: statusColors[status] || '#6B7280'
  }));
  
  return NextResponse.json({
    analytics: {
      data,
      total: tasks.length
    }
  }, { status: 200 });
}

// Get tasks per user
function getUserTasksAnalytics() {
  const tasks = taskService.getTasks();
  const users = userService.getUsers();
  
  // Group tasks by assignee
  const userTasks: Record<string, {
    user: { id: string; name: string; role: string; };
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    completionRate: number;
  }> = {};
  
  // Initialize with all users who have team role
  users
    .filter(u => u.role === 'team')
    .forEach(user => {
      userTasks[user.id] = {
        user: { id: user.id, name: user.name, role: user.role },
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        completionRate: 0
      };
    });
  
  // Count tasks for each user
  tasks.forEach(task => {
    if (task.assigneeId && userTasks[task.assigneeId]) {
      userTasks[task.assigneeId].totalTasks++;
      
      if (task.status === TaskStatus.COMPLETED) {
        userTasks[task.assigneeId].completedTasks++;
      } else if (task.status === TaskStatus.IN_PROGRESS) {
        userTasks[task.assigneeId].inProgressTasks++;
      }
    }
  });
  
  // Calculate completion rate for each user
  Object.values(userTasks).forEach(userData => {
    userData.completionRate = userData.totalTasks > 0 
      ? Math.round((userData.completedTasks / userData.totalTasks) * 100) 
      : 0;
  });
  
  // Convert to array and sort by total tasks
  const data = Object.values(userTasks)
    .sort((a, b) => b.totalTasks - a.totalTasks);
  
  return NextResponse.json({
    analytics: { data }
  }, { status: 200 });
}

// Get recent activity
function getRecentActivityAnalytics(limit: number) {
  const recentActivity = activityService.getRecentActivity(limit);
  
  return NextResponse.json({
    analytics: { activity: recentActivity }
  }, { status: 200 });
} 