import React from 'react';
import { Typography, Badge, Space, Select } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface ChatHeaderProps {
  isTyping?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isTyping = false }) => {
  const languages = [
    { value: 'id', label: '🇮🇩 Bahasa Indonesia' },
    { value: 'en', label: '🇬🇧 English' },
    { value: 'zh', label: '🇨🇳 中文' },
    { value: 'ja', label: '🇯🇵 日本語' },
    { value: 'ar', label: '🇸🇦 العربية' },
  ];

  return (
    <div className="chat-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: '#f8f8f8',
      borderRadius: '8px 8px 0 0',
      borderBottom: '1px solid #e8e8e8',
      marginBottom: '16px'
    }}>
      <Space>
        <CommentOutlined style={{ fontSize: '24px', color: '#4CAF50' }} />
        <Title level={3} style={{ margin: 0 }}>AI Trade Mentor</Title>
        {isTyping ? (
          <Badge status="processing" text="Typing..." />
        ) : (
          <Badge status="success" text="Online" />
        )}
      </Space>
      
      <Select
        defaultValue="en"
        style={{ width: 180 }}
        onChange={(value) => console.log(`Language changed to: ${value}`)}
      >
        {languages.map(lang => (
          <Option key={lang.value} value={lang.value}>{lang.label}</Option>
        ))}
      </Select>
    </div>
  );
};

export default ChatHeader; 