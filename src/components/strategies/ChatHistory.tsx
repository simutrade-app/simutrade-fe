import React from 'react';
import type { ChatData } from '../../services/AIService';
import { FaPlus } from 'react-icons/fa';

interface ChatHistoryProps {
  chats: ChatData[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  loading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  loading,
}) => {
  const formatDate = (chatId: string) => {
    // Extract timestamp from MongoDB ObjectId
    const timestamp = parseInt(chatId.substring(0, 8), 16) * 1000;
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="chat-history-container">
      <div className="chat-history-header">
        <h2 className="history-title">Chat History</h2>
      </div>
      <div className="new-chat-button-container">
        <button
          className="new-chat-button"
          onClick={onNewChat}
          disabled={loading}
        >
          <FaPlus className="plus-icon" />
          <span>New Question</span>
        </button>
      </div>

      {loading ? (
        <div className="chat-history-skeleton">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-item">
              <div className="skeleton-line"></div>
              <div className="skeleton-date"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="chat-list">
          {chats.length === 0 ? (
            <div className="empty-list">No conversations yet</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`chat-history-item ${selectedChatId === chat._id ? 'selected' : ''}`}
              >
                <div className="chat-preview">
                  <div className="chat-title">{chat.query}</div>
                  <div className="chat-meta">
                    <span className="chat-time">{formatDate(chat._id)}</span>
                    <span className="message-count">
                      {chat.response.length} messages
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .chat-history-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.85);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .chat-history-header {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          background-color: #ffffff;
          z-index: 5;
        }
        .history-title {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .new-chat-button-container {
          padding: 16px;
          text-align: center;
          border-bottom: 1px solid #f0f0f0;
          background-color: #ffffff;
          z-index: 5;
        }
        .new-chat-button {
          width: 100%;
          height: 40px;
          background-color: #52c41a;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(82, 196, 26, 0.2);
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          gap: 8px;
        }
        .new-chat-button:hover {
          background-color: #73d13d;
          transform: translateY(-1px);
        }
        .new-chat-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .plus-icon {
          font-size: 14px;
        }
        .chat-list {
          overflow-y: auto;
          flex: 1;
        }
        .empty-list {
          padding: 20px;
          text-align: center;
          color: rgba(0, 0, 0, 0.45);
        }
        .chat-history-item {
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid #f0f0f0;
          margin: 0;
          position: relative;
        }
        .chat-history-item:hover {
          background-color: #f6ffed;
        }
        .chat-history-item.selected {
          background-color: #f6ffed;
        }
        .chat-history-item.selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background-color: #52c41a;
        }
        .chat-preview {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .chat-title {
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          max-width: 100%;
          line-height: 1.4;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          font-weight: 500;
        }
        .chat-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }
        .chat-time, .message-count {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
        }
        .chat-history-skeleton {
          padding: 0 16px;
          overflow-y: auto;
          flex: 1;
        }
        .skeleton-item {
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
        }
        .skeleton-line {
          height: 16px;
          width: 90%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .skeleton-date {
          height: 12px;
          width: 80px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .chat-history-container {
            max-height: 100%;
            overflow: hidden;
          }
          .chat-list {
            max-height: calc(100% - 110px);
          }
          .chat-title {
            font-size: 13px;
          }
          .chat-time, .message-count {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatHistory;
