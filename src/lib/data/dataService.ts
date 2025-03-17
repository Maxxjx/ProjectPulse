import { prisma, testDatabaseConnection } from '../prisma';
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
        deadline: project.deadline?.toISOString() || "",
        team: [],
        priority: "low",
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
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
      console.error('Error fetching time entries by user from database:', error);
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
      console.error('Error fetching time entries by task from database:', error);
      return mockDataService.timeEntryService.getTimeEntriesByTaskId(taskId);
    }
  }
};

// Export additional services as needed 