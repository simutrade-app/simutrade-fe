import React, { useState, useEffect, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Separator from '@radix-ui/react-separator';
import { 
  FiAnchor,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiZap,
  FiAlertTriangle,
  FiFileText,
  FiTrendingUp,
  FiLoader,
  FiActivity
} from 'react-icons/fi';
import { MdAirplanemodeActive } from 'react-icons/md';
import LegalProcessFlow from './LegalProcessFlow';

interface ResultsDisplayProps {
  results: {
    tradeEfficiencyScore: number;
    costEstimate: number;
    timeEstimate: number;
    transportMode?: string;
    recommendations: string[];
    risks: {
      type: string;
      level: string;
      impact: string;
    }[];
    commodity?: string;
    originCountry?: string;
    destinationCountry?: string;
  };
}

interface AIResponse {
  response?: string;
  error?: string;
}

const TransportIcon = ({ mode }: { mode: string }) => {
  switch (mode) {
    case 'air':
      return <MdAirplanemodeActive className="w-4 h-4" />;
    case 'land':
      return <FiTruck className="w-4 h-4" />;
    case 'sea':
    default:
      return <FiAnchor className="w-4 h-4" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return '#00403D';
  if (score >= 60) return '#D97706';
  return '#DC2626';
};

const getRiskColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'high':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'medium':
      return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'low':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'very low':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

// Simple display component for typed text
const TypingText: React.FC<{ 
  displayText: string;
}> = ({ displayText }) => {
  // Format text with bold support
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <span>{formatText(displayText)}</span>;
};

// Get card type based on content
const getCardType = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('high') || lowerTitle.includes('critical') || lowerTitle.includes('severe')) {
    return 'high-risk';
  } else if (lowerTitle.includes('medium') || lowerTitle.includes('moderate')) {
    return 'medium-risk';
  } else if (lowerTitle.includes('low') || lowerTitle.includes('minor')) {
    return 'low-risk';
  } else if (lowerTitle.includes('mitigation') || lowerTitle.includes('recommendation') || lowerTitle.includes('strategies')) {
    return 'mitigation';
  }
  return 'insight';
};

// Format AI response into structured cards
const formatAIResponse = (text: string): Array<{title: string, content: string, type?: string}> => {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const cards: Array<{title: string, content: string, type?: string}> = [];
  
  let currentCard: {title: string, content: string[], type?: string} | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this is a numbered point (e.g., "1. **Title**" or "1. Title")
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
    if (numberedMatch) {
      // Save previous card if exists
      if (currentCard) {
        cards.push({
          title: currentCard.title,
          content: currentCard.content.join('\n'),
          type: currentCard.type
        });
      }
      
      // Extract title (remove markdown formatting for title but keep in content)
      let title = numberedMatch[2];
      if (title.startsWith('**') && title.includes('**')) {
        const boldMatch = title.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          title = boldMatch[1];
        }
      }
      
      // Start new card
      currentCard = {
        title: title,
        content: [],
        type: getCardType(title)
      };
    } else if (currentCard && trimmedLine && !trimmedLine.match(/^(\d+)\./)) {
      // Add content to current card (preserve line breaks for better formatting)
      currentCard.content.push(trimmedLine);
    } else if (trimmedLine && !currentCard) {
      // Handle content without numbered headers
      currentCard = {
        title: 'Analysis',
        content: [trimmedLine],
        type: 'insight'
      };
    }
  }
  
  // Add final card
  if (currentCard) {
    cards.push({
      title: currentCard.title,
      content: currentCard.content.join('\n'),
      type: currentCard.type
    });
  }
  
  // If no cards were created, try to parse as simple numbered list
  if (cards.length === 0) {
    const numberedPoints = text.match(/\d+\.\s*[^0-9].*?(?=\d+\.|$)/gs);
    if (numberedPoints) {
      numberedPoints.forEach((point, index) => {
        const cleanPoint = point.replace(/^\d+\.\s*/, '').trim();
        const titleMatch = cleanPoint.match(/^\*\*([^*]+)\*\*/);
        const title = titleMatch ? titleMatch[1] : `Point ${index + 1}`;
        
        cards.push({
          title: title,
          content: cleanPoint,
          type: getCardType(title)
        });
      });
    } else {
      // Fallback: create a single card with all content
      cards.push({
        title: 'Analysis',
        content: text,
        type: 'insight'
      });
    }
  }
  
  return cards;
};

