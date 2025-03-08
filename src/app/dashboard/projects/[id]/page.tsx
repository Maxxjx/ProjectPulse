'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Sample project data
const getProjectById = (id: number) => {
  // In a real application, this would fetch from the API
  const project = {
    id,
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles, improve performance, and enhance mobile responsiveness.',
    status: 'In Progress',
    progress: 65,
    team: [
      { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD' },
      { id: 2, name: 'Sarah Smith', role: 'UI Designer', avatar: 'SS' },
      { id: 3, name: 'Michael Chen', role: 'Developer', avatar: 'MC' },
    ],
    startDate: '2023-05-15',
    deadline: '2023-08-30',
    priority: 'High',
    client: 'Acme Corporation',
    budget: {
      total: 45000,
      spent: 29250,
      remaining: 15750,
      utilization: 65
    },
    tasks: [
      { id: 1, name: 'Wireframe Creation', status: 'Completed', assignee: 'Sarah Smith' },
      { id: 2, name: 'UI Design', status: 'In Progress', assignee: 'Sarah Smith' },
      { id: 3, name: 'Frontend Development', status: 'Not Started', assignee: 'Michael Chen' },
      { id: 4, name: 'Backend Integration', status: 'Not Started', assignee: 'Michael Chen' },
      { id: 5, name: 'Testing', status: 'Not Started', assignee: 'John Doe' },
    ],
    documents: [
      { id: 1, name: 'Project Brief.pdf', size: '1.2 MB', dateAdded: '2023-05-15' },
      { id: 2, name: 'Requirements Doc.docx', size: '845 KB', dateAdded: '2023-05-20' },
      { id: 3, name: 'Design Assets.zip', size: '15.5 MB', dateAdded: '2023-06-10' },
    ],
    updates: [
      { id: 1, user: 'John Doe', avatar: 'JD', message: 'Kick-off meeting completed. All team members are briefed on their responsibilities.', date: '2023-05-16' },
      { id: 2, user: 'Sarah Smith', avatar: 'SS', message: 'Wireframes completed and ready for review.', date: '2023-06-01' },
      { id: 3, user: 'Michael Chen', avatar: 'MC', message: 'Started working on the frontend development.', date: '2023-06-15' },
    ]
  };
  
  return project;
};

export default function ProjectDetailView({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  const { data: session } = useSession();
  
  // Fetch project details
  const project = getProjectById(projectId);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(date);
  };
  
  // Get utilization color
  const getUtilizationColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/20 text-green-500';
      case 'In Progress': return 'bg-blue-500/20 text-blue-500';
      case 'Not Started': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  return (
    <div className="p-6">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/projects"
          className="text-[#8B5CF6] hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
      </div>
      
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <span className={`ml-4 px-3 py-1 text-sm rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-400 mt-1">Client: {project.client}</p>
        </div>
        <div className="flex space-x-2">
          {session?.user?.role !== 'client' && (
            <>
              <button className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-3 py-2 rounded text-sm">
                Edit Project
              </button>
              <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-2 rounded text-sm">
                Add Task
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'overview' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'tasks' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Tasks
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'team' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Team
          </button>
          <button 
            onClick={() => setActiveTab('budget')}
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'budget' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Budget
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'files' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Files
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mb-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-[#111827] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Description</h3>
                    <p>{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Start Date</h3>
                      <p>{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Deadline</h3>
                      <p>{formatDate(project.deadline)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Priority</h3>
                      <p>{project.priority}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Team Size</h3>
                      <p>{project.team.length} members</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Progress</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 rounded-full bg-[#8B5CF6]"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111827] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Updates</h2>
                  <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">View all</button>
                </div>
                <div className="space-y-4">
                  {project.updates.map(update => (
                    <div key={update.id} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white mr-3">
                        {update.avatar}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{update.user}</p>
                          <span className="mx-2 text-gray-400">•</span>
                          <p className="text-sm text-gray-400">{formatDate(update.date)}</p>
                        </div>
                        <p className="text-sm mt-1">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-[#111827] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Total Budget</span>
                    <span className="text-sm">${project.budget.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Spent</span>
                    <span className="text-sm">${project.budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span className="text-sm">Remaining</span>
                    <span className="text-sm">${project.budget.remaining.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Budget Utilization</span>
                    <span className="text-xs">{project.budget.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${getUtilizationColor(project.budget.utilization)}`}
                      style={{ width: `${project.budget.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111827] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Team</h2>
                <div className="space-y-3">
                  {project.team.map(member => (
                    <div key={member.id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white mr-3">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#111827] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Tasks Overview</h2>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Total Tasks</span>
                      <span className="text-xs">{project.tasks.length}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="bg-[#8B5CF6] h-1.5 rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Completed</span>
                      <span className="text-xs">
                        {project.tasks.filter(t => t.status === 'Completed').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ 
                          width: `${(project.tasks.filter(t => t.status === 'Completed').length / project.tasks.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">In Progress</span>
                      <span className="text-xs">
                        {project.tasks.filter(t => t.status === 'In Progress').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ 
                          width: `${(project.tasks.filter(t => t.status === 'In Progress').length / project.tasks.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-[#111827] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Project Tasks</h2>
              {session?.user?.role !== 'client' && (
                <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-1 rounded text-sm">
                  Add Task
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {project.tasks.map(task => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{task.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{task.assignee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/dashboard/tasks/${task.id}`}
                          className="text-[#8B5CF6] hover:text-[#A78BFA]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-[#111827] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Project Team</h2>
              {session?.user?.role !== 'client' && (
                <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-1 rounded text-sm">
                  Add Member
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.team.map(member => (
                <div key={member.id} className="bg-[#1F2937] rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white mr-4 text-xl">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
                      View Profile
                    </button>
                    <button className="text-gray-400 hover:text-white text-sm">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="bg-[#111827] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Budget Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Total Budget</h3>
                <p className="text-2xl font-bold">${project.budget.total.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Spent</h3>
                <p className="text-2xl font-bold">${project.budget.spent.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Remaining</h3>
                <p className="text-2xl font-bold">${project.budget.remaining.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Budget Utilization</span>
                <span className="text-sm">{project.budget.utilization}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUtilizationColor(project.budget.utilization)}`}
                  style={{ width: `${project.budget.utilization}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Expenses</h3>
              <div className="bg-[#1F2937] rounded-lg p-4 text-center">
                <p className="text-gray-400">No expenses recorded yet.</p>
                <button className="mt-2 text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="bg-[#111827] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Project Files</h2>
              {session?.user?.role !== 'client' && (
                <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-1 rounded text-sm">
                  Upload File
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      File Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {project.documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div className="text-sm font-medium">{doc.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{doc.size}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{formatDate(doc.dateAdded)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#8B5CF6] hover:text-[#A78BFA] mr-3">
                          Download
                        </button>
                        <button className="text-red-500 hover:text-red-400">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 