'use client';

import React from 'react';
import ChartWrapper from './ChartWrapper';
import { BudgetChartData, generateRandomData } from './types';

interface BudgetComparisonChartProps {
  data?: BudgetChartData;
  height?: number;
  title?: string;
  className?: string;
}

const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({ 
  data = generateRandomData.budget(),
  height = 350,
  title = 'Budget vs. Actual Spending',
  className = ''
}) => {
  const series = [
    {
      name: 'Budget',
      data: data.budget
    },
    {
      name: 'Spent',
      data: data.spent
    }
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: height,
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ['#8B5CF6', '#EC4899'],
    xaxis: {
      categories: data.categories,
      labels: {
        style: {
          colors: '#94A3B8'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Amount (₹)',
        style: {
          color: '#94A3B8',
          fontSize: '12px',
          fontWeight: 400
        }
      },
      labels: {
        style: {
          colors: '#94A3B8'
        },
        formatter: function(val) {
          return '₹' + (val / 1000).toFixed(0) + 'k';
        }
      }
    },
    fill: {
      opacity: 0.9
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return '₹' + val.toLocaleString('en-IN');
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -10,
      labels: {
        colors: '#E5E7EB'
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#E5E7EB',
        fontWeight: 'bold'
      }
    }
  };

  return (
    <ChartWrapper
      type="bar"
      series={series}
      options={options}
      height={height}
      className={className}
    />
  );
};

export default BudgetComparisonChart; 