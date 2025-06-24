import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Select,
  Space,
  Typography,
  Tag,
  Divider,
  Input,
  InputNumber,
  Form,
  Row,
  Col,
  message,
  Tooltip,
  Badge,
  Avatar,
  Collapse,
} from 'antd';
import {
  ArrowRightOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  CompassOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import '../../styles/dashboard.css';

// Import the CountryDropdown component
import CountryDropdown from './CountryDropdown';
import type { Country } from './CountrySelectorButton';

// Custom icons for transport mode
const ShipOutlined = () => <span style={{ fontSize: '32px' }}>🚢</span>;
const RiseOutlined = () => <span style={{ fontSize: '32px' }}>✈️</span>;
const CarOutlined = () => <span style={{ fontSize: '32px' }}>🚚</span>;

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Mock data with enhanced visual properties
const commodities = [
  { id: 1, name: 'Electronics', icon: '🔌', color: '#1890ff', bgColor: '#e6f7ff' },
  { id: 2, name: 'Textiles', icon: '🧵', color: '#52c41a', bgColor: '#f6ffed' },
  { id: 3, name: 'Coffee', icon: '☕', color: '#fa8c16', bgColor: '#fff7e6' },
  { id: 4, name: 'Automotive Parts', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff' },
  { id: 5, name: 'Pharmaceuticals', icon: '💊', color: '#eb2f96', bgColor: '#fff0f6' },
  { id: 6, name: 'Furniture', icon: '🪑', color: '#13c2c2', bgColor: '#e6fffb' },
  { id: 7, name: 'Jewelry', icon: '💎', color: '#faad14', bgColor: '#fffbe6' },
  { id: 8, name: 'Toys', icon: '🧸', color: '#f5222d', bgColor: '#fff1f0' },
];

// Sample origin countries
const originCountries = [
  { id: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'SGP', name: 'Singapore', flag: '🇸🇬' },
  { id: 'THA', name: 'Thailand', flag: '🇹🇭' },
  { id: 'VNM', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'PHL', name: 'Philippines', flag: '🇵🇭' },
];

// Destination countries for dropdown
const destinationCountries: Country[] = [
  { id: 'us', name: 'United States', code: 'US', flagUrl: 'https://flagcdn.com/w80/us.png' },
  { id: 'cn', name: 'China', code: 'CN', flagUrl: 'https://flagcdn.com/w80/cn.png' },
  { id: 'jp', name: 'Japan', code: 'JP', flagUrl: 'https://flagcdn.com/w80/jp.png' },
  { id: 'kr', name: 'South Korea', code: 'KR', flagUrl: 'https://flagcdn.com/w80/kr.png' },
  { id: 'de', name: 'Germany', code: 'DE', flagUrl: 'https://flagcdn.com/w80/de.png' },
  { id: 'gb', name: 'United Kingdom', code: 'GB', flagUrl: 'https://flagcdn.com/w80/gb.png' },
  { id: 'fr', name: 'France', code: 'FR', flagUrl: 'https://flagcdn.com/w80/fr.png' },
  { id: 'ca', name: 'Canada', code: 'CA', flagUrl: 'https://flagcdn.com/w80/ca.png' },
  { id: 'au', name: 'Australia', code: 'AU', flagUrl: 'https://flagcdn.com/w80/au.png' },
  { id: 'sg', name: 'Singapore', code: 'SG', flagUrl: 'https://flagcdn.com/w80/sg.png' },
];

// Enhanced transport mode information
interface TransportModeInfo {
  name: string;
  icon: React.ReactNode;
  timeMultiplier: number;
  costMultiplier: number;
  description: string;
  color: string;
  bgColor: string;
  benefits: string[];
  timeLabel: string;
  costLabel: string;
}

const transportModeInfo: { [key: string]: TransportModeInfo } = {
  sea: {
    name: 'Sea Freight',
    icon: <ShipOutlined />,
    timeMultiplier: 1.5,
    costMultiplier: 0.8,
    description: 'Most economical for bulk shipments',
    color: '#1890ff',
    bgColor: '#e6f7ff',
    benefits: ['Lowest cost', 'Eco-friendly', 'Large capacity'],
    timeLabel: 'Slower',
    costLabel: 'Cheapest',
  },
  air: {
    name: 'Air Freight',
    icon: <RiseOutlined />,
    timeMultiplier: 0.5,
    costMultiplier: 2.5,
    description: 'Fastest delivery worldwide',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    benefits: ['Fastest delivery', 'High security', 'Global reach'],
    timeLabel: 'Fastest',
    costLabel: 'Most expensive',
  },
  land: {
    name: 'Land Transport',
    icon: <CarOutlined />,
    timeMultiplier: 1.0,
    costMultiplier: 1.2,
    description: 'Reliable regional shipping',
    color: '#52c41a',
    bgColor: '#f6ffed',
    benefits: ['Door-to-door', 'Flexible routes', 'Good for perishables'],
    timeLabel: 'Medium',
    costLabel: 'Medium cost',
  },
};

// Interfaces
interface CountryData {
  name: string;
  lat?: number;
  lng?: number;
  iso?: string;
  code?: string;
  id?: string;
}

interface SimulationPanelProps {
  selectedCountry: CountryData | null;
  onRunSimulation: (formData: Record<string, any>) => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
  simulationResults: Record<string, any> | null;
}

interface FormDataType {
  commodity: number | null;
  volume: number;
  transportMode: string;
  originCountry: string;
  destinationMode: 'map' | 'dropdown' | 'custom';
  destinationCountry: string | null;
  destinationName: string;
  destinationLat: number | null;
  destinationLng: number | null;
  dropdownDestinationId: string | null;
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
  const [formData, setFormData] = useState<FormDataType>({
    commodity: null,
    volume: 100,
    transportMode: 'sea',
    originCountry: 'IDN',
    destinationMode: 'map',
    destinationCountry: null,
    destinationName: '',
    destinationLat: null,
    destinationLng: null,
    dropdownDestinationId: null,
    customFields: {
      price: 1000,
      weight: 500,
    },
  });

  // Calculate real-time estimates
  const [estimates, setEstimates] = useState({ cost: 0, time: 0 });

  useEffect(() => {
    if (formData.commodity && formData.volume) {
      const mode = transportModeInfo[formData.transportMode];
      const baseTime = selectedCountry ? calculateBaseTime(selectedCountry) : 10;
      const basePrice = formData.customFields.price * formData.volume;

      setEstimates({
        cost: Math.round(basePrice * mode.costMultiplier),
        time: Math.round(baseTime * mode.timeMultiplier),
      });
    }
  }, [formData, selectedCountry]);

  const calculateBaseTime = (country: CountryData) => {
    const region = country.name || '';
    if (region.includes('United States') || region.includes('Canada')) return 14;
    if (region.includes('China') || region.includes('Japan') || region.includes('Korea')) return 7;
    if (region.includes('Singapore') || region.includes('Malaysia') || region.includes('Thailand')) return 3;
    if (region.includes('Australia')) return 10;
    if (region.includes('Germany') || region.includes('France') || region.includes('UK')) return 18;
    return 10;
  };

  // Check if form is ready to submit
  const isFormComplete = () => {
    const hasBasicInfo = formData.commodity && formData.originCountry;
    let hasDestination = false;

    if (formData.destinationMode === 'map') {
      hasDestination = !!selectedCountry;
    } else if (formData.destinationMode === 'dropdown') {
      hasDestination = !!formData.dropdownDestinationId;
    } else {
      hasDestination = !!(formData.destinationName && formData.destinationLat && formData.destinationLng);
    }

    return hasBasicInfo && hasDestination && formData.transportMode;
  };

  // Reset form
  useEffect(() => {
    if (!selectedCountry && !simulationResults) {
      form.resetFields();
      setFormData(prev => ({
        ...prev,
        commodity: null,
        destinationMode: 'map',
        destinationCountry: null,
        destinationName: '',
        destinationLat: null,
        destinationLng: null,
        dropdownDestinationId: null,
      }));
    } else if (selectedCountry && formData.destinationMode === 'map') {
      setFormData(prev => ({
        ...prev,
        destinationName: selectedCountry.name,
        destinationLat: selectedCountry.lat || null,
        destinationLng: selectedCountry.lng || null,
        destinationCountry: selectedCountry.iso || null,
      }));
    }
  }, [selectedCountry, form, simulationResults]);

  const handleDestinationDropdownChange = (countryId: string) => {
    const selectedDestination = destinationCountries.find(c => c.id === countryId);
    if (selectedDestination) {
      const countryCoordinates: { [key: string]: { lat: number; lng: number } } = {
        us: { lat: 38.8951, lng: -77.0364 }, cn: { lat: 39.9042, lng: 116.4074 },
        jp: { lat: 35.6762, lng: 139.6503 }, kr: { lat: 37.5665, lng: 126.978 },
        de: { lat: 52.52, lng: 13.405 }, gb: { lat: 51.5074, lng: -0.1278 },
        fr: { lat: 48.8566, lng: 2.3522 }, ca: { lat: 45.4215, lng: -75.6972 },
        au: { lat: -35.2809, lng: 149.13 }, sg: { lat: 1.3521, lng: 103.8198 },
      };

      const coordinates = countryCoordinates[countryId] || { lat: 0, lng: 0 };
      setFormData(prev => ({
        ...prev,
        dropdownDestinationId: countryId,
        destinationName: selectedDestination.name,
        destinationCountry: selectedDestination.code,
        destinationLat: coordinates.lat,
        destinationLng: coordinates.lng,
      }));
    }
  };

  const handleSubmit = () => {
    if (!isFormComplete()) {
      message.error('Please complete all required fields');
      return;
    }

    const simulationData = {
      ...formData,
      estimatedCost: estimates.cost,
      estimatedTime: estimates.time,
      destination: formData.destinationMode === 'map' && selectedCountry
        ? { name: selectedCountry.name, lat: selectedCountry.lat, lng: selectedCountry.lng, iso: selectedCountry.iso }
        : formData.destinationMode === 'dropdown'
          ? { name: formData.destinationName, code: formData.destinationCountry, id: formData.dropdownDestinationId, lat: formData.destinationLat, lng: formData.destinationLng }
          : { name: formData.destinationName, lat: formData.destinationLat, lng: formData.destinationLng }
    };
    onRunSimulation(simulationData);
  };

  const selectedCommodity = commodities.find(c => c.id === formData.commodity);
  const selectedTransport = transportModeInfo[formData.transportMode];

  return (
    <Card
      style={{ 
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
        borderRadius: '16px',
        border: 'none',
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      }}
    >
      {/* Header with Quick Actions */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
        <Col>
          <Space size={16}>
            <Avatar size={48} style={{ backgroundColor: '#1890ff' }}>
              <CalculatorOutlined style={{ fontSize: '24px' }} />
            </Avatar>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                Trade Simulation
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Set up your trade parameters quickly and intuitively
              </Text>
            </div>
          </Space>
        </Col>
        <Col>
          {simulationResults && (
            <Button 
              danger 
              icon={<ReloadOutlined />} 
              onClick={onResetSimulation}
            >
              Reset All
            </Button>
          )}
        </Col>
      </Row>

      <Form form={form} layout="vertical">
        {/* Step 1: Quick Trade Setup */}
        <Card 
          title={
            <Space>
              <ShoppingOutlined style={{ color: '#1890ff' }} />
              <span>1. What & Where</span>
              {selectedCommodity && <Tag color={selectedCommodity.color}>Selected</Tag>}
            </Space>
          }
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            border: selectedCommodity ? `2px solid ${selectedCommodity.color}20` : '1px solid #d9d9d9',
            backgroundColor: selectedCommodity ? selectedCommodity.bgColor : 'white',
          }}
        >
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            {/* Commodity Selection */}
            <div>
              <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
                Select Commodity
              </Text>
              <Row gutter={[12, 12]}>
                {commodities.map((commodity) => (
                  <Col xs={12} sm={6} md={4} key={commodity.id}>
                    <Card
                      hoverable
                      size="small"
                      style={{
                        textAlign: 'center',
                        border: formData.commodity === commodity.id 
                          ? `3px solid ${commodity.color}` 
                          : '1px solid #e8e8e8',
                        borderRadius: '12px',
                        backgroundColor: formData.commodity === commodity.id 
                          ? commodity.bgColor 
                          : 'white',
                        transition: 'all 0.3s ease',
                        transform: formData.commodity === commodity.id ? 'scale(1.05)' : 'scale(1)',
                        cursor: 'pointer',
                      }}
                      bodyStyle={{ padding: '16px 8px' }}
                      onClick={() => setFormData(prev => ({ ...prev, commodity: commodity.id }))}
                    >
                      <Space direction="vertical" size={8}>
                        <span style={{ fontSize: '28px' }}>{commodity.icon}</span>
                        <Text 
                          style={{ 
                            fontSize: '12px',
                            fontWeight: formData.commodity === commodity.id ? 'bold' : 'normal',
                            color: formData.commodity === commodity.id ? commodity.color : 'inherit'
                          }}
                        >
                          {commodity.name}
                        </Text>
                        {formData.commodity === commodity.id && (
                          <CheckCircleOutlined style={{ color: commodity.color, fontSize: '16px' }} />
                        )}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Origin & Volume */}
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item label={<Text strong>Origin Country</Text>}>
                  <Select
                    value={formData.originCountry}
                    onChange={(value) => setFormData(prev => ({ ...prev, originCountry: value }))}
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    {originCountries.map((country) => (
                      <Option key={country.id} value={country.id}>
                        <Space>
                          <span style={{ fontSize: '18px' }}>{country.flag}</span>
                          {country.name}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  label={
                    <Space>
                      <Text strong>Volume</Text>
                      <Badge count={`${formData.volume} units`} style={{ backgroundColor: '#52c41a' }} />
                    </Space>
                  }
                >
                  <InputNumber
                    value={formData.volume}
                    onChange={(value) => setFormData(prev => ({ ...prev, volume: value || 0 }))}
                    min={1}
                    max={10000}
                    size="large"
                    style={{ width: '100%', borderRadius: '8px' }}
                    addonAfter="units"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Step 2: Destination Selection */}
        <Card 
          title={
            <Space>
              <EnvironmentOutlined style={{ color: '#52c41a' }} />
              <span>2. Destination</span>
              {(selectedCountry || formData.dropdownDestinationId || (formData.destinationMode === 'custom' && formData.destinationName)) && 
                <Tag color="green">Selected</Tag>
              }
            </Space>
          }
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            border: (selectedCountry || formData.dropdownDestinationId || (formData.destinationMode === 'custom' && formData.destinationName)) 
              ? '2px solid #52c41a20' : '1px solid #d9d9d9',
            backgroundColor: (selectedCountry || formData.dropdownDestinationId || (formData.destinationMode === 'custom' && formData.destinationName)) 
              ? '#f6ffed' : 'white',
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Map Selection */}
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{
                  border: formData.destinationMode === 'map' ? '2px solid #1890ff' : '1px solid #e8e8e8',
                  borderRadius: '12px',
                  backgroundColor: formData.destinationMode === 'map' ? '#e6f7ff' : 'white',
                  cursor: 'pointer',
                  height: '120px',
                }}
                bodyStyle={{ padding: '16px', textAlign: 'center' }}
                onClick={() => setFormData(prev => ({ ...prev, destinationMode: 'map' }))}
              >
                <Space direction="vertical" align="center" size={8}>
                  <span style={{ fontSize: '32px' }}>🗺️</span>
                  <Text strong style={{ color: formData.destinationMode === 'map' ? '#1890ff' : 'inherit' }}>
                    Select on Map
                  </Text>
                  {formData.destinationMode === 'map' && selectedCountry && (
                    <Tag color="blue">{selectedCountry.name}</Tag>
                  )}
                </Space>
              </Card>
            </Col>

            {/* Dropdown Selection */}
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{
                  border: formData.destinationMode === 'dropdown' ? '2px solid #1890ff' : '1px solid #e8e8e8',
                  borderRadius: '12px',
                  backgroundColor: formData.destinationMode === 'dropdown' ? '#e6f7ff' : 'white',
                  cursor: 'pointer',
                  height: '120px',
                }}
                bodyStyle={{ padding: '16px', textAlign: 'center' }}
                onClick={() => setFormData(prev => ({ ...prev, destinationMode: 'dropdown' }))}
              >
                <Space direction="vertical" align="center" size={8}>
                  <span style={{ fontSize: '32px' }}>📋</span>
                  <Text strong style={{ color: formData.destinationMode === 'dropdown' ? '#1890ff' : 'inherit' }}>
                    Choose from List
                  </Text>
                  {formData.destinationMode === 'dropdown' && formData.dropdownDestinationId && (
                    <Tag color="blue">{formData.destinationName}</Tag>
                  )}
                </Space>
              </Card>
            </Col>

            {/* Custom Coordinates */}
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{
                  border: formData.destinationMode === 'custom' ? '2px solid #1890ff' : '1px solid #e8e8e8',
                  borderRadius: '12px',
                  backgroundColor: formData.destinationMode === 'custom' ? '#e6f7ff' : 'white',
                  cursor: 'pointer',
                  height: '120px',
                }}
                bodyStyle={{ padding: '16px', textAlign: 'center' }}
                onClick={() => setFormData(prev => ({ ...prev, destinationMode: 'custom' }))}
              >
                <Space direction="vertical" align="center" size={8}>
                  <span style={{ fontSize: '32px' }}>📍</span>
                  <Text strong style={{ color: formData.destinationMode === 'custom' ? '#1890ff' : 'inherit' }}>
                    Custom Location
                  </Text>
                  {formData.destinationMode === 'custom' && formData.destinationName && (
                    <Tag color="blue">{formData.destinationName}</Tag>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Conditional Input Fields */}
          {formData.destinationMode === 'dropdown' && (
            <div style={{ marginTop: '16px' }}>
              <CountryDropdown
                type="destination"
                value={formData.dropdownDestinationId || undefined}
                onChange={handleDestinationDropdownChange}
                placeholder="Select destination country"
              />
            </div>
          )}

          {formData.destinationMode === 'custom' && (
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={8}>
                <Input
                  placeholder="Destination name"
                  value={formData.destinationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, destinationName: e.target.value }))}
                />
              </Col>
              <Col span={8}>
                <InputNumber
                  placeholder="Latitude"
                  value={formData.destinationLat}
                  onChange={(value) => setFormData(prev => ({ ...prev, destinationLat: value }))}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={8}>
                <InputNumber
                  placeholder="Longitude"
                  value={formData.destinationLng}
                  onChange={(value) => setFormData(prev => ({ ...prev, destinationLng: value }))}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          )}

          {formData.destinationMode === 'map' && !selectedCountry && (
            <div style={{ textAlign: 'center', marginTop: '16px', padding: '20px' }}>
              <Text type="secondary">
                👆 Click on any country in the map above to select your destination
              </Text>
            </div>
          )}
        </Card>

        {/* Step 3: Transport Mode */}
        <Card 
          title={
            <Space>
              <CompassOutlined style={{ color: '#722ed1' }} />
              <span>3. Transport Method</span>
              <Tag color={selectedTransport.color}>{selectedTransport.name}</Tag>
            </Space>
          }
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            border: `2px solid ${selectedTransport.color}20`,
            backgroundColor: selectedTransport.bgColor,
          }}
        >
          <Row gutter={[16, 16]}>
            {Object.entries(transportModeInfo).map(([key, mode]) => (
              <Col xs={24} md={8} key={key}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    border: formData.transportMode === key ? `3px solid ${mode.color}` : '1px solid #e8e8e8',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: formData.transportMode === key ? mode.bgColor : 'white',
                    transition: 'all 0.3s ease',
                    transform: formData.transportMode === key ? 'scale(1.02)' : 'scale(1)',
                  }}
                  bodyStyle={{ padding: '20px', textAlign: 'center' }}
                  onClick={() => setFormData(prev => ({ ...prev, transportMode: key }))}
                >
                  <Space direction="vertical" align="center" size={12} style={{ width: '100%' }}>
                    <div>{mode.icon}</div>
                    <Title level={5} style={{ margin: 0, color: mode.color }}>
                      {mode.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                      {mode.description}
                    </Text>
                    <Row gutter={8} style={{ width: '100%' }}>
                      <Col span={12}>
                        <Tag color="blue" style={{ fontSize: '10px' }}>{mode.timeLabel}</Tag>
                      </Col>
                      <Col span={12}>
                        <Tag color="green" style={{ fontSize: '10px' }}>{mode.costLabel}</Tag>
                      </Col>
                    </Row>
                    {formData.transportMode === key && (
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Live Estimates */}
        {isFormComplete() && (
          <Card 
            title={
              <Space>
                <CalculatorOutlined style={{ color: '#fa8c16' }} />
                <span>Live Estimates</span>
              </Space>
            }
            style={{ 
              marginBottom: '24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)',
              border: '2px solid #ffd591',
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  style={{
                    background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                    border: 'none',
                    textAlign: 'center',
                    borderRadius: '12px',
                  }}
                >
                  <Space direction="vertical" align="center">
                    <DollarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                    <Text style={{ fontSize: '14px', color: '#595959' }}>Total Cost</Text>
                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                      ${estimates.cost.toLocaleString()}
                    </Title>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  style={{
                    background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
                    border: 'none',
                    textAlign: 'center',
                    borderRadius: '12px',
                  }}
                >
                  <Space direction="vertical" align="center">
                    <ClockCircleOutlined style={{ fontSize: '32px', color: '#f5222d' }} />
                    <Text style={{ fontSize: '14px', color: '#595959' }}>Delivery Time</Text>
                    <Title level={2} style={{ margin: 0, color: '#f5222d' }}>
                      {estimates.time} days
                    </Title>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        )}

        {/* Advanced Settings (Collapsible) */}
        <Collapse
          ghost
          style={{ marginBottom: '24px' }}
          items={[{
            key: 'advanced',
            label: (
              <Space>
                <SettingOutlined style={{ color: '#8c8c8c' }} />
                <Text>Advanced Settings</Text>
                <Tooltip title="Optional parameters for more accurate calculations">
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                </Tooltip>
              </Space>
            ),
            children: (
              <Card style={{ backgroundColor: '#fafafa', border: 'none' }}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Base Item Price (per unit)">
                      <InputNumber
                        addonBefore="$"
                        style={{ width: '100%' }}
                        value={formData.customFields.price}
                        onChange={(value) => setFormData(prev => ({
                          ...prev,
                          customFields: { ...prev.customFields, price: value || 0 }
                        }))}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Item Weight (kg per unit)">
                      <InputNumber
                        addonAfter="kg"
                        style={{ width: '100%' }}
                        value={formData.customFields.weight}
                        onChange={(value) => setFormData(prev => ({
                          ...prev,
                          customFields: { ...prev.customFields, weight: value || 0 }
                        }))}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )
          }]}
        />

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={handleSubmit}
            loading={isSimulating}
            disabled={!isFormComplete() || isSimulating}
            style={{
              height: '60px',
              padding: '0 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '12px',
              background: isFormComplete() 
                ? 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' 
                : undefined,
              border: 'none',
              boxShadow: isFormComplete() 
                ? '0 6px 20px rgba(82, 196, 26, 0.3)' 
                : undefined,
            }}
          >
            {isSimulating ? 'Running Simulation...' : 'Run Trade Simulation'}
          </Button>
        </div>

        {/* Results Summary */}
        {simulationResults && (
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Simulation Complete</span>
              </Space>
            }
            style={{ 
              marginTop: '24px',
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              border: '2px solid #95de64',
              borderRadius: '12px',
            }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Text strong>Commodity:</Text><br />
                <Text>{commodities.find(c => c.id === simulationResults.commodity)?.name}</Text>
              </Col>
              <Col span={6}>
                <Text strong>Transport:</Text><br />
                <Text>{transportModeInfo[simulationResults.transportMode]?.name}</Text>
              </Col>
              <Col span={6}>
                <Text strong>Origin:</Text><br />
                <Text>{originCountries.find(c => c.id === simulationResults.originCountry)?.name}</Text>
              </Col>
              <Col span={6}>
                <Text strong>Destination:</Text><br />
                <Text>{simulationResults.destination?.name || 'N/A'}</Text>
              </Col>
            </Row>
          </Card>
        )}
      </Form>
    </Card>
  );
};

export default SimulationPanel;
