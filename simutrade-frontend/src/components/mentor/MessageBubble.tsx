import React from 'react';
import { Avatar, Typography, Card, Space } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string;
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  type, 
  content,
  timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}) => {
  const isUser = type === 'user';
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px'
    }}>
      <Space align="start" style={{ maxWidth: '80%' }}>
        {!isUser && (
          <Avatar 
            icon={<RobotOutlined />} 
            style={{ backgroundColor: '#4CAF50' }} 
          />
        )}
        
        <div>
          <Card 
            style={{ 
              backgroundColor: isUser ? '#e6f7e6' : '#ffffff',
              borderColor: isUser ? '#c8e6c9' : '#e8e8e8',
              borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
          </Card>
          <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
            {timestamp}
          </Text>
        </div>
        
        {isUser && (
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }} 
          />
        )}
      </Space>
    </div>
  );
};

export default MessageBubble; 