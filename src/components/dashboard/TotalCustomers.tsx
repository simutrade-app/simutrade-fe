import React from 'react';
import { Card, Typography, Avatar, Progress, Space, Tag } from 'antd';
import { TeamOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

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
  const activeUsers = 1646; // From screenshot
  const activePercentage = 68; // From screenshot
  const greenColor = '#52c41a';

  return (
    <Card
      title={
        <Space>
          <TeamOutlined style={{ color: greenColor }} />
          <span>Total Customers</span>
        </Space>
      }
      extra={<Text style={{ color: greenColor }}>Show All →</Text>}
      style={{
        height: '100%',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        borderRadius: '8px',
      }}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Customer Count Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space align="center">
            <TeamOutlined style={{ fontSize: '28px', color: '#333' }} />
            <Text
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#333',
                margin: 0,
              }}
            >
              2,420
            </Text>
          </Space>
          <Tag color={greenColor} style={{ margin: 0, fontWeight: 'bold' }}>
            NEW
          </Tag>
        </div>

        {/* Growth Section */}
        <Space align="center">
          <Text strong style={{ color: greenColor, fontSize: '16px' }}>
            <ArrowUpOutlined /> +25% growth
          </Text>
          <Text type="secondary">this month</Text>
        </Space>

        {/* Active Users Section */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Text>Active users</Text>
            <Text strong>
              {activeUsers} ({activePercentage}%)
            </Text>
          </div>
          <Progress
            percent={activePercentage}
            showInfo={false}
            strokeColor={greenColor}
            trailColor="#f0f0f0"
            style={{ marginBottom: '8px' }}
          />
        </div>

        {/* Recent Customers Section */}
        <div>
          <Text
            type="secondary"
            style={{ display: 'block', marginBottom: '12px' }}
          >
            Recently active customers
          </Text>
          <Avatar.Group maxCount={5} maxStyle={{ backgroundColor: greenColor }}>
            {data.avatars.map((avatar, index) => (
              <Avatar
                key={index}
                src={avatar}
                size={40}
                style={{ border: '2px solid #fff' }}
              />
            ))}
            <Avatar style={{ backgroundColor: '#f56a00', fontSize: '16px' }}>
              A
            </Avatar>
            <Avatar style={{ backgroundColor: greenColor }}>+7</Avatar>
          </Avatar.Group>
        </div>
      </Space>
    </Card>
  );
};

export default TotalCustomers;