// AI Content Display Component
const AIContentDisplay: React.FC<{ 
  content: string; 
  isLoading: boolean; 
  isError: boolean; 
  type: 'insights' | 'risks';
  displayText: string;
}> = ({ content, isLoading, isError, type, displayText }) => {
  if (isLoading) return <SkeletonLoader />;
  
  if (!content) return null;
  
  const cards = formatAIResponse(content);
  
  if (cards.length === 0) {
    // Fallback to simple display with typing effect
    return (
      <div className="p-4 bg-[#00403D]/5 rounded-lg">
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          <TypingText displayText={displayText} />
        </div>
      </div>
    );
  }
  
  // For cards display, we'll show the full content since cards have their own typing logic
  const cardsToShow = cards;
  
  return (
    <div className="space-y-3">
      {cards.map((card, index) => {
        const getCardStyle = (cardType?: string) => {
          switch (cardType) {
            case 'high-risk':
              return {
                cardClass: 'bg-red-50 border-red-200',
                headerClass: 'bg-red-100 text-red-800',
                contentClass: 'text-red-700',
                icon: '🚨'
              };
            case 'medium-risk':
              return {
                cardClass: 'bg-amber-50 border-amber-200',
                headerClass: 'bg-amber-100 text-amber-800',
                contentClass: 'text-amber-700',
                icon: '⚠️'
              };
            case 'low-risk':
              return {
                cardClass: 'bg-blue-50 border-blue-200',
                headerClass: 'bg-blue-100 text-blue-800',
                contentClass: 'text-blue-700',
                icon: 'ℹ️'
              };
            case 'mitigation':
              return {
                cardClass: 'bg-green-50 border-green-200',
                headerClass: 'bg-green-100 text-green-800',
                contentClass: 'text-green-700',
                icon: '✅'
              };
            default:
              return {
                cardClass: 'bg-white border-gray-200',
                headerClass: 'bg-gray-100 text-gray-800',
                contentClass: 'text-gray-700',
                icon: '📋'
              };
          }
        };
        
        const style = getCardStyle(card.type);
        
        return (
          <div key={index} className={`rounded-lg border ${style.cardClass} overflow-hidden shadow-sm`}>
            <div className={`px-4 py-3 border-b border-gray-200 ${style.headerClass}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{style.icon}</span>
                <h4 className="font-semibold text-sm">{card.title}</h4>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className={`text-sm leading-relaxed ${style.contentClass}`}>
                <TypingText displayText={card.content} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Skeleton loader component
const SkeletonLoader: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
        <div className="w-6 h-4 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [aiInsights, setAiInsights] = useState<string>('');
  const [aiRisks, setAiRisks] = useState<string>('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [risksLoading, setRisksLoading] = useState(false);
  const [insightsError, setInsightsError] = useState(false);
  const [risksError, setRisksError] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  
  // Track if content has been typed at least once
  const [typingCompleted, setTypingCompleted] = useState<{
    insights: boolean;
    risks: boolean;
  }>({
    insights: false,
    risks: false
  });

  // Global typing state for continuous background typing
  const [typingState, setTypingState] = useState<{
    insights: { currentIndex: number; isTyping: boolean; displayText: string };
    risks: { currentIndex: number; isTyping: boolean; displayText: string };
  }>({
    insights: { currentIndex: 0, isTyping: false, displayText: '' },
    risks: { currentIndex: 0, isTyping: false, displayText: '' }
  });

  // Global typing intervals
  const typingIntervalsRef = useRef<{
    insights: NodeJS.Timeout | null;
    risks: NodeJS.Timeout | null;
  }>({
    insights: null,
    risks: null
  });

  const transportMode = results.transportMode || 'sea';

  // Start typing for a specific content type
  const startTyping = (type: 'insights' | 'risks', content: string, speed: number = 30) => {
    // Only start typing if not already completed and not currently typing
    if (typingCompleted[type]) return;
    
    // If already typing the same content, don't restart
    if (typingState[type].isTyping && typingIntervalsRef.current[type]) return;

    // Clear existing interval only if we're starting fresh
    if (typingIntervalsRef.current[type]) {
      clearInterval(typingIntervalsRef.current[type]!);
    }

    // Only reset if we're starting fresh (not completed)
    setTypingState(prev => ({
      ...prev,
      [type]: { currentIndex: 0, isTyping: true, displayText: '' }
    }));

    // Start typing interval
    typingIntervalsRef.current[type] = setInterval(() => {
      setTypingState(prev => {
        const currentState = prev[type];
        const newIndex = currentState.currentIndex + 1;
        const newDisplayText = content.slice(0, newIndex);

        if (newIndex >= content.length) {
          // Typing completed - clear interval and mark as completed
          if (typingIntervalsRef.current[type]) {
            clearInterval(typingIntervalsRef.current[type]!);
            typingIntervalsRef.current[type] = null;
          }
          
          setTypingCompleted(prevCompleted => ({ ...prevCompleted, [type]: true }));
          
          return {
            ...prev,
            [type]: { currentIndex: newIndex, isTyping: false, displayText: content }
          };
        }

        return {
          ...prev,
          [type]: { currentIndex: newIndex, isTyping: true, displayText: newDisplayText }
        };
      });
    }, speed);
  };

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalsRef.current.insights) {
        clearInterval(typingIntervalsRef.current.insights);
      }
      if (typingIntervalsRef.current.risks) {
        clearInterval(typingIntervalsRef.current.risks);
      }
    };
  }, []);

  // API call function
  const callAIAgent = async (query: string): Promise<string> => {
    try {
      // Try multiple token sources
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('authToken') ||
                   'demo-token';
      
      console.log('Calling AI Agent with token:', token ? 'Present' : 'Missing');
      
      // Try both relative and absolute paths
      const endpoints = [
        'https://api.simutrade.app/service/ai-agent/vertex',
        '/service/ai-agent/vertex',
        '/api/ai-agent/vertex',
        'http://localhost:3001/service/ai-agent/vertex',
        'http://localhost:8080/service/ai-agent/vertex'
      ];
      
      let lastError: Error | null = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
          });

          console.log('Response status:', response.status);
          
          if (response.ok) {
            const data: AIResponse = await response.json();
            
            if (data.error) {
              throw new Error(data.error);
            }

            return data.response || '';
          } else if (response.status === 401) {
            console.warn(`401 Unauthorized for ${endpoint}`);
            lastError = new Error(`Unauthorized access to ${endpoint}`);
            continue; // Try next endpoint
          } else {
            lastError = new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
            continue; // Try next endpoint
          }
        } catch (fetchError) {
          console.warn(`Failed to fetch from ${endpoint}:`, fetchError);
          lastError = fetchError as Error;
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints failed, throw the last error
      throw lastError || new Error('All endpoints failed');
      
    } catch (error) {
      console.error('AI Agent Error:', error);
      throw error;
    }
  };

  // Mock AI responses for testing
  const getMockResponse = (type: 'insights' | 'risks', query: string): string => {
    if (type === 'insights') {
      return `1. **Cost Optimization**
Consider consolidating shipments during off-peak seasons to reduce transportation costs by **15-20%**. Bulk shipping reduces per-unit costs significantly and provides better negotiating power with carriers.

2. **Route Efficiency** 
Monitor alternative shipping routes that could reduce delivery time from ${results.timeEstimate} to **${Math.max(results.timeEstimate - 3, 5)} days** while maintaining cost effectiveness. Digital route optimization tools can identify better pathways.

3. **Market Timing**
Current market conditions suggest **optimal shipping windows** during Q2 and Q4 for better pricing. Avoid peak season surcharges by planning ahead and securing capacity early.

4. **Supply Chain Enhancement**
Implement digital tracking systems to improve transparency and reduce insurance costs by **8-12%**. Real-time visibility enhances customer confidence and enables proactive issue resolution.

5. **Regulatory Compliance**
Stay updated on trade regulations between ${results.originCountry || 'origin'} and ${results.destinationCountry || 'destination'} to avoid **costly delays and penalties**. Automated compliance monitoring reduces manual oversight requirements.`;
    } else {
      return `1. **High Risk: Currency Fluctuation**
Exchange rate volatility could impact **profit margins by ±10-15%** affecting overall profitability. USD strengthening against local currencies poses significant exposure during transit periods.

2. **Medium Risk: Weather Delays**
Seasonal weather patterns may cause **2-5 day delays** during monsoon periods. Port congestion during peak seasons (Dec-Feb) causing schedule disruptions and additional demurrage charges.

3. **Medium Risk: Regulatory Changes**
New trade policies in destination country requiring **updated documentation** and compliance procedures. Supply chain bottlenecks at major transit hubs creating cascading delays.

4. **Low Risk: Quality Control**
Minor quality control issues during packaging and handling processes. Documentation delays due to **manual processing systems** and routine customs inspection procedures.

5. **Mitigation Strategies**
Use **forward contracts for currency hedging** to lock in favorable rates. Maintain 10% buffer in delivery timeline for unexpected delays. Partner with experienced local customs brokers for **smooth clearance processes**.`;
    }
  };

  // Enhanced fetch with mock fallback
  const fetchInsights = async () => {
    if (aiInsights || insightsLoading) return;
    
    setInsightsLoading(true);
    setInsightsError(false);

    try {
      const query = `Generate strategic trade insights for ${results.commodity || 'commodity'} export from ${results.originCountry || 'origin'} to ${results.destinationCountry || 'destination'} using ${transportMode} transport. Cost estimate: $${results.costEstimate.toLocaleString()}, delivery time: ${results.timeEstimate} days, efficiency score: ${results.tradeEfficiencyScore}. Provide 3-4 actionable insights to optimize this trade route, improve costs, or enhance efficiency. Format as numbered points.`;
      
      try {
        const response = await callAIAgent(query);
        setAiInsights(response);
        // Start typing for insights immediately
        startTyping('insights', response, 20);
      } catch (apiError) {
        console.warn('API failed, using mock response:', apiError);
        // Use mock response as fallback
        const mockResponse = getMockResponse('insights', query);
        setAiInsights(mockResponse);
        // Start typing for insights immediately
        startTyping('insights', mockResponse, 20);
      }
    } catch (error) {
      setInsightsError(true);
      setAiInsights('Unable to fetch AI insights at this time. Please check your connection and try again.');
    } finally {
      setInsightsLoading(false);
    }
  };

  // Enhanced fetch with mock fallback
  const fetchRisks = async () => {
    if (aiRisks || risksLoading) return;
    
    setRisksLoading(true);
    setRisksError(false);

    try {
      const query = `Analyze potential risks for trading ${results.commodity || 'commodity'} from ${results.originCountry || 'origin'} to ${results.destinationCountry || 'destination'} via ${transportMode} transport. Consider current global trade conditions, regulatory changes, market volatility, and logistics challenges. Provide 3-4 key risks with their likelihood and mitigation strategies. Format as structured risk assessment.`;
      
      try {
        const response = await callAIAgent(query);
        setAiRisks(response);
        // Start typing for risks immediately
        startTyping('risks', response, 20);
      } catch (apiError) {
        console.warn('API failed, using mock response:', apiError);
        // Use mock response as fallback
        const mockResponse = getMockResponse('risks', query);
        setAiRisks(mockResponse);
        // Start typing for risks immediately
        startTyping('risks', mockResponse, 20);
      }
    } catch (error) {
      setRisksError(true);
      setAiRisks('Unable to fetch risk analysis at this time. Please check your connection and try again.');
    } finally {
      setRisksLoading(false);
    }
  };

    // Fetch insights when new simulation results come in
  useEffect(() => {
    fetchInsights();
  }, [results]); // Only reload when results change

  // Load risks when user first clicks on risks tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'risks' && !aiRisks && !risksLoading) {
      fetchRisks();
    }
  };

  // Fallback data
  const fallbackInsights = [
    "Consider consolidating shipments to reduce per-unit costs",
    "Monitor seasonal demand patterns for optimal timing",
    "Explore alternative routes during peak seasons",
    "Implement quality control measures to reduce returns"
  ];

  const fallbackRisks = [
    { type: "Currency Fluctuation", level: "Medium", impact: "Exchange rate changes could affect profitability" },
    { type: "Regulatory Changes", level: "Low", impact: "New trade policies may require documentation updates" },
    { type: "Weather Delays", level: "Medium", impact: "Seasonal weather patterns may cause delivery delays" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Results Card */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#00403D]/10">
            <FiTrendingUp className="w-5 h-5 text-[#00403D]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Trade Analysis</h2>
            <p className="text-sm text-gray-600">Simulation completed successfully</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-left">
            <div className="w-12 h-12 mb-3 rounded-lg bg-gradient-to-br from-[#00403D]/10 to-[#B3CFCD]/20 flex items-center justify-center border border-gray-200/50">
              <FiActivity className="w-5 h-5 text-[#00403D]" />
            </div>
            <div className="text-lg font-bold text-gray-900" style={{ color: getScoreColor(results.tradeEfficiencyScore) }}>
              {results.tradeEfficiencyScore}
            </div>
            <div className="text-xs text-gray-500">Efficiency Score</div>
          </div>

          <div className="text-left">
            <div className="w-12 h-12 mb-3 rounded-lg bg-[#00403D]/5 flex items-center justify-center border border-gray-200/50">
              <TransportIcon mode={transportMode} />
            </div>
            <div className="text-lg font-bold text-gray-900 capitalize">{transportMode} Freight</div>
            <div className="text-xs text-gray-500">Transport Mode</div>
          </div>

          <div className="text-left">
            <div className="w-12 h-12 mb-3 rounded-lg bg-[#00403D]/5 flex items-center justify-center border border-gray-200/50">
              <FiDollarSign className="w-5 h-5 text-[#00403D]" />
            </div>
            <div className="text-lg font-bold text-gray-900">${results.costEstimate.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Cost</div>
          </div>

          <div className="text-left">
            <div className="w-12 h-12 mb-3 rounded-lg bg-[#00403D]/5 flex items-center justify-center border border-gray-200/50">
              <FiClock className="w-5 h-5 text-[#00403D]" />
            </div>
            <div className="text-lg font-bold text-gray-900">{results.timeEstimate} days</div>
            <div className="text-xs text-gray-500">Delivery Time</div>
          </div>
        </div>

        <Separator.Root className="bg-gray-200 h-px w-full my-6" />

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={handleTabChange} className="w-full">
          <Tabs.List className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <Tabs.Trigger 
              value="recommendations" 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#00403D] data-[state=active]:shadow-sm text-gray-600"
            >
              <FiZap className="w-4 h-4" />
              AI Insights
              {insightsLoading && <FiLoader className="w-3 h-3 animate-spin" />}
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="risks" 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#00403D] data-[state=active]:shadow-sm text-gray-600"
            >
              <FiAlertTriangle className="w-4 h-4" />
              AI Risk Analysis
              {risksLoading && <FiLoader className="w-3 h-3 animate-spin" />}
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="documents" 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-[#00403D] data-[state=active]:shadow-sm text-gray-600"
            >
              <FiFileText className="w-4 h-4" />
              Legal
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="recommendations" className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Strategic Trade Insights</h3>
              {aiInsights ? (
                <AIContentDisplay 
                  content={aiInsights}
                  isLoading={insightsLoading}
                  isError={insightsError}
                  type="insights"
                  displayText={typingCompleted.insights ? aiInsights : typingState.insights.displayText}
                />
              ) : insightsLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-3">
                  {fallbackInsights.map((item, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 text-[#00403D]">Insight {index + 1}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Content>

          <Tabs.Content value="risks" className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Risk Assessment</h3>
              {aiRisks ? (
                <AIContentDisplay 
                  content={aiRisks}
                  isLoading={risksLoading}
                  isError={risksError}
                  type="risks"
                  displayText={typingCompleted.risks ? aiRisks : typingState.risks.displayText}
                />
              ) : risksLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-3">
                  {fallbackRisks.map((risk, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getRiskColor(risk.level)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{risk.type}</h4>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-white/50">
                          {risk.level}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{risk.impact}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Content>

          <Tabs.Content value="documents" className="space-y-6">
            <div className="h-96 rounded-lg overflow-hidden">
              <LegalProcessFlow 
                commodity={results.commodity}
                originCountry={results.originCountry}
                destinationCountry={results.destinationCountry}
                transportMode={results.transportMode}
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>

        {/* Action Button */}
        <div className="flex justify-center pt-6">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#00403D] text-white rounded-lg font-medium transition-colors hover:bg-[#00403D]/90">
            <FiDownload className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
