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

interface TimeEntry {
  id: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  taskId: string;
  task?: {
    title: string;
    projectId: string;
  };
  userId: string;
  user?: {
    name: string;
    position: string;
  };
}

export default function BudgetReport() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [view, setView] = useState<string>('overview');
  
  // Sample cost rates (INR per hour) - would ideally come from a database
  const hourlyRates = {
    'Project Director': 1800,
    'Senior Developer': 1200,
    'UI/UX Designer': 1000,
    'QA Engineer': 800,
    'Software Engineer': 1000,
    'Project Manager': 1500,
    'default': 900
  };
  
  // Fetch projects and time entries data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataService = DataServiceInstance;
        
        // Fetch projects
        const projectsData = await dataService.getProjects();
        setProjects(projectsData);
        
        // Fetch time entries
        const timeEntriesData = await dataService.getTimeEntries();
        setTimeEntries(timeEntriesData);
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
    if (selectedProject !== 'all' && project.id !== selectedProject) {
      return false;
    }
    
    // Handle date range filter
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
  
  // Get time entries for a specific project
  const getProjectTimeEntries = (projectId: string) => {
    return timeEntries.filter(entry => 
      entry.task && entry.task.projectId === projectId
    );
  };
  
  // Calculate labor cost for a project
  const calculateLaborCost = (projectId: string) => {
    const entries = getProjectTimeEntries(projectId);
    
    let totalCost = 0;
    entries.forEach(entry => {
      const hourlyRate = entry.user?.position 
        ? hourlyRates[entry.user.position as keyof typeof hourlyRates] || hourlyRates.default
        : hourlyRates.default;
      
      const hours = entry.duration / 3600; // Convert seconds to hours
      totalCost += hours * hourlyRate;
    });
    
    return totalCost;
  };
  
  // Calculate hours spent on a project
  const calculateHoursSpent = (projectId: string) => {
    const entries = getProjectTimeEntries(projectId);
    const totalSeconds = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return totalSeconds / 3600; // Convert seconds to hours
  };
  
  // Calculate budget utilization for a project
  const calculateBudgetUtilization = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.budget === 0) return 0;
    
    const laborCost = calculateLaborCost(projectId);
    return (laborCost / project.budget) * 100;
  };
  
  // Calculate cost per hour for a project
  const calculateCostPerHour = (projectId: string) => {
    const hours = calculateHoursSpent(projectId);
    if (hours === 0) return 0;
    
    const cost = calculateLaborCost(projectId);
    return cost / hours;
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format hours for display
  const formatHours = (hours: number) => {
    return hours.toFixed(1);
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
  
  // Calculate total budget
  const totalBudget = filteredProjects.reduce(
    (sum, project) => sum + project.budget, 
    0
  );
  
  // Calculate total labor cost
  const totalLaborCost = filteredProjects.reduce(
    (sum, project) => sum + calculateLaborCost(project.id), 
    0
  );
  
  // Calculate overall budget utilization
  const overallBudgetUtilization = totalBudget > 0 
    ? (totalLaborCost / totalBudget) * 100 
    : 0;
  
  // Calculate total hours
  const totalHours = filteredProjects.reduce(
    (sum, project) => sum + calculateHoursSpent(project.id), 
    0
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Budget Reports</h1>
        <Link 
          href="/dashboard/reports" 
          className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
        >
          Back to Reports
        </Link>
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
            <label className="block text-sm text-gray-400 mb-1">View</label>
            <select 
              className="w-full bg-[#1F2937] border border-gray-700 rounded py-2 px-3"
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="detail">Detailed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalLaborCost)}</p>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Utilization</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{Math.round(overallBudgetUtilization)}%</p>
            <div className="ml-4 flex-1">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${overallBudgetUtilization > 100 ? 'bg-red-500' : 'bg-purple-600'}`}
                  style={{ width: `${Math.min(overallBudgetUtilization, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Hours Logged</p>
          <p className="text-2xl font-bold">{formatHours(totalHours)}</p>
        </div>
      </div>
      
      {/* Projects Budget List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading budget data...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1F2937] text-gray-300 text-left">
                <th className="p-3 rounded-tl-lg">Project</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Spent</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Cost/Hour</th>
                <th className="p-3">Utilization</th>
                <th className="p-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProjects.map(project => {
                const laborCost = calculateLaborCost(project.id);
                const hoursSpent = calculateHoursSpent(project.id);
                const utilization = calculateBudgetUtilization(project.id);
                const costPerHour = calculateCostPerHour(project.id);
                
                return (
                  <tr key={project.id} className="hover:bg-[#1F2937] transition">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {view === 'detail' && (
                          <p className="text-xs text-gray-400">{project.client?.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{formatCurrency(project.budget)}</td>
                    <td className="p-3">{formatCurrency(laborCost)}</td>
                    <td className="p-3">{formatHours(hoursSpent)}</td>
                    <td className="p-3">{formatCurrency(costPerHour)}/hr</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className={`${utilization > 100 ? 'text-red-500' : ''}`}>
                          {Math.round(utilization)}%
                        </span>
                        <div className="ml-2 w-16">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${utilization > 100 ? 'bg-red-500' : 'bg-purple-600'}`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        utilization > 100 ? 'bg-red-500 bg-opacity-20 text-red-400' :
                        utilization > 80 ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                        'bg-green-500 bg-opacity-20 text-green-400'
                      }`}>
                        {utilization > 100 ? 'Over Budget' : 
                         utilization > 80 ? 'Warning' : 'On Budget'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#111827] rounded-lg p-8 text-center">
          <p className="text-gray-400">No projects found matching the selected filters.</p>
        </div>
      )}
      
      {/* Detailed View - Additional Information */}
      {view === 'detail' && selectedProject !== 'all' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Detailed Cost Analysis</h2>
          <div className="bg-[#111827] rounded-lg p-6">
            {projects.filter(p => p.id === selectedProject).map(project => (
              <div key={project.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Start Date</p>
                    <p className="font-medium">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Deadline</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Progress</p>
                    <p className="font-medium">{project.progress}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="font-medium">{project.status}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-3">Budget Breakdown</h3>
                  <div className="p-4 bg-[#1F2937] rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Initial Budget</p>
                        <p className="text-xl font-bold">{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Spent to Date</p>
                        <p className="text-xl font-bold">{formatCurrency(calculateLaborCost(project.id))}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Remaining</p>
                        <p className={`text-xl font-bold ${project.budget - calculateLaborCost(project.id) < 0 ? 'text-red-500' : ''}`}>
                          {formatCurrency(project.budget - calculateLaborCost(project.id))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                      <div 
                        className={`h-2.5 rounded-full ${calculateBudgetUtilization(project.id) > 100 ? 'bg-red-500' : 'bg-purple-600'}`}
                        style={{ width: `${Math.min(calculateBudgetUtilization(project.id), 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 text-right">
                      {Math.round(calculateBudgetUtilization(project.id))}% of budget used
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 