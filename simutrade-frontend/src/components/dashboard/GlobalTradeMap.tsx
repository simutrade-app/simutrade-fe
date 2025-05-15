import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const GlobalTradeMap: React.FC = () => {
  return (
    <Card title="Global Trade Hotspots" style={{ height: '100%' }}>
      <div
        style={{
          height: 'calc(100% - 48px)', // Adjust height considering card title
          minHeight: '250px', // Ensure a minimum height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f2f5',
          borderRadius: '8px',
        }}
      >
        <Text type="secondary">[Interactive Map Placeholder]</Text>
      </div>
    </Card>
  );
};

export default GlobalTradeMap;
