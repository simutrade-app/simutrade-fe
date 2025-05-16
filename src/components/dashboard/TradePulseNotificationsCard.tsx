import React from 'react';
import {
  Card,
  List,
  Typography,
  Button,
  Badge,
  Tag,
  Tooltip,
  Divider,
} from 'antd';
import {
  BellOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'event'; // Added type for different notification styles
  category?: string; // e.g., "Tariff Changes", "Logistics", "Events"
}

interface TradePulseNotificationsCardProps {
  notifications: Notification[];
}

const getNotificationIcon = (notification: Notification) => {
  if (!notification.type) {
    return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
  }

  switch (notification.type) {
    case 'warning':
      return <WarningOutlined style={{ color: '#faad14' }} />;
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'event':
      return <CalendarOutlined style={{ color: '#722ed1' }} />;
    case 'info':
    default:
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
  }
};

const getNotificationColor = (notification: Notification) => {
  if (!notification.type) return '#1890ff';

  switch (notification.type) {
    case 'warning':
      return '#faad14';
    case 'success':
      return '#52c41a';
    case 'event':
      return '#722ed1';
    case 'info':
    default:
      return '#1890ff';
  }
};

const TradePulseNotificationsCard: React.FC<
  TradePulseNotificationsCardProps
> = ({ notifications }) => {
  // Mock notifications with proper types
  const enhancedNotifications = [
    {
      id: 1,
      message: 'New import tariff changes for electronics in the EU.',
      time: '2h ago',
      read: false,
      type: 'info',
      category: 'Tariff Changes',
    },
    {
      id: 2,
      message: 'Port congestion reported in Shanghai, expect delays.',
      time: '5h ago',
      read: false,
      type: 'warning',
      category: 'Logistics',
    },
    {
      id: 3,
      message: 'Webinar: "Navigating USMCA 2.0" next Tuesday.',
      time: '1 day ago',
      read: true,
      type: 'event',
      category: 'Events',
    },
  ];

  // In a real app, this would likely come from context or props
  const [displayCount, setDisplayCount] = React.useState(3);
  const [notificationState, setNotificationState] = React.useState(
    enhancedNotifications
  );

  const handleShowMore = () => {
    setDisplayCount(notifications.length);
  };

  const handleMarkAsRead = (id: number) => {
    setNotificationState((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotificationState((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notificationState.filter(
    (notification) => !notification.read
  ).length;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellOutlined style={{ color: '#1890ff' }} />
          <span>Trade Pulse Notifications</span>
        </div>
      }
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge count={2} size="small">
            <Button
              type="text"
              size="small"
              style={{ color: '#ff4d4f', padding: '0', marginRight: '8px' }}
            >
              Mark all read
            </Button>
          </Badge>
          <Text style={{ color: '#1890ff' }}>View All →</Text>
        </div>
      }
      style={{ height: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <div>
        {/* First notification */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div
              style={{
                backgroundColor: '#e6f7ff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <InfoCircleOutlined
                style={{ color: '#1890ff', fontSize: '18px' }}
              />
            </div>

            <div style={{ width: '100%' }}>
              <Tag
                color="#1890ff"
                style={{ borderRadius: '12px', marginBottom: '4px' }}
              >
                Tariff Changes
              </Tag>
              <div>
                <Text strong>
                  New import tariff changes for electronics in the EU.
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                }}
              >
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  2h ago
                </Text>
                <Button
                  type="link"
                  size="small"
                  style={{ padding: '0', fontSize: '12px' }}
                >
                  Mark as read
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Second notification */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div
              style={{
                backgroundColor: '#fff7e6',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <WarningOutlined style={{ color: '#faad14', fontSize: '18px' }} />
            </div>

            <div style={{ width: '100%' }}>
              <Tag
                color="#faad14"
                style={{ borderRadius: '12px', marginBottom: '4px' }}
              >
                Logistics
              </Tag>
              <div>
                <Text strong>
                  Port congestion reported in Shanghai, expect delays.
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                }}
              >
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  5h ago
                </Text>
                <Button
                  type="link"
                  size="small"
                  style={{ padding: '0', fontSize: '12px' }}
                >
                  Mark as read
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Third notification */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div
              style={{
                backgroundColor: '#f9f0ff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarOutlined
                style={{ color: '#722ed1', fontSize: '18px' }}
              />
            </div>

            <div style={{ width: '100%' }}>
              <Tag
                color="#722ed1"
                style={{ borderRadius: '12px', marginBottom: '4px' }}
              >
                Events
              </Tag>
              <div>
                <Text style={{ opacity: 0.7 }}>
                  Webinar: "Navigating USMCA 2.0" next Tuesday.
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                }}
              >
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  1 day ago
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ textAlign: 'center', color: '#1890ff', marginTop: '30px' }}
        >
          <a href="#" style={{ color: '#1890ff' }}>
            Show All (4)
          </a>
        </div>
      </div>
    </Card>
  );
};

export default TradePulseNotificationsCard;
