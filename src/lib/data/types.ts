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

// Define notification types
export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'task_deadline'
  | 'comment_added'
  | 'project_update'
  | 'document_shared'
  | 'mention';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  entityId?: number; // ID of the related task, project, etc.
  entityType?: string; // 'task', 'project', etc.
  read: boolean;
  createdAt: string;
  actionUrl?: string; // URL to navigate to when notification is clicked
}

export interface EmailNotification extends Notification {
  recipientEmail: string;
  emailSent: boolean;
  emailSentAt?: string;
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

// Define widget types
export type WidgetType = 
  | 'task_summary'
  | 'project_status'
  | 'recent_activity'
  | 'team_workload'
  | 'upcoming_deadlines'
  | 'budget_overview'
  | 'time_tracking_summary'
  | 'quick_actions';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  settings?: Record<string, any>;
}

export interface UserDashboardConfig {
  userId: number;
  widgets: DashboardWidget[];
  layout: 'grid' | 'list';
  lastUpdated: string;
} 