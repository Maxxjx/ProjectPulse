'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartWrapperProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar';
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options: ApexCharts.ApexOptions;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  series,
  options,
  width = '100%',
  height = 350,
  className = '',
}) => {
  // State to track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);

  // Set mounted to true on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Merge default options with provided options
  const defaultOptions: ApexCharts.ApexOptions = {
    theme: {
      mode: 'dark',
    },
    chart: {
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    tooltip: {
      theme: 'dark',
    },
    colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1', '#EF4444'],
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    ...options,
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div 
        className={`flex items-center justify-center bg-[#111827] rounded-lg ${className}`} 
        style={{ width, height }}
      >
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className={`bg-[#111827] rounded-lg p-4 ${className}`}>
      <Chart
        type={type}
        series={series}
        options={defaultOptions}
        width={width}
        height={height}
      />
    </div>
  );
};

export default ChartWrapper; 