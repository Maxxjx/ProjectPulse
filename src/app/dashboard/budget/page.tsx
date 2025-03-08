'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Sample budget data
const sampleBudgetData = {
  totalBudget: 150000,
  spent: 87500,
  remaining: 62500,
  utilization: 58,
  projects: [
    {
      id: 1,
      name: 'Website Redesign',
      budget: 45000,
      spent: 32000,
      remaining: 13000,
      utilization: 71,
      status: 'In Progress',
      startDate: '2023-05-15',
      endDate: '2023-08-30',
      expenses: [
        { id: 1, category: 'Development', amount: 18000, date: '2023-06-10' },
        { id: 2, category: 'Design', amount: 9000, date: '2023-05-25' },
        { id: 3, category: 'QA Testing', amount: 5000, date: '2023-07-05' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      budget: 65000,
      spent: 28000,
      remaining: 37000,
      utilization: 43,
      status: 'In Progress',
      startDate: '2023-06-01',
      endDate: '2023-11-15',
      expenses: [
        { id: 1, category: 'Development', amount: 20000, date: '2023-07-01' },
        { id: 2, category: 'Design', amount: 8000, date: '2023-06-15' }
      ]
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      budget: 25000,
      spent: 18500,
      remaining: 6500,
      utilization: 74,
      status: 'In Progress',
      startDate: '2023-07-01',
      endDate: '2023-09-30',
      expenses: [
        { id: 1, category: 'Digital Ads', amount: 10000, date: '2023-07-10' },
        { id: 2, category: 'Content Creation', amount: 5500, date: '2023-07-05' },
        { id: 3, category: 'Social Media', amount: 3000, date: '2023-07-20' }
      ]
    },
    {
      id: 4,
      name: 'Product Launch',
      budget: 15000,
      spent: 9000,
      remaining: 6000,
      utilization: 60,
      status: 'Not Started',
      startDate: '2023-09-01',
      endDate: '2023-10-15',
      expenses: [
        { id: 1, category: 'Event Planning', amount: 5000, date: '2023-07-25' },
        { id: 2, category: 'Marketing Materials', amount: 4000, date: '2023-07-30' }
      ]
    }
  ]
};

export default function BudgetMonitoringView() {
  const { data: session } = useSession();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('all');

  // Get selected project data
  const projectData = selectedProject 
    ? sampleBudgetData.projects.find(p => p.id === selectedProject) 
    : null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get utilization color
  const getUtilizationColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Budget Monitoring</h1>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#1F2937] border border-gray-600 rounded text-sm px-3 py-2"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-2 rounded text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Overall Budget Summary */}
      <div className="bg-[#111827] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Budget Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Total Budget</h3>
            <p className="text-2xl font-bold">{formatCurrency(sampleBudgetData.totalBudget)}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Spent</h3>
            <p className="text-2xl font-bold">{formatCurrency(sampleBudgetData.spent)}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Remaining</h3>
            <p className="text-2xl font-bold">{formatCurrency(sampleBudgetData.remaining)}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Budget Utilization</span>
            <span className="text-sm">{sampleBudgetData.utilization}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getUtilizationColor(sampleBudgetData.utilization)}`} 
              style={{ width: `${sampleBudgetData.utilization}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Projects Budget List */}
      <div className="bg-[#111827] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Projects Budget</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Remaining
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Utilization
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
              {sampleBudgetData.projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#1F2937]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{project.name}</div>
                    <div className="text-xs text-gray-400">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(project.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(project.spent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(project.remaining)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getUtilizationColor(project.utilization)}`} 
                          style={{ width: `${project.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{project.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                      project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => setSelectedProject(project.id)}
                      className="text-[#8B5CF6] hover:text-[#A78BFA]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details */}
      {projectData && (
        <div className="bg-[#111827] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{projectData.name} - Budget Details</h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Total Budget</h3>
              <p className="text-2xl font-bold">{formatCurrency(projectData.budget)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Spent</h3>
              <p className="text-2xl font-bold">{formatCurrency(projectData.spent)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Remaining</h3>
              <p className="text-2xl font-bold">{formatCurrency(projectData.remaining)}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Budget Utilization</span>
              <span className="text-sm">{projectData.utilization}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUtilizationColor(projectData.utilization)}`} 
                style={{ width: `${projectData.utilization}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Expense Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projectData.expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-[#1F2937]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(expense.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Link 
              href={`/dashboard/projects/${projectData.id}`}
              className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white text-sm"
            >
              View Project Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 