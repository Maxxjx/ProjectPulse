'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSummaryAnalytics, useRecentActivity } from '@/lib/hooks/useAnalytics';
import ErrorBoundary from '@/components/ErrorBoundary'; // new import

// Dashboard components
const AdminDashboard = () => {
  const { data: analytics, isLoading: isLoadingAnalytics } = useSummaryAnalytics();
  const { data: recentActivity, isLoading: isLoadingActivity } = useRecentActivity(5);

  return (
    <main role="main" aria-label="Admin Dashboard">
      {isLoadingAnalytics ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-label="Loading dashboard metrics">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#111827] rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-label="Dashboard metrics">
          <article className="bg-[#111827] rounded-lg p-6 focus-within:ring-2 focus-within:ring-[#8B5CF6] hover:bg-[#1F2937] transition-colors">
            <h2 className="font-semibold text-xl mb-2">Projects</h2>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">{analytics?.projects.total || 0}</span>
              <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">
                {analytics?.projects.inProgress || 0} in progress
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/projects" 
                className="text-[#8B5CF6] hover:text-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] rounded-md py-1 px-2 -ml-2 text-sm flex items-center transition-colors"
                aria-label="View all projects"
              >
                View all projects
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </article>
          
          <article className="bg-[#111827] rounded-lg p-6 focus-within:ring-2 focus-within:ring-[#8B5CF6] hover:bg-[#1F2937] transition-colors">
            <h2 className="font-semibold text-xl mb-2">Users</h2>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">{analytics?.users.total || 0}</span>
              <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-sm">
                {analytics?.users.team || 0} team members
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/users" 
                className="text-[#8B5CF6] hover:text-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] rounded-md py-1 px-2 -ml-2 text-sm flex items-center transition-colors"
                aria-label="Manage users"
              >
                Manage users
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </article>
          
          <article className="bg-[#111827] rounded-lg p-6 focus-within:ring-2 focus-within:ring-[#8B5CF6] hover:bg-[#1F2937] transition-colors">
            <h2 className="font-semibold text-xl mb-2">Budget</h2>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">${(analytics?.budget.total || 0).toLocaleString()}</span>
              <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">
                {analytics?.budget.utilization || 0}% used
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/analytics" 
                className="text-[#8B5CF6] hover:text-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] rounded-md py-1 px-2 -ml-2 text-sm flex items-center transition-colors"
                aria-label="View reports"
              >
                View reports
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </article>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-[#111827] rounded-lg p-6" aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading" className="font-semibold text-xl mb-4">Recent Activity</h2>
          
          {isLoadingActivity ? (
            <div className="space-y-4" aria-label="Loading recent activities">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4" role="feed" aria-busy="false">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity: any) => (
                  <article 
                    key={activity.id} 
                    className="flex items-start"
                    aria-label={`${activity.userName} ${activity.action} ${activity.entityType} ${activity.entityName}`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-3 ${
                        activity.action === 'created' ? 'bg-green-500' : 
                        activity.action === 'updated' ? 'bg-blue-500' : 
                        activity.action === 'deleted' ? 'bg-red-500' :
                        activity.action === 'completed' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                      aria-hidden="true"
                    >
                      {activity.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="sr-only">Activity:</span>
                        {activity.userName} {activity.action} {activity.entityType} 
                        <span className="text-[#8B5CF6]"> {activity.entityName}</span>
                        {activity.projectName && (
                          <>
                            <span className="text-gray-400"> in project </span>
                            <span className="text-[#8B5CF6]">{activity.projectName}</span>
                          </>
                        )}
                      </p>
                      <time dateTime={activity.timestamp} className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </time>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-gray-400" role="status">No recent activity.</p>
              )}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link 
              href="/dashboard/activity" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] rounded-md py-1 px-2 text-sm inline-block transition-colors"
              aria-label="View all activity"
            >
              View all activity
            </Link>
          </div>
        </section>
        
        <section className="bg-[#111827] rounded-lg p-6" aria-labelledby="tasks-overview-heading">
          <div className="flex justify-between items-center mb-4">
            <h2 id="tasks-overview-heading" className="font-semibold text-xl">Tasks Overview</h2>
            <select 
              className="bg-[#1F2937] border border-gray-600 rounded text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              aria-label="Filter tasks"
            >
              <option>All Tasks</option>
              <option>Overdue</option>
              <option>Completed</option>
            </select>
          </div>
          
          {isLoadingAnalytics ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-12"></div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Total Tasks</span>
                  <span className="text-sm">{analytics?.tasks.total || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Completed</span>
                  <span className="text-sm">{analytics?.tasks.completed || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ 
                    width: `${analytics ? (analytics.tasks.completed / analytics.tasks.total) * 100 : 0}%` 
                  }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">In Progress</span>
                  <span className="text-sm">{analytics?.tasks.inProgress || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ 
                    width: `${analytics ? (analytics.tasks.inProgress / analytics.tasks.total) * 100 : 0}%` 
                  }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Overdue</span>
                  <span className="text-sm text-red-500">{analytics?.tasks.overdue || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ 
                    width: `${analytics ? (analytics.tasks.overdue / analytics.tasks.total) * 100 : 0}%` 
                  }}></div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-medium text-green-500">{analytics?.tasks.completion || 0}%</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link 
              href="/dashboard/tasks" 
              className="text-[#8B5CF6] hover:text-[#a78bfa] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] rounded-md py-1 px-2 text-sm inline-block transition-colors"
              aria-label="View all tasks"
            >
              View all tasks
            </Link>
          </div>
        </section>
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
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
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