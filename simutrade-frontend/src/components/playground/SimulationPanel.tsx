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

const { Title, Text } = Typography;
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
const transportModeInfo = {
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
  const [formData, setFormData] = useState({
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
  const calculateBaseTime = (country) => {
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
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RocketOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
          <span>Simulation Control Panel</span>
        </div>
      }
      style={{
        height: '100%',
        minHeight: '550px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      className="simulation-panel"
    >
      {!selectedCountry && !customDestination ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div style={{ textAlign: 'center' }}>
                <Title
                  level={5}
                  style={{ marginBottom: '16px', marginTop: '8px' }}
                >
                  Select a destination country
                </Title>
                <Text type="secondary">
                  Click on any country on the map to configure your export
                  simulation
                </Text>
                <Divider plain>Or</Divider>
              </div>
            }
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <GlobalOutlined
                style={{
                  fontSize: '48px',
                  color: '#bfbfbf',
                  marginBottom: '20px',
                }}
              />
              <Button
                type="primary"
                onClick={() => handleCustomDestinationToggle(true)}
                icon={<CompassOutlined />}
                size="large"
              >
                Use Custom Destination
              </Button>
            </div>
          </Empty>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            commodity: formData.commodity,
            volume: formData.volume,
            transportMode: formData.transportMode,
            originCountry: formData.originCountry,
            destinationName: formData.destinationName,
            destinationLat: formData.destinationLat,
            destinationLng: formData.destinationLng,
            price: formData.customFields.price,
            weight: formData.customFields.weight,
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarStyle={{ display: 'none' }} // Hide tab bar
            items={[
              {
                key: '1',
                label: (
                  <span>
                    <CompassOutlined /> Route Setup
                  </span>
                ),
                children: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        className="tab-navigation"
                        style={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 0',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #1890ff',
                            flex: 1,
                            textAlign: 'center',
                          }}
                        >
                          <CompassOutlined style={{ marginRight: '8px' }} />
                          Route Setup
                        </div>
                        <div
                          style={{
                            padding: '10px 0',
                            fontWeight: 'normal',
                            color: '#999',
                            flex: 1,
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => setActiveTab('2')}
                        >
                          <SettingOutlined style={{ marginRight: '8px' }} />
                          Transport & Settings
                        </div>
                      </div>
                    </div>

                    <div
                      className="route-info"
                      style={{ marginBottom: '20px' }}
                    >
                      <div style={{ display: 'flex', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <Form.Item
                            label={
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <EnvironmentOutlined
                                  style={{
                                    color: '#1890ff',
                                    marginRight: '8px',
                                  }}
                                />
                                <span>Origin</span>
                              </div>
                            }
                            name="originCountry"
                            style={{ marginBottom: '8px' }}
                          >
                            <Select
                              placeholder="Select origin country"
                              onChange={handleOriginCountryChange}
                              style={{ width: '100%' }}
                            >
                              {originCountries.map((country) => (
                                <Option key={country.id} value={country.id}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '16px',
                                        marginRight: '8px',
                                      }}
                                    >
                                      {country.flag}
                                    </span>
                                    <span>{country.name}</span>
                                  </div>
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                        <div style={{ flex: 1, marginLeft: '12px' }}>
                          {customDestination ? (
                            <Form.Item
                              label="Destination"
                              style={{ marginBottom: '8px' }}
                            >
                              <Space
                                direction="vertical"
                                style={{ width: '100%' }}
                              >
                                <Input
                                  placeholder="Destination Name"
                                  value={formData.destinationName}
                                  onChange={(e) =>
                                    handleCustomDestinationChange(
                                      'destinationName',
                                      e.target.value
                                    )
                                  }
                                />
                                <Space>
                                  <InputNumber
                                    placeholder="Latitude"
                                    style={{ width: '100%' }}
                                    value={formData.destinationLat}
                                    onChange={(val) =>
                                      handleCustomDestinationChange(
                                        'destinationLat',
                                        val
                                      )
                                    }
                                  />
                                  <InputNumber
                                    placeholder="Longitude"
                                    style={{ width: '100%' }}
                                    value={formData.destinationLng}
                                    onChange={(val) =>
                                      handleCustomDestinationChange(
                                        'destinationLng',
                                        val
                                      )
                                    }
                                  />
                                </Space>
                                <Button
                                  type="link"
                                  onClick={() =>
                                    handleCustomDestinationToggle(false)
                                  }
                                  style={{ paddingLeft: 0 }}
                                >
                                  Use Map Selection
                                </Button>
                              </Space>
                            </Form.Item>
                          ) : (
                            <Form.Item
                              label="Destination"
                              style={{ marginBottom: '8px' }}
                            >
                              <Tag
                                color="green"
                                style={{
                                  padding: '4px 12px',
                                  fontSize: '14px',
                                  width: '100%',
                                  textAlign: 'center',
                                }}
                              >
                                <GlobalOutlined /> {selectedCountry.name}
                              </Tag>
                              <Button
                                type="link"
                                onClick={() =>
                                  handleCustomDestinationToggle(true)
                                }
                                style={{ paddingLeft: 0 }}
                              >
                                Use Custom Destination
                              </Button>
                            </Form.Item>
                          )}
                        </div>
                      </div>
                    </div>

                    <Divider style={{ margin: '0 0 16px 0' }} />

                    <Form.Item
                      name="commodity"
                      label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <ShoppingOutlined
                            style={{ marginRight: '8px', color: '#1890ff' }}
                          />
                          <span>Commodity</span>
                          <Tooltip title="Select the product you want to export">
                            <InfoCircleOutlined
                              style={{ marginLeft: '8px', color: '#bfbfbf' }}
                            />
                          </Tooltip>
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Please select a commodity',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select a commodity"
                        onChange={handleCommodityChange}
                        dropdownStyle={{ borderRadius: '4px' }}
                        style={{ marginBottom: '16px' }}
                      >
                        {commodities.map((commodity) => (
                          <Option key={commodity.id} value={commodity.id}>
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <span
                                style={{ fontSize: '18px', marginRight: '8px' }}
                              >
                                {commodity.icon}
                              </span>
                              <span>{commodity.name}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="volume"
                      label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <CalculatorOutlined
                            style={{ marginRight: '8px', color: '#1890ff' }}
                          />
                          <span>Export Volume (containers)</span>
                          <Tooltip title="Number of shipping containers">
                            <InfoCircleOutlined
                              style={{ marginLeft: '8px', color: '#bfbfbf' }}
                            />
                          </Tooltip>
                        </div>
                      }
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Slider
                          min={1}
                          max={100}
                          value={formData.volume}
                          onChange={handleVolumeChange}
                          style={{ flex: 1 }}
                          marks={{
                            1: '1',
                            25: '25',
                            50: '50',
                            75: '75',
                            100: '100',
                          }}
                          trackStyle={{ backgroundColor: '#1890ff' }}
                          handleStyle={{ borderColor: '#1890ff' }}
                        />
                        <InputNumber
                          min={1}
                          max={100}
                          value={formData.volume}
                          onChange={(value) =>
                            handleVolumeChange(value as number)
                          }
                          style={{ width: '60px' }}
                        />
                      </div>
                    </Form.Item>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '24px',
                      }}
                    >
                      <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        onClick={() => setActiveTab('2')}
                      >
                        Next: Transport & Settings
                      </Button>
                    </div>
                  </>
                ),
              },
              {
                key: '2',
                label: (
                  <span>
                    <SettingOutlined /> Transport & Settings
                  </span>
                ),
                children: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        className="tab-navigation"
                        style={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 0',
                            fontWeight: 'normal',
                            color: '#999',
                            flex: 1,
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => setActiveTab('1')}
                        >
                          <CompassOutlined style={{ marginRight: '8px' }} />
                          Route Setup
                        </div>
                        <div
                          style={{
                            padding: '10px 0',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #1890ff',
                            flex: 1,
                            textAlign: 'center',
                          }}
                        >
                          <SettingOutlined style={{ marginRight: '8px' }} />
                          Transport & Settings
                        </div>
                      </div>
                    </div>

                    <Form.Item
                      name="transportMode"
                      label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>Transport Mode</span>
                          <Tooltip title="Choose your preferred transportation method">
                            <InfoCircleOutlined
                              style={{ marginLeft: '8px', color: '#bfbfbf' }}
                            />
                          </Tooltip>
                        </div>
                      }
                    >
                      <Radio.Group
                        value={formData.transportMode}
                        onChange={(e) =>
                          handleTransportModeChange(e.target.value)
                        }
                        style={{ width: '100%' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            flexDirection: 'column',
                          }}
                        >
                          <Radio.Button
                            value="sea"
                            style={{
                              height: 'auto',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              width: '100%',
                            }}
                          >
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {transportModeInfo.sea.icon}
                              <span
                                style={{
                                  marginLeft: '8px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {transportModeInfo.sea.name}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                marginTop: '4px',
                                color: '#666',
                              }}
                            >
                              {transportModeInfo.sea.description}
                            </div>
                          </Radio.Button>

                          <Radio.Button
                            value="air"
                            style={{
                              height: 'auto',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              width: '100%',
                            }}
                          >
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {transportModeInfo.air.icon}
                              <span
                                style={{
                                  marginLeft: '8px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {transportModeInfo.air.name}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                marginTop: '4px',
                                color: '#666',
                              }}
                            >
                              {transportModeInfo.air.description}
                            </div>
                          </Radio.Button>

                          <Radio.Button
                            value="land"
                            style={{
                              height: 'auto',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              width: '100%',
                            }}
                          >
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {transportModeInfo.land.icon}
                              <span
                                style={{
                                  marginLeft: '8px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {transportModeInfo.land.name}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                marginTop: '4px',
                                color: '#666',
                              }}
                            >
                              {transportModeInfo.land.description}
                            </div>
                          </Radio.Button>
                        </div>
                      </Radio.Group>
                    </Form.Item>

                    <Divider style={{ margin: '8px 0 16px 0' }} />

                    <div
                      className="advanced-settings"
                      style={{ marginBottom: '16px' }}
                    >
                      <Title level={5} style={{ marginBottom: '12px' }}>
                        Advanced Settings
                      </Title>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                          name="price"
                          label="Price per Unit ($)"
                          style={{ flex: 1, marginBottom: '0' }}
                        >
                          <InputNumber
                            min={1}
                            max={10000}
                            defaultValue={formData.customFields.price}
                            onChange={(value) =>
                              handleCustomFieldChange('price', value)
                            }
                            style={{ width: '100%' }}
                            prefix={<DollarOutlined />}
                          />
                        </Form.Item>
                        <Form.Item
                          name="weight"
                          label="Weight per Unit (kg)"
                          style={{ flex: 1, marginBottom: '0' }}
                        >
                          <InputNumber
                            min={1}
                            max={5000}
                            defaultValue={formData.customFields.weight}
                            onChange={(value) =>
                              handleCustomFieldChange('weight', value)
                            }
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    {formData.commodity && (
                      <div
                        className="estimates-panel"
                        style={{ marginTop: '20px', marginBottom: '20px' }}
                      >
                        <Title level={5} style={{ marginBottom: '12px' }}>
                          Preliminary Estimates
                        </Title>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div
                            style={{
                              flex: 1,
                              padding: '12px',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <DollarOutlined
                              style={{
                                fontSize: '24px',
                                color: '#1890ff',
                                marginRight: '12px',
                              }}
                            />
                            <div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Estimated Cost
                              </div>
                              <div
                                style={{ fontSize: '18px', fontWeight: 'bold' }}
                              >
                                ${estimates.cost.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              padding: '12px',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <ClockCircleOutlined
                              style={{
                                fontSize: '24px',
                                color: '#ff9800',
                                marginRight: '12px',
                              }}
                            />
                            <div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Est. Time
                              </div>
                              <div
                                style={{ fontSize: '18px', fontWeight: 'bold' }}
                              >
                                {estimates.time} days
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: 'center',
                            marginTop: '8px',
                            fontSize: '12px',
                            color: '#666',
                          }}
                        >
                          These are preliminary estimates and may vary in the
                          final simulation
                        </div>
                      </div>
                    )}

                    <div
                      className="action-buttons"
                      style={{ marginTop: '24px' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                        }}
                      >
                        <Button
                          icon={<ArrowLeftOutlined />}
                          onClick={() => setActiveTab('1')}
                        >
                          Back
                        </Button>

                        <Button
                          type="primary"
                          icon={<ArrowRightOutlined />}
                          onClick={handleSubmit}
                          loading={isSimulating}
                          disabled={
                            !formData.commodity ||
                            (!selectedCountry && !formData.customDestination)
                          }
                        >
                          Run Simulation
                        </Button>
                      </div>

                      {simulationResults && (
                        <Button
                          block
                          icon={<ReloadOutlined />}
                          style={{ borderRadius: '6px' }}
                          onClick={handleReset}
                        >
                          Reset Simulation
                        </Button>
                      )}
                    </div>
                  </>
                ),
              },
            ]}
          />
        </Form>
      )}
    </Card>
  );
};

export default SimulationPanel;
