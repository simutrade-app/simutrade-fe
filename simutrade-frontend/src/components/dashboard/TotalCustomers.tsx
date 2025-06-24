import React from 'react';
import { cn } from '@/lib/utils';

interface CustomerData {
  count: number;
  growthPercent: number;
  avatars: string[];
}

interface TotalCustomersProps {
  data: CustomerData;
}

const defaultData: CustomerData = {
  count: 2420,
  growthPercent: 25,
  avatars: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
  ],
};

const TotalCustomers: React.FC<TotalCustomersProps> = ({
  data = defaultData,
}) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-medium text-gray-900">Total Customers</h3>
        <button className="text-sm text-primary hover:text-secondary-dark">
          View all →
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-semibold text-gray-900">
            {data.count.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
            +{data.growthPercent}%
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          1,646 active this month
        </div>
        
        <div className="flex -space-x-2">
          {data.avatars.slice(0, 4).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"
            />
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
            +7
          </div>
        </div>
      </div>

      {/* Additional customer insights */}
      <div className="border-t border-gray-100 pt-4 mt-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-medium text-gray-900">892</div>
            <div className="text-xs text-gray-500">New</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">1,528</div>
            <div className="text-xs text-gray-500">Returning</div>
          </div>
          <div>
            <div className="text-sm font-medium text-emerald-600">94.2%</div>
            <div className="text-xs text-gray-500">Retention</div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-600">Average session: 24 minutes</div>
        </div>
      </div>
    </div>
  );
};

export default TotalCustomers;
