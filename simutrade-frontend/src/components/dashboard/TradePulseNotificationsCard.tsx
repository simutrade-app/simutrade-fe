import React from 'react';
import { Card, List, Typography, Button } from 'antd';

const { Text } = Typography;

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface TradePulseNotificationsCardProps {
  notifications: Notification[];
}

const TradePulseNotificationsCard: React.FC<
  TradePulseNotificationsCardProps
> = ({ notifications }) => {
  // In a real app, this would likely come from context or props
  const [displayCount, setDisplayCount] = React.useState(3);

  const handleShowMore = () => {
    setDisplayCount(notifications.length);
  };

  return (
    <Card title="Trade Pulse Notifications" style={{ height: '100%' }}>
      <List
        itemLayout="horizontal"
        dataSource={notifications.slice(0, displayCount)}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Text strong={!item.read} delete={item.read}>
                  {item.message}
                </Text>
              }
              description={item.time}
            />
            {/* Add actions like 'Mark as read' if needed */}
          </List.Item>
        )}
      />
      {notifications.length > displayCount && (
        <Button
          type="link"
          onClick={handleShowMore}
          style={{ paddingLeft: 0, marginTop: '10px' }}
        >
          Show All ({notifications.length})
        </Button>
      )}
      {notifications.length === 0 && (
        <Text type="secondary">No new notifications.</Text>
      )}
    </Card>
  );
};

export default TradePulseNotificationsCard;
