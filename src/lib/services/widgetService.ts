'use client';

import { DashboardWidget, WidgetType, UserDashboardConfig } from '../data/types';
import { v4 as uuidv4 } from 'uuid';

// Default widget configurations
export const defaultWidgets: DashboardWidget[] = [
  {
    id: 'task-summary',
    type: 'task_summary',
    title: 'Task Summary',
    size: 'small',
    position: 0
  },
  {
    id: 'project-status',
    type: 'project_status',
    title: 'Project Status',
    size: 'medium',
    position: 1
  },
  {
    id: 'recent-activity',
    type: 'recent_activity',
    title: 'Recent Activity',
    size: 'medium',
    position: 2
  },
  {
    id: 'upcoming-deadlines',
    type: 'upcoming_deadlines',
    title: 'Upcoming Deadlines',
    size: 'small',
    position: 3
  }
];

// Role-specific widget sets
export const widgetsByRole: Record<string, DashboardWidget[]> = {
  admin: [
    ...defaultWidgets,
    {
      id: 'team-workload',
      type: 'team_workload',
      title: 'Team Workload',
      size: 'medium',
      position: 4
    },
    {
      id: 'budget-overview',
      type: 'budget_overview',
      title: 'Budget Overview',
      size: 'medium',
      position: 5
    }
  ],
  team: [
    ...defaultWidgets,
    {
      id: 'time-tracking-summary',
      type: 'time_tracking_summary',
      title: 'Time Tracking',
      size: 'small',
      position: 4
    },
    {
      id: 'quick-actions',
      type: 'quick_actions',
      title: 'Quick Actions',
      size: 'small',
      position: 5
    }
  ],
  client: [
    {
      id: 'project-status',
      type: 'project_status',
      title: 'Project Status',
      size: 'large',
      position: 0
    },
    {
      id: 'upcoming-deadlines',
      type: 'upcoming_deadlines',
      title: 'Upcoming Deadlines',
      size: 'medium',
      position: 1
    },
    {
      id: 'budget-overview',
      type: 'budget_overview',
      title: 'Budget Overview',
      size: 'medium',
      position: 2
    }
  ]
};

// Available widgets for users to add
export const availableWidgets: { type: WidgetType; title: string; description: string; defaultSize: 'small' | 'medium' | 'large' }[] = [
  {
    type: 'task_summary',
    title: 'Task Summary',
    description: 'Overview of your tasks by status',
    defaultSize: 'small'
  },
  {
    type: 'project_status',
    title: 'Project Status',
    description: 'Status of your active projects',
    defaultSize: 'medium'
  },
  {
    type: 'recent_activity',
    title: 'Recent Activity',
    description: 'Latest activities in your projects',
    defaultSize: 'medium'
  },
  {
    type: 'team_workload',
    title: 'Team Workload',
    description: 'Current workload distribution across team members',
    defaultSize: 'medium'
  },
  {
    type: 'upcoming_deadlines',
    title: 'Upcoming Deadlines',
    description: 'Tasks and projects with approaching deadlines',
    defaultSize: 'small'
  },
  {
    type: 'budget_overview',
    title: 'Budget Overview',
    description: 'Overview of project budgets and spending',
    defaultSize: 'medium'
  },
  {
    type: 'time_tracking_summary',
    title: 'Time Tracking',
    description: 'Summary of time tracked on tasks',
    defaultSize: 'small'
  },
  {
    type: 'quick_actions',
    title: 'Quick Actions',
    description: 'Shortcuts to common actions',
    defaultSize: 'small'
  }
];

// User dashboard configurations (simulated database)
let userDashboardConfigs: UserDashboardConfig[] = [];

// Get a user's dashboard configuration
export const getUserDashboardConfig = async (userId: number, userRole: string): Promise<UserDashboardConfig> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Check if user already has a configuration
  let userConfig = userDashboardConfigs.find(config => config.userId === userId);
  
  if (!userConfig) {
    // Create default configuration based on role
    userConfig = {
      userId,
      widgets: [...(widgetsByRole[userRole] || defaultWidgets)],
      layout: 'grid',
      lastUpdated: new Date().toISOString()
    };
    
    userDashboardConfigs.push(userConfig);
  }
  
  return userConfig;
};

