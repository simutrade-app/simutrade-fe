import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from 'react-icons/io5';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      // Send message
      onSendMessage(message);

      // Clear message state immediately
      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-form">
      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about strategic trade opportunities..."
          disabled={loading}
          className="chat-textarea"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="send-button"
        >
          {loading ? (
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          ) : (
            <>
              <IoSend className="send-icon" />
              <span className="send-text">Send</span>
            </>
          )}
        </button>
      </div>
      <style>{`
        .chat-input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          width: 100%;
          position: relative;
        }
        .chat-textarea {
          flex: 1;
          border-radius: 20px;
          padding: 12px 16px;
          resize: none;
          border: 1px solid #e6e6e6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          font-size: 15px;
          transition: all 0.3s;
          line-height: 1.5;
          font-family: inherit;
          min-height: 44px;
          max-height: 120px;
          overflow-y: auto;
          background-color: #ffffff;
          word-wrap: break-word;
        }
        .chat-textarea:hover {
          border-color: #b7eb8f;
        }
        .chat-textarea:focus {
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
          outline: none;
        }
        .chat-textarea::placeholder {
          color: rgba(0, 0, 0, 0.35);
        }
        .send-button {
          height: 44px;
          min-width: 80px;
          border-radius: 22px;
          background-color: #52c41a;
          border: none;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          color: white;
          cursor: pointer;
          padding: 0 16px;
          flex-shrink: 0;
        }
        .send-button:hover:not(:disabled) {
          background-color: #73d13d;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
        }
        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #a8a8a8;
          box-shadow: none;
        }
        .send-icon {
          font-size: 16px;
          margin-right: 8px;
        }
        .send-text {
          font-weight: 500;
        }
        .chat-input-form {
          width: 100%;
        }
        .loading-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .dot {
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .chat-textarea {
            padding: 10px 14px;
            font-size: 14px;
            min-height: 40px;
          }
          .send-button {
            height: 40px;
            min-width: 70px;
            padding: 0 12px;
          }
          .send-text {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
