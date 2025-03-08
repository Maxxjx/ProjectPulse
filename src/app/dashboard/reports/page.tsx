'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

const reportLinks = [
  {
    title: 'Time Tracking',
    description: 'View time spent on tasks, generate reports, and analyze productivity',
    href: '/dashboard/reports/time-tracking',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    roles: ['admin', 'team']
  },
  {
    title: 'Project Progress',
    description: 'Track project completion, milestones, and deadlines',
    href: '/dashboard/reports/project-progress',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    roles: ['admin', 'team', 'client']
  },
  {
    title: 'Budget Reports',
    description: 'Analyze budget allocation, spending, and forecasts',
    href: '/dashboard/reports/budget',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    roles: ['admin', 'client']
  },
  {
    title: 'Team Performance',
    description: 'Evaluate team productivity, task completion rates, and performance metrics',
    href: '/dashboard/reports/team-performance',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    roles: ['admin']
  },
];

export default function ReportsView() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || '';
  
  // Filter reports based on user role
  const filteredReports = reportLinks.filter(report => 
    report.roles.includes(userRole) || userRole === 'admin'
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Link 
          href="/dashboard" 
          className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <Link 
            key={index}
            href={report.href}
            className="bg-[#111827] rounded-lg p-6 hover:bg-[#1F2937] transition"
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1">{report.icon}</div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
                <p className="text-gray-400">{report.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <div className="bg-[#111827] rounded-lg p-8 text-center">
          <p className="text-gray-400">No reports available for your role.</p>
        </div>
      )}
    </div>
  );
} 