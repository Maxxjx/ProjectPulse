'use client';

import { Notification, NotificationType, EmailNotification, User, Task } from '../data/types';

// Simulated notifications database
let notifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    title: 'Task assigned',
    message: 'You have been assigned a new task: "Implement Login Page"',
    type: 'task_assigned',
    entityId: 1,
    entityType: 'task',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: '/dashboard/tasks/1'
  },
  {
    id: 2,
    userId: 1,
    title: 'Task deadline approaching',
    message: 'Task "Setup API Routes" is due in 2 days',
    type: 'task_deadline',
    entityId: 2,
    entityType: 'task',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    actionUrl: '/dashboard/tasks/2'
  },
  {
    id: 3,
    userId: 1,
    title: 'New comment',
    message: 'John Doe commented on the task "Implement Login Page"',
    type: 'comment_added',
    entityId: 1,
    entityType: 'task',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    actionUrl: '/dashboard/tasks/1'
  }
];

// Simulated email queue
let emailQueue: EmailNotification[] = [];

// Notification service functions
export const getNotifications = async (userId: number): Promise<Notification[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return notifications.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getUnreadNotificationCount = async (userId: number): Promise<number> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return notifications.filter(n => n.userId === userId && !n.read).length;
};

export const markNotificationAsRead = async (notificationId: number): Promise<Notification> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const notification = notifications.find(n => n.id === notificationId);
  if (!notification) {
    throw new Error('Notification not found');
  }
  
  notification.read = true;
  return notification;
};

export const markAllNotificationsAsRead = async (userId: number): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  notifications = notifications.map(n => 
    n.userId === userId ? { ...n, read: true } : n
  );
};

export const deleteNotification = async (notificationId: number): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  notifications = notifications.filter(n => n.id !== notificationId);
};

// Create a new notification
export const createNotification = async (
  userId: number,
  title: string,
  message: string,
  type: NotificationType,
  entityId?: number,
  entityType?: string,
  actionUrl?: string
): Promise<Notification> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newNotification: Notification = {
    id: Math.max(...notifications.map(n => n.id), 0) + 1,
    userId,
    title,
    message,
    type,
    entityId,
    entityType,
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl
  };
  
  notifications.push(newNotification);
  return newNotification;
};

// Queue an email notification
export const queueEmailNotification = async (
  notification: Notification,
  recipientEmail: string
): Promise<EmailNotification> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const emailNotification: EmailNotification = {
    ...notification,
    recipientEmail,
    emailSent: false
  };
  
  emailQueue.push(emailNotification);
  
  // In a real app, we would trigger an email sending service here
  // For demo purposes, we'll simulate sending after a delay
  simulateSendEmail(emailNotification);
  
  return emailNotification;
};

// Simulate sending an email
const simulateSendEmail = async (emailNotification: EmailNotification): Promise<void> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Update the email status
  const index = emailQueue.findIndex(e => e.id === emailNotification.id);
  if (index !== -1) {
    emailQueue[index].emailSent = true;
    emailQueue[index].emailSentAt = new Date().toISOString();
    
    console.log(`Email sent to ${emailNotification.recipientEmail}:`, {
      subject: emailNotification.title,
      body: emailNotification.message
    });
  }
};

// Event-based notification functions
export const notifyTaskAssigned = async (task: Task, assigneeId: number, assigneeEmail: string): Promise<void> => {
  const notification = await createNotification(
    assigneeId,
    'Task assigned',
    `You have been assigned a new task: "${task.title}"`,
    'task_assigned',
    task.id,
    'task',
    `/dashboard/tasks/${task.id}`
  );
  
  await queueEmailNotification(notification, assigneeEmail);
};

export const notifyTaskDeadlineApproaching = async (task: Task, userId: number, userEmail: string, daysRemaining: number): Promise<void> => {
  const notification = await createNotification(
    userId,
    'Task deadline approaching',
    `Task "${task.title}" is due in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
    'task_deadline',
    task.id,
    'task',
    `/dashboard/tasks/${task.id}`
  );
  
  await queueEmailNotification(notification, userEmail);
};

export const notifyCommentAdded = async (task: Task, commentAuthor: string, recipientId: number, recipientEmail: string): Promise<void> => {
  const notification = await createNotification(
    recipientId,
    'New comment',
    `${commentAuthor} commented on the task "${task.title}"`,
    'comment_added',
    task.id,
    'task',
    `/dashboard/tasks/${task.id}`
  );
  
  await queueEmailNotification(notification, recipientEmail);
};

export const notifyProjectUpdate = async (projectId: number, projectName: string, updateMessage: string, recipientIds: number[], recipientEmails: string[]): Promise<void> => {
  for (let i = 0; i < recipientIds.length; i++) {
    const notification = await createNotification(
      recipientIds[i],
      'Project update',
      `Update on project "${projectName}": ${updateMessage}`,
      'project_update',
      projectId,
      'project',
      `/dashboard/projects/${projectId}`
    );
    
    await queueEmailNotification(notification, recipientEmails[i]);
  }
};

// Function to check for upcoming deadlines and send notifications
export const checkDeadlines = async (users: User[], tasks: Task[]): Promise<void> => {
  const now = new Date();
  
  for (const task of tasks) {
    if (task.status === 'Completed') continue;
    
    const deadline = new Date(task.dueDate);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Notify when deadline is 1 or 3 days away
    if (daysRemaining === 1 || daysRemaining === 3) {
      const assignee = users.find(u => u.id === task.assigneeId);
      if (assignee) {
        await notifyTaskDeadlineApproaching(task, assignee.id, assignee.email, daysRemaining);
      }
    }
  }
}; 