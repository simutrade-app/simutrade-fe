import React from 'react';
import { Card } from 'antd';
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
  return (
    <Card
      title="Top Simulated Commodities (by Value)"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flexGrow: 1, paddingBottom: '16px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fontSize: '10px' }}
          />
          <YAxis tick={{ fontSize: '10px' }} />
          <RechartsTooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopCommoditiesChart;
