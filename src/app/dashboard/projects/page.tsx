'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DashboardFilters, DashboardFilters as FilterTypes } from '@/components/dashboard/DashboardFilters';
import { DateRange } from 'react-day-picker';
import { formatDistance } from 'date-fns';

// Sample project data
const sampleProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles',
    status: 'In Progress',
    progress: 75,
    team: ['John Doe', 'Sarah Smith', 'Michael Chen'],
    deadline: '2023-08-15',
    priority: 'High'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile app for customer engagement',
    status: 'In Progress',
    progress: 32,
    team: ['Alex Johnson', 'Emily Taylor', 'Robert Chen'],
    deadline: '2023-10-05',
    priority: 'High'
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Q3 digital marketing campaign for new product launch',
    status: 'In Progress',
    progress: 50,
    team: ['Lisa Brown', 'David Wilson'],
    deadline: '2023-09-01',
    priority: 'Medium'
  },
  {
    id: 4,
    name: 'Product Launch',
    description: 'Coordinate the launch of the new product line',
    status: 'Not Started',
    progress: 18,
    team: ['Victoria Adams', 'Thomas Moore', 'Sandra Lee'],
    deadline: '2023-11-15',
    priority: 'Medium'
  },
  {
    id: 5,
    name: 'Customer Research',
    description: 'Conduct research to understand customer needs for upcoming product',
    status: 'Almost Complete',
    progress: 90,
    team: ['James Peterson', 'Linda Garcia'],
    deadline: '2023-07-30',
    priority: 'Low'
  },
];

export default function ProjectListView() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      // Redirect to login or show an error
      window.location.href = '/login'; // Adjust the path as necessary
    }
  }, [session, status]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');
  const [projects, setProjects] = useState(sampleProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterTypes>({});
  
  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters based on filters
        const queryParams = new URLSearchParams();
        if (filters.projectId) queryParams.append('id', filters.projectId);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.departmentId) queryParams.append('department', filters.departmentId);
        if (filters.dateRange?.from) queryParams.append('fromDate', filters.dateRange.from.toISOString());
        if (filters.dateRange?.to) queryParams.append('toDate', filters.dateRange.to.toISOString());
        
        const url = `/api/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
        console.log('Projects fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects, showing sample data');
        // Keep using sample data on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterTypes) => {
    setFilters(newFilters);
  };

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(project => {
    // Search term filter
    const matchesSearch = 
      searchTerm === '' ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter from the dropdown
    const matchesStatusDropdown = statusFilter === 'All' || 
      project.status === statusFilter;
    
    // Status filter from DashboardFilters
    const matchesStatusFilter = !filters.status || 
      project.status.toLowerCase().replace(' ', '-') === filters.status;
    
    // Date filter
    let matchesDateFilter = true;
    if (filters.dateRange?.from) {
      const projectDeadline = new Date(project.deadline);
      const fromDate = filters.dateRange.from;
      const toDate = filters.dateRange.to || new Date();
      
      matchesDateFilter = projectDeadline >= fromDate && projectDeadline <= toDate;
    }
    
    return matchesSearch && matchesStatusDropdown && matchesStatusFilter && matchesDateFilter;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (sortBy === 'progress') {
      return b.progress - a.progress;
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
      case 'Almost Complete':
        return 'bg-purple-500/20 text-purple-500';
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
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link 
          href="/dashboard/projects/new" 
          className="bg-[#8B5CF6] hover:bg-[#A78BFA] transition px-4 py-2 rounded text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Project
        </Link>
      </div>
      
      {/* Enhanced Filters Section */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="flex flex-col space-y-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
              Search Projects
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description"
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          
          {/* Advanced Filters */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-300 mb-3">Advanced Filters</h3>
            <DashboardFilters
              onFilterChange={handleFilterChange}
              showProjectFilter={false}
              statuses={[
                { value: 'all', label: 'All Statuses' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'not-started', label: 'Not Started' },
                { value: 'almost-complete', label: 'Almost Complete' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
          </div>
          
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
            <div className="flex items-center">
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-400 mr-2">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              >
                <option value="deadline">Deadline</option>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="progress">Progress</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-400 mr-2">
                Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              >
                <option>All</option>
                <option>In Progress</option>
                <option>Not Started</option>
                <option>Almost Complete</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-[#111827] rounded-lg p-16 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6] mb-4"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <div key={project.id} className="bg-[#111827] rounded-lg p-4 hover:bg-[#1a202c] transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                <div>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <h2 className="text-xl font-semibold text-white hover:text-[#8B5CF6]">{project.name}</h2>
                  </Link>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      project.progress >= 80 ? 'bg-green-500' : 
                      project.progress >= 40 ? 'bg-blue-500' : 
                      'bg-yellow-500'
                    }`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between text-sm">
                <div className="mb-2 md:mb-0">
                  <span className="text-gray-400">Team: </span>
                  <span>{project.team.slice(0, 2).join(', ')}
                    {project.team.length > 2 && `, +${project.team.length - 2}`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Deadline: </span>
                  <span className={`
                    ${new Date() > new Date(project.deadline) ? 'text-red-500' : 'text-white'}
                  `}>
                    {formatDate(project.deadline)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#111827] rounded-lg p-8 text-center">
            <p className="text-gray-400">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
