'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import ReportCharts from '@/components/reports/ReportCharts';

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [view, setView] = React.useState<'overview' | 'detailed'>('overview');
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#111827] rounded-lg p-1 flex">
            <button
              className={`px-4 py-2 rounded-md text-sm transition ${
                view === 'overview' 
                  ? 'bg-[#1F2937] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setView('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm transition ${
                view === 'detailed' 
                  ? 'bg-[#1F2937] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setView('detailed')}
            >
              Detailed
            </button>
          </div>
          
          <Link 
            href="/dashboard" 
            className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Render different views based on selection */}
      <div>
        {view === 'overview' ? (
          <DashboardCharts />
        ) : (
          <ReportCharts />
        )}
      </div>
    </div>
  );
} 