import React from 'react';
import { Card, Typography, Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface CustomerData {
  count: number;
  growthPercent: number;
  avatars: string[]; // URLs to customer avatars
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
    <Card
      title="Total Customers"
      extra={<Text type="secondary">Show All →</Text>}
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Title level={2} style={{ margin: 0 }}>
            {data.count.toLocaleString()}
          </Title>
          <Badge
            count={`+${data.growthPercent}%`}
            style={{
              backgroundColor: '#52c41a',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '0 8px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {data.avatars.map((avatar, index) => (
            <Avatar
              key={index}
              src={avatar}
              size={40}
              icon={!avatar ? <UserOutlined /> : undefined}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TotalCustomers;
