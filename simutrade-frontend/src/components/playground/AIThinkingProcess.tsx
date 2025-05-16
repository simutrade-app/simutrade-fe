import React, { useState } from 'react';
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
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ThinkingNode {
  id: number;
  title: string;
  content: string;
  type: 'route' | 'regulation' | 'weather' | 'cost' | 'risk' | 'recommendation';
}

interface AIThinkingProcessProps {
  simulationData: Record<string, unknown>;
  isSimulating: boolean;
  authToken?: string; // Optional token passed as prop
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'route':
      return <CompassOutlined />;
    case 'regulation':
      return <FileSearchOutlined />;
    case 'weather':
      return <CloudOutlined />;
    case 'cost':
      return <DollarOutlined />;
    case 'risk':
      return <WarningOutlined />;
    case 'recommendation':
      return <CheckCircleOutlined />;
    default:
      return <ThunderboltOutlined />;
  }
};

// Prompt templates for trade analysis
const PROMPT_TEMPLATES = [
  {
    id: 'regulations',
    title: 'Export Regulation Analysis',
    icon: <FileSearchOutlined />,
    getQuery: (origin: string, destination: string, commodity: string) =>
      `What are the export regulations for ${commodity} from ${origin} to ${destination}?`,
  },
  {
    id: 'logistics',
    title: 'Logistics Vendor Recommendations',
    icon: <TeamOutlined />,
    getQuery: (
      origin: string,
      destination: string,
      commodity: string,
      transportMode: string
    ) =>
      `Best logistics vendors for shipping ${commodity} via ${transportMode} from ${origin} to ${destination}.`,
  },
  {
    id: 'route',
    title: 'Shipping Route Optimization',
    icon: <CompassOutlined />,
    getQuery: (origin: string, destination: string, transportMode: string) =>
      `Best shipping route via ${transportMode} from ${origin} to ${destination}.`,
  },
  {
    id: 'risks',
    title: 'Trade Risk Analysis',
    icon: <WarningOutlined />,
    getQuery: (origin: string, destination: string, transportMode: string) =>
      `Risks in trade via ${transportMode} from ${origin} to ${destination}.`,
  },
  {
    id: 'costs',
    title: 'Detailed Cost Estimation',
    icon: <DollarOutlined />,
    getQuery: (origin: string, destination: string, transportMode: string) =>
      `Cost breakdown for shipping via ${transportMode} from ${origin} to ${destination}.`,
  },
];

