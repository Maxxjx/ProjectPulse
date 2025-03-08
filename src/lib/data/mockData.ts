import { 
  User, 
  Project, 
  Task, 
  Comment, 
  Attachment,
  TimeEntry,
  Notification,
  ActivityLog,
  UserRole,
  ProjectStatus,
  TaskStatus,
  Priority
} from './types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@projectpulse.com',
    password: 'admin1234', // In a real app, never store plain text passwords
    role: UserRole.ADMIN,
    position: 'System Administrator',
    department: 'IT',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'Senior Developer',
    department: 'Engineering',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Sarah Smith',
    email: 'sarah@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'UI/UX Designer',
    department: 'Design',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Michael Chen',
    email: 'michael@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'Full Stack Developer',
    department: 'Engineering',
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Emily Taylor',
    email: 'emily@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'Backend Developer',
    department: 'Engineering',
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Acme Corp',
    email: 'client@projectpulse.com',
    password: 'client1234',
    role: UserRole.CLIENT,
    position: 'Client',
    department: 'External',
    createdAt: '2023-01-06T00:00:00Z',
    updatedAt: '2023-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'Alex Johnson',
    email: 'alex@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'Project Manager',
    department: 'Operations',
    createdAt: '2023-01-07T00:00:00Z',
    updatedAt: '2023-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Lisa Brown',
    email: 'lisa@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'Marketing Specialist',
    department: 'Marketing',
    createdAt: '2023-01-08T00:00:00Z',
    updatedAt: '2023-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: 'Globex Inc',
    email: 'globex@projectpulse.com',
    password: 'client1234',
    role: UserRole.CLIENT,
    position: 'Client',
    department: 'External',
    createdAt: '2023-01-09T00:00:00Z',
    updatedAt: '2023-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: 'James Peterson',
    email: 'james@projectpulse.com',
    password: 'team1234',
    role: UserRole.TEAM,
    position: 'Product Manager',
    department: 'Product',
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-01-10T00:00:00Z'
  }
];

