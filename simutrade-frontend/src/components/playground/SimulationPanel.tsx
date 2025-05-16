import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Select,
  Slider,
  Space,
  Typography,
  Tag,
  Tooltip,
  Divider,
  Empty,
  Input,
  InputNumber,
  Form,
  Radio,
  Tabs,
  Row,
  Col,
} from 'antd';
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import '../../styles/dashboard.css';

// Custom icons for transport mode
const ShipOutlined = () => <span style={{ fontSize: '16px' }}>🚢</span>;
const RiseOutlined = () => <span style={{ fontSize: '16px' }}>✈️</span>;
const CarOutlined = () => <span style={{ fontSize: '16px' }}>🚚</span>;

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Mock data - would be fetched from API in production (GET /api/commodities)
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

// Sample origin countries - would be fetched from API in production (GET /api/countries)
const originCountries = [
  { id: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'SGP', name: 'Singapore', flag: '🇸🇬' },
  { id: 'THA', name: 'Thailand', flag: '🇹🇭' },
  { id: 'VNM', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'PHL', name: 'Philippines', flag: '🇵🇭' },
];

// Transport mode information for display
interface TransportModeInfo {
  name: string;
  icon: React.ReactNode;
  timeMultiplier: number;
  costMultiplier: number;
  description: string;
}

interface TransportModes {
  [key: string]: TransportModeInfo;
  sea: TransportModeInfo;
  air: TransportModeInfo;
  land: TransportModeInfo;
}

const transportModeInfo: TransportModes = {
  sea: {
    name: 'Sea Freight',
    icon: <ShipOutlined />,
    timeMultiplier: 1.5, // Base time multiplier
    costMultiplier: 0.8, // Cheapest option
    description: 'Cost-effective for large shipments, longer transit time',
  },
  air: {
    name: 'Air Freight',
    icon: <RiseOutlined />,
    timeMultiplier: 0.5, // Fastest option
    costMultiplier: 2.5, // Most expensive
    description: 'Fastest shipping method, ideal for high-value goods',
  },
  land: {
    name: 'Land Transport',
    icon: <CarOutlined />,
    timeMultiplier: 1.0, // Medium speed
    costMultiplier: 1.2, // Medium cost
    description: 'Good balance of cost and time for regional shipping',
  },
};

interface SimulationPanelProps {
  selectedCountry: any | null;
  onRunSimulation: (formData: any) => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
  simulationResults: any | null;
}

