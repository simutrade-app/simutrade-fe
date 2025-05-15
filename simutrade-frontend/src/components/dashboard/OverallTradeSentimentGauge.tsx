import React from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

interface SentimentData {
  score: number;
  status: string;
}

interface OverallTradeSentimentGaugeProps {
  data: SentimentData;
}

const OverallTradeSentimentGauge: React.FC<OverallTradeSentimentGaugeProps> = ({
  data,
}) => {
  const getSentimentColor = (score: number) => {
    if (score > 3.5) return '#52c41a'; // green
    if (score > 2) return '#faad14'; // orange
    return '#f5222d'; // red
  };

  const color = getSentimentColor(data.score);

  // Calculate needle position
  const needlePosition = (data.score / 5) * 100;

  return (
    <Card
      title="Overall Trade Sentiment"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        height: 'calc(100% - 48px)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <Title
          level={1}
          style={{
            fontSize: '3rem',
            margin: 0,
            color,
            lineHeight: '1',
          }}
        >
          {data.score.toFixed(1)}
        </Title>
        <Text
          strong
          style={{
            color,
            fontSize: '1.2rem',
            display: 'block',
            marginTop: '5px',
          }}
        >
          {data.status}
        </Text>
      </div>

      <div
        style={{
          width: '100%',
          marginTop: '15px',
          marginBottom: '15px',
        }}
      >
        {/* Gauge background */}
        <div
          style={{
            position: 'relative',
            height: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {/* Color segments */}
          <div style={{ display: 'flex', height: '100%' }}>
            <div
              style={{
                flex: 1,
                background: 'linear-gradient(90deg, #f5222d 0%, #faad14 100%)',
              }}
            />
            <div
              style={{
                flex: 1,
                background: 'linear-gradient(90deg, #faad14 0%, #52c41a 100%)',
              }}
            />
          </div>
        </div>

        {/* Needle pointer */}
        <div
          style={{
            position: 'relative',
            height: '24px',
            marginTop: '-12px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: `${needlePosition}%`,
              top: '0',
              width: '2px',
              height: '24px',
              backgroundColor: '#000',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${needlePosition}%`,
              top: '0',
              width: '12px',
              height: '12px',
              backgroundColor: '#000',
              borderRadius: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* Scale markers */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
          }}
        >
          <Text type="secondary">0</Text>
          <Text type="secondary">5.0</Text>
        </div>
      </div>

      {/* Sentiment score label */}
      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '0.9rem' }}>
          [Sentiment Score: {data.score.toFixed(2)}/5.00]
        </Text>
      </div>
    </Card>
  );
};

export default OverallTradeSentimentGauge;