// Mock Projects
export const projects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles',
    status: ProjectStatus.IN_PROGRESS,
    progress: 75,
    startDate: '2023-05-01T00:00:00Z',
    deadline: '2023-08-15T00:00:00Z',
    budget: 25000,
    spent: 18750,
    clientId: '6', // Acme Corp
    team: ['2', '3', '4'], // John, Sarah, Michael
    tags: ['design', 'frontend', 'ui/ux'],
    priority: Priority.HIGH,
    createdAt: '2023-04-15T00:00:00Z',
    updatedAt: '2023-07-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile app for customer engagement',
    status: ProjectStatus.IN_PROGRESS,
    progress: 32,
    startDate: '2023-06-01T00:00:00Z',
    deadline: '2023-10-05T00:00:00Z',
    budget: 50000,
    spent: 16000,
    clientId: '6', // Acme Corp
    team: ['2', '4', '5'], // John, Michael, Emily
    tags: ['mobile', 'react-native', 'api'],
    priority: Priority.HIGH,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-07-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Q3 digital marketing campaign for new product launch',
    status: ProjectStatus.IN_PROGRESS,
    progress: 50,
    startDate: '2023-07-01T00:00:00Z',
    deadline: '2023-09-01T00:00:00Z',
    budget: 15000,
    spent: 7500,
    clientId: '6', // Acme Corp
    team: ['7', '8'], // Alex, Lisa
    tags: ['marketing', 'digital', 'social-media'],
    priority: Priority.MEDIUM,
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z'
  },
  {
    id: 4,
    name: 'Product Launch',
    description: 'Coordinate the launch of the new product line',
    status: ProjectStatus.NOT_STARTED,
    progress: 18,
    startDate: '2023-08-01T00:00:00Z',
    deadline: '2023-11-15T00:00:00Z',
    budget: 35000,
    spent: 6300,
    clientId: '9', // Globex Inc
    team: ['7', '8', '10'], // Alex, Lisa, James
    tags: ['product', 'launch', 'marketing'],
    priority: Priority.MEDIUM,
    createdAt: '2023-07-15T00:00:00Z',
    updatedAt: '2023-07-15T00:00:00Z'
  },
  {
    id: 5,
    name: 'Customer Research',
    description: 'Conduct research to understand customer needs for upcoming product',
    status: ProjectStatus.ALMOST_COMPLETE,
    progress: 90,
    startDate: '2023-04-01T00:00:00Z',
    deadline: '2023-07-30T00:00:00Z',
    budget: 10000,
    spent: 9000,
    clientId: '9', // Globex Inc
    team: ['8', '10'], // Lisa, James
    tags: ['research', 'customer', 'product'],
    priority: Priority.LOW,
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-07-20T00:00:00Z'
  }
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: 1,
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and visual design for the new homepage',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    projectId: 1,
    project: 'Website Redesign',
    assigneeId: '3', // Sarah
    assignee: 'Sarah Smith',
    deadline: '2023-07-25T00:00:00Z',
    estimatedHours: 20,
    actualHours: 15,
    createdBy: 'Alex Johnson',
    created: '2023-07-10T00:00:00Z',
    updated: '2023-07-20T00:00:00Z',
    tags: ['design', 'homepage']
  },
  {
    id: 2,
    title: 'Implement User Authentication',
    description: 'Set up JWT-based authentication system for the app',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    projectId: 2,
    project: 'Mobile App Development',
    assigneeId: '5', // Emily
    assignee: 'Emily Taylor',
    deadline: '2023-07-30T00:00:00Z',
    estimatedHours: 16,
    actualHours: 8,
    createdBy: 'Alex Johnson',
    created: '2023-07-12T00:00:00Z',
    updated: '2023-07-20T00:00:00Z',
    tags: ['backend', 'auth', 'security']
  },
  {
    id: 3,
    title: 'Create Social Media Content Calendar',
    description: 'Plan content for social media posts for the next month',
    status: TaskStatus.COMPLETED,
    priority: Priority.MEDIUM,
    projectId: 3,
    project: 'Marketing Campaign',
    assigneeId: '8', // Lisa
    assignee: 'Lisa Brown',
    deadline: '2023-07-15T00:00:00Z',
    estimatedHours: 8,
    actualHours: 10,
    createdBy: 'Alex Johnson',
    created: '2023-07-05T00:00:00Z',
    updated: '2023-07-15T00:00:00Z',
    tags: ['marketing', 'social-media']
  },
  {
    id: 4,
    title: 'Update Product Pricing',
    description: 'Review and update pricing for the new product line',
    status: TaskStatus.NOT_STARTED,
    priority: Priority.MEDIUM,
    projectId: 4,
    project: 'Product Launch',
    assigneeId: '10', // James
    assignee: 'James Peterson',
    deadline: '2023-08-05T00:00:00Z',
    estimatedHours: 4,
    actualHours: 0,
    createdBy: 'Alex Johnson',
    created: '2023-07-18T00:00:00Z',
    updated: '2023-07-18T00:00:00Z',
    tags: ['pricing', 'product']
  },
  {
    id: 5,
    title: 'Conduct Customer Interviews',
    description: 'Interview 10 customers about their experience with the product',
    status: TaskStatus.COMPLETED,
    priority: Priority.HIGH,
    projectId: 5,
    project: 'Customer Research',
    assigneeId: '10', // James
    assignee: 'James Peterson',
    deadline: '2023-07-20T00:00:00Z',
    estimatedHours: 20,
    actualHours: 18,
    createdBy: 'Alex Johnson',
    created: '2023-07-08T00:00:00Z',
    updated: '2023-07-19T00:00:00Z',
    tags: ['research', 'customer']
  },
  {
    id: 6,
    title: 'Fix Navigation Menu Bug',
    description: 'Resolve issue with dropdown menu not working on mobile devices',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    projectId: 1,
    project: 'Website Redesign',
    assigneeId: '2', // John
    assignee: 'John Doe',
    deadline: '2023-07-22T00:00:00Z',
    estimatedHours: 4,
    actualHours: 2,
    createdBy: 'Alex Johnson',
    created: '2023-07-15T00:00:00Z',
    updated: '2023-07-20T00:00:00Z',
    tags: ['bug', 'mobile', 'navigation']
  },
  {
    id: 7,
    title: 'Optimize Database Queries',
    description: 'Improve performance of search queries in the backend',
    status: TaskStatus.NOT_STARTED,
    priority: Priority.MEDIUM,
    projectId: 2,
    project: 'Mobile App Development',
    assigneeId: '4', // Michael
    assignee: 'Michael Chen',
    deadline: '2023-08-10T00:00:00Z',
    estimatedHours: 8,
    actualHours: 0,
    createdBy: 'Alex Johnson',
    created: '2023-07-17T00:00:00Z',
    updated: '2023-07-17T00:00:00Z',
    tags: ['optimization', 'database', 'performance']
  },
  {
    id: 8,
    title: 'Set Up Analytics Dashboard',
    description: 'Configure Google Analytics and create custom dashboard',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.LOW,
    projectId: 3,
    project: 'Marketing Campaign',
    assigneeId: '8', // Lisa
    assignee: 'Lisa Brown',
    deadline: '2023-07-28T00:00:00Z',
    estimatedHours: 6,
    actualHours: 3,
    createdBy: 'Alex Johnson',
    created: '2023-07-14T00:00:00Z',
    updated: '2023-07-20T00:00:00Z',
    tags: ['analytics', 'dashboard', 'reporting']
  }
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: 1,
    taskId: 1,
    userId: '7', // Alex
    userName: 'Alex Johnson',
    text: 'Make sure to follow our brand guidelines for colors and typography.',
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-07-15T10:30:00Z'
  },
  {
    id: 2,
    taskId: 1,
    userId: '3', // Sarah
    userName: 'Sarah Smith',
    text: 'I\'ve uploaded initial wireframes for review. Please check the attachments.',
    createdAt: '2023-07-16T09:15:00Z',
    updatedAt: '2023-07-16T09:15:00Z'
  },
  {
    id: 3,
    taskId: 2,
    userId: '5', // Emily
    userName: 'Emily Taylor',
    text: 'I\'m researching the best JWT implementation for our stack. Will update soon.',
    createdAt: '2023-07-14T11:20:00Z',
    updatedAt: '2023-07-14T11:20:00Z'
  },
  {
    id: 4,
    taskId: 3,
    userId: '8', // Lisa
    userName: 'Lisa Brown',
    text: 'Calendar completed and shared with the team for review.',
    createdAt: '2023-07-15T15:45:00Z',
    updatedAt: '2023-07-15T15:45:00Z'
  },
  {
    id: 5,
    taskId: 5,
    userId: '10', // James
    userName: 'James Peterson',
    text: 'All interviews completed. Working on the summary report now.',
    createdAt: '2023-07-19T16:30:00Z',
    updatedAt: '2023-07-19T16:30:00Z'
  }
];

