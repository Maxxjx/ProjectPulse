'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSummaryAnalytics, useRecentActivity } from '@/lib/hooks/useAnalytics';
import ErrorBoundary from '@/components/ErrorBoundary';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useProjects } from '@/lib/hooks/useProjects';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';

// Dashboard components
const AdminDashboard = () => {
  const { data: analytics, isLoading: isLoadingAnalytics } = useSummaryAnalytics();
  const { data: recentActivity, isLoading: isLoadingActivity } = useRecentActivity(5);
  const { data: session } = useSession();
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const { data: users = [] } = useUsers();

  // Calculate portfolio values for display
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  
  // Portfolio percentages for charts
  const projectCompletionRate = totalProjects > 0 
    ? Math.round((projects.filter(p => p.status === 'completed').length / totalProjects) * 100) 
    : 0;

  return (
    <main className="bg-dark-200 text-gray-100 min-h-screen p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome, <span className="text-purple-400">{session?.user?.name || 'Naya'}</span></h1>
        <p className="text-gray-400 text-sm">Here's your quick overview</p>
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-dark-100 rounded-xl p-6 mb-8 border border-dark-300 relative overflow-hidden">
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="bg-purple-900/40 hover:bg-purple-800/60 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="bg-purple-900/40 hover:bg-purple-800/60 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-gray-400 font-medium mb-2">Total Holding</h2>
        
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-white">
            ${analytics?.budget?.total?.toLocaleString() || '12,304.11'}
          </div>
          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
            +2.4%
          </span>
        </div>
      </div>

      {/* My Portfolio Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">My Portfolio</h2>
          <button className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 py-1 px-3 rounded-md text-sm flex items-center gap-1 transition-colors">
            See All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Project Card */}
          <div className="bg-dark-100 rounded-xl p-4 border border-dark-300 hover:border-purple-800/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-blue-900/30 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <span className="text-green-400 text-xs">+1.2%</span>
            </div>
            <h3 className="text-gray-400 text-xs">Projects</h3>
            <p className="text-lg font-semibold text-white">{totalProjects || 0}</p>
            <div className="mt-2 text-xs text-gray-500">Active: {activeProjects || 0}</div>
          </div>
          
          {/* Tasks Card */}
          <div className="bg-dark-100 rounded-xl p-4 border border-dark-300 hover:border-purple-800/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-purple-900/30 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-red-400 text-xs">-0.8%</span>
            </div>
            <h3 className="text-gray-400 text-xs">Tasks</h3>
            <p className="text-lg font-semibold text-white">{tasks.length || 0}</p>
            <div className="mt-2 text-xs text-gray-500">Pending: {pendingTasks || 0}</div>
          </div>
          
          {/* Team Card */}
          <div className="bg-dark-100 rounded-xl p-4 border border-dark-300 hover:border-purple-800/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-green-900/30 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span className="text-green-400 text-xs">+3.1%</span>
            </div>
            <h3 className="text-gray-400 text-xs">Team</h3>
            <p className="text-lg font-semibold text-white">{users.length || 0}</p>
            <div className="mt-2 text-xs text-gray-500">Active: {users.filter(u => u.status === 'active').length || 0}</div>
          </div>
          
          {/* Budget Card */}
          <div className="bg-dark-100 rounded-xl p-4 border border-dark-300 hover:border-purple-800/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-indigo-900/30 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-green-400 text-xs">+0.9%</span>
            </div>
            <h3 className="text-gray-400 text-xs">Budget</h3>
            <p className="text-lg font-semibold text-white">${analytics?.budget?.total?.toLocaleString()}</p>
            <div className="mt-2 text-xs text-gray-500">Used: {analytics?.budget?.utilization || 0}%</div>
          </div>
          
          {/* Clients Card */}
          <div className="bg-dark-100 rounded-xl p-4 border border-dark-300 hover:border-purple-800/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-amber-900/30 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="text-amber-400 text-xs">+1.5%</span>
            </div>
            <h3 className="text-gray-400 text-xs">Clients</h3>
            <p className="text-lg font-semibold text-white">{analytics?.users?.clients || 0}</p>
            <div className="mt-2 text-xs text-gray-500">Active: {analytics?.users?.activeClients || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Portfolio Performance</h2>
          <div className="flex space-x-2">
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">1D</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">1W</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">1M</button>
            <button className="bg-purple-900/70 text-purple-300 py-1 px-3 rounded-md text-sm">3M</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">1Y</button>
          </div>
        </div>

        <ErrorBoundary fallback={<div className="text-red-500">Error loading charts</div>}>
          <div className="bg-dark-100 rounded-xl p-6 border border-dark-300 relative overflow-hidden">
            <DashboardCharts />
          </div>
        </ErrorBoundary>
      </div>

      {/* Portfolio Overview */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Portfolio Overview</h2>
          <div className="flex space-x-2">
            <button className="bg-purple-900/70 text-purple-300 py-1 px-3 rounded-md text-sm transition-colors">All</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">Clients</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">Teams</button>
          </div>
        </div>

        <div className="bg-dark-100 rounded-xl p-6 border border-dark-300">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-400 text-gray-400 text-xs uppercase">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Last Price</th>
                  <th className="text-left py-3 px-4">Change %</th>
                  <th className="text-left py-3 px-4">Market Cap</th>
                  <th className="text-left py-3 px-4">Last 7 days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-400">
                {projects.slice(0, 3).map((project, index) => (
                  <tr key={index} className="hover:bg-dark-300/50 transition-colors">
                    <td className="py-3 px-4 flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">{project.name?.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.status}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">${project.budget?.toLocaleString() || '0'}</td>
                    <td className="py-3 px-4">
                      <span className={`${index % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {index % 2 === 0 ? '+' : '-'}{Math.random().toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">${(project.budget * 1.3)?.toLocaleString() || '0'}</td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-20 rounded overflow-hidden bg-dark-400">
                        <div 
                          className={`h-full ${index % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Watchlist</h2>
          <div className="flex space-x-2">
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">Most Viewed</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">Gainers</button>
            <button className="bg-dark-300 hover:bg-dark-400 text-gray-400 py-1 px-3 rounded-md text-sm transition-colors">Losers</button>
          </div>
        </div>

        <div className="bg-dark-100 rounded-xl p-6 border border-dark-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Watchlist Items */}
            {tasks.slice(0, 3).map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-dark-200 hover:bg-dark-300 transition-colors">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-2 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white">{task.title}</h3>
                    <p className="text-xs text-gray-500">Task #{task.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${Math.floor(Math.random() * 100).toFixed(2)}</p>
                  <p className={`text-xs ${index % 2 === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {index % 2 === 0 ? '-' : '+'}{Math.random().toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const TeamDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">My Tasks</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">23</span>
            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-sm">8 due soon</span>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/tasks" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm flex items-center"
            >
              View all tasks
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Active Projects</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">7</span>
            <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-sm">2 new</span>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/projects" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm flex items-center"
            >
              View projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Time Logged</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">32h</span>
            <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">This Week</span>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/analytics" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm flex items-center"
            >
              View time report
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Design UI Components</p>
                  <p className="text-xs text-gray-400">Website Redesign</p>
                </div>
              </div>
              <div className="text-red-500 text-sm">Today</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Complete User Research</p>
                  <p className="text-xs text-gray-400">Mobile App</p>
                </div>
              </div>
              <div className="text-orange-500 text-sm">Tomorrow</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">API Integration</p>
                  <p className="text-xs text-gray-400">Payment System</p>
                </div>
              </div>
              <div className="text-yellow-500 text-sm">In 2 days</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Create Documentation</p>
                  <p className="text-xs text-gray-400">Marketing Campaign</p>
                </div>
              </div>
              <div className="text-blue-500 text-sm">Next week</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm">View all deadlines</button>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-4">Team Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-3">JD</div>
              <div>
                <p className="text-sm">John completed the homepage design</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mr-3">AS</div>
              <div>
                <p className="text-sm">Alex submitted the backend code for review</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm mr-3">ML</div>
              <div>
                <p className="text-sm">Maria fixed 3 bugs in the payment system</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm mr-3">TW</div>
              <div>
                <p className="text-sm">Tom added new test cases for the API</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm">View all activity</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  const { data: session } = useSession();
  const { data: analytics, isLoading: isLoadingAnalytics } = useSummaryAnalytics();
  const [selectedProject, setSelectedProject] = useState(1); // Default to first project
  
  // Sample client projects
  const clientProjects = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'Marketing Campaign' }
  ];

  return (
    <div>
      {/* Welcome and Project Selection - Moved to Top */}
      <div className="bg-[#111827] rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || 'Client'}</h1>
            <p className="text-gray-400 mt-1">Here's the latest on your projects</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Project:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(parseInt(e.target.value))}
              className="bg-[#1F2937] border border-gray-600 rounded text-sm px-3 py-2"
            >
              {clientProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Project Status</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">68%</span>
            <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-sm">In Progress</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Budget</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">$32,450</span>
            <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">72% Remaining</span>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/budget" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm flex items-center"
            >
              View budget details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Tasks</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">12</span>
            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-sm">4 Completed</span>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/tasks" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm flex items-center"
            >
              View tasks
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Project Progress Chart */}
      <div className="bg-[#111827] rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-xl mb-4">Project Progress</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Progress Bars */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Task Completion</span>
                <span className="text-sm">33%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Budget Utilization</span>
                <span className="text-sm">28%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Timeline Progress</span>
                <span className="text-sm">45%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Overall Progress</span>
                <span className="text-sm">68%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-[#8B5CF6] h-3 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Stats */}
          <div className="flex-1 bg-[#1F2937] rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">4/12</div>
                <div className="text-sm text-gray-400">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">68%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">$28K</div>
                <div className="text-sm text-gray-400">Budget Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">May 30</div>
                <div className="text-sm text-gray-400">Deadline</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Project Manager</div>
                  <div className="font-medium">John Doe</div>
                </div>
                <Link 
                  href={`/dashboard/projects/${selectedProject}`}
                  className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-1 rounded text-sm"
                >
                  View Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activities & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">Recent Updates</h2>
            <Link 
              href="/dashboard/activity"
              className="text-[#8B5CF6] hover:text-[#a78bfa] text-sm"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm">Wireframes have been approved</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm">Homepage design completed</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <p className="text-sm">Backend API integration delayed</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-4">Need Support?</h2>
          <p className="text-gray-400 mb-4">If you have any questions or need assistance with your project, don't hesitate to reach out to our team.</p>
          
          <Link 
            href="/dashboard/tickets/new" 
            className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white text-sm inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-1.414-1.414L10.586 9H7a1 1 0 110-2h3.586l-1.293-1.293a1 1 0 00-1.414 1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 13H13a1 1 0 110 2H9.414l1.293 1.293a1 1 0 001.414 1.414l-3-3a1 1 0 10-1.414-1.414l3-3a1 1 0 001.414 1.414z" clipRule="evenodd" />
            </svg>
            Create Support Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function DashboardHomeView() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (session?.user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'team':
        return <TeamDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return <TeamDashboard />;
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {renderDashboard()}
    </ErrorBoundary>
  );
}