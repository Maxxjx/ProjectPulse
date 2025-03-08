// Type definitions for our application data models

export enum UserRole {
  ADMIN = 'admin',
  TEAM = 'team',
  CLIENT = 'client',
  USER = 'user'
}

export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  ALMOST_COMPLETE = 'Almost Complete'
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  UNDER_REVIEW = 'Under Review',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not included in responses
  role: UserRole;
  avatar?: string;
  position?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  budget?: number;
  spent?: number;
  clientId?: string;
  team: string[]; // Array of user IDs or names
  tags?: string[];
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  projectId: number;
  project: string;
  assigneeId?: string;
  assignee: string;
  deadline: string;
  estimatedHours?: number;
  actualHours?: number;
  createdBy: string;
  created: string;
  updated: string;
  tags?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  taskId: number;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: number;
  taskId: number;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TimeEntry {
  id: number;
  taskId: number;
  userId: string;
  description: string;
  minutes: number;
  date: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  relatedToType?: 'project' | 'task' | 'comment';
  relatedToId?: number;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userId: string;
  userName: string;
  action: string;
  entityType: 'project' | 'task' | 'user';
  entityId: number | string;
  entityName: string;
  details?: string;
  timestamp: string;
} 