// Mock Time Entries
export const timeEntries: TimeEntry[] = [
  {
    id: 1,
    taskId: 1,
    userId: '3', // Sarah
    description: 'Creating wireframes for homepage',
    minutes: 180, // 3 hours
    date: '2023-07-15',
    createdAt: '2023-07-15T17:00:00Z'
  },
  {
    id: 2,
    taskId: 1,
    userId: '3', // Sarah
    description: 'Finalizing homepage design',
    minutes: 240, // 4 hours
    date: '2023-07-16',
    createdAt: '2023-07-16T17:00:00Z'
  },
  {
    id: 3,
    taskId: 2,
    userId: '5', // Emily
    description: 'Researching JWT implementations',
    minutes: 120, // 2 hours
    date: '2023-07-14',
    createdAt: '2023-07-14T17:00:00Z'
  },
  {
    id: 4,
    taskId: 2,
    userId: '5', // Emily
    description: 'Setting up auth endpoints',
    minutes: 360, // 6 hours
    date: '2023-07-17',
    createdAt: '2023-07-17T17:00:00Z'
  },
  {
    id: 5,
    taskId: 3,
    userId: '8', // Lisa
    description: 'Creating content calendar',
    minutes: 300, // 5 hours
    date: '2023-07-15',
    createdAt: '2023-07-15T17:00:00Z'
  },
  {
    id: 6,
    taskId: 3,
    userId: '8', // Lisa
    description: 'Revising content strategy',
    minutes: 180, // 3 hours
    date: '2023-07-16',
    createdAt: '2023-07-16T17:00:00Z'
  }
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 1,
    userId: '3', // Sarah
    title: 'Task Assigned',
    message: 'You have been assigned to "Design Homepage Mockup"',
    type: 'info',
    read: false,
    relatedToType: 'task',
    relatedToId: 1,
    createdAt: '2023-07-10T10:30:00Z'
  },
  {
    id: 2,
    userId: '2', // John
    title: 'Task Assigned',
    message: 'You have been assigned to "Fix Navigation Menu Bug"',
    type: 'info',
    read: true,
    relatedToType: 'task',
    relatedToId: 6,
    createdAt: '2023-07-15T09:45:00Z'
  },
  {
    id: 3,
    userId: '7', // Alex
    title: 'Task Completed',
    message: 'The task "Create Social Media Content Calendar" has been completed',
    type: 'success',
    read: false,
    relatedToType: 'task',
    relatedToId: 3,
    createdAt: '2023-07-15T15:50:00Z'
  },
  {
    id: 4,
    userId: '5', // Emily
    title: 'Comment Added',
    message: 'Alex Johnson commented on "Implement User Authentication"',
    type: 'info',
    read: false,
    relatedToType: 'comment',
    relatedToId: 3,
    createdAt: '2023-07-14T11:25:00Z'
  },
  {
    id: 5,
    userId: '4', // Michael
    title: 'Task Deadline Approaching',
    message: 'The task "Optimize Database Queries" is due in 3 days',
    type: 'warning',
    read: false,
    relatedToType: 'task',
    relatedToId: 7,
    createdAt: '2023-07-17T08:00:00Z'
  }
];

