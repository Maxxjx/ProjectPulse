'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DataServiceInstance } from '@/lib/data-service';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  status: string;
  progress: number;
  budget: number;
  client: {
    id: string;
    name: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
}

const statusColors = {
  'Not Started': 'bg-gray-500',
  'In Progress': 'bg-blue-500',
  'On Hold': 'bg-yellow-500',
  'Completed': 'bg-green-500',
  'Cancelled': 'bg-red-500'
};

export default function ProjectProgressReport() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('progress');
  
  // Fetch projects and tasks data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataService = DataServiceInstance;
        
        // Fetch projects
        const projectsData = await dataService.getProjects();
        setProjects(projectsData);
        
        // Fetch tasks
        const tasksData = await dataService.getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter projects based on selected options
  const filteredProjects = projects.filter(project => {
    // Filter by selected project
    if (selectedProject !== 'all' && project.id !== selectedProject) {
      return false;
    }
    
    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date(project.startDate);
      
      if (dateRange === 'month' && (
        startDate.getMonth() !== now.getMonth() || 
        startDate.getFullYear() !== now.getFullYear()
      )) {
        return false;
      }
      
      if (dateRange === 'quarter') {
        const startQuarter = Math.floor(startDate.getMonth() / 3);
        const currentQuarter = Math.floor(now.getMonth() / 3);
        if (startQuarter !== currentQuarter || startDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
      
      if (dateRange === 'year' && startDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'progress') {
      return b.progress - a.progress;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'startDate') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    if (sortBy === 'endDate') {
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
    return 0;
  });
  
  // Calculate project statistics
  const statistics = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'Completed').length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    notStarted: projects.filter(p => p.status === 'Not Started').length,
    onHold: projects.filter(p => p.status === 'On Hold').length,
    averageProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) 
      : 0
  };
  
  // Get tasks for a specific project
  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };
  
  // Format date for display
  const formatDate = (date: Date | null | string) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Project Progress Report</h1>
        <Link 
          href="/dashboard/reports" 
          className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
        >
          Back to Reports
        </Link>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Projects</p>
          <p className="text-2xl font-bold">{statistics.total}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-500">{statistics.completed}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-500">{statistics.inProgress}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Not Started</p>
          <p className="text-2xl font-bold text-gray-500">{statistics.notStarted}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">On Hold</p>
          <p className="text-2xl font-bold text-yellow-500">{statistics.onHold}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Avg. Progress</p>
          <p className="text-2xl font-bold">{statistics.averageProgress}%</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-[#111827] rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Project</label>
            <select 
              className="w-full bg-[#1F2937] border border-gray-700 rounded py-2 px-3"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Date Range</label>
            <select 
              className="w-full bg-[#1F2937] border border-gray-700 rounded py-2 px-3"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Sort By</label>
            <select 
              className="w-full bg-[#1F2937] border border-gray-700 rounded py-2 px-3"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="progress">Progress</option>
              <option value="name">Name</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Projects List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading project data...</p>
        </div>
      ) : sortedProjects.length > 0 ? (
        <div className="space-y-6">
          {sortedProjects.map(project => (
            <div key={project.id} className="bg-[#111827] rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Client: {project.client?.name || 'N/A'}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-500'}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-2">{project.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400 mt-2">
                  <span>Start: {formatDate(project.startDate)}</span>
                  <span>Deadline: {formatDate(project.endDate)}</span>
                  <span>Budget: ₹{project.budget.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Tasks summary for this project */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Tasks ({getProjectTasks(project.id).length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-[#1F2937] p-2 rounded">
                    <p>Completed</p>
                    <p className="font-bold text-green-500">{getProjectTasks(project.id).filter(t => t.status === 'Completed').length}</p>
                  </div>
                  <div className="bg-[#1F2937] p-2 rounded">
                    <p>In Progress</p>
                    <p className="font-bold text-blue-500">{getProjectTasks(project.id).filter(t => t.status === 'In Progress').length}</p>
                  </div>
                  <div className="bg-[#1F2937] p-2 rounded">
                    <p>Todo</p>
                    <p className="font-bold text-gray-500">{getProjectTasks(project.id).filter(t => t.status === 'Todo').length}</p>
                  </div>
                  <div className="bg-[#1F2937] p-2 rounded">
                    <p>High Priority</p>
                    <p className="font-bold text-red-500">{getProjectTasks(project.id).filter(t => t.priority === 'High').length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111827] rounded-lg p-8 text-center">
          <p className="text-gray-400">No projects found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
} 