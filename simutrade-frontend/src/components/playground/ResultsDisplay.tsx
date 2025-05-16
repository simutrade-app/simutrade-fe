import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  List,
  Divider,
  Space,
  Tooltip,
} from 'antd';
import {
  ThunderboltOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// Custom icons for transport mode
const ShipOutlined = () => <span style={{ fontSize: '16px' }}>🚢</span>;
const RiseOutlined = () => <span style={{ fontSize: '16px' }}>✈️</span>;
const CarOutlined = () => <span style={{ fontSize: '16px' }}>🚚</span>;

const { Title, Text, Paragraph } = Typography;

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
  };
}

// Custom component for displaying transport mode information
const TransportModeLabel = ({ mode }: { mode: string }) => {
  const getIconForMode = () => {
    switch (mode) {
      case 'air':
        return <RiseOutlined />;
      case 'land':
        return <CarOutlined />;
      case 'sea':
      default:
        return <ShipOutlined />;
    }
  };

  const getTextForMode = () => {
    switch (mode) {
      case 'air':
        return 'Air Freight';
      case 'land':
        return 'Land Transport';
      case 'sea':
      default:
        return 'Sea Freight';
    }
  };

  const getColorForMode = () => {
    switch (mode) {
      case 'air':
        return '#1890ff'; // blue
      case 'land':
        return '#FF9800'; // orange
      case 'sea':
      default:
        return '#4CAF50'; // green
    }
  };

  return (
    <Tag
      color={getColorForMode()}
      style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '12px' }}
    >
      {getIconForMode()} {getTextForMode()}
    </Tag>
  );
};

// Modern progress bar component
interface ModernProgressBarProps {
  percent: number;
  color: string;
}