// Mock Activity Logs
export const activityLogs: ActivityLog[] = [
  {
    id: 1,
    userId: '7', // Alex
    userName: 'Alex Johnson',
    action: 'created',
    entityType: 'task',
    entityId: 1,
    entityName: 'Design Homepage Mockup',
    timestamp: '2023-07-10T10:30:00Z'
  },
  {
    id: 2,
    userId: '7', // Alex
    userName: 'Alex Johnson',
    action: 'assigned',
    entityType: 'task',
    entityId: 1,
    entityName: 'Design Homepage Mockup',
    details: 'Assigned to Sarah Smith',
    timestamp: '2023-07-10T10:31:00Z'
  },
  {
    id: 3,
    userId: '3', // Sarah
    userName: 'Sarah Smith',
    action: 'updated',
    entityType: 'task',
    entityId: 1,
    entityName: 'Design Homepage Mockup',
    details: 'Changed status to "In Progress"',
    timestamp: '2023-07-12T09:15:00Z'
  },
  {
    id: 4,
    userId: '8', // Lisa
    userName: 'Lisa Brown',
    action: 'completed',
    entityType: 'task',
    entityId: 3,
    entityName: 'Create Social Media Content Calendar',
    timestamp: '2023-07-15T15:45:00Z'
  },
  {
    id: 5,
    userId: '7', // Alex
    userName: 'Alex Johnson',
    action: 'created',
    entityType: 'project',
    entityId: 4,
    entityName: 'Product Launch',
    timestamp: '2023-07-15T14:00:00Z'
  },
  {
    id: 6,
    userId: '1', // Admin
    userName: 'Admin User',
    action: 'created',
    entityType: 'user',
    entityId: '10',
    entityName: 'James Peterson',
    timestamp: '2023-07-09T11:30:00Z'
  },
  {
    id: 7,
    userId: '5', // Emily
    userName: 'Emily Taylor',
    action: 'commented',
    entityType: 'task',
    entityId: 2,
    entityName: 'Implement User Authentication',
    timestamp: '2023-07-14T11:20:00Z'
  }
]; 