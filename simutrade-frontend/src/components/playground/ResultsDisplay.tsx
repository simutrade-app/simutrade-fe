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
const ModernProgressBar = ({ percent, color }) => {
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
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutlined
              style={{ color: '#52c41a', marginRight: '8px', fontSize: '18px' }}
            />
            <span style={{ fontSize: '16px', fontWeight: '500' }}>
              Simulation Results
            </span>
          </div>
          <TransportModeLabel mode={transportMode} />
        </div>
      }
      className="results-card"
      bordered={false}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
      extra={
        <Button
          icon={<DownloadOutlined />}
          type="primary"
          ghost
          style={{ borderRadius: '6px' }}
        >
          Export Results
        </Button>
      }
    >
      {/* KPI Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '28px' }}>
        {/* Trade Efficiency Score */}
        <Col xs={24} md={8}>
          <Card
            className="metric-card"
            bordered={false}
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '12px',
              padding: '4px',
              height: '100%',
            }}
          >
            <div style={{ padding: '12px 16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <Text
                  strong
                  style={{ fontSize: '16px', color: 'rgba(0,0,0,0.85)' }}
                >
                  Trade Efficiency Score
                </Text>
                <div
                  style={{
                    background: getScoreColor(results.tradeEfficiencyScore),
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '16px',
                    padding: '2px 12px',
                    fontSize: '14px',
                  }}
                >
                  {getEfficiencyGrade(results.tradeEfficiencyScore)}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Tooltip title="Score is calculated based on route optimization, cost efficiency, and regulatory compliance">
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <InfoCircleOutlined style={{ marginRight: '5px' }} />
                    Overall trade route efficiency
                  </Text>
                </Tooltip>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: '10px',
                }}
              >
                <Text
                  style={{
                    fontSize: '38px',
                    fontWeight: 'bold',
                    color: getScoreColor(results.tradeEfficiencyScore),
                    lineHeight: 1,
                  }}
                >
                  {results.tradeEfficiencyScore}
                </Text>
                <Text
                  style={{
                    color: 'rgba(0,0,0,0.45)',
                    marginLeft: '4px',
                    marginBottom: '6px',
                  }}
                >
                  / 100
                </Text>
              </div>

              <ModernProgressBar
                percent={results.tradeEfficiencyScore}
                color={getScoreColor(results.tradeEfficiencyScore)}
              />
            </div>
          </Card>
        </Col>

        {/* Estimated Cost */}
        <Col xs={24} md={8}>
          <Card
            className="metric-card"
            bordered={false}
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '12px',
              padding: '4px',
              height: '100%',
            }}
          >
            <div style={{ padding: '12px 16px' }}>
              <div style={{ marginBottom: '10px' }}>
                <Text
                  strong
                  style={{ fontSize: '16px', color: 'rgba(0,0,0,0.85)' }}
                >
                  Estimated Cost
                </Text>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Tooltip title="Costs include shipping, insurance, customs duties, and handling fees">
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <InfoCircleOutlined style={{ marginRight: '5px' }} />
                    Total export operation costs
                  </Text>
                </Tooltip>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(24,144,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  <DollarOutlined
                    style={{ fontSize: '20px', color: '#1890ff' }}
                  />
                </div>
                <div>
                  <Text
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#1890ff',
                      lineHeight: 1,
                    }}
                  >
                    ${results.costEstimate.toLocaleString()}
                  </Text>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '13px',
                      display: 'block',
                      marginTop: '4px',
                    }}
                  >
                    Includes taxes and customs fees
                  </Text>
                </div>
              </div>

              <ModernProgressBar percent={70} color="#1890ff" />
            </div>
          </Card>
        </Col>

        {/* Estimated Time */}
        <Col xs={24} md={8}>
          <Card
            className="metric-card"
            bordered={false}
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '12px',
              padding: '4px',
              height: '100%',
            }}
          >
            <div style={{ padding: '12px 16px' }}>
              <div style={{ marginBottom: '10px' }}>
                <Text
                  strong
                  style={{ fontSize: '16px', color: 'rgba(0,0,0,0.85)' }}
                >
                  Estimated Time
                </Text>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Tooltip title="Includes processing, transit, and customs clearance time">
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <InfoCircleOutlined style={{ marginRight: '5px' }} />
                    Total delivery timeline
                  </Text>
                </Tooltip>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(250,140,22,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  <ClockCircleOutlined
                    style={{ fontSize: '20px', color: '#fa8c16' }}
                  />
                </div>
                <div>
                  <Text
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#fa8c16',
                      lineHeight: 1,
                    }}
                  >
                    {results.timeEstimate} days
                  </Text>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '13px',
                      display: 'block',
                      marginTop: '4px',
                    }}
                  >
                    Door-to-door delivery time
                  </Text>
                </div>
              </div>

              <ModernProgressBar percent={60} color="#fa8c16" />
            </div>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '8px 0 24px 0' }} />

      {/* Tabs for detailed information */}
      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        size="large"
        className="results-tabs"
        items={[
          {
            key: '1',
            label: (
              <span>
                <ThunderboltOutlined /> AI Recommendations
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
                <FileTextOutlined /> Export Documents
              </span>
            ),
            children: formatExportDocuments(),
          },
        ]}
      />

      <style jsx>{`
        .results-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #1890ff;
          font-weight: 500;
        }
        .results-tabs .ant-tabs-ink-bar {
          background-color: #1890ff;
          height: 3px;
          border-radius: 3px;
        }
        .results-tabs .ant-tabs-nav-list {
          width: 100%;
          display: flex;
        }
        .results-tabs .ant-tabs-tab {
          flex: 1;
          display: flex;
          justify-content: center;
          margin: 0 8px;
        }
        .results-tabs .ant-tabs-tab:first-child {
          margin-left: 0;
        }
        .results-tabs .ant-tabs-tab:last-child {
          margin-right: 0;
        }
        .metric-card {
          transition: all 0.2s;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </Card>
  );
};

export default ResultsDisplay;
