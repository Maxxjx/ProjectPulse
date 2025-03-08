'use client';

import { useState } from 'react';
import { useTask, useUpdateTask } from '@/lib/hooks/useTasks';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TaskComments from '@/components/TaskComments';
import TimeTracker from '@/components/TimeTracker';
import { TaskStatus, Priority } from '@/lib/data/types';

export default function TaskDetailView({ params }: { params: { id: string } }) {
  const taskId = parseInt(params.id);
  const { data: session } = useSession();
  const { data: task, isLoading, error } = useTask(taskId);
  const updateTaskMutation = useUpdateTask(taskId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    deadline: '',
  });

  // Initialize edit form when task data is loaded
  useState(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline.split('T')[0], // Format date for input
      });
    }
  });

  const handleUpdateTask = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        ...editedTask,
        updaterId: session?.user?.id || '1',
        updaterName: session?.user?.name || 'Anonymous',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="bg-[#111827] rounded-lg p-6 mb-6">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
        Error loading task details. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/dashboard/tasks" 
          className="text-gray-400 hover:text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Tasks
        </Link>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateTask}
                className="bg-[#8B5CF6] hover:bg-opacity-90 px-3 py-1 rounded text-sm"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#8B5CF6] hover:bg-opacity-90 px-3 py-1 rounded text-sm"
            >
              Edit Task
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        // Edit Form
        <div className="bg-[#111827] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Priority
              </label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
              >
                {Object.values(Priority).map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={editedTask.deadline}
                onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
              />
            </div>
          </div>
        </div>
      ) : (
        // Task Details View
        <div className="bg-[#111827] rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                task.status === TaskStatus.COMPLETED ? 'bg-green-500/20 text-green-500' : 
                task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500/20 text-blue-500' :
                task.status === TaskStatus.UNDER_REVIEW ? 'bg-purple-500/20 text-purple-500' :
                task.status === TaskStatus.ON_HOLD ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-gray-500/20 text-gray-400'
              }`}
            >
              {task.status}
            </span>
            
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                task.priority === Priority.HIGH ? 'bg-red-500/20 text-red-500' : 
                task.priority === Priority.MEDIUM ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-green-500/20 text-green-500'
              }`}
            >
              {task.priority}
            </span>
          </div>
          
          <p className="text-gray-300 mb-6">{task.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Project</h3>
                  <p>{task.project}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Assignee</h3>
                  <p>{task.assignee}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
                  <p>{new Date(task.created).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Deadline</h3>
                  <p className={new Date() > new Date(task.deadline) ? 'text-red-500' : ''}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
                
                {task.estimatedHours && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Estimated Hours</h3>
                    <p>{task.estimatedHours} hours</p>
                  </div>
                )}
                
                {task.actualHours && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Actual Hours</h3>
                    <p>{task.actualHours} hours</p>
                  </div>
                )}
              </div>
              
              {task.tags && task.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-[#1F2937] rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {session?.user?.role !== 'client' && (
                <TimeTracker taskId={taskId} taskName={task.title} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <TaskComments taskId={taskId} />
    </div>
  );
} 