import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface KpiCardProps {
  title: string;
  value: string;
  percentageChange: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
}) => {
  return (
    <Card style={{ textAlign: 'center', height: '100%' }}>
      <span style={{ fontSize: '2em' }}>{icon}</span>
      <Title level={5} style={{ marginTop: '8px', marginBottom: '4px' }}>
        {title}
      </Title>
      <Text
        strong
        style={{ fontSize: '1.5em', display: 'block', marginBottom: '4px' }}
      >
        {value}
      </Text>
      <Text
        type={
          percentageChange.startsWith('+')
            ? 'success'
            : percentageChange.startsWith('-')
              ? 'danger'
              : 'secondary'
        }
      >
        {percentageChange}
      </Text>
    </Card>
  );
};

export default KpiCard;
