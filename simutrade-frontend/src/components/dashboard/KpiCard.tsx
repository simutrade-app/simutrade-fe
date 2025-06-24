import React from 'react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  percentageChange: string;
  icon: React.ReactNode;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
  className,
}) => {
  const isPositive = percentageChange.startsWith('+');
  const isNegative = percentageChange.startsWith('-');

  return (
    <div
      className={cn(
        // Clean minimalist card
        "bg-white border border-gray-200/60",
        "rounded-xl p-6",
        "hover:border-gray-300/60 hover:shadow-sm",
        "transition-all duration-200 ease-out",
        "group",
        className
      )}
    >
      <div className="flex flex-col space-y-4">
        {/* Icon and Title Row */}
        <div className="flex items-center justify-between">
          <div className="text-xl text-gray-600 group-hover:text-primary transition-colors duration-200">
            {icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-500 leading-tight">
          {title}
        </h3>
        
        {/* Value and Change */}
        <div className="flex items-end justify-between">
          <div className="text-2xl font-semibold text-gray-900">
            {value}
          </div>
          
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1",
            isPositive && "text-emerald-700 bg-emerald-50",
            isNegative && "text-red-700 bg-red-50",
            !isPositive && !isNegative && "text-gray-600 bg-gray-50"
          )}>
            {isPositive && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isNegative && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {percentageChange}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
