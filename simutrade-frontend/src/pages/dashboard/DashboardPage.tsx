import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUser } from '@/services/AuthService';
import { Card, List, Typography, Row, Col } from 'antd';
import {
  GlobalOutlined,
  RiseOutlined,
  ExperimentOutlined,
  BulbOutlined,
} from '@ant-design/icons';

// Import new components
import KpiCard from '../../components/dashboard/KpiCard';
import GlobalTradeMap from '../../components/dashboard/GlobalTradeMap';
import TopCommoditiesChart from '../../components/dashboard/TopCommoditiesChart';
import TopTradingPartnersList from '../../components/dashboard/TopTradingPartnersList';
import OverallTradeSentimentGauge from '../../components/dashboard/OverallTradeSentimentGauge';
import TradePulseNotificationsCard from '../../components/dashboard/TradePulseNotificationsCard';
import TradeSimulationChart from '../../components/dashboard/TradeSimulationChart';
import TotalCustomers from '../../components/dashboard/TotalCustomers';

const { Title, Text } = Typography;

// Mock Data with Ant Design Icons
const kpiData = [
  {
    title: 'Total Simulations',
    value: '1,280',
    percentageChange: '+15%',
    icon: <ExperimentOutlined style={{ color: '#1890ff' }} />,
  },
  {
    title: 'Avg. Efficiency Score',
    value: '82%',
    percentageChange: '+3%',
    icon: <RiseOutlined style={{ color: '#52c41a' }} />,
  },
  {
    title: 'Active Trade Missions',
    value: '12',
    percentageChange: '-5%',
    icon: <GlobalOutlined style={{ color: '#faad14' }} />,
  },
  {
    title: 'New Opportunities',
    value: '45',
    percentageChange: '+10%',
    icon: <BulbOutlined style={{ color: '#722ed1' }} />,
  },
];

const topCommoditiesData = [
  { name: 'Electronics', value: 4000 },
  { name: 'Textiles', value: 3000 },
  { name: 'Coffee', value: 2000 },
  { name: 'Automotive Parts', value: 2780 },
  { name: 'Pharmaceuticals', value: 1890 },
];

const topTradingPartnersData = [
  { name: 'United States', value: 50, flag: '🇺🇸' },
  { name: 'China', value: 35, flag: '🇨🇳' },
  { name: 'Germany', value: 28, flag: '🇩🇪' },
  { name: 'Japan', value: 22, flag: '🇯🇵' },
  { name: 'United Kingdom', value: 18, flag: '🇬🇧' },
];

const overallTradeSentimentData = { score: 4.2, status: 'Positive' }; // Score out of 5

const tradePulseNotifications = [
  {
    id: 1,
    message: 'New import tariff changes for electronics in the EU.',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    message: 'Port congestion reported in Shanghai, expect delays.',
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    message: 'Webinar: "Navigating USMCA 2.0" next Tuesday.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    message: 'Trade agreement between Kenya and UK ratified.',
    time: '2 days ago',
    read: true,
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(
    null
  );

  // Fetch user data from token
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);
      console.log('User data loaded in dashboard:', currentUser);
    }
  }, []);

  const activities = [
    {
      time: '11:45 AM',
      description: 'New simulation started: Exporting textiles to USA.',
    },
    {
      time: 'Yesterday',
      description: 'Trade Mission "ASEAN Expansion" progress: 75% completed.',
    },
    {
      time: '2 days ago',
      description:
        'Trade Pulse: Updated import regulations for Brazil available.',
    },
    {
      time: '3 days ago',
      description:
        'Completed simulation: Coffee beans to Canada - Efficiency Score: 88%',
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
            marginBottom: '24px',
          }}
        >
          Welcome back, {String(userData?.name || user?.name || 'User')}
        </Title>
      </div>

      {/* Row 1: KPIs */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {kpiData.map((kpi) => (
          <Col xs={24} sm={12} md={12} lg={6} key={kpi.title}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              percentageChange={kpi.percentageChange}
              icon={kpi.icon}
            />
          </Col>
        ))}
      </Row>

      {/* Row 2: Main Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <TradeSimulationChart />
        </Col>
        <Col xs={24} lg={8} style={{ minHeight: '350px' }}>
          <TopCommoditiesChart data={topCommoditiesData} />
        </Col>
      </Row>

      {/* Row 3: Map, Top Partners, Sentiment */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <GlobalTradeMap />
        </Col>
        <Col xs={24} lg={6}>
          <TopTradingPartnersList data={topTradingPartnersData} />
        </Col>
        <Col xs={24} lg={6}>
          <OverallTradeSentimentGauge data={overallTradeSentimentData} />
        </Col>
      </Row>

      {/* Row 4: Original Cards + Notifications + Total Customers */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <TotalCustomers
            data={{
              count: 2420,
              growthPercent: 25,
              avatars: [
                'https://randomuser.me/api/portraits/men/1.jpg',
                'https://randomuser.me/api/portraits/women/2.jpg',
                'https://randomuser.me/api/portraits/women/3.jpg',
                'https://randomuser.me/api/portraits/men/4.jpg',
              ],
            }}
          />
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Export Opportunities" style={{ height: '100%' }}>
            <Text>
              Details about export opportunities will go here... (e.g., a list
              or summary with potential values)
            </Text>
            {/* TODO: Integrate with actual data */}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <TradePulseNotificationsCard
            notifications={tradePulseNotifications}
          />
        </Col>
      </Row>

      {/* Row 5: Recent SimuTrade Activity */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card title="Recent SimuTrade Activity">
            <List
              bordered
              className="activity-list"
              dataSource={activities}
              renderItem={(item) => (
                <List.Item className="activity-item">
                  <Text type="secondary" className="activity-time">
                    {item.time}
                  </Text>
                  <Text className="activity-description">
                    {item.description}
                  </Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