const AIThinkingProcess: React.FC<AIThinkingProcessProps> = ({
  simulationData,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingNode[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // Extract simulation data to use in prompts
  const extractSimulationInfo = () => {
    const transportMode = (simulationData.transportMode as string) || 'sea';
    const originCountry =
      (simulationData.originCountry as string) || 'Unknown Origin';
    const destinationName =
      ((simulationData.destination as Record<string, unknown>)
        ?.name as string) ||
      (simulationData.destinationName as string) ||
      'Unknown Destination';
    const commodityId = simulationData.commodity as number;

    let commodityName = 'Unknown Commodity';
    if (commodityId !== undefined) {
      const foundCommodity = commodities.find((c) => c.id === commodityId);
      if (foundCommodity) {
        commodityName = foundCommodity.name;
      }
    } else if (typeof simulationData.commodity === 'string') {
      commodityName = simulationData.commodity;
    }

    return {
      transportMode,
      originCountry,
      destinationName,
      commodity: commodityName,
    };
  };

  // Get query based on selected template
  const getQueryFromTemplate = (templateId: string) => {
    const { transportMode, originCountry, destinationName, commodity } =
      extractSimulationInfo();
    const template = PROMPT_TEMPLATES.find((t) => t.id === templateId);

    if (!template) return '';

    return template.getQuery(
      originCountry,
      destinationName,
      commodity,
      transportMode
    );
  };

  // Fetch thinking process from API with specific prompt
  const fetchThinkingProcess = async (promptId: string) => {
    setLoading(true);
    setApiError(null);
    setThinkingSteps([]);
    setSelectedPrompt(promptId);

    try {
      const query = getQueryFromTemplate(promptId);
      if (!query) {
        throw new Error('Invalid prompt template');
      }

      // For demo purposes, we'll skip the API call and just generate demo thinking steps
      console.log('Simulating API call with query:', query);

      // Generate thinking steps based on prompt type
      generateThinkingSteps(promptId);

      /* 
      // Real API call would be:
      const token = authToken || getAuthToken();
      
      if (!token || token.trim() === '') {
        throw new Error('Authentication token is missing or invalid');
      }

      console.log('Using auth token:', token.substring(0, 5) + '...');

      const response = await fetch(
        'https://api.simutrade.app/service/ai-agent/vertex',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: query,
          }),
        }
      );

      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid or expired token');
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Agent Response:', data);
      */
    } catch (error) {
      console.error('Error fetching AI thinking process:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setApiError(
        errorMessage.includes('Authentication')
          ? 'Authentication failed. Please log in again or check your session.'
          : 'Failed to retrieve AI thinking process. Please try again later.'
      );
      setLoading(false);
    }
  };

  // Generate thinking steps based on prompt type
  const generateThinkingSteps = (promptId: string) => {
    const { transportMode, originCountry, destinationName, commodity } =
      extractSimulationInfo();

    // Variations of steps based on prompt type
    let steps: ThinkingNode[] = [];

    switch (promptId) {
      case 'regulations':
        steps = [
          {
            id: 1,
            title: 'Commodity Identification',
            content: `Identifying regulatory category for ${commodity}.`,
            type: 'regulation',
          },
          {
            id: 2,
            title: 'Origin Country Regulation Analysis',
            content: `Examining export regulations for ${commodity} from ${originCountry}.`,
            type: 'regulation',
          },
          {
            id: 3,
            title: 'Destination Country Regulation Analysis',
            content: `Examining import regulations for ${commodity} to ${destinationName}.`,
            type: 'regulation',
          },
          {
            id: 4,
            title: 'Documentation Requirements',
            content: `Identifying required documents: Certificate of Origin, Declaration of Origin, Commercial Invoice, Packing List, and Bill of Lading.`,
            type: 'regulation',
          },
          {
            id: 5,
            title: 'Tax and Duty Analysis',
            content: `Calculating applicable tariffs and taxes for ${commodity} in ${destinationName}.`,
            type: 'cost',
          },
          {
            id: 6,
            title: 'Compliance Recommendations',
            content: `Developing regulatory compliance strategy for exporting ${commodity} from ${originCountry} to ${destinationName}.`,
            type: 'recommendation',
          },
        ];
        break;

      case 'logistics':
        steps = [
          {
            id: 1,
            title: 'Logistics Needs Analysis',
            content: `Identifying specific requirements for shipping ${commodity} via ${transportMode}.`,
            type: 'route',
          },
          {
            id: 2,
            title: 'Potential Vendor Identification',
            content: `Listing logistics vendors operating on the ${originCountry} to ${destinationName} route.`,
            type: 'route',
          },
          {
            id: 3,
            title: 'Cost Analysis',
            content: `Comparing cost structures from various vendors for shipping ${commodity}.`,
            type: 'cost',
          },
          {
            id: 4,
            title: 'Reliability Evaluation',
            content: `Evaluating track record of timeliness and cargo security from logistics vendors.`,
            type: 'risk',
          },
          {
            id: 5,
            title: 'Special Considerations',
            content: `Analyzing vendor capabilities in handling special requirements for ${commodity}.`,
            type: 'route',
          },
          {
            id: 6,
            title: 'Vendor Recommendations',
            content: `Presenting 3 best vendor options with considerations for price, reliability, and service for the ${originCountry} to ${destinationName} route.`,
            type: 'recommendation',
          },
        ];
        break;

      case 'route':
        steps = [
          {
            id: 1,
            title: 'Origin and Destination Point Analysis',
            content: `Identifying exact locations and infrastructure in ${originCountry} and ${destinationName}.`,
            type: 'route',
          },
          {
            id: 2,
            title: 'Alternative Route Mapping',
            content: `Analyzing several alternative ${transportMode} routes from ${originCountry} to ${destinationName}.`,
            type: 'route',
          },
          {
            id: 3,
            title: 'Travel Time Analysis',
            content: `Calculating estimated travel time for each alternative route.`,
            type: 'route',
          },
          {
            id: 4,
            title: 'Potential Obstacles Analysis',
            content: `Identifying congestion points, restrictions, or risks along the route.`,
            type: 'risk',
          },
          {
            id: 5,
            title: 'Weather and Season Considerations',
            content: `Analyzing weather conditions and seasonal patterns that may affect the journey.`,
            type: 'weather',
          },
          {
            id: 6,
            title: 'Optimal Route Recommendation',
            content: `Presenting optimal ${transportMode} route from ${originCountry} to ${destinationName} considering time, cost, and risk.`,
            type: 'recommendation',
          },
        ];
        break;

      case 'risks':
        steps = [
          {
            id: 1,
            title: 'Political Risk Analysis',
            content: `Evaluating political stability and trade relations between ${originCountry} and ${destinationName}.`,
            type: 'risk',
          },
          {
            id: 2,
            title: 'Economic Risk Analysis',
            content: `Analyzing currency fluctuations, inflation, and economic conditions that may affect trade.`,
            type: 'risk',
          },
          {
            id: 3,
            title: 'Transportation Risks',
            content: `Identifying specific risks for shipping ${commodity} via ${transportMode}.`,
            type: 'risk',
          },
          {
            id: 4,
            title: 'Regulatory Risk Analysis',
            content: `Evaluating trade regulation changes that may affect ${commodity} export.`,
            type: 'regulation',
          },
          {
            id: 5,
            title: 'Risk Mitigation Strategy',
            content: `Developing strategies to reduce identified risks.`,
            type: 'risk',
          },
          {
            id: 6,
            title: 'Insurance Recommendations',
            content: `Presenting appropriate insurance options to protect ${commodity} shipment from ${originCountry} to ${destinationName}.`,
            type: 'recommendation',
          },
        ];
        break;

      case 'costs':
        steps = [
          {
            id: 1,
            title: 'Main Transportation Costs',
            content: `Calculating basic ${transportMode} costs for the ${originCountry} to ${destinationName} route.`,
            type: 'cost',
          },
          {
            id: 2,
            title: 'Handling & Packaging Costs',
            content: `Analyzing packaging and handling costs for ${commodity}.`,
            type: 'cost',
          },
          {
            id: 3,
            title: 'Customs & Tax Costs',
            content: `Calculating import duties, taxes, and other customs fees in ${destinationName}.`,
            type: 'cost',
          },
          {
            id: 4,
            title: 'Insurance Costs',
            content: `Calculating insurance costs to protect the ${commodity} shipment.`,
            type: 'cost',
          },
          {
            id: 5,
            title: 'Document & Administrative Costs',
            content: `Analyzing costs for document processing, certification, and other administrative requirements.`,
            type: 'cost',
          },
          {
            id: 6,
            title: 'Cost Optimization Recommendations',
            content: `Presenting strategies to optimize costs for shipping ${commodity} from ${originCountry} to ${destinationName}.`,
            type: 'recommendation',
          },
        ];
        break;

      default:
        // Default steps if no matching prompt
        steps = [
          {
            id: 1,
            title: 'Route Analysis',
            content: `Analyzing optimal ${transportMode} routes from ${originCountry} to ${destinationName}. Considering main shipping lanes, ports, and transit hubs.`,
            type: 'route',
          },
          {
            id: 2,
            title: 'Regulatory Assessment',
            content: `Checking import/export regulations for ${commodity} between ${originCountry} and ${destinationName}. Verifying required documentation, certificates, and compliance requirements.`,
            type: 'regulation',
          },
          {
            id: 3,
            title: 'Weather & Seasonal Factors',
            content: `Evaluating weather patterns and seasonal factors along the ${transportMode} route. ${transportMode === 'sea' ? 'Avoiding monsoon seasons and high-risk typhoon areas.' : transportMode === 'air' ? 'Considering jet streams and avoiding storm systems.' : 'Identifying potential road closures or seasonal passage restrictions.'}`,
            type: 'weather',
          },
          {
            id: 4,
            title: 'Cost Structure Analysis',
            content: `Calculating total costs including ${transportMode} freight, handling, insurance, customs duties, and documentation. Comparing different carriers and identifying cost optimization opportunities.`,
            type: 'cost',
          },
          {
            id: 5,
            title: 'Risk Assessment',
            content: `Identifying potential risks: ${transportMode === 'sea' ? 'port congestion, piracy concerns, and transit delays' : transportMode === 'air' ? 'capacity constraints, handling damage, and customs clearance delays' : 'border crossing delays, security concerns, and road quality issues'}. Developing mitigation strategies and contingency plans.`,
            type: 'risk',
          },
          {
            id: 6,
            title: 'Recommendations',
            content: `Recommended approach: ${transportMode === 'sea' ? 'Direct shipping with FCL (Full Container Load) to minimize handling' : transportMode === 'air' ? 'Consolidated air freight with trusted handling agent at destination' : 'Bonded transit through intermediate countries with experienced carrier'}. ${transportMode === 'sea' ? 'Secure marine insurance with extended coverage.' : transportMode === 'air' ? 'Use specialized packaging for protection.' : 'Implement real-time tracking and multiple driver teams.'}`,
            type: 'recommendation',
          },
        ];
    }

    setThinkingSteps(steps);
    animateThinkingProcess(steps);
  };

  // Function to animate the thinking process
  const animateThinkingProcess = (steps: ThinkingNode[]) => {
    setCurrentStep(0);
    let step = 0;

    const interval = setInterval(() => {
      if (step < steps.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 1200); // Show a new step every 1.2 seconds

    return () => clearInterval(interval);
  };

  // Render prompt selection buttons
  const renderPromptSelectionButtons = () => {
    return (
      <div style={{ marginBottom: '24px' }}>
        <Title level={5}>Select AI Analysis:</Title>
        <Row gutter={[16, 16]}>
          {PROMPT_TEMPLATES.map((template) => (
            <Col xs={24} sm={12} md={8} key={template.id}>
              <Button
                type={selectedPrompt === template.id ? 'primary' : 'default'}
                icon={template.icon}
                onClick={() => fetchThinkingProcess(template.id)}
                style={{
                  width: '100%',
                  height: 'auto',
                  padding: '16px 8px',
                  textAlign: 'left',
                }}
                loading={loading && selectedPrompt === template.id}
              >
                {template.title}
              </Button>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // Render thinking process view
  const renderThinkingProcess = () => {
    if (loading && !thinkingSteps.length) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" tip="AI analyzing trade options..." />
          <Paragraph style={{ marginTop: '16px' }}>
            Our AI agent is analyzing your trade scenario and considering all
            factors...
          </Paragraph>
        </div>
      );
    }

    if (apiError) {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <WarningOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
          <Paragraph style={{ marginTop: '16px' }}>{apiError}</Paragraph>
        </div>
      );
    }

    if (!thinkingSteps.length) {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <BulbOutlined style={{ fontSize: '48px', color: '#faad14' }} />
          <Paragraph style={{ marginTop: '16px' }}>
            Select one of the analysis types above to see the AI thinking
            process.
          </Paragraph>
        </div>
      );
    }

    return (
      <Steps
        current={currentStep}
        direction="vertical"
        items={thinkingSteps.map((step) => ({
          title: step.title,
          description: step.content,
          icon: getNodeIcon(step.type),
          status:
            thinkingSteps.indexOf(step) <= currentStep ? 'finish' : 'wait',
        }))}
      />
    );
  };

  return (
    <Card
      title={
        <Space>
          <RobotOutlined />
          <Title level={4} style={{ margin: 0 }}>
            AI Trade Analysis
          </Title>
        </Space>
      }
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        marginTop: '24px',
      }}
      extra={<Tag color="blue">AI-Powered Insights</Tag>}
    >
      <Paragraph>
        Select an analysis type to see how AI processes your trade data step by
        step.
      </Paragraph>

      {renderPromptSelectionButtons()}
      {renderThinkingProcess()}
    </Card>
  );
};

// Mock commodities data to use when parsing commodity ID
const commodities = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Textiles' },
  { id: 3, name: 'Coffee' },
  { id: 4, name: 'Automotive Parts' },
  { id: 5, name: 'Pharmaceuticals' },
  { id: 6, name: 'Furniture' },
  { id: 7, name: 'Jewelry' },
  { id: 8, name: 'Toys' },
];

export default AIThinkingProcess;
