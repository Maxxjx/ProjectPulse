'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Sample task data
const initialTasks = [
  {
    id: 1,
    title: 'Implement Login Page',
    description: 'Create a responsive login page with email and password fields',
    status: 'To Do',
    priority: 'High',
    assignee: 'Sarah Smith',
    dueDate: '2023-08-01',
    tags: ['Frontend', 'UI'],
  },
  {
    id: 2,
    title: 'Setup API Routes',
    description: 'Create API routes for authentication and user management',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Michael Chen',
    dueDate: '2023-07-25',
    tags: ['Backend', 'API'],
  },
  {
    id: 3,
    title: 'Design Database Schema',
    description: 'Create database schema for users, projects, and tasks',
    status: 'Done',
    priority: 'Medium',
    assignee: 'John Doe',
    dueDate: '2023-07-15',
    tags: ['Database', 'Architecture'],
  },
  {
    id: 4,
    title: 'Implement User Registration',
    description: 'Create user registration functionality with email verification',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Sarah Smith',
    dueDate: '2023-07-28',
    tags: ['Frontend', 'Backend'],
  },
  {
    id: 5,
    title: 'Create Dashboard Layout',
    description: 'Design and implement the main dashboard layout with sidebar and header',
    status: 'To Do',
    priority: 'High',
    assignee: 'Michael Chen',
    dueDate: '2023-08-05',
    tags: ['Frontend', 'UI'],
  },
  {
    id: 6,
    title: 'Write Unit Tests',
    description: 'Write unit tests for authentication functions',
    status: 'To Do',
    priority: 'Low',
    assignee: 'John Doe',
    dueDate: '2023-08-10',
    tags: ['Testing'],
  },
  {
    id: 7,
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for continuous integration and deployment',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Michael Chen',
    dueDate: '2023-07-10',
    tags: ['DevOps'],
  },
  {
    id: 8,
    title: 'Implement Task Management',
    description: 'Create functionality to add, edit, and delete tasks',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sarah Smith',
    dueDate: '2023-08-03',
    tags: ['Frontend', 'Backend'],
  },
  {
    id: 9,
    title: 'Design System Documentation',
    description: 'Document all UI components and their usage',
    status: 'Done',
    priority: 'Low',
    assignee: 'John Doe',
    dueDate: '2023-07-20',
    tags: ['Documentation', 'UI'],
  },
];

// Column definitions
const columns = [
  { id: 'todo', title: 'To Do', status: 'To Do', color: 'border-gray-400' },
  { id: 'inprogress', title: 'In Progress', status: 'In Progress', color: 'border-blue-500' },
  { id: 'done', title: 'Done', status: 'Done', color: 'border-green-500' },
];

export default function KanbanBoardView() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  
  // Filter tasks based on search term and assignee
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAssignee = assigneeFilter === 'All' || task.assignee === assigneeFilter;
    
    return matchesSearch && matchesAssignee;
  });
  
  // Group tasks by status for the Kanban board
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };
  
  // Handle drag and drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Find the task that was dragged
    const taskId = parseInt(result.draggableId);
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        // Update the task status based on the destination column
        const newStatus = columns.find(col => col.id === destination.droppableId)?.status || task.status;
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
  
  // Get unique assignees for filter
  const assignees = ['All', ...new Set(tasks.map(task => task.assignee))];
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-gray-400 mt-1">Drag and drop tasks to change their status</p>
        </div>
        <div className="flex space-x-2">
          {session?.user?.role !== 'client' && (
            <Link 
              href="/dashboard/tasks/new"
              className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </Link>
          )}
          <Link 
            href="/dashboard/tasks"
            className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            List View
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
              Search Tasks
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-400 mb-1">
              Assignee
            </label>
            <select
              id="assignee"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`bg-[#111827] rounded-lg p-4 border-t-4 ${column.color}`}>
              <h2 className="font-bold text-lg mb-4 flex items-center justify-between">
                <span>{column.title}</span>
                <span className="bg-[#1F2937] text-sm px-2 py-1 rounded-full">
                  {getTasksByStatus(column.status).length}
                </span>
              </h2>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[200px]"
                  >
                    {getTasksByStatus(column.status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-[#1F2937] rounded-lg p-3 shadow ${
                              snapshot.isDragging ? 'opacity-70' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-400">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-medium mb-2">{task.title}</h3>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-xs text-gray-400">Assignee</div>
                                <div className="text-sm">{task.assignee}</div>
                              </div>
                              <Link 
                                href={`/dashboard/tasks/${task.id}`}
                                className="text-[#8B5CF6] hover:text-[#A78BFA] text-xs"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 