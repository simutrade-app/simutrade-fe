import React from 'react';
import { Empty } from 'antd';
import type { ChatResponse } from '../../services/AIService';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: ChatResponse[];
  children?: React.ReactNode;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, children }) => {
  return (
    <div
      className="chat-window"
      style={{
        height: '50vh',
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f0f2f5',
        borderRadius: '0 0 8px 8px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
        margin: '0 0 16px 0',
      }}
    >
      {messages.length > 0 ? (
        <div className="messages-container">
          <MessageBubble
            type="user"
            content="What are the major trade trends in 2023?"
          />

          {messages.map((msg, index) => (
            <MessageBubble
              key={`message-${index}`}
              type="ai"
              content={msg.text}
            />
          ))}
        </div>
      ) : (
        <Empty
          description="No messages yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: '80px' }}
        />
      )}
      {children}
    </div>
  );
};

export default ChatWindow;
