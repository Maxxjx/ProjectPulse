'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

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

export default function Projects() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  // Filter projects based on search term and status
  const filteredProjects = sampleProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded-md text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111827] rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
              <option value="Almost Complete">Almost Complete</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-400 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-white"
            >
              <option value="deadline">Deadline (Closest First)</option>
              <option value="name">Project Name</option>
              <option value="progress">Progress</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {sortedProjects.length > 0 ? (
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