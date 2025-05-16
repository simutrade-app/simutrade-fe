import axios from 'axios';
import { AUTH_TOKEN_KEY } from './AuthService';

// Configuration
// Use proxy URL in development environment
const API_URL = 'https://api.simutrade.app';

// Helper function to handle token refresh
const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/user/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data.status === 'success' && response.data.data?.token) {
      const newToken = response.data.data.token;
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      console.log(
        'Token refreshed successfully:',
        newToken.substring(0, 15) + '...'
      );
      return newToken;
    } else {
      console.error('Failed to refresh token:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Helper for API requests with error handling
const apiRequest = async (
  endpoint: string,
  method: string,
  data: Record<string, unknown> | null = null
) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Accept: '*/*',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Using auth token:', token.substring(0, 15) + '...');
    } else {
      console.warn('No auth token found for API request');
    }

    const options = {
      method,
      headers,
      data: data ? JSON.stringify(data) : undefined,
      withCredentials: true,
    };

    // Log the request details
    console.log(`Making API request to: ${url}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data, null, 2));
    }

    try {
      const response = await axios(url, options);
      return response.data;
    } catch (axiosError: unknown) {
      if (
        axios.isAxiosError(axiosError) &&
        axiosError.response?.status === 401
      ) {
        // Token might be expired, try to refresh
        console.log(
          'Received 401 Unauthorized, attempting to refresh token...'
        );

        if (axiosError.response?.data?.message === 'jwt expired') {
          const newToken = await refreshToken();

          if (newToken) {
            // Retry the original request with the new token
            headers['Authorization'] = `Bearer ${newToken}`;
            options.headers = headers;

            const retryResponse = await axios(url, options);
            return retryResponse.data;
          } else {
            // If token refresh failed, return the original error
            console.error('Token refresh failed, returning original error');
            return {
              status: 'error',
              message: 'Authentication failed. Please login again.',
              data: {},
            };
          }
        }
      }
      throw axiosError; // Re-throw to be caught by the outer catch
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `API Error (${error.response.status}):`,
        error.response.data
      );
      // Log more details about the error
      if (error.response.data && typeof error.response.data === 'object') {
        console.error(
          'Detailed error:',
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return error.response.data;
    } else if (error instanceof Error) {
      console.error('API Error:', error.message);
      return {
        status: 'error',
        message: error.message || 'Network error',
        data: {},
      };
    } else {
      console.error('Unknown API Error');
      return {
        status: 'error',
        message: 'An unknown error occurred',
        data: {},
      };
    }
  }
};

// Types for AI Service
export interface TradeOpportunity {
  country: string;
  city?: string;
  lat: number;
  lng: number;
  sector: string;
  opportunity: string;
  details: string;
  potentialValue?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface ChatResponse {
  text: string;
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

// API response chat object
interface ApiChatData {
  _id: string;
  query: string;
  response: ChatResponse[];
  context_used?: string[];
  createdTime?: string;
}

export interface ChatData {
  _id: string;
  query: string;
  response: ChatResponse[];
  grounding_metadata?: Record<string, unknown>;
  context_used?: string[];
  createdAt?: string;
  sessionId?: string;
  chatHistory?: ChatData[];
}

export interface PdfReportResponse {
  pdfID: string;
  pdfURL: string;
}

// Placeholder data for empty states or testing
export const placeholderChats: ChatData[] = [
  {
    _id: 'placeholder123',
    query: 'What are the major trade trends in 2025?',
    response: [
      {
        text: "Based on my augmented trade knowledge, here are some of the major trade trends observed in 2025:\n\n* **Shift in Trade and Industrial Policies:** There's a growing trend of countries prioritizing domestic issues and focusing on fulfilling climate commitments.\n* **Reconfiguration of World Merchandise Trade:** The long-term slowdown of world merchandise trade continues.\n* **Increase in Used Smartphone Shipments:** While the market for new smartphones experienced a decline, global shipments of used smartphones saw an increase of 9.5% in 2025.\n* **Growth in Commercial Services:** Most major regions experienced growth in exports of commercial services.\n* **Supply Chain Diversification:** Globalization remained near its peak level in 2025, but supply chains are becoming more diversified.",
        _id: 'response1',
      },
    ],
    context_used: [
      'This trend is evident in the smartphone sector, with the market for new smartphones falling by 3.2% in 2025.',
      'Growth composition in 2025 was supported by the continuing fast rebound in travel, with international travel receipts rising at an annual rate of 35 per cent.',
    ],
  },
];

// Function to extract trade opportunities from a chat response
const extractOpportunities = async (
  chatResponse: string
): Promise<TradeOpportunity[]> => {
  try {
    console.log('Extracting opportunities from chat response');

    // Get token from localStorage
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      console.error('No auth token found for Vertex API request');
      return [];
    }

    // Prepare the prompt for Vertex AI
    const requestData = {
      prompt: `Analyze the following text and extract specific trade opportunities mentioned. 
For each opportunity, identify:
1. The country and city (if mentioned)
2. Business sector (e.g., agriculture, technology, manufacturing)
3. A concise title for the opportunity
4. Detailed description
5. Potential value or market size (if mentioned)
6. Risk level (low, medium, high)

For each location, also provide latitude and longitude coordinates.

Format your response as a valid JSON array of opportunities with the following structure:
[
  {
    "country": "Country name",
    "city": "City name (if mentioned)",
    "lat": latitude,
    "lng": longitude,
    "sector": "Business sector",
    "opportunity": "Brief opportunity title",
    "details": "Detailed description of the opportunity",
    "potentialValue": "Market size or value (if mentioned)",
    "riskLevel": "low|medium|high"
  }
]

If no specific opportunities are mentioned, return an empty array: []

Text to analyze: ${chatResponse}`,
      temperature: 0.1,
      maxOutputTokens: 1024,
    };

    const response = await axios.post(
      `${API_URL}/service/ai-agent/vertex`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.text) {
      try {
        // Extract JSON from response
        const jsonMatch = response.data.text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const opportunities = JSON.parse(jsonMatch[0]);
          console.log('Extracted opportunities:', opportunities);
          return opportunities;
        }
      } catch (parseError) {
        console.error('Error parsing JSON from Vertex response:', parseError);
      }
    }

    return [];
  } catch (error) {
    console.error('Error extracting opportunities:', error);
    return [];
  }
};

// Process chat response to extract opportunities
const processResponseWithOpportunities = async (response: {
  status: string;
  message?: string;
  data?: {
    response?: ChatResponse[];
    chatData?: ApiChatData[];
    chatHistory?: ChatData[];
    [key: string]: unknown;
  };
}) => {
  if (response.status === 'success' && response.data?.response) {
    try {
      // Only process the first response text
      const responseText = response.data.response[0]?.text;
      if (responseText) {
        const opportunities = await extractOpportunities(responseText);
        if (opportunities.length > 0) {
          // Add opportunities to the response object
          response.data.response[0].opportunities = opportunities;
        }
      }
    } catch (error) {
      console.error('Error processing response for opportunities:', error);
    }
  }
  return response;
};

// Create a new chat
const createChat = async (query: string) => {
  try {
    // Create a properly structured request
    const requestData = {
      query,
      grounding_metadata: {
        sources: [],
        citations: [],
        context: [],
      },
    };

    console.log('Sending chat creation request with data:', requestData);

    const response = await apiRequest(
      '/service/rag-chat/create',
      'POST',
      requestData
    );

    console.log('Received response for chat creation:', response);

    // If the response contains an error, handle it here
    if (response.status === 'error') {
      console.error('Error from API during chat creation:', response.message);
      return {
        status: 'error',
        message: response.message || 'Failed to create chat',
        data: null,
      };
    }

    // Process response to extract opportunities
    const processedResponse = await processResponseWithOpportunities(response);
    return processedResponse;
  } catch (error) {
    console.error('Exception during chat creation:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to create chat',
      data: null,
    };
  }
};

// Get all chats
const getAllChats = async () => {
  try {
    const response = await apiRequest('/service/rag-chat/read', 'GET');
    console.log('Chat history response:', response);

    // If no chats or error, return placeholder
    if (
      !response.status ||
      response.status !== 'success' ||
      !response.data?.chatSession
    ) {
      console.log('No valid chat session data found, using placeholders');
      return {
        status: 'success',
        message: 'Using placeholder chats',
        data: {
          chatData: placeholderChats,
        },
      };
    }

    // Extract only the first chat from each session for the sidebar display
    const sessionChats = [];
    for (const session of response.data.chatSession) {
      if (session.chatData && session.chatData.length > 0) {
        // Get the first chat (topmost query) from each session
        const firstChat = session.chatData[0];

        // Store all the other chats as a history property
        const chatHistory = session.chatData
          .slice(1)
          .map((chat: ApiChatData) => ({
            _id: chat._id,
            query: chat.query,
            response: chat.response || [],
            context_used: chat.context_used || [],
            createdAt: chat.createdTime,
          }));

        sessionChats.push({
          _id: firstChat._id,
          query: firstChat.query,
          response: firstChat.response || [],
          context_used: firstChat.context_used || [],
          createdAt: firstChat.createdTime,
          // Add the session ID for reference
          sessionId: session._id,
          // Add the history items for this session
          chatHistory: chatHistory,
        });
      }
    }

    console.log('Session chats for display:', sessionChats);

    return {
      status: 'success',
      message: 'Chats retrieved successfully',
      data: {
        chatData: sessionChats,
      },
    };
  } catch (error) {
    console.error('Error fetching chats:', error);
    return {
      status: 'success',
      message: 'Using placeholder chats due to error',
      data: {
        chatData: placeholderChats,
      },
    };
  }
};

// Get chat by ID
const getChatById = async (id: string) => {
  // If placeholder ID, return the placeholder chat
  if (id === 'placeholder123') {
    return {
      status: 'success',
      message: 'Retrieved placeholder chat',
      data: placeholderChats[0],
    };
  }

  try {
    console.log('Fetching chat by ID:', id);

    // First try getting all chats to find the matching chat and its sessionId
    const allChatsResponse = await getAllChats();

    if (
      allChatsResponse.status === 'success' &&
      allChatsResponse.data?.chatData &&
      allChatsResponse.data.chatData.length > 0
    ) {
      // First look for the chat with the matching _id
      let foundChat = allChatsResponse.data.chatData.find(
        (chat) => chat._id === id
      );

      // If not found by _id, try finding by sessionId
      if (!foundChat) {
        foundChat = allChatsResponse.data.chatData.find(
          (chat) => chat.sessionId === id
        );
        console.log(
          'Found chat by sessionId:',
          foundChat ? foundChat._id : 'not found'
        );
      } else {
        console.log('Found chat by _id:', foundChat._id);
      }

      if (foundChat) {
        console.log('Found chat in chat history:', foundChat);
        return {
          status: 'success',
          message: 'Retrieved chat from history',
          data: foundChat,
        };
      }
    }

    // If we couldn't find it in the all chats response, log an error
    console.error('Chat not found by ID or sessionId:', id);
    return {
      status: 'error',
      message: 'Chat not found',
      data: null,
    };
  } catch (error) {
    console.error('Error fetching chat:', error);
    return {
      status: 'error',
      message: 'Failed to fetch chat',
      data: null,
    };
  }
};

// Update an existing chat
const updateChat = async (chatId: string, query: string) => {
  try {
    // For update requests, we need the session ID, not individual chat ID
    let sessionId = chatId;

    // Check if we need to find the parent session ID (if this is a specific message ID)
    if (!chatId.includes('placeholder')) {
      const allChatsResponse = await getAllChats();

      if (
        allChatsResponse.status === 'success' &&
        allChatsResponse.data?.chatData
      ) {
        // First look for the chat with this ID in the main chat list
        let chatItem = allChatsResponse.data.chatData.find(
          (chat) => chat._id === chatId
        );

        // If not found in main list, search through each chat's history
        if (!chatItem) {
          for (const chat of allChatsResponse.data.chatData) {
            if (chat.chatHistory && chat.chatHistory.length > 0) {
              const historyItem = chat.chatHistory.find(
                (historyChat: ChatData) => historyChat._id === chatId
              );

              if (historyItem) {
                // If found in history, use the parent chat's sessionId
                chatItem = chat;
                console.log(
                  `Found chat ID ${chatId} in history of chat ${chat._id}, using session ID ${chat.sessionId}`
                );
                break;
              }
            }
          }
        }

        if (chatItem && chatItem.sessionId) {
          // If found, use the session ID for the update
          console.log(
            `Using session ID ${chatItem.sessionId} instead of chat ID ${chatId}`
          );
          sessionId = chatItem.sessionId;
        }
      }
    }

    console.log(`Sending update to session ID: ${sessionId}`);

    // Create request data with preserveHistory flag
    const requestData = {
      id: sessionId,
      query,
      preserveHistory: true, // Add this flag to indicate history should be preserved
    };

    console.log('Update chat request data:', requestData);

    // Send request with the correct format
    const response = await apiRequest(
      `/service/rag-chat/update`,
      'PUT',
      requestData
    );

    console.log('Update chat response:', response);

    // Process response to extract opportunities
    const processedResponse = await processResponseWithOpportunities(response);
    return processedResponse;
  } catch (error) {
    console.error('Error updating chat:', error);
    return {
      status: 'error',
      message: 'Failed to update chat',
      data: null,
    };
  }
};

// Create a PDF report from chat history
const createChatPDF = async (chatId: string) => {
  try {
    console.log('Creating PDF report for chat ID:', chatId);

    // Validate that we have an actual ID before making the request
    if (!chatId || chatId.includes('placeholder')) {
      console.error('Invalid chat ID provided:', chatId);
      return {
        status: 'error',
        message: 'Cannot create PDF: Invalid chat ID',
        data: null,
      };
    }

    const response = await apiRequest('/service/pdf-report/create', 'POST', {
      chatId,
    });

    console.log('Received PDF creation response:', response);

    if (response.status === 'error') {
      console.error('Error creating PDF report:', response.message);

      // Check if the error is due to an invalid chatId
      if (response.message?.includes('chatId not found')) {
        console.warn(
          'The provided chat ID could not be found. Make sure to use the session ID rather than individual message ID.'
        );
      }

      return {
        status: 'error',
        message: response.message || 'Failed to create PDF report',
        data: null,
      };
    }

    // If successful, the response will contain the PDF URL
    if (response.data?.pdfURL) {
      // Trigger download of the PDF
      window.open(response.data.pdfURL, '_blank');
    } else {
      console.warn('PDF creation successful but no URL returned:', response);
    }

    return response;
  } catch (error) {
    console.error('Exception during PDF creation:', error);
    return {
      status: 'error',
      message:
        error instanceof Error ? error.message : 'Failed to create PDF report',
      data: null,
    };
  }
};

// Export functions as a default object
const AIService = {
  createChat,
  getAllChats,
  getChatById,
  updateChat,
  createChatPDF,
  extractOpportunities,
};

export default AIService;
