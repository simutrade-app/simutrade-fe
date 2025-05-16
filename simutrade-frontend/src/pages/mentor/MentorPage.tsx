import React, { useState, useEffect, useRef } from 'react';
import { Layout, Spin, message as antMessage } from 'antd';
import { useChatHistory, useSendMessage } from '../../hooks/useMentor';
import ChatHeader from '../../components/mentor/ChatHeader';
import ChatWindow from '../../components/mentor/ChatWindow';
import MessageInput from '../../components/mentor/MessageInput';
import TemplateCarousel from '../../components/mentor/TemplateCarousel';

const { Content } = Layout;

const MentorPage: React.FC = () => {
  const [draftMessage, setDraftMessage] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  const {
    data: historyRes,
    isLoading: loadingHistory,
    isError: historyError,
  } = useChatHistory();

  // Send message mutation
  const sendMessageMutation = useSendMessage();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historyRes]);

  // Show error if history fetch fails
  useEffect(() => {
    if (historyError) {
      antMessage.error(
        'Failed to load chat history. Using sample data instead.'
      );
    }
  }, [historyError]);

  // Handler for sending messages
  const handleSend = () => {
    if (!draftMessage.trim()) return;

    sendMessageMutation.mutate(draftMessage, {
      onError: () => antMessage.error('Failed to send message'),
      onSuccess: () => setDraftMessage(''),
    });
  };

  // Get the first chat response from history or default to empty array
  const messages = historyRes?.data?.chatData?.[0]?.response || [];
  const isMessageLoading = sendMessageMutation.isPending;

  return (
    <div className="mentor-container" style={{ padding: '24px' }}>
      <div
        className="mentor-content"
        style={{ maxWidth: '1000px', margin: '0 auto' }}
      >
        <ChatHeader isTyping={isMessageLoading} />

        {loadingHistory ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <Spin size="large" tip="Loading conversations..." />
          </div>
        ) : (
          <ChatWindow messages={messages}>
            <div ref={scrollRef} />
          </ChatWindow>
        )}

        <TemplateCarousel
          onSelect={(template) => {
            setDraftMessage(template);
            sendMessageMutation.mutate(template, {
              onError: () =>
                antMessage.error('Failed to send template question'),
              onSuccess: () => setDraftMessage(''),
            });
          }}
        />

        <MessageInput
          value={draftMessage}
          onChange={(e) => setDraftMessage(e.target.value)}
          onSend={handleSend}
          loading={isMessageLoading}
        />
      </div>
    </div>
  );
};

export default MentorPage;