interface FormDataType {
  commodity: number | null;
  volume: number;
  transportMode: string;
  originCountry: string;
  customDestination: boolean;
  destinationCountry: string | null;
  destinationName: string;
  destinationLat: number | null;
  destinationLng: number | null;
  customFields: {
    price: number;
    weight: number;
  };
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  selectedCountry,
  onRunSimulation,
  onResetSimulation,
  isSimulating,
  simulationResults,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [customDestination, setCustomDestination] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    commodity: null,
    volume: 50, // default value
    transportMode: 'sea',
    originCountry: 'IDN', // default to Indonesia
    customDestination: false,
    destinationCountry: null,
    destinationName: '',
    destinationLat: null,
    destinationLng: null,
    customFields: {
      price: 1000,
      weight: 500,
    },
  });

  // Calculate estimated metrics based on current form values
  const [estimates, setEstimates] = useState({
    cost: 0,
    time: 0,
  });

  // Update estimates when form values change
  useEffect(() => {
    if (formData.commodity && formData.volume) {
      const mode = formData.transportMode;
      const baseTime = selectedCountry
        ? calculateBaseTime(selectedCountry)
        : 10;
      const basePrice = formData.customFields.price * formData.volume;

      setEstimates({
        cost: Math.round(basePrice * transportModeInfo[mode].costMultiplier),
        time: Math.round(baseTime * transportModeInfo[mode].timeMultiplier),
      });
    }
  }, [formData, selectedCountry]);

  // Helper function to calculate base shipping time based on distance
  const calculateBaseTime = (country: any) => {
    // This would be based on real distance data in production
    // For now, just some mock logic based on region
    const region = country.name || '';
    if (region.includes('United States') || region.includes('Canada')) {
      return 14; // North America
    } else if (
      region.includes('China') ||
      region.includes('Japan') ||
      region.includes('Korea')
    ) {
      return 7; // East Asia
    } else if (
      region.includes('Singapore') ||
      region.includes('Malaysia') ||
      region.includes('Thailand')
    ) {
      return 3; // Southeast Asia
    } else if (region.includes('Australia')) {
      return 10; // Oceania
    } else if (
      region.includes('Germany') ||
      region.includes('France') ||
      region.includes('UK')
    ) {
      return 18; // Europe
    }
    return 10; // Default
  };

  // Reset form when country changes
  useEffect(() => {
    if (!selectedCountry) {
      form.resetFields();
      setFormData({
        commodity: null,
        volume: 50,
        transportMode: 'sea',
        originCountry: 'IDN', // default to Indonesia
        customDestination: false,
        destinationCountry: null,
        destinationName: '',
        destinationLat: null,
        destinationLng: null,
        customFields: {
          price: 1000,
          weight: 500,
        },
      });
    }
  }, [selectedCountry, form]);

  const handleCommodityChange = (value: number) => {
    setFormData({ ...formData, commodity: value });
    form.setFieldsValue({ commodity: value });
  };

  const handleVolumeChange = (value: number) => {
    setFormData({ ...formData, volume: value });
    form.setFieldsValue({ volume: value });
  };

  const handleTransportModeChange = (mode: string) => {
    setFormData({ ...formData, transportMode: mode });
    form.setFieldsValue({ transportMode: mode });
  };

  const handleOriginCountryChange = (countryCode: string) => {
    setFormData({ ...formData, originCountry: countryCode });
    form.setFieldsValue({ originCountry: countryCode });
  };

  const handleCustomFieldChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      customFields: {
        ...formData.customFields,
        [field]: value,
      },
    });
  };

  // Toggle custom destination
  const handleCustomDestinationToggle = (checked: boolean) => {
    setCustomDestination(checked);
    setFormData({
      ...formData,
      customDestination: checked,
    });
  };

  // Update custom destination fields
  const handleCustomDestinationChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    if (!form) return;

    // Check if we have a valid destination (either selected or custom)
    if (!selectedCountry && !formData.customDestination) {
      return;
    }

    form
      .validateFields()
      .then(() => {
        // Add the transport mode info and estimates to the simulation data
        const simulationData = {
          ...formData,
          estimatedCost: estimates.cost,
          estimatedTime: estimates.time,
          transportMode: formData.transportMode,
          originCountry: formData.originCountry,
          // Use custom destination if enabled, otherwise use the selected country
          destination: formData.customDestination
            ? {
                name: formData.destinationName,
                lat: formData.destinationLat,
                lng: formData.destinationLng,
              }
            : selectedCountry,
        };
        onRunSimulation(simulationData);
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleReset = () => {
    if (!form) return;

    form.resetFields();
    onResetSimulation();
    setFormData({
      commodity: null,
      volume: 50,
      transportMode: 'sea',
      originCountry: 'IDN', // default to Indonesia
      customDestination: false,
      destinationCountry: null,
      destinationName: '',
      destinationLat: null,
      destinationLng: null,
      customFields: {
        price: 1000,
        weight: 500,
      },
    });
  };

  // Find the selected origin country object
  const getSelectedOriginCountry = () => {
    return (
      originCountries.find(
        (country) => country.id === formData.originCountry
      ) || originCountries[0]
    );
  };

  return (
    <Card
      className="simulation-panel"
      style={{
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      bordered={false}
    >
      {simulationResults ? (
        // Active simulation view with more horizontal layout
        <div>
          <Row gutter={[24, 24]} align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Title level={4} style={{ margin: 0 }}>
                  <RocketOutlined style={{ marginRight: '8px' }} />
                  Active Simulation
                </Title>
                <Text type="secondary">
                  {getSelectedOriginCountry()?.flag || '🌏'}{' '}
                  {getSelectedOriginCountry()?.name || 'Unknown'} to{' '}
                  {selectedCountry?.name || 'Selected Destination'}
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  New Simulation
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      ) : (
        // Simulation setup with tabs and improved horizontal layout
        <div>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>
            <RocketOutlined style={{ marginRight: '8px' }} />
            Configure Trade Simulation
          </Title>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: '1',
                  label: (
                    <span>
                      <GlobalOutlined /> Basic Info
                    </span>
                  ),
                  children: (
                    <Row gutter={[24, 16]}>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                          name="commodity"
                          label="Commodity"
                          rules={[
                            {
                              required: true,
                              message: 'Please select a commodity',
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select a commodity"
                            style={{ width: '100%' }}
                            onChange={handleCommodityChange}
                          >
                            {commodities.map((commodity) => (
                              <Option key={commodity.id} value={commodity.id}>
                                <Space>
                                  <span>{commodity.icon}</span>
                                  <span>{commodity.name}</span>
                                </Space>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                          name="originCountry"
                          label="Origin Country"
                          initialValue="IDN"
                        >
                          <Select
                            placeholder="Select origin country"
                            style={{ width: '100%' }}
                            onChange={handleOriginCountryChange}
                          >
                            {originCountries.map((country) => (
                              <Option key={country.id} value={country.id}>
                                <Space>
                                  <span>{country.flag}</span>
                                  <span>{country.name}</span>
                                </Space>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="volume" label="Volume (units)">
                          <Slider
                            min={1}
                            max={100}
                            defaultValue={50}
                            onChange={handleVolumeChange}
                            tooltip={{ formatter: (value) => `${value} units` }}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={24}>
                        <div style={{ marginBottom: '16px' }}>
                          <Text strong>Destination</Text>
                          {selectedCountry ? (
                            <Tag
                              color="green"
                              style={{ marginLeft: '8px', padding: '0 8px' }}
                            >
                              {selectedCountry.name}
                            </Tag>
                          ) : (
                            <Tag
                              color="warning"
                              style={{ marginLeft: '8px', padding: '0 8px' }}
                            >
                              Select country on map
                            </Tag>
                          )}
                        </div>
                      </Col>

                      <Col span={24}>
                        <Text type="secondary">
                          <InfoCircleOutlined style={{ marginRight: '8px' }} />
                          Select a destination country on the map or enter
                          custom coordinates
                        </Text>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span>
                      <CompassOutlined /> Transport Options
                    </span>
                  ),
                  children: (
                    <Row gutter={[24, 16]}>
                      <Col span={24}>
                        <Form.Item
                          name="transportMode"
                          label="Transport Mode"
                          initialValue="sea"
                        >
                          <Radio.Group
                            onChange={(e) =>
                              handleTransportModeChange(e.target.value)
                            }
                            defaultValue="sea"
                            buttonStyle="solid"
                          >
                            <Radio.Button value="sea">
                              <Space>
                                <ShipOutlined />
                                <span>Sea Freight</span>
                              </Space>
                            </Radio.Button>
                            <Radio.Button value="air">
                              <Space>
                                <RiseOutlined />
                                <span>Air Freight</span>
                              </Space>
                            </Radio.Button>
                            <Radio.Button value="land">
                              <Space>
                                <CarOutlined />
                                <span>Land Transport</span>
                              </Space>
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      </Col>

                      <Col xs={24}>
                        <Card
                          size="small"
                          title={
                            <Space>
                              {transportModeInfo[formData.transportMode]?.icon}
                              <span>
                                {
                                  transportModeInfo[formData.transportMode]
                                    ?.name
                                }
                              </span>
                            </Space>
                          }
                          style={{ marginBottom: '16px' }}
                        >
                          <Paragraph>
                            {
                              transportModeInfo[formData.transportMode]
                                ?.description
                            }
                          </Paragraph>
                        </Card>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span>
                      <SettingOutlined /> Advanced Settings
                    </span>
                  ),
                  children: (
                    <Row gutter={[24, 16]}>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item label="Price per Unit ($)">
                          <InputNumber
                            style={{ width: '100%' }}
                            defaultValue={1000}
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            onChange={(value) =>
                              handleCustomFieldChange('price', value)
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={6}>
                        <Form.Item label="Weight per Unit (kg)">
                          <InputNumber
                            style={{ width: '100%' }}
                            defaultValue={500}
                            onChange={(value) =>
                              handleCustomFieldChange('weight', value)
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />

            <Divider style={{ margin: '24px 0 16px' }} />

            <div className="preliminary-estimates">
              <Title level={5}>Preliminary Estimates</Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <Card
                    style={{
                      textAlign: 'center',
                      backgroundColor: '#f9f9ff',
                      borderRadius: '8px',
                    }}
                    bordered={false}
                  >
                    <DollarOutlined
                      style={{
                        fontSize: '24px',
                        color: '#1890ff',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    />
                    <div>Estimated Cost</div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        margin: '8px 0',
                      }}
                    >
                      ${estimates.cost.toLocaleString()}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card
                    style={{
                      textAlign: 'center',
                      backgroundColor: '#fff9f9',
                      borderRadius: '8px',
                    }}
                    bordered={false}
                  >
                    <ClockCircleOutlined
                      style={{
                        fontSize: '24px',
                        color: '#ff7875',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    />
                    <div>Est. Time</div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        margin: '8px 0',
                      }}
                    >
                      {estimates.time} days
                    </div>
                  </Card>
                </Col>
              </Row>
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: 'rgba(0, 0, 0, 0.45)',
                  textAlign: 'center',
                }}
              >
                These are preliminary estimates and may vary in the final
                simulation
              </div>
            </div>

            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleReset}
                style={{ marginRight: '8px' }}
              >
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<ArrowRightOutlined />}
                loading={isSimulating}
                disabled={!selectedCountry && !customDestination}
              >
                Run Simulation
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Card>
  );
};

export default SimulationPanel;
