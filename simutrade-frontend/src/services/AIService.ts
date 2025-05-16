import axios from 'axios';
import { AUTH_TOKEN_KEY } from './AuthService';

// Configuration
const API_URL = 'https://api.simutrade.app';

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

    const response = await axios(url, options);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `API Error (${error.response.status}):`,
        error.response.data
      );
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
export interface ChatResponse {
  text: string;
  _id?: string;
  videoMetadata?: any;
  thought?: any;
  inlineData?: any;
  codeExecutionResult?: any;
  executableCode?: any;
  fileData?: any;
  functionCall?: any;
  functionResponse?: any;
}

export interface ChatData {
  _id: string;
  query: string;
  response: ChatResponse[];
  grounding_metadata?: any;
  context_used?: string[];
}

// Placeholder data for empty states or testing
export const placeholderChats: ChatData[] = [
  {
    _id: 'placeholder123',
    query: 'What are the major trade trends in 2023?',
    response: [
      {
        text: "Based on my augmented trade knowledge, here are some of the major trade trends observed in 2023:\n\n* **Shift in Trade and Industrial Policies:** There's a growing trend of countries prioritizing domestic issues and focusing on fulfilling climate commitments.\n* **Reconfiguration of World Merchandise Trade:** The long-term slowdown of world merchandise trade continues.\n* **Increase in Used Smartphone Shipments:** While the market for new smartphones experienced a decline, global shipments of used smartphones saw an increase of 9.5% in 2023.\n* **Growth in Commercial Services:** Most major regions experienced growth in exports of commercial services.\n* **Supply Chain Diversification:** Globalization remained near its peak level in 2023, but supply chains are becoming more diversified.",
        _id: 'response1',
      },
    ],
    context_used: [
      'This trend is evident in the smartphone sector, with the market for new smartphones falling by 3.2% in 2023.',
      'Growth composition in 2023 was supported by the continuing fast rebound in travel, with international travel receipts rising at an annual rate of 35 per cent.',
    ],
  },
];

// Create a new chat
const createChat = async (query: string) => {
  try {
    const response = await apiRequest('/service/rag-chat/create', 'POST', {
      query,
    });
    return response;
  } catch (error) {
    console.error('Error creating chat:', error);
    return {
      status: 'error',
      message: 'Failed to create chat',
      data: null,
    };
  }
};

// Get all chats
const getAllChats = async () => {
  try {
    const response = await apiRequest('/service/rag-chat/read', 'GET');

    // If no chats or error, return placeholder
    if (
      !response.status ||
      response.status !== 'success' ||
      !response.data?.chatData?.length
    ) {
      return {
        status: 'success',
        message: 'Using placeholder chats',
        data: {
          chatData: placeholderChats,
        },
      };
    }

    return response;
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
    const response = await apiRequest(`/service/rag-chat/read/${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching chat:', error);
    return {
      status: 'error',
      message: 'Failed to fetch chat',
      data: null,
    };
  }
};

// Export functions as a default object
const AIService = {
  createChat,
  getAllChats,
  getChatById,
};

export default AIService;
