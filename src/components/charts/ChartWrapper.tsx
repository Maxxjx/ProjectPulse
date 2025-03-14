'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { theme } from '@/lib/utils/theme';

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
      fontFamily: theme.typography.fontFamily.sans,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.sans,
      },
      background: {
        color: theme.chartTheme.tooltip.background,
        borderColor: theme.chartTheme.tooltip.border,
      },
    },
    colors: theme.chartTheme.colors,
    grid: {
      borderColor: theme.chartTheme.grid,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.chartTheme.text,
          fontSize: theme.typography.fontSize.sm,
          fontFamily: theme.typography.fontFamily.sans,
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.chartTheme.text,
          fontSize: theme.typography.fontSize.sm,
          fontFamily: theme.typography.fontFamily.sans,
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.chartTheme.text,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 5
      },
      fontFamily: theme.typography.fontFamily.sans,
      fontSize: theme.typography.fontSize.sm,
    },
    ...options,
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div 
        className={`flex items-center justify-center bg-gray-900 rounded-xl shadow-md ${className}`} 
        style={{ width, height }}
      >
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-purple-500 animate-spin"></div>
          <div className="text-gray-400 text-sm">Loading chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
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