import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatData } from '../../services/AIService';
import { FaCommentDots, FaArrowRight, FaDownload } from 'react-icons/fa';
import AIService from '../../services/AIService';

interface ChatDetailProps {
  chat: ChatData | null;
  loading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({
  chat,
  loading,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // For debugging purposes
  useEffect(() => {
    if (chat) {
      console.log('ChatDetail received chat:', chat);
      if (chat.chatHistory) {
        console.log('Chat history entries:', chat.chatHistory.length);
      }
    }
  }, [chat]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (chat) {
      // Use sessionId if available, otherwise fall back to _id
      const chatIdToUse = chat.sessionId || chat._id;

      if (chatIdToUse && !chatIdToUse.includes('placeholder')) {
        console.log('Downloading PDF for chat ID:', chatIdToUse);
        try {
          await AIService.createChatPDF(chatIdToUse);
        } catch (error) {
          console.error('Error downloading PDF:', error);
        }
      } else {
        console.warn('No valid chat ID found for PDF download');
      }
    }
  };

  // Always show empty state (New Question) by default
  if (!chat && !loading) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-content">
          <div className="chat-icon">
            <FaCommentDots />
          </div>
          <h3 className="empty-title">Chat with the AI Tutor</h3>
          <p className="empty-description">
            Ask anything or use the suggestions below
          </p>
          <div className="suggestions">
            <div
              className="suggestion-item"
              onClick={() =>
                onSendMessage('What are the major trade trends in 2023?')
              }
            >
              <div className="suggestion-text">
                What are the major trade trends in 2023?
              </div>
              <FaArrowRight className="suggestion-arrow" />
            </div>
            <div
              className="suggestion-item"
              onClick={() =>
                onSendMessage(
                  'How are supply chains being affected by recent geopolitical events?'
                )
              }
            >
              <div className="suggestion-text">
                How are supply chains being affected by recent geopolitical
                events?
              </div>
              <FaArrowRight className="suggestion-arrow" />
            </div>
            <div
              className="suggestion-item"
              onClick={() =>
                onSendMessage(
                  'What strategies are effective for entering the European market?'
                )
              }
            >
              <div className="suggestion-text">
                What strategies are effective for entering the European market?
              </div>
              <FaArrowRight className="suggestion-arrow" />
            </div>
          </div>
          <div className="chat-input-container-wrapper">
            <ChatInput onSendMessage={onSendMessage} loading={loading} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-detail-container">
      <div className="chat-header">
        <div className="chat-title-container">
          <FaCommentDots className="chat-title-icon" />
          <h2 className="chat-title">Chat with the AI Tutor</h2>
        </div>
        {chat &&
          ((chat._id && !chat._id.includes('placeholder')) ||
            (chat.sessionId && !chat.sessionId.includes('placeholder'))) && (
            <button
              className="download-pdf-button"
              onClick={handleDownloadPDF}
              title="Download as PDF"
            >
              <FaDownload className="download-icon" />
              <span className="download-text">PDF</span>
            </button>
          )}
      </div>
      <div className="chat-messages-container">
        {loading && !chat ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Loading conversation...</span>
          </div>
        ) : (
          <>
            {chat && (
              <div className="chat-messages">
                {/* First display the initial query and response (oldest) */}
                <ChatMessage isUser={true} message={chat.query} />
                {chat.response &&
                  chat.response.filter(response => response.text).map((response, index) => (
                    <ChatMessage
                      key={`main-${index}`}
                      isUser={false}
                      message={response.text || ''}
                      contextUsed={chat.context_used}
                    />
                  ))}

                {/* Then render chat history (newer messages) */}
                {chat.chatHistory && chat.chatHistory.length > 0 && (
                  <>
                    {chat.chatHistory.slice().map((historyItem, historyIndex) => (
                      <React.Fragment key={`history-${historyIndex}`}>
                        <ChatMessage
                          isUser={true}
                          message={historyItem.query}
                        />
                        {historyItem.response && historyItem.response.length > 0 &&
                          historyItem.response.map(
                            (response, responseIndex) => (
                              <ChatMessage
                                key={`history-${historyIndex}-response-${responseIndex}`}
                                isUser={false}
                                message={response.text || ''}
                                contextUsed={historyItem.context_used}
                              />
                            )
                          )}
                        {/* Show skeleton only for the last history item that has no response and we're loading */}
                        {loading && chat.chatHistory && historyIndex === chat.chatHistory.length - 1 && 
                         (!historyItem.response || historyItem.response.length === 0) && (
                          <ChatMessage isUser={false} message="" skeleton={true} />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="chat-input-wrapper">
        <ChatInput onSendMessage={onSendMessage} loading={loading} />
      </div>

      <style>{`
        .chat-detail-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.85);
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          background-color: #ffffff;
          z-index: 5;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-title-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chat-title-icon {
          color: #52c41a;
          font-size: 20px;
        }
        .chat-title {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .download-pdf-button {
          background-color: #f6ffed;
          border: 1px solid #b7eb8f;
          border-radius: 6px;
          color: #52c41a;
          display: flex;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .download-pdf-button:hover {
          background-color: #d9f7be;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .download-icon {
          margin-right: 6px;
          font-size: 14px;
        }
        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          padding-bottom: 80px;
          scroll-behavior: smooth;
          background-color: #f9f9f9;
        }
        .chat-messages {
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          gap: 20px;
          padding-bottom: 20px;
        }
        .empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 32px;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.85);
          background-image: linear-gradient(to bottom, #ffffff, #f9fafb);
          overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .empty-chat-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 600px;
          width: 100%;
          padding: 40px 20px;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .chat-icon {
          font-size: 40px;
          color: #52c41a;
          margin-bottom: 24px;
          background-color: #f6ffed;
          padding: 16px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(82, 196, 26, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
        }
        .empty-title {
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 16px;
          font-weight: 600;
          font-size: 24px;
        }
        .empty-description {
          color: rgba(0, 0, 0, 0.65);
          margin-bottom: 32px;
          font-size: 16px;
        }
        .suggestions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }
        .suggestion-item {
          padding: 14px 16px;
          background-color: #f6ffed;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s;
          border: 1px solid #b7eb8f;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .suggestion-item:hover {
          background-color: #d9f7be;
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
        }
        .suggestion-text {
          color: rgba(0, 0, 0, 0.85);
          font-size: 15px;
          font-weight: 500;
          line-height: 1.5;
          flex: 1;
        }
        .suggestion-arrow {
          color: #52c41a;
          font-size: 16px;
          flex-shrink: 0;
        }
        .chat-input-container-wrapper {
          width: 100%;
          max-width: 600px;
          margin-top: 16px;
          padding: 12px;
          background-color: #f9f9f9;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          color: rgba(0, 0, 0, 0.45);
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #52c41a;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .chat-input-wrapper {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          background-color: #ffffff;
          border-top: 1px solid #f0f0f0;
          z-index: 5;
          box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .chat-detail-container {
            height: 100%;
          }
          .chat-header {
            padding: 12px 16px;
          }
          .chat-title {
            font-size: 16px;
          }
          .chat-title-icon {
            font-size: 18px;
          }
          .download-text {
            display: none;
          }
          .download-pdf-button {
            padding: 6px 8px;
          }
          .download-icon {
            margin-right: 0;
          }
          .chat-messages-container {
            padding: 16px;
          }
          .chat-messages {
            gap: 16px;
            padding-bottom: 16px;
          }
          .suggestions {
            width: 100%;
          }
          .empty-chat {
            padding: 16px;
            overflow-y: auto;
          }
          .empty-chat-content {
            padding: 24px 16px;
          }
          .empty-title {
            font-size: 20px;
          }
          .empty-description {
            font-size: 14px;
            margin-bottom: 20px;
          }
          .suggestions {
            gap: 10px;
            margin-bottom: 20px;
          }
          .suggestion-item {
            padding: 12px 14px;
          }
          .suggestion-text {
            font-size: 14px;
          }
          .chat-input-wrapper {
            padding: 12px 16px;
          }
          .chat-input-container-wrapper {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatDetail;
