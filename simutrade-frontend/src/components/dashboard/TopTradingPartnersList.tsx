import React from 'react';
import { Card, List, Typography } from 'antd';

const { Text } = Typography;

interface TradingPartnerData {
  name: string;
  value: number;
  flag: string;
}

interface TopTradingPartnersListProps {
  data: TradingPartnerData[];
}

const TopTradingPartnersList: React.FC<TopTradingPartnersListProps> = ({
  data,
}) => {
  return (
    <Card title="Top Trading Partners (Simulated)" style={{ height: '100%' }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Text style={{ fontSize: '1.5em' }}>{item.flag}</Text>}
              title={<Text>{item.name}</Text>}
              description={
                <div
                  style={{
                    width: '100%',
                    backgroundColor: '#e6e6e6',
                    borderRadius: '2px',
                    height: '8px',
                  }}
                >
                  <div
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: '#1890ff',
                      height: '8px',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              }
            />
            <Text strong style={{ marginLeft: '8px' }}>
              {item.value}%
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TopTradingPartnersList;
