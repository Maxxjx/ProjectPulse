import { prisma, testDatabaseConnection, isDatabaseEnvironment } from '../prisma';
import * as mockDataService from './mockDataService';
import { 
  User, 
  Project, 
  Task, 
  Comment, 
  TimeEntry,
  Notification,
  ActivityLog
} from './types';

// Flag to indicate whether to use database or mock data
let useMockData = true;

// Initialize the service to check if database is available
export async function initializeDataService() {
  // First check if we're in a browser environment
  if (!isDatabaseEnvironment()) {
    // We're in a browser, always use mock data
    useMockData = true;
    console.info('Browser environment detected. Using mock data service.');
    return false;
  }
  
  // We're in a server environment, try to connect to the database
  const isDbConnected = await testDatabaseConnection();
  useMockData = !isDbConnected;
  
  if (useMockData) {
    console.warn('Database connection failed. Using mock data service as fallback.');
  } else {
    console.log('Connected to database. Using database service.');
  }
  
  return !useMockData;
}

// Data services that use database with fallback to mock
export const userService = {
  getUsers: async (): Promise<User[]> => {
    if (useMockData) return mockDataService.userService.getUsers();
    
    try {
      const users = await prisma.user.findMany();
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching users from database:', error);
      return mockDataService.userService.getUsers();
    }
  },
  
  getUserById: async (userId: string): Promise<User | null> => {
    if (useMockData) return mockDataService.userService.getUserById(userId);
    
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error fetching user from database:', error);
      return mockDataService.userService.getUserById(userId);
    }
  },
  
  getUserByEmail: async (email: string): Promise<User | null> => {
    if (useMockData) return mockDataService.userService.getUserByEmail(email);
    
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error fetching user from database:', error);
      return mockDataService.userService.getUserByEmail(email);
    }
  },
  
  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    if (useMockData) return mockDataService.userService.createUser(userData as any);
    
    try {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          avatar: userData.avatar,
          position: userData.position,
          department: userData.department
        }
      });
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error creating user in database:', error);
      return mockDataService.userService.createUser(userData as any);
    }
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    if (useMockData) return mockDataService.userService.updateUser(id, userData);
    
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          avatar: userData.avatar,
          position: userData.position,
          department: userData.department
        }
      });
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        avatar: user.avatar || undefined,
        position: user.position || undefined,
        department: user.department || undefined,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error(`Error updating user with ID ${id} in database:`, error);
      return mockDataService.userService.updateUser(id, userData);
    }
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    if (useMockData) return mockDataService.userService.deleteUser(id);
    
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${id} from database:`, error);
      return mockDataService.userService.deleteUser(id);
    }
  }
};

// Project service
export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    if (useMockData) return mockDataService.projectService.getProjects();
    
    try {
      const projects = await prisma.project.findMany({
        include: {
          client: true
        }
      });
      
      return projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate.toISOString(),
        endDate: project.endDate ? project.endDate.toISOString() : null,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        client: project.client ? {
          id: project.client.id,
          name: project.client.name
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching projects from database:', error);
      return mockDataService.projectService.getProjects();
    }
  },
  
  getProjectById: async (projectId: string): Promise<Project | null> => {
    if (useMockData) return mockDataService.projectService.getProjectById(projectId);
    
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          client: true
        }
      });
      
      if (!project) return null;
      
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate.toISOString(),
        endDate: project.endDate ? project.endDate.toISOString() : null,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        client: project.client ? {
          id: project.client.id,
          name: project.client.name
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching project from database:', error);
      return mockDataService.projectService.getProjectById(projectId);
    }
  }
};

// Task service
export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    if (useMockData) return mockDataService.taskService.getTasks();
    
    try {
      const tasks = await prisma.task.findMany({
        include: {
          project: true,
          assignee: true,
          creator: true
        }
      });
      
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        project: task.project.name,
        assigneeId: task.assigneeId || undefined,
        assignee: task.assignee ? task.assignee.name : '',
        deadline: task.deadline.toISOString(),
        estimatedHours: task.estimatedHours || undefined,
        actualHours: task.actualHours || undefined,
        createdBy: task.creator.name,
        created: task.createdAt.toISOString(),
        updated: task.updatedAt.toISOString(),
        tags: task.tags ? task.tags.split(',') : [],
        attachments: [],  // We'd need to fetch these separately
        comments: []      // We'd need to fetch these separately
      }));
    } catch (error) {
      console.error('Error fetching tasks from database:', error);
      return mockDataService.taskService.getTasks();
    }
  },
  
  getTasksByProjectId: async (projectId: string): Promise<Task[]> => {
    if (useMockData) return mockDataService.taskService.getTasksByProjectId(projectId);
    
    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
          project: true,
          assignee: true,
          creator: true
        }
      });
      
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        project: task.project.name,
        assigneeId: task.assigneeId || undefined,
        assignee: task.assignee ? task.assignee.name : '',
        deadline: task.deadline.toISOString(),
        estimatedHours: task.estimatedHours || undefined,
        actualHours: task.actualHours || undefined,
        createdBy: task.creator.name,
        created: task.createdAt.toISOString(),
        updated: task.updatedAt.toISOString(),
        tags: task.tags ? task.tags.split(',') : [],
        attachments: [],
        comments: []
      }));
    } catch (error) {
      console.error('Error fetching tasks by project from database:', error);
      return mockDataService.taskService.getTasksByProjectId(projectId);
    }
  },
  
  getTaskById: async (taskId: string): Promise<Task | null> => {
    if (useMockData) return mockDataService.taskService.getTaskById(taskId);
    
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: true,
          assignee: true,
          creator: true
        }
      });
      
      if (!task) return null;
      
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        project: task.project.name,
        assigneeId: task.assigneeId || undefined,
        assignee: task.assignee ? task.assignee.name : '',
        deadline: task.deadline.toISOString(),
        estimatedHours: task.estimatedHours || undefined,
        actualHours: task.actualHours || undefined,
        createdBy: task.creator.name,
        created: task.createdAt.toISOString(),
        updated: task.updatedAt.toISOString(),
        tags: task.tags ? task.tags.split(',') : [],
        attachments: [],
        comments: []
      };
    } catch (error) {
      console.error('Error fetching task from database:', error);
      return mockDataService.taskService.getTaskById(taskId);
    }
  }
};

// Time Entry service
export const timeEntryService = {
  getTimeEntries: async (): Promise<TimeEntry[]> => {
    if (useMockData) return mockDataService.timeEntryService.getTimeEntries();
    
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries from database:', error);
      return mockDataService.timeEntryService.getTimeEntries();
    }
  },
  
  getTimeEntriesByUserId: async (userId: string): Promise<TimeEntry[]> => {
    if (useMockData) return mockDataService.timeEntryService.getTimeEntriesByUserId(userId);
    
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { userId },
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries from database:', error);
      return mockDataService.timeEntryService.getTimeEntriesByUserId(userId);
    }
  },
  
  getTimeEntriesByTaskId: async (taskId: string): Promise<TimeEntry[]> => {
    if (useMockData) return mockDataService.timeEntryService.getTimeEntriesByTaskId(taskId);
    
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { taskId },
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries from database:', error);
      return mockDataService.timeEntryService.getTimeEntriesByTaskId(taskId);
    }
  },
  
  getTimeEntriesByProjectId: async (projectId: string): Promise<TimeEntry[]> => {
    if (useMockData) {
      const allEntries = mockDataService.timeEntryService.getTimeEntries();
      return allEntries.filter(entry => 
        entry.task && entry.task.projectId === projectId
      );
    }
    
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: {
          task: {
            projectId: projectId
          }
        },
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return timeEntries.map(entry => ({
        id: entry.id,
        description: entry.description,
        startTime: entry.startTime.toISOString(),
        endTime: entry.endTime ? entry.endTime.toISOString() : null,
        duration: entry.duration,
        taskId: entry.taskId,
        task: {
          title: entry.task.title,
          projectId: entry.task.projectId,
          project: entry.task.project.name
        },
        userId: entry.userId,
        user: {
          name: entry.user.name,
          position: entry.user.position || undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching time entries by project from database:', error);
      const allEntries = await timeEntryService.getTimeEntries();
      return allEntries.filter(entry => 
        entry.task && entry.task.projectId === projectId
      );
    }
  },
  
  createTimeEntry: async (entryData: Omit<TimeEntry, 'id'>): Promise<TimeEntry> => {
    if (useMockData) {
      if (typeof mockDataService.timeEntryService.createTimeEntry === 'function') {
        return mockDataService.timeEntryService.createTimeEntry(entryData);
      }
      
      const entry = {
        id: new Date().getTime().toString(),
        ...entryData,
        date: new Date().toISOString()
      };
      return entry as TimeEntry;
    }
    
    try {
      const timeEntry = await prisma.timeEntry.create({
        data: {
          description: entryData.description,
          startTime: new Date(entryData.date),
          duration: entryData.hours * 60, // Convert hours to minutes for storage
          userId: entryData.userId,
          taskId: entryData.taskId
        },
        include: {
          task: {
            include: {
              project: true
            }
          },
          user: true
        }
      });
      
      return {
        id: timeEntry.id,
        description: timeEntry.description,
        date: timeEntry.startTime.toISOString().split('T')[0],
        hours: timeEntry.duration / 60, // Convert minutes back to hours
        taskId: timeEntry.taskId,
        task: {
          title: timeEntry.task.title,
          projectId: timeEntry.task.projectId,
          project: timeEntry.task.project.name
        },
        userId: timeEntry.userId,
        user: {
          name: timeEntry.user.name,
          position: timeEntry.user.position || undefined
        }
      };
    } catch (error) {
      console.error('Error creating time entry in database:', error);
      
      if (typeof mockDataService.timeEntryService.createTimeEntry === 'function') {
        return mockDataService.timeEntryService.createTimeEntry(entryData);
      }
      
      const entry = {
        id: new Date().getTime().toString(),
        ...entryData,
        date: new Date().toISOString()
      };
      return entry as TimeEntry;
    }
  }
};

// Add notification service
export const notificationService = {
  getNotificationsByUserId: async (userId: string): Promise<Notification[]> => {
    if (useMockData) {
      if (typeof mockDataService.notificationService.getUserNotifications === 'function') {
        return mockDataService.notificationService.getUserNotifications(userId);
      }
      
      return [];
    }
    
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      
      return notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        entityId: notification.entityId,
        entityType: notification.entityType,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching notifications from database:', error);
      
      if (typeof mockDataService.notificationService.getUserNotifications === 'function') {
        return mockDataService.notificationService.getUserNotifications(userId);
      }
      
      return [];
    }
  },
  
  getNotificationById: async (id: string): Promise<Notification | null> => {
    if (useMockData) {
      const userNotifications = mockDataService.notificationService.getUserNotifications('all');
      return userNotifications.find(n => n.id === id) || null;
    }
    
    try {
      const notification = await prisma.notification.findUnique({
        where: { id }
      });
      
      if (!notification) return null;
      
      return {
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        entityId: notification.entityId,
        entityType: notification.entityType,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error fetching notification from database:', error);
      
      const userNotifications = mockDataService.notificationService.getUserNotifications('all');
      return userNotifications.find(n => n.id === id) || null;
    }
  },
  
  updateNotifications: async (ids: string[], isRead: boolean): Promise<Notification[]> => {
    if (useMockData) {
      const userNotifications = mockDataService.notificationService.getUserNotifications('all');
      const updatedNotifications = userNotifications
        .filter(n => ids.includes(n.id))
        .map(n => ({
          ...n,
          isRead: isRead
        }));
      
      return updatedNotifications;
    }
    
    try {
      await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { isRead }
      });
      
      const updatedNotifications = await prisma.notification.findMany({
        where: { id: { in: ids } }
      });
      
      return updatedNotifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        entityId: notification.entityId,
        entityType: notification.entityType,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error('Error updating notifications in database:', error);
      
      const userNotifications = mockDataService.notificationService.getUserNotifications('all');
      const updatedNotifications = userNotifications
        .filter(n => ids.includes(n.id))
        .map(n => ({
          ...n,
          isRead: isRead
        }));
      
      return updatedNotifications;
    }
  },
  
  createNotification: async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> => {
    if (useMockData) {
      return {
        id: new Date().getTime().toString(),
        ...notificationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          isRead: notificationData.isRead || false,
          entityId: notificationData.entityId,
          entityType: notificationData.entityType
        }
      });
      
      return {
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        entityId: notification.entityId,
        entityType: notification.entityType,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Error creating notification in database:', error);
      
      return {
        id: new Date().getTime().toString(),
        ...notificationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }
};