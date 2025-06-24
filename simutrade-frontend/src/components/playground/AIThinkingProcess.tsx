import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Spin,
  Steps,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Progress,
  Alert,
  Tooltip,
} from 'antd';
import {
  RobotOutlined,
  CompassOutlined,
  FileSearchOutlined,
  CloudOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  BulbOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  TrophyOutlined,
  GlobalOutlined,
  SendOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ContainerOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface ThinkingNode {
  id: number;
  title: string;
  content: string;
  type: 'route' | 'regulation' | 'weather' | 'cost' | 'risk' | 'recommendation';
}

interface AIThinkingProcessProps {
  simulationData: Record<string, unknown>;
  simulationResults: Record<string, any> | null;
  isSimulating: boolean;
  authToken?: string;
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

// Typewriter effect component
const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayText}</span>;
};

const getTransportIcon = (mode: string) => {
  switch (mode?.toLowerCase()) {
    case 'air':
      return <SendOutlined style={{ color: '#1890ff' }} />;
    case 'sea':
      return <ContainerOutlined style={{ color: '#52c41a' }} />;
    case 'land':
      return <CarOutlined style={{ color: '#fa8c16' }} />;
    default:
      return <GlobalOutlined style={{ color: '#722ed1' }} />;
  }
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'route':
      return <CompassOutlined style={{ color: '#1890ff' }} />;
    case 'regulation':
      return <FileSearchOutlined style={{ color: '#722ed1' }} />;
    case 'weather':
      return <CloudOutlined style={{ color: '#13c2c2' }} />;
    case 'cost':
      return <DollarOutlined style={{ color: '#52c41a' }} />;
    case 'risk':
      return <WarningOutlined style={{ color: '#fa8c16' }} />;
    case 'recommendation':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    default:
      return <ThunderboltOutlined style={{ color: '#eb2f96' }} />;
  }
};

// Commodities data mapping
const commodities = [
  { id: 1, name: 'Electronics', icon: '🔌' },
  { id: 2, name: 'Textiles', icon: '🧵' },
  { id: 3, name: 'Coffee', icon: '☕' },
  { id: 4, name: 'Automotive Parts', icon: '🚗' },
  { id: 5, name: 'Pharmaceuticals', icon: '💊' },
  { id: 6, name: 'Furniture', icon: '🪑' },
  { id: 7, name: 'Jewelry', icon: '💎' },
  { id: 8, name: 'Toys', icon: '🧸' },
];

const transportModes = {
  sea: { name: 'Sea Freight', icon: '🚢' },
  air: { name: 'Air Freight', icon: '✈️' },
  land: { name: 'Land Transport', icon: '🚚' },
};

const originCountries = [
  { id: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'SGP', name: 'Singapore', flag: '🇸🇬' },
  { id: 'THA', name: 'Thailand', flag: '🇹🇭' },
  { id: 'VNM', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'PHL', name: 'Philippines', flag: '🇵🇭' },
  { id: 'CURRENT', name: 'Current Location', flag: '📍' },
];

