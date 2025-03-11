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

import { 
  users as mockUsers,
  projects as mockProjects,
  tasks as mockTasks,
  comments as mockComments,
  timeEntries as mockTimeEntries,
  notifications as mockNotifications,
  activityLogs as mockActivityLogs
} from './mockData';

// Make copies of the mock data to allow modifications during runtime
let users = [...mockUsers];
let projects = [...mockProjects];
let tasks = [...mockTasks];
let comments = [...mockComments];
let timeEntries = [...mockTimeEntries];
let notifications = [...mockNotifications];
let activityLogs = [...mockActivityLogs];

// Helper to create activity logs
const createActivityLog = (
  userId: string,
  userName: string,
  action: string,
  entityType: 'project' | 'task' | 'user',
  entityId: number | string,
  entityName: string,
  details?: string
): ActivityLog => {
  const newId = activityLogs.length > 0 
    ? Math.max(...activityLogs.map(log => log.id)) + 1 
    : 1;
  
  const log: ActivityLog = {
    id: newId,
    userId,
    userName,
    action,
    entityType,
    entityId,
    entityName,
    details,
    timestamp: new Date().toISOString()
  };
  
  activityLogs.push(log);
  return log;
};

// User Services
export const userService = {
  // Get all users
  getUsers: () => {
    // Remove password field for security
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },
  
  // Get user by ID
  getUserById: (id: string) => {
    const user = users.find(user => user.id === id);
    if (!user) return null;
    
    // Remove password field for security
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Get user by email
  getUserByEmail: (email: string) => {
    return users.find(user => user.email === email) || null;
  },
  
  // Create a new user
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = users.length > 0 
      ? String(Math.max(...users.map(user => parseInt(user.id))) + 1) 
      : '1';
    
    const now = new Date().toISOString();
    const newUser: User = {
      id: newId,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    
    users.push(newUser);
    
    // Create activity log
    createActivityLog(
      '1', // Assume admin is creating the user
      'Admin User',
      'created',
      'user',
      newId,
      userData.name
    );
    
    // Return without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  // Update a user
  updateUser: (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    const updatedUser: User = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    users[index] = updatedUser;
    
    // Create activity log
    createActivityLog(
      '1', // Assume admin is updating the user
      'Admin User',
      'updated',
      'user',
      id,
      updatedUser.name
    );
    
    // Return without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
  
  // Delete a user
  deleteUser: (id: string) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    const deletedUser = users[index];
    users.splice(index, 1);
    
    // Create activity log
    createActivityLog(
      '1', // Assume admin is deleting the user
      'Admin User',
      'deleted',
      'user',
      id,
      deletedUser.name
    );
    
    return true;
  }
};

// Project Services
export const projectService = {
  // Get all projects
  getProjects: () => {
    return projects;
  },
  
  // Get project by ID
  getProjectById: (id: number) => {
    return projects.find(project => project.id === id) || null;
  },
  
  // Get projects by client ID
  getProjectsByClient: (clientId: string) => {
    return projects.filter(project => project.clientId === clientId);
  },
  
  // Get projects for a team member
  getProjectsByTeamMember: (userId: string) => {
    return projects.filter(project => project.team.includes(userId));
  },
  
  // Create a new project
  createProject: (
    projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, 
    creatorId: string, 
    creatorName: string
  ) => {
    const newId = projects.length > 0 
      ? Math.max(...projects.map(project => project.id)) + 1 
      : 1;
    
    const now = new Date().toISOString();
    const newProject: Project = {
      id: newId,
      ...projectData,
      createdAt: now,
      updatedAt: now
    };
    
    projects.push(newProject);
    
    // Create activity log
    createActivityLog(
      creatorId,
      creatorName,
      'created',
      'project',
      newId,
      projectData.name
    );
    
    return newProject;
  },
  
  // Update a project
  updateProject: (
    id: number, 
    projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>,
    updaterId: string,
    updaterName: string
  ) => {
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) return null;
    
    const updatedProject: Project = {
      ...projects[index],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    projects[index] = updatedProject;
    
    // Create activity log
    createActivityLog(
      updaterId,
      updaterName,
      'updated',
      'project',
      id,
      updatedProject.name
    );
    
    return updatedProject;
  },
  
  // Delete a project
  deleteProject: (id: number, deleterId: string, deleterName: string) => {
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) return false;
    
    const deletedProject = projects[index];
    projects.splice(index, 1);
    
    // Create activity log
    createActivityLog(
      deleterId,
      deleterName,
      'deleted',
      'project',
      id,
      deletedProject.name
    );
    
    return true;
  },
  
  // Add a team member to a project
  addTeamMember: (
    projectId: number, 
    userId: string,
    adderId: string,
    adderName: string
  ) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    
    if (project.team.includes(userId)) {
      return project; // User already in team
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const updatedProject = {
      ...project,
      team: [...project.team, userId],
      updatedAt: new Date().toISOString()
    };
    
    const index = projects.findIndex(p => p.id === projectId);
    projects[index] = updatedProject;
    
    // Create activity log
    createActivityLog(
      adderId,
      adderName,
      'added team member',
      'project',
      projectId,
      project.name,
      `Added ${user.name} to the project team`
    );
    
    return updatedProject;
  },
  
  // Remove a team member from a project
  removeTeamMember: (
    projectId: number, 
    userId: string,
    removerId: string,
    removerName: string
  ) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    
    if (!project.team.includes(userId)) {
      return project; // User not in team
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const updatedProject = {
      ...project,
      team: project.team.filter(id => id !== userId),
      updatedAt: new Date().toISOString()
    };
    
    const index = projects.findIndex(p => p.id === projectId);
    projects[index] = updatedProject;
    
    // Create activity log
    createActivityLog(
      removerId,
      removerName,
      'removed team member',
      'project',
      projectId,
      project.name,
      `Removed ${user.name} from the project team`
    );
    
    return updatedProject;
  }
};

// Task Services
export const taskService = {
  // Get all tasks
  getTasks: () => {
    return tasks;
  },
  
  // Get task by ID
  getTaskById: (id: number) => {
    return tasks.find(task => task.id === id) || null;
  },
  
  // Get tasks by project ID
  getTasksByProject: (projectId: number) => {
    return tasks.filter(task => task.projectId === projectId);
  },
  
  // Get tasks assigned to a user
  getTasksByAssignee: (assigneeId: string) => {
    return tasks.filter(task => task.assigneeId === assigneeId);
  },
  
  // Create a new task
  createTask: (
    taskData: Omit<Task, 'id' | 'created' | 'updated' | 'comments' | 'attachments'>,
    creatorId: string,
    creatorName: string
  ) => {
    const newId = tasks.length > 0 
      ? Math.max(...tasks.map(task => task.id)) + 1 
      : 1;
    
    const now = new Date().toISOString();
    const newTask: Task = {
      id: newId,
      ...taskData,
      created: now,
      updated: now,
      comments: [],
      attachments: []
    };
    
    tasks.push(newTask);
    
    // Create activity log
    createActivityLog(
      creatorId,
      creatorName,
      'created',
      'task',
      newId,
      taskData.title
    );
    
    // Create notification for assignee if present
    if (taskData.assigneeId) {
      const newNotificationId = notifications.length > 0 
        ? Math.max(...notifications.map(n => n.id)) + 1 
        : 1;
      
      notifications.push({
        id: newNotificationId,
        userId: taskData.assigneeId,
        title: 'Task Assigned',
        message: `You have been assigned to "${taskData.title}"`,
        type: 'info',
        read: false,
        relatedToType: 'task',
        relatedToId: newId,
        createdAt: now
      });
    }
    
    return newTask;
  },
  
  // Update a task
  updateTask: (
    id: number, 
    taskData: Partial<Omit<Task, 'id' | 'created' | 'updated' | 'comments' | 'attachments'>>,
    updaterId: string,
    updaterName: string
  ) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return null;
    
    const prevTask = tasks[index];
    const updatedTask: Task = {
      ...prevTask,
      ...taskData,
      updated: new Date().toISOString()
    };
    
    tasks[index] = updatedTask;
    
    // Create activity log with details about what changed
    const changes: string[] = [];
    if (taskData.status && taskData.status !== prevTask.status) {
      changes.push(`Changed status from "${prevTask.status}" to "${taskData.status}"`);
    }
    if (taskData.assigneeId && taskData.assigneeId !== prevTask.assigneeId) {
      const newAssignee = users.find(user => user.id === taskData.assigneeId);
      changes.push(`Reassigned from ${prevTask.assignee} to ${newAssignee?.name || 'unknown'}`);
      
      // Create notification for new assignee
      if (newAssignee) {
        const newNotificationId = notifications.length > 0 
          ? Math.max(...notifications.map(n => n.id)) + 1 
          : 1;
        
        notifications.push({
          id: newNotificationId,
          userId: taskData.assigneeId,
          title: 'Task Assigned',
          message: `You have been assigned to "${updatedTask.title}"`,
          type: 'info',
          read: false,
          relatedToType: 'task',
          relatedToId: id,
          createdAt: new Date().toISOString()
        });
      }
    }
    
    createActivityLog(
      updaterId,
      updaterName,
      'updated',
      'task',
      id,
      updatedTask.title,
      changes.length > 0 ? changes.join(', ') : undefined
    );
    
    return updatedTask;
  },
  
  // Delete a task
  deleteTask: (id: number, deleterId: string, deleterName: string) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    
    // Create activity log
    createActivityLog(
      deleterId,
      deleterName,
      'deleted',
      'task',
      id,
      deletedTask.title
    );
    
    return true;
  },
  
  // Add a comment to a task
  addComment: (
    taskId: number,
    userId: string,
    userName: string,
    text: string
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    const newCommentId = comments.length > 0 
      ? Math.max(...comments.map(c => c.id)) + 1 
      : 1;
    
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: newCommentId,
      taskId,
      userId,
      userName,
      text,
      createdAt: now,
      updatedAt: now
    };
    
    comments.push(newComment);
    
    // Create activity log
    createActivityLog(
      userId,
      userName,
      'commented',
      'task',
      taskId,
      task.title
    );
    
    // Create notification for task assignee if different from commenter
    if (task.assigneeId && task.assigneeId !== userId) {
      const newNotificationId = notifications.length > 0 
        ? Math.max(...notifications.map(n => n.id)) + 1 
        : 1;
      
      notifications.push({
        id: newNotificationId,
        userId: task.assigneeId,
        title: 'New Comment',
        message: `${userName} commented on "${task.title}"`,
        type: 'info',
        read: false,
        relatedToType: 'comment',
        relatedToId: newCommentId,
        createdAt: now
      });
    }
    
    return newComment;
  },
  
  // Get comments for a task
  getTaskComments: (taskId: number) => {
    return comments.filter(comment => comment.taskId === taskId);
  }
};

