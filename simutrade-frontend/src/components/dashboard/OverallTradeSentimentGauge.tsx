import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

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

  return (
    <Card
      title="Overall Trade Sentiment"
      style={{
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <div>
        <Text
          style={{
            fontSize: '2.5em',
            fontWeight: 'bold',
            color: color,
            lineHeight: '1.2',
          }}
        >
          {data.score.toFixed(2)}
        </Text>
        <Text
          strong
          style={{ color: color, fontSize: '1em', display: 'block' }}
        >
          {data.status}
        </Text>
      </div>

      <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div
          style={{
            width: '90%',
            height: '25px',
            margin: '10px auto',
            background: `linear-gradient(to right, #f5222d, #faad14, #52c41a)`,
            borderRadius: '5px',
            position: 'relative',
            border: '1px solid #d9d9d9',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: `${(data.score / 5) * 100}%`,
              top: '-8px',
              width: '4px',
              height: '41px',
              backgroundColor: '#333',
              transform: 'translateX(-50%)',
              borderRadius: '2px',
            }}
          ></div>
        </div>
        <Text type="secondary" style={{ display: 'block', fontSize: '0.8em' }}>
          [Sentiment Score: {data.score.toFixed(2)}/5.00]
        </Text>
      </div>
    </Card>
  );
};

export default OverallTradeSentimentGauge;
