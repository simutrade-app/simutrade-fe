import React, { useState, useEffect, useRef } from 'react';
import AIService from '../../services/AIService';
import type {
  TradeOpportunity,
  ChatData,
  ChatResponse,
} from '../../services/AIService';
import ChatDetail from '../../components/strategies/ChatDetail';
import '../../styles/opportunity-map.css';
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
  FaInfoCircle,
} from 'react-icons/fa';

// Import the ApiChatData interface we need
interface ApiChatData {
  _id: string;
  query: string;
  response: ChatResponse[];
  context_used?: string[];
  createdTime?: string;
}

// Define interfaces for our chat data
interface ChatResponseItem {
  text?: string;
  _id?: string;
  videoMetadata?: Record<string, unknown>;
  thought?: Record<string, unknown>;
  inlineData?: Record<string, unknown>;
  codeExecutionResult?: Record<string, unknown>;
  executableCode?: Record<string, unknown>;
  fileData?: Record<string, unknown>;
  functionCall?: Record<string, unknown>;
  functionResponse?: Record<string, unknown>;
  opportunities?: TradeOpportunity[];
}

interface ChatItem {
  _id: string;
  title?: string;
  createdAt?: string;
  query: string;
  response?: ChatResponseItem[];
  chatHistory?: ChatItem[]; // Chat history items - recursive definition
  sessionId?: string; // Session ID for the chat
  context_used?: string[]; // Context used for grounding responses
}

// Define the API response structure for chat session
/* These interfaces might be removed since we now use types from AIService,
 * but keeping them for reference until the migration is complete
 */