// Notification Services
export const notificationService = {
  // Get notifications for a user
  getUserNotifications: (userId: string) => {
    return notifications.filter(notification => notification.userId === userId);
  },
  
  // Mark notification as read
  markAsRead: (id: number) => {
    const index = notifications.findIndex(notification => notification.id === id);
    if (index === -1) return false;
    
    notifications[index] = {
      ...notifications[index],
      read: true
    };
    
    return true;
  },
  
  // Mark all notifications as read for a user
  markAllAsRead: (userId: string) => {
    notifications = notifications.map(notification => 
      notification.userId === userId 
        ? { ...notification, read: true } 
        : notification
    );
    
    return true;
  }
};

// Time Entry Services
export const timeEntryService = {
  // Get all time entries
  getTimeEntries: (): TimeEntry[] => {
    return timeEntries.map(entry => {
      // Find the associated task to get project info
      const task = tasks.find(t => t.id === entry.taskId);
      const user = users.find(u => u.id === entry.userId);
      
      return {
        ...entry,
        task: task ? {
          title: task.title,
          projectId: task.projectId,
          project: projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'
        } : undefined,
        user: user ? {
          name: user.name,
          position: user.position
        } : undefined
      };
    });
  },
  
  // Get time entries by user
  getTimeEntriesByUserId: (userId: string): TimeEntry[] => {
    return timeEntries
      .filter(entry => entry.userId === userId)
      .map(entry => {
        // Find the associated task to get project info
        const task = tasks.find(t => t.id === entry.taskId);
        const user = users.find(u => u.id === entry.userId);
        
        return {
          ...entry,
          task: task ? {
            title: task.title,
            projectId: task.projectId,
            project: projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'
          } : undefined,
          user: user ? {
            name: user.name,
            position: user.position
          } : undefined
        };
      });
  },
  
  // Get time entries by task
  getTimeEntriesByTaskId: (taskId: string): TimeEntry[] => {
    return timeEntries
      .filter(entry => entry.taskId === taskId)
      .map(entry => {
        // Find the associated task to get project info
        const task = tasks.find(t => t.id === entry.taskId);
        const user = users.find(u => u.id === entry.userId);
        
        return {
          ...entry,
          task: task ? {
            title: task.title,
            projectId: task.projectId,
            project: projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'
          } : undefined,
          user: user ? {
            name: user.name,
            position: user.position
          } : undefined
        };
      });
  },
  
  // Create a new time entry
  createTimeEntry: (entry: Omit<TimeEntry, 'id'>): TimeEntry => {
    const newEntry = {
      id: `te_${timeEntries.length + 1}`,
      ...entry
    };
    
    timeEntries.push(newEntry);
    
    return newEntry;
  },
  
  // Update a time entry
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>): TimeEntry | null => {
    const entryIndex = timeEntries.findIndex(e => e.id === id);
    
    if (entryIndex === -1) return null;
    
    const updatedEntry = {
      ...timeEntries[entryIndex],
      ...updates
    };
    
    timeEntries[entryIndex] = updatedEntry;
    
    return updatedEntry;
  },
  
  // Delete a time entry
  deleteTimeEntry: (id: string): boolean => {
    const entryIndex = timeEntries.findIndex(e => e.id === id);
    
    if (entryIndex === -1) return false;
    
    timeEntries.splice(entryIndex, 1);
    
    return true;
  }
};

// Activity Log Services
export const activityService = {
  // Get recent activity
  getRecentActivity: (limit = 10) => {
    return [...activityLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
  
  // Get activity for a project
  getProjectActivity: (projectId: number, limit = 20) => {
    return activityLogs
      .filter(log => log.entityType === 'project' && log.entityId === projectId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
  
  // Get activity for a task
  getTaskActivity: (taskId: number, limit = 20) => {
    return activityLogs
      .filter(log => log.entityType === 'task' && log.entityId === taskId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
  
  // Get activity by a user
  getUserActivity: (userId: string, limit = 20) => {
    return activityLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}; 