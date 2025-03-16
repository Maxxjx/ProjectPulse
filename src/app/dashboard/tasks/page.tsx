'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DashboardFilters, DashboardFilters as FilterTypes } from '@/components/dashboard/DashboardFilters';
import { DateRange } from 'react-day-picker';
import { formatDistance } from 'date-fns';

// Sample task data
const sampleTasks = [
  {
    id: 1,
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and visual design for the new homepage',
    status: 'In Progress',
    priority: 'High',
    project: 'Website Redesign',
    assignee: 'John Doe',
    deadline: '2023-07-25',
    created: '2023-07-10'
  },
  {
    id: 2,
    title: 'Implement User Authentication',
    description: 'Set up JWT-based authentication system for the app',
    status: 'In Progress',
    priority: 'High',
    project: 'Mobile App Development',
    assignee: 'Emily Taylor',
    deadline: '2023-07-30',
    created: '2023-07-12'
  },
  {
    id: 3,
    title: 'Create Social Media Content Calendar',
    description: 'Plan content for social media posts for the next month',
    status: 'Completed',
    priority: 'Medium',
    project: 'Marketing Campaign',
    assignee: 'Lisa Brown',
    deadline: '2023-07-15',
    created: '2023-07-05'
  },
  {
    id: 4,
    title: 'Update Product Pricing',
    description: 'Review and update pricing for the new product line',
    status: 'Not Started',
    priority: 'Medium',
    project: 'Product Launch',
    assignee: 'Thomas Moore',
    deadline: '2023-08-05',
    created: '2023-07-18'
  },
  {
    id: 5,
    title: 'Conduct Customer Interviews',
    description: 'Interview 10 customers about their experience with the product',
    status: 'Completed',
    priority: 'High',
    project: 'Customer Research',
    assignee: 'James Peterson',
    deadline: '2023-07-20',
    created: '2023-07-08'
  },
  {
    id: 6,
    title: 'Fix Navigation Menu Bug',
    description: 'Resolve issue with dropdown menu not working on mobile devices',
    status: 'In Progress',
    priority: 'High',
    project: 'Website Redesign',
    assignee: 'Sarah Smith',
    deadline: '2023-07-22',
    created: '2023-07-15'
  },
  {
    id: 7,
    title: 'Optimize Database Queries',
    description: 'Improve performance of search queries in the backend',
    status: 'Not Started',
    priority: 'Medium',
    project: 'Mobile App Development',
    assignee: 'Robert Chen',
    deadline: '2023-08-10',
    created: '2023-07-17'
  },
  {
    id: 8,
    title: 'Set Up Analytics Dashboard',
    description: 'Configure Google Analytics and create custom dashboard',
    status: 'In Progress',
    priority: 'Low',
    project: 'Marketing Campaign',
    assignee: 'David Wilson',
    deadline: '2023-07-28',
    created: '2023-07-14'
  }
];

