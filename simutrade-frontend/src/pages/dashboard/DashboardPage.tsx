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
import ExportOpportunitiesCard from '../../components/dashboard/ExportOpportunitiesCard';

const { Title, Text } = Typography;

// Minimalist KPI data - removed unused "Avg. Efficiency Score"
const kpiData = [
  {
    title: 'Total Simulations',
    value: '1,280',
    percentageChange: '+15%',
    icon: <ExperimentOutlined />,
  },
  {
    title: 'Active Trade Missions',
    value: '12',
    percentageChange: '-5%',
    icon: <GlobalOutlined />,
  },
  {
    title: 'New Opportunities',
    value: '45',
    percentageChange: '+10%',
    icon: <BulbOutlined />,
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
      action: 'Simulation Started',
      details: 'Electronics → United States',
      status: 'Running',
      value: '$2.4M',
    },
    {
      time: '10:20 AM',
      action: 'Simulation Completed',
      details: 'Textiles → Germany',
      status: 'Success',
      value: '$1.8M',
    },
    {
      time: 'Yesterday',
      action: 'Simulation Completed',
      details: 'Coffee → Canada',
      status: 'Success',
      value: '$950K',
    },
    {
      time: '2 days ago',
      action: 'Simulation Failed',
      details: 'Automotive Parts → Japan',
      status: 'Failed',
      value: '$3.2M',
    },
  ];

  return (
    <div className="dashboard-page-wrapper" style={{ width: '100%' }}>


      {/* Row 1: KPIs */}
      <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
        {kpiData.map((kpi) => (
          <Col xs={24} sm={12} md={8} lg={8} key={kpi.title}>
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
          <ExportOpportunitiesCard />
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
          <div className="bg-white border border-gray-200/60 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Simulations</h3>
            </div>
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 w-16">
                      {activity.time}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'Running' ? 'bg-blue-500' :
                        activity.status === 'Success' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      {activity.details}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {activity.value}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-md ${
                      activity.status === 'Running' ? 'bg-blue-50 text-blue-700' :
                      activity.status === 'Success' ? 'bg-green-50 text-green-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