const SUGGESTED_QUESTIONS = [
  'What are the top trade opportunities in Southeast Asia in 2025?',
  'Which countries offer the best opportunities for agricultural exports?',
  'What are the most promising sectors for trade with China?',
  'Where are the growing opportunities for renewable energy investments?',
  'What are the best countries for exporting automotive parts?',
  'Identify emerging market opportunities in South America',
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
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<TradeOpportunity | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
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
  const [mapCenter, setMapCenter] = useState({
    lat: -2.42959445,
    lng: 115.14567645,
  });

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
      console.log('Response from getAllChats:', response);

      if (response.status === 'success' && response.data?.chatData) {
        const sortedChats = [...response.data.chatData].sort((a, b) => {
          // Try to use createdAt first if available
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          // Fall back to _id as a secondary sort method
          const timestampA = parseInt(a._id.substring(0, 8), 16);
          const timestampB = parseInt(b._id.substring(0, 8), 16);
          return timestampB - timestampA;
        });

        console.log('Sorted chats for display:', sortedChats);
        setChats(sortedChats);
      } else {
        console.error('No chat data found in response:', response);
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
      console.log('getChatById response:', response);

      if (response.status === 'success' && response.data) {
        // Check if the response matches our ChatSessionResponse type
        const chatData = response.data;

        // For debugging purposes
        console.log('Chat data received:', chatData);
        if (chatData.chatHistory) {
          console.log(
            'Chat history directly in response:',
            chatData.chatHistory.length
          );
        }

        // Check if this is a session with chatData array
        if (
          'chatData' in chatData &&
          Array.isArray(chatData.chatData) &&
          chatData.chatData.length > 0
        ) {
          console.log(
            'Processing response as a chat session with',
            chatData.chatData.length,
            'messages'
          );

          // Use the first message as the main chat
          const mainChat = chatData.chatData[0];
          // Use the rest as chat history
          const chatHistory = chatData.chatData.slice(1);

          // Combine them into our expected format
          const formattedChat: ChatItem = {
            _id: chatData._id,
            query: mainChat.query,
            response: mainChat.response || [],
            context_used: mainChat.context_used || [],
            createdAt: mainChat.createdTime,
            sessionId: chatId, // Store the original session ID
            chatHistory: chatHistory.map((chat: ApiChatData) => ({
              _id:
                chat._id ||
                `history-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              query: chat.query,
              response: chat.response || [],
              context_used: chat.context_used || [],
              createdAt: chat.createdTime,
            })),
          };

          console.log('Formatted chat with history:', formattedChat);
          console.log(
            'History items in formattedChat:',
            formattedChat.chatHistory?.length || 0
          );

          setSelectedChat(formattedChat);
        }
        // If it has a query and response fields directly, it's probably a single chat
        else if (chatData.query) {
          console.log('Processing response as a single chat');
          console.log(
            'Chat history in single chat:',
            chatData.chatHistory?.length || 0
          );
          setSelectedChat(chatData as ChatItem);
        }
        // If we can't determine the format, just use as is
        else {
          console.warn('Unknown response format, using as-is');
          setSelectedChat(response.data as unknown as ChatItem);
        }
      } else {
        console.error('Failed to load chat details:', response);
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

    // Create a temporary chat with skeleton loading state
    if (selectedChat) {
      // Update existing chat with pending message
      const updatedChat = {
        ...selectedChat,
        // Save current chat state in history
        chatHistory: [
          ...(selectedChat.chatHistory || []),
          // Only add the current chat to history if it has responses
          // This prevents adding empty skeleton messages to history
          ...(selectedChat.response &&
          selectedChat.response.length > 0 &&
          selectedChat.response[0].text
            ? [
                {
                  _id: selectedChat._id,
                  query: selectedChat.query,
                  response: selectedChat.response || [],
                  context_used: selectedChat.context_used || [],
                },
              ]
            : []),
        ],
        // Update the main query and show skeleton response
        query,
        response: [{ text: '', _id: `temp-skeleton-${Date.now()}` }],
      };
      setSelectedChat(updatedChat);
    } else {
      // Create a new chat with skeleton loading
      const tempChat = {
        _id: `temp-${Date.now()}`,
        query,
        response: [{ text: '', _id: `temp-skeleton-${Date.now()}` }],
      };
      setSelectedChat(tempChat as ChatItem);
    }

    try {
      let response;
      console.log(
        'Sending message:',
        query,
        selectedChatId ? `to existing chat ${selectedChatId}` : 'as new chat'
      );

      if (selectedChatId) {
        // For existing chats, make sure we're using the session ID
        let chatIdToUse = selectedChatId;

        // Check if this is a chat with a sessionId property
        if (selectedChat && selectedChat.sessionId) {
          // Use the session ID instead of the chat ID
          chatIdToUse = selectedChat.sessionId;
          console.log(
            `Using session ID ${chatIdToUse} instead of chat ID ${selectedChatId}`
          );
        }

        // Update existing chat with the appropriate ID
        response = await AIService.updateChat(chatIdToUse, query);
      } else {
        // Create new chat
        response = await AIService.createChat(query);
      }

      console.log('Chat API response:', response);

      if (response.status === 'success' && response.data) {
        // Determine the ID to use for subsequent operations
        // For existing chats, continue using the selectedChatId (which might be a sessionId)
        // For new chats, use the _id from the response
        const chatIdToUse = selectedChatId || response.data._id;

        // Update selectedChatId if needed
        if (!selectedChatId && response.data._id) {
          console.log('Setting selected chat ID to:', response.data._id);
          setSelectedChatId(response.data._id as string);
        }

        // Reload chat history first to ensure we have the latest data
        await loadChatHistory();

        // Then load the updated chat detail
        if (chatIdToUse) {
          console.log('Loading chat detail with ID:', chatIdToUse);
          await loadChatDetail(chatIdToUse as string);
        } else {
          console.warn('No chatId available for loadChatDetail');
          setSelectedChat(response.data as unknown as ChatItem);
        }
      } else {
        console.error('Failed response from chat API:', response);
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

  // Update map with opportunities when selected chat changes
  useEffect(() => {
    if (selectedChat?.response && selectedChat.response.length > 0) {
      const chatResponse = selectedChat.response[0];

      if (
        chatResponse?.opportunities &&
        chatResponse.opportunities.length > 0
      ) {
        console.log(
          'Found opportunities in chat response:',
          chatResponse.opportunities
        );
        setOpportunities(chatResponse.opportunities);

        // If there are opportunities, center map on first one
        if (chatResponse.opportunities.length > 0) {
          const firstOpp = chatResponse.opportunities[0];
          setMapCenter({ lat: firstOpp.lat, lng: firstOpp.lng });

          // Show map if it's currently collapsed
          if (mapCollapsed) {
            setMapCollapsed(false);
          }
        }
      } else if (chatResponse?.text) {
        // If no opportunities in response, but we have text, try to extract opportunities
        console.log(
          'No opportunities found, trying to extract from response text'
        );
        setMapLoading(true);

        AIService.extractOpportunities(chatResponse.text)
          .then((extractedOpportunities) => {
            if (extractedOpportunities.length > 0) {
              console.log('Extracted opportunities:', extractedOpportunities);
              setOpportunities(extractedOpportunities);

              // Center map on first opportunity
              const firstOpp = extractedOpportunities[0];
              setMapCenter({ lat: firstOpp.lat, lng: firstOpp.lng });

              // Show map if it's currently collapsed
              if (mapCollapsed) {
                setMapCollapsed(false);
              }
            } else {
              console.log('No opportunities extracted from response');
              setOpportunities([]);
            }
            setMapLoading(false);
          })
          .catch((error) => {
            console.error('Error extracting opportunities:', error);
            setMapLoading(false);
            setOpportunities([]);
          });
      } else {
        setOpportunities([]);
      }
    } else {
      setOpportunities([]);
    }
  }, [selectedChat, mapCollapsed]);

  // Build URL for Google Maps with opportunity markers
  const getMapUrl = () => {
    // If we have opportunities, we'll use a different approach to show them
    if (opportunities.length > 0) {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15377478.99249724!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1631512402051!5m2!1sen!2sid&zoom=${mapZoom}`;
    } else {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15377478.99249724!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1631512402051!5m2!1sen!2sid&zoom=${mapZoom}`;
    }
  };

  // Function to handle opportunity click
  const handleOpportunityClick = (opportunity: TradeOpportunity) => {
    setSelectedOpportunity(opportunity);
    setMapCenter({ lat: opportunity.lat, lng: opportunity.lng });
  };

  // Function to close opportunity detail modal
  const closeOpportunityDetail = () => {
    setSelectedOpportunity(null);
  };

  // Render opportunity pins on map
  const renderOpportunityPins = () => {
    return opportunities.map((opp, index) => (
      <div
        key={`opp-${index}`}
        className={`opportunity-pin ${selectedOpportunity === opp ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          // Simple calculation to position pins, in a real app you'd use proper map projection
          left: `${((opp.lng + 180) / 360) * 100}%`,
          top: `${((90 - opp.lat) / 180) * 100}%`,
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          zIndex: selectedOpportunity === opp ? 10 : 1,
        }}
        onClick={() => handleOpportunityClick(opp)}
        title={opp.opportunity}
      >
        <div
          className="pin"
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: getRiskColor(opp.riskLevel || 'medium'),
            border: '2px solid white',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          {selectedOpportunity === opp && (
            <div
              className="pulse"
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: getRiskColor(opp.riskLevel || 'medium', 0.2),
                top: '-14px',
                left: '-14px',
                animation: 'pulse 1.5s infinite',
              }}
            ></div>
          )}
        </div>
      </div>
    ));
  };

  // Helper function to get color based on risk level
  const getRiskColor = (riskLevel: string, alpha = 1) => {
    const colors = {
      low: `rgba(76, 175, 80, ${alpha})`,
      medium: `rgba(255, 152, 0, ${alpha})`,
      high: `rgba(244, 67, 54, ${alpha})`,
    };
    return colors[riskLevel as keyof typeof colors] || colors.medium;
  };

  // Render the map section with pins and overlays
  const renderMap = () => {
    return (
      <div
        className={`map-container relative ${
          mapCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'
        }`}
        style={{ height: '100%', width: '100%', position: 'relative' }}
      >
        {mapLoading && (
          <div className="map-loading">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-700">
              Analyzing opportunities...
            </span>
          </div>
        )}

        {/* Base Google Maps iframe */}
        <iframe
          ref={mapRef}
          src={getMapUrl()}
          className="w-full h-full border-0"
          loading="lazy"
          title="Strategy Map"
        ></iframe>

        {/* Overlay with opportunity pins */}
        <div
          className="opportunity-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none', // Allow clicks to pass through to map
          }}
        >
          <div
            className="pins-container"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'auto', // Enable clicks on pins
            }}
          >
            {opportunities.length > 0 ? renderOpportunityPins() : null}
          </div>
        </div>

        {/* Opportunity detail modal */}
        {selectedOpportunity && (
          <div className="opportunity-detail">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">
                {selectedOpportunity.opportunity}
              </h3>
              <button
                onClick={closeOpportunityDetail}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="opp-location mb-2 text-sm text-gray-600">
              <strong>Location:</strong> {selectedOpportunity.country}
              {selectedOpportunity.city ? `, ${selectedOpportunity.city}` : ''}
            </div>

            <div className="opp-sector mb-2 text-sm">
              <span
                className="inline-block px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  color: 'rgb(25, 118, 210)',
                }}
              >
                {selectedOpportunity.sector}
              </span>
            </div>

            <div className="opp-details my-3 text-sm text-gray-700">
              {selectedOpportunity.details}
            </div>

            <div className="opp-meta flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              {selectedOpportunity.potentialValue && (
                <div className="value text-xs">
                  <span className="text-gray-500">Potential value:</span>
                  <span className="ml-1 font-medium">
                    {selectedOpportunity.potentialValue}
                  </span>
                </div>
              )}

              <div className="risk text-xs flex items-center">
                <span className="text-gray-500 mr-1">Risk level:</span>
                <span
                  className="inline-block px-2 py-1 rounded-full text-white text-xs"
                  style={{
                    backgroundColor: getRiskColor(
                      selectedOpportunity.riskLevel || 'medium'
                    ),
                  }}
                >
                  {selectedOpportunity.riskLevel || 'Medium'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Map controls */}
        <div className="map-controls">
          <button
            onClick={zoomIn}
            className="text-gray-700 hover:bg-gray-100"
            title="Zoom in"
          >
            <FaSearchPlus size={16} />
          </button>
          <button
            onClick={zoomOut}
            className="text-gray-700 hover:bg-gray-100"
            title="Zoom out"
          >
            <FaSearchMinus size={16} />
          </button>
          <button
            onClick={resetZoom}
            className="text-gray-700 hover:bg-gray-100"
            title="Reset zoom"
          >
            <FaGlobe size={16} />
          </button>
          <button
            onClick={openFullscreenMap}
            className="text-gray-700 hover:bg-gray-100"
            title="View larger map"
          >
            <FaExpand size={16} />
          </button>
        </div>

        {/* Map legend */}
        {opportunities.length > 0 && (
          <div className="map-legend">
            <div className="text-sm font-medium mb-2 flex items-center">
              <FaInfoCircle className="mr-1 text-gray-500" size={14} />
              <span>Opportunity Risk Levels</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getRiskColor('low') }}
                ></span>
                <span className="text-xs">Low Risk</span>
              </div>
              <div className="flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getRiskColor('medium') }}
                ></span>
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getRiskColor('high') }}
                ></span>
                <span className="text-xs">High Risk</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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

  // Convert our ChatItem to ChatData for the ChatDetail component
  const adaptChatForDetail = (chat: ChatItem): ChatData => {
    console.log('Adapting chat for detail:', chat);

    // If the chat already has chatHistory, use that
    if (chat.chatHistory && chat.chatHistory.length > 0) {
      console.log(
        `Chat ${chat._id} already has ${chat.chatHistory.length} history items`
      );
      return {
        _id: chat._id,
        query: chat.query,
        response: (chat.response || []) as ChatResponse[],
        chatHistory: chat.chatHistory.map((historyItem) => ({
          ...historyItem,
          response: (historyItem.response || []) as ChatResponse[],
        })) as ChatData[],
        context_used: chat.context_used || [],
        sessionId: chat.sessionId || chat._id,
      };
    }

    // Otherwise, look for it in the chats array
    const fullChat = chats.find((c) => c._id === chat._id);

    console.log('Full chat from chats array:', fullChat);
    if (fullChat?.chatHistory) {
      console.log('History found in chats array:', fullChat.chatHistory.length);
    }

    // Try to check if this is a new message in an existing session
    let chatHistory: ChatItem[] = [];
    if (fullChat?.chatHistory) {
      // Use history from the full chat
      chatHistory = fullChat.chatHistory;
    } else if (fullChat?.sessionId) {
      // If this chat has a sessionId, look for other chats with the same sessionId
      const sessionChats = chats.filter(
        (c) => c.sessionId === fullChat.sessionId && c._id !== chat._id
      );

      if (sessionChats.length > 0) {
        console.log(
          'Found other chats in the same session:',
          sessionChats.length
        );
        chatHistory = sessionChats;
      }
    }

    return {
      _id: chat._id,
      query: chat.query,
      response: (chat.response || []) as ChatResponse[],
      chatHistory: chatHistory.map((historyItem) => ({
        ...historyItem,
        response: (historyItem.response || []) as ChatResponse[],
      })) as ChatData[],
      context_used: chat.context_used || [],
      sessionId: fullChat?.sessionId || chat._id,
    };
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
                    <div>
                      <div className="p-2 bg-gray-100 text-xs text-gray-600 font-mono border-b border-gray-200">
                        Debug: Chat ID: {selectedChat._id} |
                        {selectedChat.sessionId
                          ? ` Session ID: ${selectedChat.sessionId} | `
                          : ''}
                        History Items: {selectedChat.chatHistory?.length || 0}
                      </div>
                      {/* Always use ChatDetail for consistent history display */}
                      <ChatDetail
                        chat={adaptChatForDetail(selectedChat)}
                        loading={loading}
                        onSendMessage={handleSendMessage}
                      />
                    </div>
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
                {/* Map header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-white">
                  <h2 className="font-medium text-gray-800">
                    Trade Opportunities Map
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      onClick={zoomIn}
                      title="Zoom in"
                    >
                      <FaSearchPlus size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      onClick={zoomOut}
                      title="Zoom out"
                    >
                      <FaSearchMinus size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      onClick={resetZoom}
                      title="Reset zoom"
                    >
                      <FaGlobe size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      onClick={toggleMap}
                      title="Collapse map"
                    >
                      <FaChevronRight
                        size={14}
                        className="text-gray-500"
                        aria-label="Collapse map"
                      />
                    </button>
                  </div>
                </div>

                {/* Map container */}
                {renderMap()}
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
