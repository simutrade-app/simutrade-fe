import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined, AudioOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  loading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  loading = false,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() !== '') {
        onSend();
      }
    }
  };

  return (
    <div
      className="message-input"
      style={{
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.03)',
        borderTop: '1px solid #e8e8e8',
      }}
    >
      <Space.Compact style={{ width: '100%' }}>
        <TextArea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{
            resize: 'none',
            borderRadius: '8px 0 0 8px',
          }}
          disabled={loading}
        />

        <Button
          icon={<AudioOutlined />}
          style={{ borderLeft: 0, borderRight: 0 }}
          disabled={loading}
          onClick={() => alert('Voice input feature coming soon!')}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={onSend}
          style={{
            backgroundColor: '#4CAF50',
            borderRadius: '0 8px 8px 0',
          }}
          disabled={value.trim() === '' || loading}
        />
      </Space.Compact>
    </div>
  );
};

export default MessageInput;
