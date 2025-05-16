import React, { useState, useEffect, useRef } from 'react';
import AIService from '../../services/AIService';
import ChatDetail from '../../components/strategies/ChatDetail';
import ReactMarkdown from 'react-markdown';
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMicrophone,
  FaPaperPlane,
  FaLanguage,
  FaGlobe,
  FaBookmark,
  FaDownload,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaMap,
  FaRobot,
  FaGripLinesVertical,
  FaUser,
} from 'react-icons/fa';
import type { ChatData } from '../../services/AIService';

// Define interfaces for our chat data
interface ChatResponseItem {
  text?: string;
  _id?: string;
}

interface ChatItem {
  _id: string;
  title?: string;
  createdAt?: string;
  query: string;
  response?: ChatResponseItem[];
}

const SUGGESTED_QUESTIONS = [
  'What are the major trade trends in 2023?',
  'How are supply chains being affected by recent geopolitical events?',
  'What strategies are effective for entering the European market?',
  'What documentation is needed for exporting to Japan?',
  'How can I optimize my logistics costs for international shipping?',
  'What are common mistakes first-time exporters make?',
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

const StrategiesPage: React.FC = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]);
  const [isListening, setIsListening] = useState(false);
  const [mapZoom, setMapZoom] = useState(5); // Default zoom level for Google Maps
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);

  // Refs for resizing
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarResizeRef = useRef<HTMLDivElement>(null);
  const chatResizeRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(280); // Default sidebar width
  const [chatWidth, setChatWidth] = useState<number>(70); // Default chat area width percentage
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingChat, setIsResizingChat] = useState(false);

  // Map coordinates and parameters
  const [mapCenter] = useState({ lat: -2.42959445, lng: 115.14567645 });

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  // Focus input when chat changes
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading, selectedChat]);

  // Setup event listeners for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar && sidebarRef.current) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
          // Min/max sidebar width
          setSidebarWidth(newWidth);
        }
      }

      if (isResizingChat && !mapCollapsed) {
        const containerWidth = window.innerWidth;
        const percentage = (e.clientX / containerWidth) * 100;
        if (percentage >= 30 && percentage <= 85) {
          // Min/max chat width percentage
          setChatWidth(percentage);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingChat(false);
    };

    if (isResizingSidebar || isResizingChat) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingChat, mapCollapsed]);

  const loadChatHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await AIService.getAllChats();
      if (response.status === 'success' && response.data?.chatData) {
        const sortedChats = [...response.data.chatData].sort((a, b) => {
          const timestampA = parseInt(a._id.substring(0, 8), 16);
          const timestampB = parseInt(b._id.substring(0, 8), 16);
          return timestampB - timestampA;
        });
        setChats(sortedChats);
      } else {
        showNotification('Failed to load chat history', 'error');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      showNotification('Failed to load chat history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadChatDetail = async (chatId: string) => {
    setLoading(true);
    try {
      const response = await AIService.getChatById(chatId);
      if (response.status === 'success' && response.data) {
        setSelectedChat(response.data);
      } else {
        showNotification('Failed to load chat details', 'error');
      }
    } catch (error) {
      console.error('Error loading chat detail:', error);
      showNotification('Failed to load chat details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (query: string = message) => {
    if (!query.trim()) return;

    setMessage('');
    setLoading(true);

    try {
      const response = await AIService.createChat(query);
      if (response.status === 'success' && response.data) {
        setSelectedChat(response.data);
        setSelectedChatId(response.data._id);
        await loadChatHistory();
      } else {
        showNotification('Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    if (chatId !== selectedChatId) {
      setSelectedChatId(chatId);
      loadChatDetail(chatId);
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setSelectedChatId(null);
    if (collapsed) {
      setCollapsed(false);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMap = () => {
    console.log('Toggling map from', mapCollapsed, 'to', !mapCollapsed);
    setMapCollapsed(!mapCollapsed);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguages(!showLanguages);
  };

  const changeLanguage = (lang: (typeof LANGUAGES)[0]) => {
    setCurrentLanguage(lang);
    setShowLanguages(false);
    showNotification(`Language changed to ${lang.name}`, 'success');
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);

      if (!isListening) {
        showNotification('Listening...', 'info');
        // This is a placeholder for speech recognition API
        // In a real implementation, you would use the Web Speech API
        setTimeout(() => {
          setIsListening(false);
          showNotification('Voice input stopped', 'info');
        }, 3000);
      } else {
        showNotification('Voice input stopped', 'info');
      }
    } else {
      showNotification(
        'Speech recognition not supported in this browser',
        'error'
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const zoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20));
  };

  const zoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  const resetZoom = () => {
    setMapZoom(5);
  };

  const openFullscreenMap = () => {
    // Open map in a new tab or modal window
    window.open(
      `https://www.google.com/maps/@${mapCenter.lat},${mapCenter.lng},${mapZoom}z`,
      '_blank'
    );
  };

  // Build Google Maps URL with appropriate parameters
  const getMapUrl = () => {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15377478.99249724!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1631512402051!5m2!1sen!2sid&zoom=${mapZoom}`;
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    const bgColor =
      type === 'success'
        ? 'bg-green-500'
        : type === 'error'
          ? 'bg-red-500'
          : 'bg-blue-500';

    const notifDiv = document.createElement('div');
    notifDiv.className = `fixed top-5 right-5 p-3 ${bgColor} text-white rounded-lg shadow-lg z-50 opacity-0 transform -translate-y-5 transition-all duration-300`;
    notifDiv.textContent = message;
    document.body.appendChild(notifDiv);

    setTimeout(() => {
      notifDiv.classList.add('opacity-100', 'translate-y-0');
      notifDiv.classList.remove('opacity-0', '-translate-y-5');

      setTimeout(() => {
        notifDiv.classList.remove('opacity-100', 'translate-y-0');
        notifDiv.classList.add('opacity-0', '-translate-y-5');
        setTimeout(() => {
          document.body.removeChild(notifDiv);
        }, 300);
      }, 3000);
    }, 10);
  };

  // Render the message input area
  const renderMessageInput = () => {
    return (
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 border border-gray-300 rounded-md focus-within:border-green-500 transition-all duration-200">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about strategic trade opportunities..."
              className="w-full resize-none outline-none p-2.5 rounded-md text-gray-700 max-h-32"
              rows={1}
            />
          </div>
          <button
            onClick={toggleVoiceInput}
            title="Voice input"
            className={`p-2.5 rounded-md border transition-all duration-200 ${
              isListening
                ? 'bg-red-500 text-white border-red-500'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaMicrophone size={18} />
          </button>
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !message.trim()}
            title="Send message"
            className={`p-2.5 rounded-md border transition-all duration-200 ${
              message.trim()
                ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaPaperPlane size={18} />
            )}
          </button>
        </div>
      </div>
    );
  };

  // Component to render welcome/suggestion screen
  const renderWelcomeScreen = () => {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Chat with the AI Master Exporter
          </h3>
          <p className="text-gray-600 mb-4">
            Ask anything or use the suggestions below
          </p>

          <div className="grid grid-cols-1 gap-2 mt-4">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 flex items-center transition-all duration-200"
              >
                <span className="mr-2 text-green-500">→</span> {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add an effect to monitor mapCollapsed state to ensure it works
  useEffect(() => {
    // Force re-render when map is toggled
    if (mapCollapsed) {
      console.log('Map collapsed');
    } else {
      console.log('Map expanded');
    }
  }, [mapCollapsed]);

  // Add custom styling for the chat bubbles with user icon on the right
  // This is a new helper function to style messages correctly
  const renderChatBubbles = (chat: ChatItem) => {
    if (!chat.query || !chat.response) return null;

    return (
      <div className="space-y-4 p-4">
        {/* User message with icon on right */}
        <div className="flex justify-end items-start space-x-2">
          <div className="bg-green-500 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
            <p>{chat.query}</p>
          </div>
          <div className="bg-green-600 text-white rounded-full p-2 flex-shrink-0">
            <FaUser className="w-5 h-5" />
          </div>
        </div>

        {/* AI response with icon on left */}
        <div className="flex items-start space-x-2">
          <div className="bg-green-100 text-green-800 rounded-full p-2 flex-shrink-0">
            <FaRobot className="w-5 h-5" />
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none max-w-[80%] prose prose-sm">
            {Array.isArray(chat.response) && chat.response[0]?.text && (
              <div className="markdown-content">
                {chat.response[0].text.split('\n\n').map((paragraph, i) => (
                  <div key={i} className={i > 0 ? 'mt-3' : ''}>
                    <div className="prose prose-green prose-headings:text-green-700 prose-a:text-green-600">
                      <ReactMarkdown>
                        {
                          paragraph
                            .replace(/\*\*/g, '**') // Ensure double asterisks are preserved for bold
                            .replace(/\*/g, '*') // Ensure single asterisks are preserved for italic
                        }
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Fix the ChatDetail component type issue by creating a proper adapter
  // Convert our ChatItem to ChatData for the ChatDetail component
  const adaptChatForDetail = (chat: ChatItem): ChatData => {
    return {
      _id: chat._id,
      query: chat.query,
      response: chat.response || [],
      // Add any other required properties from ChatData
    } as ChatData;
  };

  return (
    <div className="h-full w-full bg-gray-50">
      {/* Main container */}
      <div className="flex h-[calc(100vh-68px)] max-h-[calc(100vh-68px)]">
        {/* Sidebar - Chat History */}
        <div
          ref={sidebarRef}
          style={{ width: collapsed ? 0 : `${sidebarWidth}px` }}
          className={`h-full bg-white border-r border-gray-200 shadow-sm transition-width duration-300 ease-in-out relative ${
            collapsed ? 'opacity-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <h2 className="text-lg font-semibold text-green-600">
                Chat History
              </h2>
              <button
                onClick={handleNewChat}
                className="flex items-center justify-center gap-1 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-1 px-2 rounded-md transition-all duration-200 text-sm"
              >
                <FaPlus size={12} />
                <span>New Question</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-2 bg-white">
              {!historyLoading ? (
                <div className="space-y-3">
                  {chats.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => handleSelectChat(chat._id)}
                      className={`cursor-pointer p-3 rounded-md border transition-all duration-200 ${
                        selectedChatId === chat._id
                          ? 'bg-green-50 border-green-200'
                          : 'hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <p className="font-medium text-gray-800 truncate">
                        {chat.query || chat.title || 'Untitled Chat'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.createdAt
                          ? new Date(chat.createdAt).toLocaleString()
                          : 'Invalid Date'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar resize handle */}
          {!collapsed && (
            <div
              ref={sidebarResizeRef}
              className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-green-500 hover:w-1"
              onMouseDown={() => setIsResizingSidebar(true)}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 shadow-md">
                <FaGripLinesVertical className="text-green-600" size={10} />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Toggle sidebar button */}
          <button
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full z-10 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200"
            onClick={toggleSidebar}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          {/* Content area with chat and map */}
          <div className="flex h-full">
            {/* Chat section */}
            <div
              style={{ width: mapCollapsed ? '100%' : `${chatWidth}%` }}
              className="flex-1 transition-all duration-300 relative"
            >
              <div className="flex flex-col h-full">
                {/* Chat header */}
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FaRobot className="text-green-600" size={18} />
                    </div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      AI Trading Assistant
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button
                        onClick={toggleLanguageDropdown}
                        className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700 transition-all duration-200"
                      >
                        <FaLanguage size={16} />
                        <span>{currentLanguage.name}</span>
                      </button>

                      {showLanguages && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Map toggle button - always visible for toggling map */}
                    <button
                      onClick={toggleMap}
                      className="p-2 border border-gray-300 hover:bg-gray-100 rounded-md text-gray-700 transition-all duration-200"
                      title={mapCollapsed ? 'Show map' : 'Hide map'}
                    >
                      <FaMap size={16} />
                    </button>

                    <button
                      className="p-2 border border-gray-300 hover:bg-gray-100 rounded-md text-gray-700 transition-all duration-200"
                      title="Download chat history"
                    >
                      <FaDownload size={16} />
                    </button>

                    <button
                      className="p-2 border border-gray-300 hover:bg-gray-100 rounded-md text-gray-700 transition-all duration-200"
                      title="Save as favorite"
                    >
                      <FaBookmark size={16} />
                    </button>
                  </div>
                </div>

                {/* Chat area with no gap at top */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto bg-gray-50"
                >
                  {selectedChat ? (
                    selectedChat.response ? (
                      renderChatBubbles(selectedChat)
                    ) : (
                      <ChatDetail
                        chat={adaptChatForDetail(selectedChat)}
                        loading={loading}
                        onSendMessage={handleSendMessage}
                      />
                    )
                  ) : (
                    renderWelcomeScreen()
                  )}
                </div>

                {/* Input area - show for all states, including when a chat is selected */}
                {renderMessageInput()}
              </div>

              {/* Chat resize handle - only visible when map is shown */}
              {!mapCollapsed && (
                <div
                  ref={chatResizeRef}
                  className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-green-500 hover:w-1"
                  onMouseDown={() => setIsResizingChat(true)}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-100 rounded-full p-1 shadow-md">
                    <FaGripLinesVertical className="text-green-600" size={10} />
                  </div>
                </div>
              )}
            </div>

            {/* Map section */}
            <div
              style={{ width: mapCollapsed ? '0%' : `${100 - chatWidth}%` }}
              className={`hidden lg:flex border-l border-gray-200 transition-all duration-300 ${
                mapCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              <div className="flex flex-col h-full w-full">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-1.5 rounded-full mr-2">
                      <FaGlobe className="text-green-600" size={14} />
                    </div>
                    <h2 className="font-medium text-gray-800">Strategy Map</h2>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={zoomIn}
                      title="Zoom in"
                      className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      <FaSearchPlus size={14} />
                    </button>
                    <button
                      onClick={zoomOut}
                      title="Zoom out"
                      className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      <FaSearchMinus size={14} />
                    </button>
                    <button
                      onClick={resetZoom}
                      title="Reset zoom"
                      className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      <span className="text-xs font-medium">1x</span>
                    </button>
                    <button
                      onClick={toggleMap}
                      title="Collapse map"
                      className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                      aria-label="Collapse map"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <iframe
                    ref={mapRef}
                    src={getMapUrl()}
                    className="w-full h-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                    title="Strategy Map"
                  />
                  <button
                    onClick={openFullscreenMap}
                    className="absolute top-2 left-2 bg-white border border-gray-300 px-2 py-1 text-sm rounded flex items-center gap-1 hover:bg-gray-100 transition-all duration-200"
                    aria-label="View larger map"
                  >
                    <FaExpand size={12} /> View larger map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map toggle button for mobile */}
      <button
        aria-label="Toggle map view"
        title="Toggle map view"
        className="fixed right-5 bottom-5 lg:hidden border border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30 transition-all duration-200"
        onClick={toggleMap}
      >
        {mapCollapsed ? <FaMap /> : <FaChevronRight />}
      </button>

      {/* Mobile Map Overlay */}
      {!mapCollapsed && (
        <div className="fixed inset-0 bg-white z-20 lg:hidden">
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 rounded-full mr-2">
                  <FaGlobe className="text-green-600" size={14} />
                </div>
                <h2 className="font-medium text-gray-800">Strategy Map</h2>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={zoomIn}
                  title="Zoom in"
                  className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <FaSearchPlus size={14} />
                </button>
                <button
                  onClick={zoomOut}
                  title="Zoom out"
                  className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <FaSearchMinus size={14} />
                </button>
                <button
                  onClick={resetZoom}
                  title="Reset zoom"
                  className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <span className="text-xs font-medium">1x</span>
                </button>
                <button
                  onClick={toggleMap}
                  title="Close map"
                  className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  aria-label="Close map"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <iframe
                src={getMapUrl()}
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                title="Strategy Map"
              />
              <button
                onClick={openFullscreenMap}
                className="absolute top-2 left-2 bg-white border border-gray-300 px-2 py-1 text-sm rounded flex items-center gap-1 hover:bg-gray-100 transition-all duration-200"
                aria-label="View larger map"
              >
                <FaExpand size={12} /> View larger map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategiesPage;
