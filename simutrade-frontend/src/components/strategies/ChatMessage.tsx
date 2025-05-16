import React from 'react';
import { renderMarkdown } from '../../utils/markdownUtils';
import { FaUser, FaRobot, FaInfoCircle } from 'react-icons/fa';

interface ChatMessageProps {
  isUser: boolean;
  message: string;
  contextUsed?: string[];
  loading?: boolean;
  skeleton?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  isUser,
  message,
  contextUsed,
  loading = false,
  skeleton = false,
}) => {
  const [showSources, setShowSources] = React.useState(false);

  // Common styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginBottom: '28px',
    display: 'flex',
    alignItems: 'flex-start',
  };

  const avatarStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52c41a',
    color: 'white',
    fontSize: '18px',
    flexShrink: 0,
  };

  const bubbleStyle: React.CSSProperties = {
    borderRadius: '20px',
    padding: '14px 20px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
    lineHeight: '1.6',
    fontSize: '15px',
    maxWidth: '80%',
  };

  // User message (with right-aligned avatar)
  if (isUser) {
    return (
      <div
        style={{
          ...containerStyle,
          flexDirection: 'row-reverse',
        }}
      >
        <div
          style={{
            ...avatarStyle,
            marginLeft: '12px',
          }}
        >
          <FaUser />
        </div>
        <div
          style={{
            ...bubbleStyle,
            backgroundColor: '#52c41a',
            backgroundImage: 'linear-gradient(135deg, #52c41a, #73d13d)',
            color: 'white',
            borderTopRightRadius: '4px',
          }}
        >
          {message}
        </div>
      </div>
    );
  }

  // AI message (with left-aligned avatar)
  return (
    <div style={containerStyle}>
      <div
        style={{
          ...avatarStyle,
          marginRight: '12px',
        }}
      >
        <FaRobot />
      </div>
      <div style={{ maxWidth: '80%' }}>
        {loading ? (
          <div
            style={{
              ...bubbleStyle,
              backgroundColor: '#f5f5f5',
              borderTopLeftRadius: '4px',
              minWidth: '60px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        ) : skeleton ? (
          <div
            style={{
              ...bubbleStyle,
              backgroundColor: '#f5f5f5',
              borderTopLeftRadius: '4px',
              minHeight: '100px',
            }}
          >
            <div className="skeleton-line" style={{ width: '85%' }}></div>
            <div className="skeleton-line" style={{ width: '65%' }}></div>
            <div className="skeleton-line" style={{ width: '90%' }}></div>
            <div className="skeleton-line" style={{ width: '40%' }}></div>
          </div>
        ) : (
          <>
            <div
              style={{
                ...bubbleStyle,
                backgroundColor: '#f5f5f5',
                borderTopLeftRadius: '4px',
                color: 'rgba(0, 0, 0, 0.85)',
              }}
            >
              {renderMarkdown(message)}
            </div>

            {contextUsed && contextUsed.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div
                  onClick={() => setShowSources(!showSources)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#52c41a',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <FaInfoCircle
                    style={{ marginRight: '8px', fontSize: '14px' }}
                  />
                  <span
                    style={{
                      marginLeft: '8px',
                      color: '#52c41a',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    View {contextUsed.length} sources used
                  </span>
                </div>

                {showSources && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '10px',
                      marginTop: '6px',
                      backgroundColor: 'rgba(246, 255, 237, 0.5)',
                      borderRadius: '8px',
                    }}
                  >
                    {contextUsed.map((context, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '10px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '6px',
                          border: '1px solid #f0f0f0',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '13px',
                            lineHeight: '1.5',
                            color: 'rgba(0, 0, 0, 0.65)',
                          }}
                        >
                          {context}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
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
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .skeleton-line {
          height: 16px;
          margin-bottom: 10px;
          background: linear-gradient(90deg, #eee 30%, #f9f9f9 50%, #eee 70%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;
