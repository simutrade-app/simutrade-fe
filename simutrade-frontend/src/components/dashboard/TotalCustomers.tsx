import React from 'react';
import {
  Card,
  Typography,
  Avatar,
  Badge,
  Progress,
  Tooltip,
  Statistic,
} from 'antd';
import { UserOutlined, RiseOutlined, TeamOutlined } from '@ant-design/icons';

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
  const activeUsers = 1646; // From screenshot
  const activePercentage = 68; // From screenshot

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <span>Total Customers</span>
        </div>
      }
      extra={<Text style={{ color: '#1890ff' }}>Show All →</Text>}
      style={{ height: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeamOutlined
            style={{
              fontSize: '30px',
              marginRight: '8px',
              color: '#333',
            }}
          />
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
            2,420
          </span>
          <div
            style={{
              marginLeft: 'auto',
              backgroundColor: '#1890ff',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            NEW
          </div>
        </div>

        <div style={{ margin: '8px 0 20px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', color: '#52c41a' }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              +25% growth
            </span>
            <span
              style={{ color: '#8c8c8c', marginLeft: '8px', fontSize: '14px' }}
            >
              this month
            </span>
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Text>Active users</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {activeUsers} ({activePercentage}%)
            </Text>
          </div>
          <Progress
            percent={activePercentage}
            showInfo={false}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            style={{ marginBottom: '30px' }}
          />
        </div>

        <div>
          <Text
            type="secondary"
            style={{ display: 'block', marginBottom: '12px' }}
          >
            Recently active customers
          </Text>
          <div style={{ display: 'flex', gap: '4px' }}>
            {data.avatars.map((avatar, index) => (
              <Avatar
                key={index}
                src={avatar}
                size={40}
                style={{ border: '2px solid #fff' }}
              />
            ))}
            <Avatar
              style={{
                backgroundColor: '#f56a00',
                color: '#fff',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              A
            </Avatar>
            <Avatar
              style={{
                backgroundColor: '#1890ff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +7
            </Avatar>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TotalCustomers;
