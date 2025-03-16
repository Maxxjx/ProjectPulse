'use client';

import React from 'react';

interface ChartDebugProps {
  data: any;
  title?: string;
  showInProduction?: boolean;
}

const ChartDebug: React.FC<ChartDebugProps> = ({ 
  data, 
  title = 'Chart Debug', 
  showInProduction = false 
}) => {
  // Only show in development or if explicitly enabled
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && !showInProduction) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-4 mt-4 text-sm overflow-auto">
      <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {title}
      </h4>
      <details>
        <summary className="cursor-pointer text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300">
          Toggle data debug view
        </summary>
        <div className="mt-2 bg-white dark:bg-gray-900 p-3 rounded text-xs max-h-48 overflow-auto">
          <pre className="text-gray-700 dark:text-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
};

export default ChartDebug;
