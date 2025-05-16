import React from 'react';
import { renderMarkdown } from '../../utils/markdownUtils';
import { FaUser, FaRobot, FaInfoCircle } from 'react-icons/fa';

interface ChatMessageProps {
  isUser: boolean;
  message: string;
  contextUsed?: string[];
  loading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  isUser,
  message,
  contextUsed,
  loading = false,
}) => {
  const [showSources, setShowSources] = React.useState(false);

  return (
    <div
      className={`message-container ${isUser ? 'user-message' : 'ai-message'}`}
    >
      {isUser ? (
        <>
          <div className="message-content user-content">
            <div className="message-bubble user-bubble">{message}</div>
          </div>
          <div className="avatar-container">
            <div className="avatar user-avatar">
              <FaUser />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="ai-avatar-container">
            <div className="avatar ai-avatar">
              <FaRobot />
            </div>
          </div>
          <div className="message-content ai-content">
            {loading ? (
              <div className="message-bubble ai-bubble loading-bubble">
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            ) : (
              <>
                <div className="message-bubble ai-bubble">
                  {renderMarkdown(message)}
                </div>
                {contextUsed && contextUsed.length > 0 && (
                  <div className="sources-section">
                    <div
                      className="sources-toggle"
                      onClick={() => setShowSources(!showSources)}
                    >
                      <FaInfoCircle className="info-icon" />
                      <span className="sources-text">
                        View {contextUsed.length} sources used
                      </span>
                    </div>

                    {showSources && (
                      <div className="sources-container">
                        {contextUsed.map((context, index) => (
                          <div key={index} className="source-item">
                            <span className="source-text">{context}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <style>{`
        .message-container {
          display: flex;
          margin-bottom: 28px;
          width: 100%;
        }
        .user-message {
          flex-direction: row-reverse;
        }
        .message-content {
          max-width: 80%;
        }
        .avatar-container, .ai-avatar-container {
          margin-top: 4px;
        }
        .avatar-container {
          margin-left: 12px;
        }
        .ai-avatar-container {
          margin-right: 12px;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }
        .user-avatar {
          background-color: #52c41a;
        }
        .ai-avatar {
          background-color: #52c41a;
        }
        .message-bubble {
          padding: 14px 20px;
          border-radius: 20px;
          overflow-wrap: break-word;
          width: 100%;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          line-height: 1.6;
          font-size: 15px;
        }
        .user-bubble {
          background-color: #52c41a;
          background-image: linear-gradient(135deg, #52c41a, #73d13d);
          border-top-right-radius: 4px;
          color: white;
        }
        .ai-bubble {
          background-color: #f5f5f5;
          border-top-left-radius: 4px;
          color: rgba(0, 0, 0, 0.85);
        }
        .loading-bubble {
          min-width: 60px;
          text-align: center;
        }
        .loading-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: #52c41a;
          border-radius: 50%;
          display: inline-block;
          animation: dot-pulse 1.5s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .sources-section {
          margin-top: 8px;
        }
        .sources-toggle {
          display: flex;
          align-items: center;
          color: #52c41a;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .sources-toggle:hover {
          background-color: rgba(82, 196, 26, 0.1);
        }
        .info-icon {
          margin-right: 8px;
          font-size: 14px;
        }
        .sources-text {
          margin-left: 8px;
          color: #52c41a;
          font-size: 14px;
          font-weight: 500;
        }
        .sources-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          margin-top: 6px;
          background-color: rgba(246, 255, 237, 0.5);
          border-radius: 8px;
        }
        .source-item {
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 6px;
          border: 1px solid #f0f0f0;
        }
        .source-text {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.65);
        }
        .message-bubble a {
          color: #52c41a;
          text-decoration: underline;
        }
        .message-bubble pre, .message-bubble code {
          background-color: #f9f9f9;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
        }
        .message-bubble pre {
          padding: 14px;
          overflow-x: auto;
          margin: 12px 0;
        }
        .message-bubble code {
          padding: 2px 5px;
        }
        
        @media (max-width: 768px) {
          .message-container {
            margin-bottom: 20px;
          }
          .message-content {
            max-width: 85%;
          }
          .message-bubble {
            padding: 12px 16px;
            font-size: 14px;
          }
          .avatar-container {
            margin-left: 8px;
          }
          .ai-avatar-container {
            margin-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;
