import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Row, Col, Card, Statistic, List, Typography, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  // Mock activity data
  const activities = [
    {
      time: '10:30 AM',
      description: 'Bought 10 shares of AAPL at $172.35',
    },
    {
      time: 'Yesterday',
      description: 'Sold 5 shares of MSFT at $338.12',
    },
    {
      time: 'Yesterday',
      description: 'Dividend payment received: $12.50',
    },
  ];

  return (
    <div className="dashboard-page">
      <Title level={4}>Welcome back, {user?.name || 'User'}</Title>

      <div className="dashboard-stats">
        <Card variant="borderless" className="stat-card">
          <Statistic
            title="Portfolio Value"
            value={10345.67}
            precision={2}
            prefix="$"
          />
          <div className="stat-change positive">
            <ArrowUpOutlined /> 2.5%
          </div>
        </Card>

        <Card variant="borderless" className="stat-card">
          <Statistic title="Open Positions" value={8} />
        </Card>

        <Card variant="borderless" className="stat-card">
          <Statistic
            title="Today's P/L"
            value={145.2}
            precision={2}
            prefix="$"
          />
          <div className="stat-change positive">
            <ArrowUpOutlined /> 1.4%
          </div>
        </Card>
      </div>

      <div className="recent-activity">
        <Title level={5}>Recent Activity</Title>
        <List
          bordered
          className="activity-list"
          dataSource={activities}
          renderItem={(item) => (
            <List.Item className="activity-item">
              <Text type="secondary" className="activity-time">
                {item.time}
              </Text>
              <Text className="activity-description">{item.description}</Text>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
