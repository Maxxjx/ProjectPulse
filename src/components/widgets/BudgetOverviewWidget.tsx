'use client';

import { useState, useEffect } from 'react';
import { DashboardWidget } from '@/lib/data/types';
import BaseWidget from './BaseWidget';
import Link from 'next/link';

interface BudgetData {
  totalBudget: number;
  spent: number;
  remaining: number;
  categories: {
    name: string;
    allocated: number;
    spent: number;
  }[];
}

interface BudgetOverviewWidgetProps {
  widget: DashboardWidget;
  isDragging?: boolean;
}

export default function BudgetOverviewWidget({ widget, isDragging }: BudgetOverviewWidgetProps) {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetch from API
    const getBudgetData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setBudgetData({
        totalBudget: 50000,
        spent: 32500,
        remaining: 17500,
        categories: [
          {
            name: 'Development',
            allocated: 25000,
            spent: 18000,
          },
          {
            name: 'Design',
            allocated: 15000,
            spent: 9000,
          },
          {
            name: 'Marketing',
            allocated: 8000,
            spent: 5000,
          },
          {
            name: 'Operations',
            allocated: 2000,
            spent: 500,
          }
        ]
      });
      
      setIsLoading(false);
    };
    
    getBudgetData();
  }, []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const calculatePercentage = (spent: number, total: number) => {
    return Math.round((spent / total) * 100);
  };
  
  return (
    <BaseWidget widget={widget} isDragging={isDragging}>
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="h-5 bg-gray-700 rounded-full w-full mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ) : budgetData ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Total Budget</div>
            <div className="text-sm font-medium">{formatCurrency(budgetData.totalBudget)}</div>
          </div>
          
          <div className="relative h-4 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400" 
              style={{ width: `${calculatePercentage(budgetData.spent, budgetData.totalBudget)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mb-6 text-sm">
            <div>
              <span className="text-gray-400">Spent: </span>
              <span className="font-medium">{formatCurrency(budgetData.spent)}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({calculatePercentage(budgetData.spent, budgetData.totalBudget)}%)
              </span>
            </div>
            <div>
              <span className="text-gray-400">Remaining: </span>
              <span className="font-medium">{formatCurrency(budgetData.remaining)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-2">Budget Categories</h4>
            
            {budgetData.categories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <div>{category.name}</div>
                  <div>
                    <span className="font-medium">{formatCurrency(category.spent)}</span>
                    <span className="text-gray-500">/{formatCurrency(category.allocated)}</span>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${getBudgetCategoryColor(index)}`}
                    style={{ width: `${calculatePercentage(category.spent, category.allocated)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/budget"
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm"
            >
              View budget details
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-4">
          No budget data available
        </div>
      )}
    </BaseWidget>
  );
}

function getBudgetCategoryColor(index: number): string {
  const colors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500'
  ];
  
  return colors[index % colors.length];
} 