export default function TaskListView() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState(sampleTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [filters, setFilters] = useState<FilterTypes>({});
  
  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters based on filters
        const queryParams = new URLSearchParams();
        if (filters.projectId) queryParams.append('projectId', filters.projectId);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.departmentId) queryParams.append('department', filters.departmentId);
        if (filters.dateRange?.from) queryParams.append('fromDate', filters.dateRange.from.toISOString());
        if (filters.dateRange?.to) queryParams.append('toDate', filters.dateRange.to.toISOString());
        
        const url = `/api/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data);
        console.log('Tasks fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks, showing sample data');
        // Keep using sample data on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [filters]);
  
  // Fetch projects for project filter
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        // Format projects for the filter dropdown
        const formattedProjects = Array.isArray(data) ? 
          data.map((project: any) => ({
            id: project.id.toString(),
            name: project.name
          })) : [];
          
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use sample projects if API fails
        setProjects([
          { id: '1', name: 'Website Redesign' },
          { id: '2', name: 'Mobile App Development' },
          { id: '3', name: 'Marketing Campaign' },
          { id: '4', name: 'Product Launch' },
          { id: '5', name: 'Customer Research' }
        ]);
      }
    };
    
    fetchProjects();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterTypes) => {
    setFilters(newFilters);
  };

  // Filter tasks based on search, status, priority, and advanced filters
  const filteredTasks = tasks.filter(task => {
    // Search term filter
    const matchesSearch = searchTerm === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter from the dropdown
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    // Priority filter from the dropdown
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    
    // Status filter from DashboardFilters
    const matchesStatusFilter = !filters.status || 
      task.status.toLowerCase().replace(' ', '-') === filters.status;
    
    // Project filter from DashboardFilters
    const matchesProjectFilter = !filters.projectId || 
      task.project.toLowerCase().replace(/\s+/g, '-') === projects.find(p => p.id === filters.projectId)?.name.toLowerCase().replace(/\s+/g, '-');
    
    // Date filter
    let matchesDateFilter = true;
    if (filters.dateRange?.from) {
      const taskDeadline = new Date(task.deadline);
      const fromDate = filters.dateRange.from;
      const toDate = filters.dateRange.to || new Date();
      
      matchesDateFilter = taskDeadline >= fromDate && taskDeadline <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesStatusFilter && matchesProjectFilter && matchesDateFilter;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (sortBy === 'created') {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    } else if (sortBy === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-500';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'Not Started':
        return 'bg-gray-500/20 text-gray-400';
      case 'On Hold':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link 
          href="/dashboard/tasks/new" 
          className="bg-[#8B5CF6] hover:bg-[#A78BFA] transition px-4 py-2 rounded text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Task
        </Link>
      </div>
      
      {/* Enhanced Filters Section */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Filters</h2>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] flex items-center"
          >
            {isFilterOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Hide Filters
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Show Filters
              </>
            )}
          </button>
        </div>
        
        {/* Search Input - Always visible */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, description, or project"
            className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
          />
        </div>
        
        {/* Advanced Filter Section - Toggleable */}
        {isFilterOpen && (
          <>
            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                >
                  <option>All</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Not Started</option>
                  <option>On Hold</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-400 mb-1">
                  Priority
                </label>
                <select
                  id="priorityFilter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                >
                  <option>All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-400 mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                >
                  <option value="deadline">Deadline</option>
                  <option value="title">Title</option>
                  <option value="created">Created Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
            
            {/* Advanced Filters Component */}
            <div className="mt-4">
              <h3 className="font-medium text-gray-300 mb-3">Advanced Filters</h3>
              <DashboardFilters
                projects={projects}
                onFilterChange={handleFilterChange}
                statuses={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'not-started', label: 'Not Started' },
                  { value: 'on-hold', label: 'On Hold' },
                ]}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Tasks List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-[#111827] rounded-lg p-16 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6] mb-4"></div>
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        ) : sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div key={task.id} className="bg-[#111827] rounded-lg p-4 hover:bg-[#1a202c] transition-colors flex flex-col md:flex-row md:items-center">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium hover:text-[#8B5CF6]">{task.title}</h3>
                    <p className="text-gray-400 text-sm">{task.description}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Project: </span>
                    <span className="text-[#8B5CF6]">{task.project}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Assignee: </span>
                    <span>{task.assignee}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created: </span>
                    <span>{formatDate(task.created)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Deadline: </span>
                    <span className={new Date() > new Date(task.deadline) ? 'text-red-500' : ''}>
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0 md:ml-4">
                <button 
                  className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-700"
                  title="Edit task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  className={`p-2 rounded-md ${
                    task.status === 'Completed' 
                      ? 'text-green-500 hover:text-green-400 hover:bg-green-800/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  title={task.status === 'Completed' ? 'Completed' : 'Mark as complete'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#111827] rounded-lg p-8 text-center">
            <p className="text-gray-400">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 