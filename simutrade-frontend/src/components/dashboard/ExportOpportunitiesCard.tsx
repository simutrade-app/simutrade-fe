import React from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import {
  GlobalOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface ExportOpportunity {
  id: number;
  country: string;
  product: string;
  potentialValue: string;
  growthRate: number;
  isFavorite: boolean;
  matchScore: number;
}

interface ExportOpportunitiesCardProps {
  opportunities?: ExportOpportunity[];
}

const defaultOpportunities: ExportOpportunity[] = [
  {
    id: 1,
    country: 'Germany',
    product: 'Electric Vehicles',
    potentialValue: '$2.4M',
    growthRate: 24,
    isFavorite: true,
    matchScore: 92,
  },
  {
    id: 2,
    country: 'Canada',
    product: 'Organic Food',
    potentialValue: '$1.8M',
    growthRate: 18,
    isFavorite: false,
    matchScore: 87,
  },
  {
    id: 3,
    country: 'Singapore',
    product: 'Medical Devices',
    potentialValue: '$3.2M',
    growthRate: 15,
    isFavorite: false,
    matchScore: 78,
  },
  {
    id: 4,
    country: 'Australia',
    product: 'Smart Home Tech',
    potentialValue: '$1.5M',
    growthRate: 12,
    isFavorite: false,
    matchScore: 69,
  },
];

const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    Germany: '🇩🇪',
    Canada: '🇨🇦',
    Singapore: '🇸🇬',
    Australia: '🇦🇺',
  };

  return flags[country] || '🌎';
};

const getMatchColor = (score: number): string => {
  if (score >= 90) return '#52c41a';
  if (score >= 80) return '#1890ff';
  if (score >= 70) return '#1890ff';
  return '#faad14';
};

const ExportOpportunitiesCard: React.FC<ExportOpportunitiesCardProps> = ({
  opportunities = defaultOpportunities,
}) => {
  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GlobalOutlined style={{ color: '#1890ff' }} />
          <span>Export Opportunities</span>
        </div>
      }
      extra={<Text style={{ color: '#1890ff' }}>View All →</Text>}
      style={{ height: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Electric Vehicles */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2px',
            }}
          >
            {getCountryFlag('Germany')}
            <div style={{ marginLeft: '10px' }}>
              <div
                style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
              >
                <Text strong>Electric</Text>
                <Text type="secondary">in</Text>
              </div>
              <div>
                <Text strong>Vehicles</Text>
                <Text type="secondary"> Germany</Text>
              </div>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <StarFilled style={{ color: '#faad14', fontSize: '18px' }} />
              <Button type="link" style={{ padding: '0', color: '#1890ff' }}>
                <ArrowRightOutlined /> Details
              </Button>
            </div>
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
          >
            <Text style={{ color: '#666' }}>${'2.4M'}</Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '10px',
              }}
            >
              <RiseOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text
                style={{
                  color: '#52c41a',
                  fontSize: '12px',
                  marginLeft: '3px',
                }}
              >
                +24%
              </Text>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Tag
                color="#52c41a"
                style={{
                  fontWeight: 'bold',
                  padding: '0 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                92% Match
              </Tag>
            </div>
          </div>
        </div>

        {/* Organic Food */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2px',
            }}
          >
            {getCountryFlag('Canada')}
            <div style={{ marginLeft: '10px' }}>
              <div
                style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
              >
                <Text strong>Organic</Text>
                <Text type="secondary">in</Text>
              </div>
              <div>
                <Text strong>Food</Text>
                <Text type="secondary"> Canada</Text>
              </div>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <StarOutlined style={{ color: '#d9d9d9', fontSize: '18px' }} />
              <Button type="link" style={{ padding: '0', color: '#1890ff' }}>
                <ArrowRightOutlined /> Details
              </Button>
            </div>
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
          >
            <Text style={{ color: '#666' }}>${'1.8M'}</Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '10px',
              }}
            >
              <RiseOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text
                style={{
                  color: '#52c41a',
                  fontSize: '12px',
                  marginLeft: '3px',
                }}
              >
                +18%
              </Text>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Tag
                color="#1890ff"
                style={{
                  fontWeight: 'bold',
                  padding: '0 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                87% Match
              </Tag>
            </div>
          </div>
        </div>

        {/* Medical Devices */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2px',
            }}
          >
            {getCountryFlag('Singapore')}
            <div style={{ marginLeft: '10px' }}>
              <div
                style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
              >
                <Text strong>Medical</Text>
                <Text type="secondary">in</Text>
              </div>
              <div>
                <Text strong>Devices</Text>
                <Text type="secondary"> Singapore</Text>
              </div>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <StarOutlined style={{ color: '#d9d9d9', fontSize: '18px' }} />
              <Button type="link" style={{ padding: '0', color: '#1890ff' }}>
                <ArrowRightOutlined /> Details
              </Button>
            </div>
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
          >
            <Text style={{ color: '#666' }}>${'3.2M'}</Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '10px',
              }}
            >
              <RiseOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text
                style={{
                  color: '#52c41a',
                  fontSize: '12px',
                  marginLeft: '3px',
                }}
              >
                +15%
              </Text>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Tag
                color="#1890ff"
                style={{
                  fontWeight: 'bold',
                  padding: '0 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                78% Match
              </Tag>
            </div>
          </div>
        </div>

        {/* Smart Home Tech */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2px',
            }}
          >
            {getCountryFlag('Australia')}
            <div style={{ marginLeft: '10px' }}>
              <div
                style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
              >
                <Text strong>Smart</Text>
                <Text type="secondary">in</Text>
              </div>
              <div>
                <Text strong>Home Tech</Text>
                <Text type="secondary"> Australia</Text>
              </div>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <StarOutlined style={{ color: '#d9d9d9', fontSize: '18px' }} />
              <Button type="link" style={{ padding: '0', color: '#1890ff' }}>
                <ArrowRightOutlined /> Details
              </Button>
            </div>
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
          >
            <Text style={{ color: '#666' }}>${'1.5M'}</Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '10px',
              }}
            >
              <RiseOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text
                style={{
                  color: '#52c41a',
                  fontSize: '12px',
                  marginLeft: '3px',
                }}
              >
                +12%
              </Text>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Tag
                color="#faad14"
                style={{
                  fontWeight: 'bold',
                  padding: '0 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                69% Match
              </Tag>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Button type="primary" ghost style={{ borderRadius: '4px' }}>
            Explore All Opportunities
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExportOpportunitiesCard;
