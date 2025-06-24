import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface DataPoint {
  month: string;
  value: number;
}

interface TradeSimulationChartProps {
  data?: DataPoint[];
}

const defaultData: DataPoint[] = [
  { month: 'Jan', value: 150 },
  { month: 'Feb', value: 220 },
  { month: 'Mar', value: 300 },
  { month: 'Apr', value: 280 },
  { month: 'May', value: 450 },
  { month: 'Jun', value: 400 },
  { month: 'Jul', value: 510 },
];

const TradeSimulationChart: React.FC<TradeSimulationChartProps> = ({
  data = defaultData,
}) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Trade Activity</h3>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              style={{ fontSize: '12px' }}
              stroke="#64748b"
            />
            <YAxis 
              style={{ fontSize: '12px' }}
              stroke="#64748b"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradeSimulationChart;