// Update a user's dashboard configuration
export const updateUserDashboardConfig = async (config: UserDashboardConfig): Promise<UserDashboardConfig> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = userDashboardConfigs.findIndex(c => c.userId === config.userId);
  
  if (index !== -1) {
    userDashboardConfigs[index] = {
      ...config,
      lastUpdated: new Date().toISOString()
    };
  } else {
    userDashboardConfigs.push({
      ...config,
      lastUpdated: new Date().toISOString()
    });
  }
  
  return config;
};

// Add a widget to a user's dashboard
export const addWidget = async (userId: number, widgetType: WidgetType, title?: string, size?: 'small' | 'medium' | 'large'): Promise<DashboardWidget> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userConfig = userDashboardConfigs.find(config => config.userId === userId);
  
  if (!userConfig) {
    throw new Error('User dashboard configuration not found');
  }
  
  const widgetInfo = availableWidgets.find(w => w.type === widgetType);
  
  if (!widgetInfo) {
    throw new Error('Widget type not found');
  }
  
  const newWidget: DashboardWidget = {
    id: uuidv4(),
    type: widgetType,
    title: title || widgetInfo.title,
    size: size || widgetInfo.defaultSize,
    position: userConfig.widgets.length
  };
  
  userConfig.widgets.push(newWidget);
  userConfig.lastUpdated = new Date().toISOString();
  
  return newWidget;
};

// Remove a widget from a user's dashboard
export const removeWidget = async (userId: number, widgetId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userConfig = userDashboardConfigs.find(config => config.userId === userId);
  
  if (!userConfig) {
    throw new Error('User dashboard configuration not found');
  }
  
  userConfig.widgets = userConfig.widgets.filter(widget => widget.id !== widgetId);
  userConfig.lastUpdated = new Date().toISOString();
  
  // Update positions after removal
  userConfig.widgets.forEach((widget, index) => {
    widget.position = index;
  });
};

// Update widget positions
export const updateWidgetPositions = async (userId: number, widgetPositions: { id: string; position: number }[]): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userConfig = userDashboardConfigs.find(config => config.userId === userId);
  
  if (!userConfig) {
    throw new Error('User dashboard configuration not found');
  }
  
  widgetPositions.forEach(({ id, position }) => {
    const widget = userConfig.widgets.find(w => w.id === id);
    if (widget) {
      widget.position = position;
    }
  });
  
  userConfig.widgets.sort((a, b) => a.position - b.position);
  userConfig.lastUpdated = new Date().toISOString();
};

// Update widget settings
export const updateWidgetSettings = async (userId: number, widgetId: string, settings: Record<string, any>): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userConfig = userDashboardConfigs.find(config => config.userId === userId);
  
  if (!userConfig) {
    throw new Error('User dashboard configuration not found');
  }
  
  const widget = userConfig.widgets.find(w => w.id === widgetId);
  
  if (!widget) {
    throw new Error('Widget not found');
  }
  
  widget.settings = { ...(widget.settings || {}), ...settings };
  userConfig.lastUpdated = new Date().toISOString();
};

// Reset user dashboard to default
export const resetDashboard = async (userId: number, userRole: string): Promise<UserDashboardConfig> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const defaultConfig: UserDashboardConfig = {
    userId,
    widgets: [...(widgetsByRole[userRole] || defaultWidgets)],
    layout: 'grid',
    lastUpdated: new Date().toISOString()
  };
  
  const index = userDashboardConfigs.findIndex(c => c.userId === userId);
  
  if (index !== -1) {
    userDashboardConfigs[index] = defaultConfig;
  } else {
    userDashboardConfigs.push(defaultConfig);
  }
  
  return defaultConfig;
}; 