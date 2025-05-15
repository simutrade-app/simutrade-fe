import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, List, Typography, Row, Col } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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
          Welcome back, {user?.name || 'User'}
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
          <LineChartComponent />
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

      {/* Row 4: Original Cards + Notifications */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card title="Active Trade Missions" style={{ height: '100%' }}>
            <Text>
              Details about active missions will go here... (e.g., a list or
              summary with progress)
            </Text>
            {/* TODO: Integrate with actual data and link to Missions Hub */}
          </Card>
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

const LineChartComponent: React.FC = () => {
  const data = [
    { month: 'Jan', value: 150 },
    { month: 'Feb', value: 220 },
    { month: 'Mar', value: 300 },
    { month: 'Apr', value: 280 },
    { month: 'May', value: 450 },
    { month: 'Jun', value: 400 },
    { month: 'Jul', value: 510 },
  ];

  return (
    <Card
      title="Your Trade Simulation Activity"
      style={{ height: '100%', minHeight: '350px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4CAF50"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DashboardPage;