const ModernProgressBar = ({ percent, color }: ModernProgressBarProps) => {
  return (
    <div style={{ width: '100%', marginTop: '8px' }}>
      <div
        style={{
          height: '8px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: color,
            borderRadius: '4px',
            backgroundImage: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
            transition: 'width 1s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [activeTabKey, setActiveTabKey] = useState('1');

  // Default to sea if not specified
  const transportMode = results.transportMode || 'sea';

  // Function to determine color for efficiency score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#faad14'; // Yellow/Orange
    return '#f5222d'; // Red
  };

  // Function to determine color for risk level
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return '#f5222d'; // Red
      case 'medium':
        return '#faad14'; // Orange
      case 'low':
        return '#1890ff'; // Blue
      case 'very low':
        return '#52c41a'; // Green
      default:
        return '#52c41a'; // Green
    }
  };

  // Format efficiency grade based on score
  const getEfficiencyGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    return 'F';
  };

  // Format recommendations to make them more presentable
  const formatRecommendations = () => {
    return (
      <div className="recommendations-section">
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ margin: '0 0 8px 0' }}>
            <ThunderboltOutlined
              style={{ color: '#1890ff', marginRight: '8px' }}
            />
            AI-Generated Recommendations
          </Title>
          <Text type="secondary">
            Based on current market conditions and trade regulations
          </Text>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={results.recommendations}
          renderItem={(item, index) => (
            <List.Item
              style={{
                padding: '16px',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                borderRadius: '8px',
                marginBottom: '12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      marginTop: '4px',
                    }}
                  >
                    {index + 1}
                  </div>
                }
                description={
                  <div style={{ marginLeft: '8px' }}>
                    <Text style={{ fontSize: '16px', display: 'block' }}>
                      {item}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button type="default" icon={<LineChartOutlined />}>
            View Detailed Analysis
          </Button>
        </div>
      </div>
    );
  };

  // Format risk assessment for better display
  const formatRiskAssessment = () => {
    return (
      <div className="risk-assessment-section">
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ margin: '0 0 8px 0' }}>
            <WarningOutlined style={{ color: '#faad14', marginRight: '8px' }} />
            Risk Assessment Report
          </Title>
          <Text type="secondary">
            Potential challenges and mitigations for this trade route
          </Text>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={results.risks}
          renderItem={(risk) => (
            <List.Item
              style={{
                padding: '16px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '12px',
                borderLeft: `4px solid ${getRiskColor(risk.level)}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <List.Item.Meta
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text strong style={{ fontSize: '16px' }}>
                      {risk.type}
                    </Text>
                    <Tag
                      color={getRiskColor(risk.level)}
                      style={{
                        borderRadius: '12px',
                        fontSize: '12px',
                        padding: '0 8px',
                      }}
                    >
                      {risk.level}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: '14px',
                        display: 'block',
                        marginTop: '8px',
                      }}
                    >
                      {risk.impact}
                    </Text>
                    <div style={{ marginTop: '12px' }}>
                      <Button
                        type="link"
                        size="small"
                        style={{ paddingLeft: '0' }}
                      >
                        View mitigation strategies <RightOutlined />
                      </Button>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Space>
            <Button type="default" icon={<DownloadOutlined />}>
              Download Risk Report
            </Button>
            <Tooltip title="Request a detailed risk analysis from our experts">
              <Button icon={<InfoCircleOutlined />}>
                Request Expert Analysis
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>
    );
  };

  // Format export documents tab
  const formatExportDocuments = () => {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center' }}>
        <div className="documents-header" style={{ marginBottom: '30px' }}>
          <FileTextOutlined
            style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}
          />
          <Title level={4}>Export Documentation Suite</Title>
          <Paragraph
            style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}
          >
            Generate comprehensive export documentation based on your simulation
            results. All documents are pre-filled with your route and commodity
            data.
          </Paragraph>
        </div>

        <Row
          gutter={[24, 24]}
          style={{ maxWidth: '900px', margin: '0 auto 30px auto' }}
        >
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: '8px',
              }}
            >
              <div style={{ margin: '12px 0' }}>
                <FileTextOutlined
                  style={{ fontSize: '40px', color: '#1890ff' }}
                />
              </div>
              <Title level={5}>Commercial Invoice</Title>
              <Text type="secondary">
                Standard commercial invoice with your export details
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: '8px',
              }}
            >
              <div style={{ margin: '12px 0' }}>
                <FileTextOutlined
                  style={{ fontSize: '40px', color: '#1890ff' }}
                />
              </div>
              <Title level={5}>Packing List</Title>
              <Text type="secondary">
                Detailed packing information for customs clearance
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: '8px',
              }}
            >
              <div style={{ margin: '12px 0' }}>
                <FileTextOutlined
                  style={{ fontSize: '40px', color: '#1890ff' }}
                />
              </div>
              <Title level={5}>Bill of Lading</Title>
              <Text type="secondary">
                Transport document for shipping goods
              </Text>
            </Card>
          </Col>
        </Row>

        <Space size="large">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            size="large"
            style={{
              minWidth: '220px',
              height: '48px',
              borderRadius: '6px',
            }}
          >
            Generate All Documents
          </Button>
          <Button icon={<PrinterOutlined />} size="large">
            Print Preview
          </Button>
        </Space>

        <div style={{ marginTop: '24px' }}>
          <Text type="secondary">
            Documents are compliant with international trade standards and
            regulations
          </Text>
        </div>
      </div>
    );
  };

  return (
    <Card
      style={{
        marginTop: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      bordered={false}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div className="score-display" style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ThunderboltOutlined style={{ marginRight: '8px' }} />
              Trade Efficiency Score
            </div>
            <div
              style={{
                width: '160px',
                height: '160px',
                margin: '0 auto',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                background: `conic-gradient(${getScoreColor(
                  results.tradeEfficiencyScore
                )} ${
                  (results.tradeEfficiencyScore / 100) * 360
                }deg, #f5f5f5 0deg)`,
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    lineHeight: '1',
                    color: getScoreColor(results.tradeEfficiencyScore),
                  }}
                >
                  {results.tradeEfficiencyScore}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: getScoreColor(results.tradeEfficiencyScore),
                  }}
                >
                  Grade: {getEfficiencyGrade(results.tradeEfficiencyScore)}
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ marginBottom: '8px' }}>
                <Title level={5} style={{ margin: 0 }}>
                  Simulation Results
                </Title>
                <Text type="secondary">
                  Based on your selected parameters and market conditions
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{
                  textAlign: 'center',
                  backgroundColor: 'rgba(24, 144, 255, 0.05)',
                  height: '100%',
                }}
                bordered={false}
              >
                <TransportModeLabel mode={transportMode} />
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Transport Mode
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{
                  textAlign: 'center',
                  backgroundColor: 'rgba(82, 196, 26, 0.05)',
                  height: '100%',
                }}
                bordered={false}
              >
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  ${results.costEstimate.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px' }}>Total Cost</div>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{
                  textAlign: 'center',
                  backgroundColor: 'rgba(250, 173, 20, 0.05)',
                  height: '100%',
                }}
                bordered={false}
              >
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {results.timeEstimate} days
                </div>
                <div style={{ fontSize: '14px' }}>Delivery Time</div>
              </Card>
            </Col>
          </Row>

          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                onChange={setActiveTabKey}
                items={[
                  {
                    key: '1',
                    label: (
                      <span>
                        <ThunderboltOutlined /> Recommendations
                      </span>
                    ),
                    children: formatRecommendations(),
                  },
                  {
                    key: '2',
                    label: (
                      <span>
                        <WarningOutlined /> Risk Assessment
                      </span>
                    ),
                    children: formatRiskAssessment(),
                  },
                  {
                    key: '3',
                    label: (
                      <span>
                        <FileTextOutlined /> Documentation
                      </span>
                    ),
                    children: formatExportDocuments(),
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        <Button icon={<DownloadOutlined />}>Export Report</Button>
        <Button icon={<PrinterOutlined />}>Print</Button>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
