import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

interface CommodityData {
  name: string;
  value: number;
}

interface TopCommoditiesChartProps {
  data: CommodityData[];
}

const TopCommoditiesChart: React.FC<TopCommoditiesChartProps> = ({ data }) => {
  const BAR_COLOR = '#FFA000'; // Custom color for bar fill
  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Top Commodities</h3>
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: '10px' }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: '10px' }}
              stroke="#64748b"
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar 
              dataKey="value" 
              fill={BAR_COLOR}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCommoditiesChart;
