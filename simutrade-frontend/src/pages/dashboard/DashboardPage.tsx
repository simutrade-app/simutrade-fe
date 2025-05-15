import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Statistic, List, Typography, Row, Col } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

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
    <div className="dashboard-page-wrapper" style={{ width: '100%' }}>
      <div
        className="welcome-title-container"
        style={{
          marginBottom: '24px',
          width: '100%',
          display: 'block',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          writingMode: 'horizontal-tb',
        }}
      >
        <Title
          level={4}
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            writingMode: 'horizontal-tb',
            textAlign: 'left',
          }}
        >
          Welcome back, {user?.name || 'User'}
        </Title>
      </div>

      <Row gutter={[24, 24]} className="dashboard-stats">
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
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
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic title="Open Positions" value={8} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
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
        </Col>
      </Row>

      <div className="recent-activity">
        <Title
          level={5}
          style={{
            marginBottom: '16px',
            marginTop: '32px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            writingMode: 'horizontal-tb',
            textAlign: 'left',
          }}
        >
          Recent Activity
        </Title>
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
