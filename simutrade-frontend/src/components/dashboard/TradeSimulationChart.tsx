import React from 'react';
import { Card } from 'antd';
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
    <Card
      title="Your Trade Simulation Activity"
      style={{ height: '100%', width: '100%' }}
      styles={{ body: { height: 'calc(100% - 48px)', padding: '8px' } }}
    >
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" style={{ fontSize: '12px' }} />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4CAF50"
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TradeSimulationChart;
