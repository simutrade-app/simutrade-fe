import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Select,
  Slider,
  Space,
  Typography,
  Tag,
  Divider,
  Input,
  InputNumber,
  Form,
  Radio,
  Tabs,
  Row,
  Col,
  message,
} from 'antd';
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import '../../styles/dashboard.css';

// Import the CountryDropdown component
import CountryDropdown from './CountryDropdown';
import type { Country } from './CountrySelectorButton';

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

// Sample destination countries for dropdown
// Expanded country list with flag URLs for CountryDropdown
const destinationCountries: Country[] = [
  {
    id: 'us',
    name: 'United States',
    code: 'US',
    flagUrl: 'https://flagcdn.com/w80/us.png',
  },
  {
    id: 'cn',
    name: 'China',
    code: 'CN',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
  },
  {
    id: 'jp',
    name: 'Japan',
    code: 'JP',
    flagUrl: 'https://flagcdn.com/w80/jp.png',
  },
  {
    id: 'kr',
    name: 'South Korea',
    code: 'KR',
    flagUrl: 'https://flagcdn.com/w80/kr.png',
  },
  {
    id: 'de',
    name: 'Germany',
    code: 'DE',
    flagUrl: 'https://flagcdn.com/w80/de.png',
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/w80/gb.png',
  },
  {
    id: 'fr',
    name: 'France',
    code: 'FR',
    flagUrl: 'https://flagcdn.com/w80/fr.png',
  },
  {
    id: 'ca',
    name: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/w80/ca.png',
  },
  {
    id: 'au',
    name: 'Australia',
    code: 'AU',
    flagUrl: 'https://flagcdn.com/w80/au.png',
  },
  {
    id: 'sg',
    name: 'Singapore',
    code: 'SG',
    flagUrl: 'https://flagcdn.com/w80/sg.png',
  },
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

// Create interfaces for country data
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
  customDestination: boolean;
  destinationCountry: string | null;
  destinationName: string;
  destinationLat: number | null;
  destinationLng: number | null;
  useDropdownSelection: boolean;
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
  const [activeTab, setActiveTab] = useState('1');
  const [customDestination, setCustomDestination] = useState(false);
  const [useDropdownSelection, setUseDropdownSelection] = useState(false); // New state for dropdown selection
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
    useDropdownSelection: false, // Default to false (use map selection)
    dropdownDestinationId: null, // No dropdown selection by default
    customFields: {
      price: 1000,
      weight: 500,
    },
  });

  // State to track completion of each tab
  const [tabCompletionStatus, setTabCompletionStatus] = useState<{
    [key: string]: boolean;
  }>({
    '1': false, // Basic Info
    '2': true, // Transport Options (has defaults)
    '3': false, // Advanced Settings (will depend on others or specific fields)
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
  const calculateBaseTime = (country: CountryData) => {
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

  // Function to check if Tab 1 (Basic Info) is complete
  const isBasicInfoTabComplete = () => {
    const commoditySelected = !!formData.commodity;
    let destinationSelected = false;

    if (useDropdownSelection) {
      // If using dropdown, check if a destination is selected in the dropdown
      destinationSelected = !!formData.dropdownDestinationId;
    } else if (formData.customDestination) {
      // If using custom coordinates
      destinationSelected =
        !!formData.destinationName &&
        formData.destinationLat !== null &&
        formData.destinationLng !== null;
    } else {
      // If using map selection
      destinationSelected = !!selectedCountry;
    }

    return commoditySelected && destinationSelected;
  };

  // Function to check if Tab 2 (Transport Options) is complete (always true due to defaults)
  const isTransportOptionsTabComplete = () => {
    return !!formData.transportMode; // Has a default
  };

  // Function to check if Tab 3 (Advanced Settings) is complete
  // For now, let's say it's complete if the previous tabs are.
  // This can be expanded with specific field checks if needed.
  const isAdvancedSettingsTabComplete = () => {
    return tabCompletionStatus['1'] && tabCompletionStatus['2'];
  };

  // Update tab completion status whenever formData or selectedCountry changes
  useEffect(() => {
    setTabCompletionStatus((prevStatus) => ({
      ...prevStatus,
      '1': isBasicInfoTabComplete(),
      '2': isTransportOptionsTabComplete(),
      // '3' will be updated when other tabs are complete or based on its own fields
    }));
  }, [formData, selectedCountry, customDestination, useDropdownSelection]);

  // Update Tab 3 completion when Tab 1 or Tab 2 completion changes
  useEffect(() => {
    setTabCompletionStatus((prevStatus) => ({
      ...prevStatus,
      '3': isAdvancedSettingsTabComplete(),
    }));
  }, [tabCompletionStatus['1'], tabCompletionStatus['2']]);

  // Reset form and tab completion when country changes or simulation is reset
  useEffect(() => {
    if (!selectedCountry && !simulationResults) {
      // Also reset if simulationResults are cleared
      form.resetFields();
      setFormData({
        commodity: null,
        volume: 50,
        transportMode: 'sea',
        originCountry: 'IDN',
        customDestination: false,
        destinationCountry: null,
        destinationName: '',
        destinationLat: null,
        destinationLng: null,
        useDropdownSelection: false,
        dropdownDestinationId: null,
        customFields: {
          price: 1000,
          weight: 500,
        },
      });
      setCustomDestination(false); // Reset custom destination flag
      setUseDropdownSelection(false); // Reset dropdown selection flag
      setActiveTab('1'); // Go back to the first tab
      setTabCompletionStatus({ '1': false, '2': true, '3': false });
    } else if (
      selectedCountry &&
      !formData.customDestination &&
      !useDropdownSelection
    ) {
      // If a country is selected on the map, and not using custom destination or dropdown,
      // update form data with selected country's details
      form.setFieldsValue({
        destinationName: selectedCountry.name,
        // Assuming selectedCountry has lat/lng. Adjust if structure is different.
        destinationLat: selectedCountry.lat || null,
        destinationLng: selectedCountry.lng || null,
      });
      setFormData((prevData) => ({
        ...prevData,
        destinationName: selectedCountry.name,
        destinationLat: selectedCountry.lat || null,
        destinationLng: selectedCountry.lng || null,
        destinationCountry: selectedCountry.iso || null,
      }));
    }
  }, [selectedCountry, form, simulationResults]);

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

  const handleCustomFieldChange = (field: string, value: number | null) => {
    setFormData({
      ...formData,
      customFields: {
        ...formData.customFields,
        [field]: value !== null ? value : 0, // Default to 0 if null
      },
    });
  };

  // Handle dropdown destination selection
  const handleDestinationDropdownChange = (countryId: string) => {
    // Find the selected country data
    const selectedDestination = destinationCountries.find(
      (c) => c.id === countryId
    );

    if (selectedDestination) {
      // Map of country coordinates based on country ID
      const countryCoordinates: {
        [key: string]: { lat: number; lng: number };
      } = {
        us: { lat: 38.8951, lng: -77.0364 }, // Washington DC, USA
        cn: { lat: 39.9042, lng: 116.4074 }, // Beijing, China
        jp: { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan
        kr: { lat: 37.5665, lng: 126.978 }, // Seoul, South Korea
        de: { lat: 52.52, lng: 13.405 }, // Berlin, Germany
        gb: { lat: 51.5074, lng: -0.1278 }, // London, UK
        fr: { lat: 48.8566, lng: 2.3522 }, // Paris, France
        ca: { lat: 45.4215, lng: -75.6972 }, // Ottawa, Canada
        au: { lat: -35.2809, lng: 149.13 }, // Canberra, Australia
        sg: { lat: 1.3521, lng: 103.8198 }, // Singapore
      };

      // Get coordinates for the selected country
      const coordinates = countryCoordinates[countryId] || { lat: 0, lng: 0 };

      setFormData({
        ...formData,
        dropdownDestinationId: countryId,
        // Store destination info for simulation
        destinationName: selectedDestination.name,
        destinationCountry: selectedDestination.code,
        // Use the coordinates from our map
        destinationLat: coordinates.lat,
        destinationLng: coordinates.lng,
      });
    }
  };

  // Update custom destination fields
  const handleCustomDestinationChange = (
    field: string,
    value: string | number | null
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    form.setFieldsValue({ [field]: value });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        // Construct the data to be passed for simulation
        const simulationData = {
          ...formData,
          estimatedCost: estimates.cost,
          estimatedTime: estimates.time,
          // Ensure destination details are correctly passed
          destination: useDropdownSelection
            ? {
                name: formData.destinationName,
                code: formData.destinationCountry,
                id: formData.dropdownDestinationId,
                // Use the actual lat/lng values stored in formData
                lat: formData.destinationLat,
                lng: formData.destinationLng,
              }
            : customDestination
              ? {
                  name: formData.destinationName,
                  lat: formData.destinationLat,
                  lng: formData.destinationLng,
                }
              : selectedCountry
                ? {
                    name: selectedCountry.name,
                    lat: selectedCountry.lat,
                    lng: selectedCountry.lng,
                    iso: selectedCountry.iso,
                  }
                : null,
        };
        onRunSimulation(simulationData);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        // Optionally, find the first tab with errors and switch to it
        if (info.errorFields.length > 0) {
          const firstErrorFieldPath = info.errorFields[0].name.join('');
          if (formItemsTabMapping[firstErrorFieldPath]) {
            setActiveTab(formItemsTabMapping[firstErrorFieldPath]);
            message.error(
              'Please complete all required fields in the current tab.'
            );
          } else {
            message.error('Please complete all required fields.');
          }
        }
      });
  };

  const handleReset = () => {
    onResetSimulation(); // This will trigger the useEffect to reset form and states
    // The useEffect for selectedCountry will handle resetting form and activeTab
  };

  // Define which form items belong to which tab for error navigation
  const formItemsTabMapping: { [key: string]: string } = {
    commodity: '1',
    originCountry: '1',
    destinationName: '1',
    destinationLat: '1',
    destinationLng: '1',
    transportMode: '2',
    // Add other form items from Tab 3 if they have validation
  };

  const handleTabChange = (key: string) => {
    // Prevent changing tab if current tab is not complete (optional, for stricter flow)
    // if (!tabCompletionStatus[activeTab] && parseInt(key) > parseInt(activeTab)) {
    //   message.error('Please complete the current tab before proceeding.');
    //   return;
    // }
    setActiveTab(key);
  };

  const handleNextTab = () => {
    if (!tabCompletionStatus[activeTab]) {
      message.error(
        'Please complete all required fields in the current tab before proceeding.'
      );
      // Trigger validation for the current tab to show error messages
      form
        .validateFields()
        .then(() => {}) // Should not happen if tab is incomplete
        .catch(() => {}); // Errors will be displayed by Ant Form
      return;
    }
    const currentTabIndex = parseInt(activeTab, 10);
    if (currentTabIndex < 3) {
      setActiveTab((currentTabIndex + 1).toString());
    }
  };

  const handlePrevTab = () => {
    const currentTabIndex = parseInt(activeTab, 10);
    if (currentTabIndex > 1) {
      setActiveTab((currentTabIndex - 1).toString());
    }
  };

  const isRunSimulationDisabled = Object.values(tabCompletionStatus).some(
    (status) => !status
  );

  // Tab Content
  const tabItems = [
    {
      key: '1',
      label: (
        <Space>
          <ShoppingOutlined />
          Basic Info
          {tabCompletionStatus['1'] ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="blue">Pending</Tag>
          )}
        </Space>
      ),
      children: (
        <Form form={form} layout="vertical" initialValues={formData}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            Trade Details
          </Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="commodity"
                label="Commodity"
                rules={[
                  { required: true, message: 'Please select a commodity' },
                ]}
              >
                <Select
                  placeholder="Select a commodity"
                  onChange={handleCommodityChange}
                  value={formData.commodity}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {commodities.map((com) => (
                    <Option key={com.id} value={com.id}>
                      {com.icon} {com.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="originCountry"
                label="Origin Country"
                rules={[{ required: true }]}
              >
                <Select
                  value={formData.originCountry}
                  onChange={handleOriginCountryChange}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {originCountries.map((country) => (
                    <Option key={country.id} value={country.id}>
                      {country.flag} {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="volume" label="Volume (units)">
            <Slider
              min={1}
              max={1000}
              onChange={handleVolumeChange}
              value={formData.volume}
              marks={{ 1: '1', 500: '500', 1000: '1000' }}
            />
          </Form.Item>

          <Divider />
          <Title level={5} style={{ marginBottom: '16px' }}>
            Destination
          </Title>
          <Form.Item>
            <Radio.Group
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'map') {
                  setCustomDestination(false);
                  setUseDropdownSelection(false);
                } else if (value === 'custom') {
                  setCustomDestination(true);
                  setUseDropdownSelection(false);
                } else if (value === 'dropdown') {
                  setCustomDestination(false);
                  setUseDropdownSelection(true);
                }

                setFormData({
                  ...formData,
                  customDestination: value === 'custom',
                  useDropdownSelection: value === 'dropdown',
                });
              }}
              value={
                useDropdownSelection
                  ? 'dropdown'
                  : customDestination
                    ? 'custom'
                    : 'map'
              }
            >
              <Radio value="map">Select destination country on map</Radio>
              <Radio value="custom">Enter custom coordinates</Radio>
              <Radio value="dropdown">Choose from country list</Radio>
            </Radio.Group>
          </Form.Item>

          {useDropdownSelection ? (
            // Dropdown selection UI
            <Form.Item
              name="dropdownDestinationId"
              label="Select Destination Country"
              rules={[
                {
                  required: useDropdownSelection,
                  message: 'Please select a destination country',
                },
              ]}
            >
              <CountryDropdown
                type="destination"
                value={formData.dropdownDestinationId || undefined}
                onChange={handleDestinationDropdownChange}
                placeholder="Select destination country"
              />
            </Form.Item>
          ) : customDestination ? (
            // Custom coordinates UI
            <>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="destinationName"
                    label="Destination Name / Port"
                    rules={[
                      {
                        required: customDestination,
                        message: 'Please enter destination name',
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Port of Rotterdam"
                      value={formData.destinationName}
                      onChange={(e) =>
                        handleCustomDestinationChange(
                          'destinationName',
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="destinationLat"
                    label="Latitude"
                    rules={[
                      {
                        required: customDestination,
                        message: 'Please enter latitude',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="e.g., 51.9498"
                      value={formData.destinationLat}
                      onChange={(value) =>
                        handleCustomDestinationChange('destinationLat', value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="destinationLng"
                    label="Longitude"
                    rules={[
                      {
                        required: customDestination,
                        message: 'Please enter longitude',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="e.g., 4.1349"
                      value={formData.destinationLng}
                      onChange={(value) =>
                        handleCustomDestinationChange('destinationLng', value)
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            // Map selection UI
            <Paragraph>
              {selectedCountry ? (
                <Tag color="blue" icon={<EnvironmentOutlined />}>
                  Selected on map: {selectedCountry.name} ({selectedCountry.iso}
                  )
                </Tag>
              ) : (
                <Text type="secondary">
                  Please select a destination country on the interactive map
                  above.
                </Text>
              )}
            </Paragraph>
          )}
        </Form>
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <CompassOutlined />
          Transport Options
          {tabCompletionStatus['2'] ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="blue">Pending</Tag>
          )}
        </Space>
      ),
      children: (
        <Form form={form} layout="vertical" initialValues={formData}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            Select Transport Mode
          </Title>
          <Form.Item name="transportMode">
            <Radio.Group
              onChange={(e) => handleTransportModeChange(e.target.value)}
              value={formData.transportMode}
              optionType="button"
              buttonStyle="solid"
              style={{ width: '100%', display: 'flex' }}
            >
              {Object.entries(transportModeInfo).map(([key, mode]) => (
                <Radio.Button
                  key={key}
                  value={key}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    height: 'auto',
                    minHeight: '120px',
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Space direction="vertical" align="center" size={4}>
                    {mode.icon}
                    <Text
                      strong
                      style={{
                        color:
                          formData.transportMode === key ? 'white' : 'inherit',
                      }}
                    >
                      {mode.name}
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: '12px',
                        color:
                          formData.transportMode === key
                            ? 'rgba(255,255,255,0.85)'
                            : 'inherit',
                        whiteSpace: 'normal',
                        lineHeight: '1.3',
                      }}
                    >
                      {mode.description}
                    </Text>
                  </Space>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          {/* Add other transport options here */}
        </Form>
      ),
    },
    {
      key: '3',
      label: (
        <Space>
          <SettingOutlined />
          Advanced Settings
          {tabCompletionStatus['3'] ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="blue">Pending</Tag>
          )}
        </Space>
      ),
      children: (
        <Form form={form} layout="vertical" initialValues={formData}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            Customize Simulation Parameters (Optional)
          </Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Base Item Price (per unit)">
                <InputNumber
                  addonBefore="$"
                  style={{ width: '100%' }}
                  value={formData.customFields.price}
                  onChange={(value) => handleCustomFieldChange('price', value)}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Item Weight (kg per unit)">
                <InputNumber
                  addonAfter="kg"
                  style={{ width: '100%' }}
                  value={formData.customFields.weight}
                  onChange={(value) => handleCustomFieldChange('weight', value)}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
          <Paragraph type="secondary">
            These values help refine cost and logistic calculations. If unsure,
            leave them as default.
          </Paragraph>
          {/* Add more advanced settings here */}
        </Form>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <CalculatorOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Configure Trade Simulation
          </Title>
        </Space>
      }
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabPosition="top" // Or "left"
        items={tabItems}
      />
      <Divider />

      {/* Preliminary Estimates */}
      <Row gutter={24} style={{ marginBottom: '24px', marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <Space direction="vertical" align="center">
              <DollarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
              <Text style={{ fontSize: '16px', color: '#595959' }}>
                Estimated Cost
              </Text>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                ${estimates.cost.toLocaleString()}
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <Space direction="vertical" align="center">
              <ClockCircleOutlined
                style={{ fontSize: '32px', color: '#f5222d' }}
              />
              <Text style={{ fontSize: '16px', color: '#595959' }}>
                Est. Time
              </Text>
              <Title level={2} style={{ margin: 0, color: '#f5222d' }}>
                {estimates.time} days
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>
      <Paragraph
        type="secondary"
        style={{ textAlign: 'center', marginBottom: '24px' }}
      >
        These are preliminary estimates and may vary in the final simulation.
      </Paragraph>

      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginTop: '20px',
          alignItems: 'center',
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handlePrevTab}
          disabled={activeTab === '1'}
        >
          Back
        </Button>

        {activeTab === '3' ? (
          <Space>
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={handleSubmit}
              loading={isSimulating}
              disabled={isRunSimulationDisabled || isSimulating}
              style={{ minWidth: '150px' }}
            >
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
            <Button
              danger
              icon={<ReloadOutlined />}
              onClick={handleReset}
              disabled={isSimulating}
            >
              Reset Simulation
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleNextTab}
            disabled={!tabCompletionStatus[activeTab]}
          >
            Next
          </Button>
        )}
      </Space>

      {simulationResults && (
        <div style={{ marginTop: '24px' }}>
          <Title level={5}>Last Simulation Summary</Title>
          <Paragraph>
            Transport Mode: {simulationResults.transportMode} <br />
            Origin: {simulationResults.originCountry} <br />
            Destination: {simulationResults.destination?.name || 'N/A'}
          </Paragraph>
          <Button onClick={handleReset} icon={<ReloadOutlined />} danger>
            Clear Results & Reset Form
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SimulationPanel;
