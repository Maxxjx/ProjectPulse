// This file exports the shared data service instance for the application
import { initializeDataService, userService, projectService, taskService, timeEntryService } from './data/dataService';

// Combine all services into a single object
export const DataServiceInstance = {
  // User methods
  getUsers: async () => userService.getUsers(),
  getUserById: async (userId: string) => userService.getUserById(userId),
  
  // Project methods
  getProjects: async () => projectService.getProjects(),
  getProjectById: async (projectId: string) => projectService.getProjectById(projectId),
  
  // Task methods
  getTasks: async () => taskService.getTasks(),
  getTasksByProjectId: async (projectId: string) => taskService.getTasksByProjectId(projectId),
  getTaskById: async (taskId: string) => taskService.getTaskById(taskId),
  
  // Time entry methods
  getTimeEntries: async () => timeEntryService.getTimeEntries(),
  getTimeEntriesByUserId: async (userId: string) => timeEntryService.getTimeEntriesByUserId(userId),
  getTimeEntriesByTaskId: async (taskId: string) => timeEntryService.getTimeEntriesByTaskId(taskId),
  
  // Make sure data service is initialized (can be called manually but will be auto-called on first use)
  initialize: async () => await initializeDataService()
};

// Initialize the data service automatically on import
// eslint-disable-next-line no-unused-vars
const initialize = (async () => {
  try {
    await DataServiceInstance.initialize();
    console.log('Application started with data service.');
  } catch (error) {
    console.error('Failed to initialize data service:', error);
  }
})(); 