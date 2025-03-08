'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import TimeTracker from '@/components/TimeTracker';
import TaskComments from '@/components/TaskComments';

// Mock task data for this example
const mockTasks = [
  {
    id: 1,
    title: 'Implement Login Page',
    description: 'Create a responsive login page with email and password fields',
    status: 'To Do',
    priority: 'High',
    assignee: { id: '1', name: 'Sarah Smith' },
    dueDate: '2023-08-01',
    project: { id: 1, name: 'Website Redesign' },
    createdBy: { id: '2', name: 'Michael Chen' },
    createdAt: '2023-07-15',
  },
  {
    id: 2,
    title: 'Setup API Routes',
    description: 'Create API routes for authentication and user management',
    status: 'In Progress',
    priority: 'High',
    assignee: { id: '3', name: 'Michael Chen' },
    dueDate: '2023-07-25',
    project: { id: 1, name: 'Website Redesign' },
    createdBy: { id: '1', name: 'Sarah Smith' },
    createdAt: '2023-07-10',
  },
  {
    id: 3,
    title: 'Design Database Schema',
    description: 'Create database schema for users, projects, and tasks',
    status: 'Done',
    priority: 'Medium',
    assignee: { id: '4', name: 'John Doe' },
    dueDate: '2023-07-15',
    project: { id: 2, name: 'Database Migration' },
    createdBy: { id: '2', name: 'Michael Chen' },
    createdAt: '2023-07-05',
  },
];

// Status options
const statusOptions = ['To Do', 'In Progress', 'Under Review', 'On Hold', 'Done'];

// Priority options
const priorityOptions = ['Low', 'Medium', 'High'];

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const taskId = Number(params.id);
  
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const taskData = mockTasks.find(t => t.id === taskId);
        
        if (!taskData) {
          setError('Task not found');
          setIsLoading(false);
          return;
        }
        
        setTask(taskData);
        
        // Initialize form state
        setTitle(taskData.title);
        setDescription(taskData.description);
        setStatus(taskData.status);
        setPriority(taskData.priority);
        setDueDate(taskData.dueDate);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load task');
        setIsLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  const handleUpdateTask = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedTask = {
        ...task,
        title,
        description,
        status,
        priority,
        dueDate
      };
      
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status color
  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'To Do':
        return 'bg-gray-500/20 text-gray-400';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'Under Review':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'On Hold':
        return 'bg-orange-500/20 text-orange-500';
      case 'Done':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priorityValue: string) => {
    switch (priorityValue) {
      case 'High':
        return 'bg-red-500/20 text-red-500';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-700 rounded mb-8"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md">
          {error || 'Task not found'}
        </div>
        <div className="mt-4">
          <Link 
            href="/dashboard/tasks"
            className="text-[#8B5CF6] hover:underline"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Link
          href="/dashboard/tasks"
          className="flex items-center text-gray-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Tasks
        </Link>
        
        {!isEditing && session?.user?.role !== 'client' && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 active:bg-[#283548] transition px-3 py-1.5 rounded text-sm flex items-center touch-manipulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Task
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - Task details */}
        <div className="md:col-span-2 space-y-6">
          {isEditing ? (
            <div className="bg-[#1F2937] p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-400 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    >
                      {priorityOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-400 mb-1">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-3 sm:py-2 border border-gray-700 rounded-md hover:bg-[#111827] active:bg-[#0a0f16] transition touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTask}
                    className="px-4 py-3 sm:py-2 bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 rounded-md transition touch-manipulation"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1F2937] p-4 sm:p-6 rounded-lg shadow-lg">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]">
                  {task.project.name}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold mb-4">{task.title}</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Assignee</p>
                  <p>{task.assignee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Due Date</p>
                  <p>{formatDate(task.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created By</p>
                  <p>{task.createdBy.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p>{formatDate(task.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <div className="bg-[#111827] p-4 rounded-md">
                  <p className="whitespace-pre-line">{task.description}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Task Time Tracker - Mobile Only */}
          <div className="md:hidden">
            {!isEditing && (
              <TimeTracker taskId={taskId} taskTitle={task.title} />
            )}
          </div>
          
          {/* Comments section */}
          <TaskComments taskId={taskId} />
        </div>
        
        {/* Sidebar - Task actions and time tracking (Desktop Only) */}
        <div className="space-y-6 hidden md:block">
          {!isEditing && (
            <TimeTracker taskId={taskId} taskTitle={task.title} />
          )}
          
          {/* Additional task actions */}
          <div className="bg-[#1F2937] p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Task Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full py-2 bg-[#111827] hover:bg-[#0B111E] active:bg-[#050a10] transition border border-gray-700 rounded-md flex items-center justify-center touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Task
              </button>
              
              <button className="w-full py-2 bg-[#111827] hover:bg-[#0B111E] active:bg-[#050a10] transition border border-gray-700 rounded-md flex items-center justify-center touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7h4v3H8v-3z" clipRule="evenodd" />
                </svg>
                Print Task
              </button>
              
              <button className="w-full py-2 bg-[#111827] hover:bg-[#0B111E] active:bg-[#050a10] transition border border-gray-700 rounded-md flex items-center justify-center touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
                Generate Report
              </button>
              
              <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 transition text-red-500 rounded-md flex items-center justify-center touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Task
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Task Actions - Fixed at bottom */}
        {!isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-gray-700 p-2 flex space-x-2 md:hidden z-30">
            <button className="flex-1 py-2 bg-[#1F2937] active:bg-[#283548] transition border border-gray-700 rounded-md flex items-center justify-center touch-manipulation">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
            
            <button className="flex-1 py-2 bg-[#1F2937] active:bg-[#283548] transition border border-gray-700 rounded-md flex items-center justify-center touch-manipulation">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7h4v3H8v-3z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="flex-1 py-2 bg-[#1F2937] active:bg-[#283548] transition border border-gray-700 rounded-md flex items-center justify-center touch-manipulation">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="flex-1 py-2 bg-red-500/10 active:bg-red-500/20 transition text-red-500 rounded-md flex items-center justify-center touch-manipulation">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Add padding to the bottom on mobile when action bar is visible */}
      {!isEditing && <div className="h-16 md:hidden"></div>}
    </div>
  );
} 