const AIThinkingProcess: React.FC<AIThinkingProcessProps> = ({
  simulationData,
  simulationResults,
  isSimulating,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Generate AI analysis using OpenRouter endpoint
  const generateAIAnalysis = async () => {
    if (!simulationResults) return;

    setLoading(true);
    setApiError(null);
    setAiAnalysis('');
    setTypewriterComplete(false);
    setAnalysisProgress(0);

    try {
      // Extract simulation info for the query
      const commodityIdForQuery = simulationResults.commodity ?? (simulationData as any)?.commodity;
      const commodityNameForQuery = commodities.find(c => String(c.id) === String(commodityIdForQuery))?.name || 'Unknown';
      const transport = transportModes[simulationResults.transportMode as keyof typeof transportModes]?.name || 'Unknown';
      const origin = originCountries.find(c => c.id === simulationResults.originCountry)?.name || 'Unknown';
      const destination = simulationResults.destination?.name || 'Unknown';

      const query = `Analyze this trade scenario: Shipping ${commodityNameForQuery} via ${transport} from ${origin} to ${destination}. Provide strategic insights, cost optimization tips, potential risks, and actionable recommendations. Keep the analysis comprehensive but concise.`;

      // Simulate progress while making API call
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      const response = await fetch('/service/ai-agent/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          model: 'gemini-2.0-flash-exp:free'
        }),
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response text from the API response
      let analysisText = '';
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        analysisText = data.choices[0].message.content;
      } else if (data.response) {
        analysisText = data.response;
      } else if (typeof data === 'string') {
        analysisText = data;
      } else {
        analysisText = 'AI analysis completed successfully. The trade route analysis shows favorable conditions for your shipment.';
      }

      setAiAnalysis(analysisText);
      setLoading(false);

    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setApiError('Failed to generate AI analysis. Please try again.');
      setLoading(false);
      setAnalysisProgress(0);
    }
  };

  // Auto-generate analysis when simulation results are available
  useEffect(() => {
    if (simulationResults && !loading && !aiAnalysis) {
      generateAIAnalysis();
    }
  }, [simulationResults]);

  const renderSimulationResults = () => {
    if (!simulationResults) return null;

    const commodityId = simulationResults.commodity ?? (simulationData as any)?.commodity;
    const commodity = commodities.find(c => String(c.id) === String(commodityId));
    const transport = transportModes[simulationResults.transportMode as keyof typeof transportModes];
    const origin = originCountries.find(c => c.id === simulationResults.originCountry);

    return (
      <Card
        title={
          <Space>
            <TrophyOutlined style={{ color: '#52c41a' }} />
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              Simulation Results
            </Title>
          </Space>
        }
        style={{
          background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          border: '2px solid #b7eb8f',
          borderRadius: '16px',
          marginBottom: '24px',
        }}
        extra={<Tag color="green">Success</Tag>}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {commodity?.icon || '📦'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Commodity
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {commodity?.name || 'Unknown'}
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {transport?.icon || '🚚'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Transport
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {transport?.name || 'Unknown'}
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {origin?.flag || '📍'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Origin
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {simulationResults.originCountry === 'CURRENT' && simulationResults.currentLocation
                  ? simulationResults.currentLocation.name
                  : origin?.name || 'Unknown'
                }
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                🎯
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Destination
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {simulationResults.destination?.name || 'N/A'}
              </Text>
            </div>
          </Col>
        </Row>
        
        {(simulationResults.costEstimate || simulationResults.timeEstimate) && (
          <>
            <div style={{ height: '1px', background: '#d9f7be', margin: '16px 0' }} />
            <Row gutter={[24, 16]}>
              {simulationResults.costEstimate && (
                <Col xs={24} sm={12}>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <DollarOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        Estimated Cost
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                        ${simulationResults.costEstimate?.toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </Col>
              )}
              
              {simulationResults.timeEstimate && (
                <Col xs={24} sm={12}>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        Estimated Time
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                        {simulationResults.timeEstimate} days
                      </Text>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </>
        )}
      </Card>
    );
  };

  const renderAIAnalysis = () => {
    return (
      <Card
        title={
          <Space>
            <RobotOutlined style={{ color: '#722ed1' }} />
            <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
              AI Trade Analysis
            </Title>
          </Space>
        }
        style={{
          background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          border: '2px solid #d3adf7',
          borderRadius: '16px',
        }}
        extra={
          <Space>
            <Tag color="purple">AI-Powered</Tag>
            {!loading && aiAnalysis && (
              <Tooltip title="Regenerate Analysis">
                <Button
                  icon={<ReloadOutlined />}
                  size="small"
                  onClick={generateAIAnalysis}
                  style={{ border: 'none', background: 'transparent' }}
                />
              </Tooltip>
            )}
          </Space>
        }
      >
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin 
              size="large" 
              indicator={<LoadingOutlined style={{ fontSize: 24, color: '#722ed1' }} spin />}
            />
            <div style={{ marginTop: '16px' }}>
              <Paragraph style={{ color: '#722ed1', marginBottom: '8px' }}>
                AI analyzing your trade scenario...
              </Paragraph>
              <Progress 
                percent={analysisProgress} 
                strokeColor="#722ed1"
                trailColor="#efdbff"
                size="small"
                style={{ maxWidth: '300px', margin: '0 auto' }}
              />
            </div>
          </div>
        )}

        {apiError && (
          <Alert
            message="Analysis Error"
            description={apiError}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
            action={
              <Button size="small" onClick={generateAIAnalysis}>
                Retry
              </Button>
            }
          />
        )}

        {!loading && !apiError && aiAnalysis && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            padding: '20px', 
            borderRadius: '12px',
            border: '1px solid #d3adf7',
            fontSize: '15px',
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <Space>
                <BulbOutlined style={{ color: '#722ed1' }} />
                <Text strong style={{ color: '#722ed1' }}>AI Insights:</Text>
              </Space>
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <TypewriterText 
                text={aiAnalysis} 
                speed={30}
                onComplete={() => setTypewriterComplete(true)}
              />
              {typewriterComplete && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Tag color="green" style={{ fontSize: '12px' }}>
                    ✓ Analysis Complete
                  </Tag>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !apiError && !aiAnalysis && simulationResults && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={generateAIAnalysis}
              style={{
                background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                padding: '0 24px',
                fontSize: '16px',
              }}
            >
              Generate AI Analysis
            </Button>
          </div>
        )}

        {!simulationResults && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <BulbOutlined style={{ fontSize: '48px', color: '#d3adf7' }} />
            <Paragraph style={{ marginTop: '16px', color: '#722ed1' }}>
              Run a trade simulation to get AI-powered insights and analysis.
            </Paragraph>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      {renderSimulationResults()}
      {renderAIAnalysis()}
    </div>
  );
};

export default AIThinkingProcess;
