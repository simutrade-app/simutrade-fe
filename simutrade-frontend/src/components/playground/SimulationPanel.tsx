import React, { useState, useEffect } from 'react';
import { Select, Collapsible } from 'radix-ui';
import {
  ChevronDownIcon, 
  ChevronRightIcon,
  CheckIcon,
  RocketIcon,
  GearIcon,
  InfoCircledIcon
} from '@radix-ui/react-icons';
import {
  FiShoppingCart, 
  FiMapPin, 
  FiTruck, 
  FiAnchor,
  FiDollarSign,
  FiClock,
  FiRefreshCw,
  FiPackage,
  FiGlobe,
  FiCpu,
  FiScissors,
  FiCoffee,
  FiSettings,
  FiBox,
  FiStar,
  FiGift,
  FiList,
  FiPlus
} from 'react-icons/fi';
import { MdAirplanemodeActive } from 'react-icons/md';

// Import the CountryDropdown component
import CountryDropdown from './CountryDropdown';
import type { Country } from './CountrySelectorButton';

// Enhanced commodities with minimalist design
const commodities = [
  { id: 1, name: 'Electronics', icon: <FiCpu size={24} />, color: 'rgb(99, 102, 241)', bgColor: 'rgb(238, 242, 255)' },
  { id: 2, name: 'Textiles', icon: <FiScissors size={24} />, color: 'rgb(34, 197, 94)', bgColor: 'rgb(240, 253, 244)' },
  { id: 3, name: 'Coffee', icon: <FiCoffee size={24} />, color: 'rgb(245, 158, 11)', bgColor: 'rgb(255, 251, 235)' },
  { id: 4, name: 'Auto Parts', icon: <FiSettings size={24} />, color: 'rgb(147, 51, 234)', bgColor: 'rgb(250, 245, 255)' },
  { id: 5, name: 'Pharmaceuticals', icon: <FiPackage size={24} />, color: 'rgb(236, 72, 153)', bgColor: 'rgb(253, 244, 255)' },
  { id: 6, name: 'Furniture', icon: <FiBox size={24} />, color: 'rgb(6, 182, 212)', bgColor: 'rgb(240, 253, 250)' },
  { id: 7, name: 'Jewelry', icon: <FiStar size={24} />, color: 'rgb(251, 191, 36)', bgColor: 'rgb(255, 252, 240)' },
  { id: 8, name: 'Toys', icon: <FiGift size={24} />, color: 'rgb(239, 68, 68)', bgColor: 'rgb(254, 242, 242)' },
  { id: 9, name: 'Add Custom', icon: <FiPlus size={24} />, color: 'rgb(107, 114, 128)', bgColor: 'rgb(243, 244, 246)' },
];

const originCountries = [
  { id: 'CURRENT', name: 'Current Location', flag: '📍' },
  { id: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'SGP', name: 'Singapore', flag: '🇸🇬' },
  { id: 'THA', name: 'Thailand', flag: '🇹🇭' },
  { id: 'VNM', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'PHL', name: 'Philippines', flag: '🇵🇭' },
];

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

interface TransportModeInfo {
  name: string;
  icon: React.ReactNode;
  timeMultiplier: number;
  costMultiplier: number;
  description: string;
  color: string;
  bgColor: string;
  benefits: string[];
}

const transportModes: { [key: string]: TransportModeInfo } = {
  sea: {
    name: 'Sea Freight',
    icon: <FiAnchor size={20} />,
    timeMultiplier: 1.5,
    costMultiplier: 0.8,
    description: 'Economical for bulk shipments',
    color: 'rgb(59, 130, 246)',
    bgColor: 'rgb(239, 246, 255)',
    benefits: ['Lowest cost', 'Eco-friendly', 'Large capacity'],
  },
  air: {
    name: 'Air Freight',
    icon: <MdAirplanemodeActive size={20} />,
    timeMultiplier: 0.5,
    costMultiplier: 2.5,
    description: 'Fastest delivery worldwide',
    color: 'rgb(147, 51, 234)',
    bgColor: 'rgb(250, 245, 255)',
    benefits: ['Fastest delivery', 'High security', 'Global reach'],
  },
  land: {
    name: 'Land Transport',
    icon: <FiTruck size={20} />,
    timeMultiplier: 1.0,
    costMultiplier: 1.2,
    description: 'Reliable regional shipping',
    color: 'rgb(34, 197, 94)',
    bgColor: 'rgb(240, 253, 244)',
    benefits: ['Door-to-door', 'Flexible routes', 'Good for perishables'],
  },
};

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
  onOriginCountryChange?: (originCountryId: string) => void;
  onCurrentLocationDetected?: (location: {lat: number, lng: number, name: string}) => void;
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

// Custom Select component using Radix UI
const CustomSelect: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onValueChange, placeholder, children, className }) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger className={`select-trigger ${className || ''}`}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="select-icon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="select-content">
        <Select.Viewport className="select-viewport">
          {children}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  selectedCountry,
  onRunSimulation,
  onResetSimulation,
  isSimulating,
  simulationResults,
  onOriginCountryChange,
  onCurrentLocationDetected,
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    commodity: null,
    volume: 100,
    transportMode: 'sea',
    originCountry: '',
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

  const [estimates, setEstimates] = useState({ cost: 0, time: 0 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Notify parent when current location is detected
  useEffect(() => {
    if (currentLocation && formData.originCountry === 'CURRENT' && onOriginCountryChange) {
      onOriginCountryChange('CURRENT');
    }
  }, [currentLocation, formData.originCountry, onOriginCountryChange]);

  // Calculate estimates
  useEffect(() => {
    if (formData.commodity && formData.volume) {
      const mode = transportModes[formData.transportMode];
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

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get country name from reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const countryName = data.countryName || 'Current Location';
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            name: countryName
          };
          setCurrentLocation(locationData);
          
          // Notify parent immediately when location is detected
          if (onCurrentLocationDetected) {
            onCurrentLocationDetected(locationData);
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          const locationData = {
            lat: latitude,
            lng: longitude,
            name: 'Current Location'
          };
          setCurrentLocation(locationData);
          
          // Notify parent immediately when location is detected
          if (onCurrentLocationDetected) {
            onCurrentLocationDetected(locationData);
          }
        }
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location: ' + error.message);
        setIsDetectingLocation(false);
        // Reset to default country if detection fails
        setFormData(prev => ({ ...prev, originCountry: 'IDN' }));
      }
    );
  };

  const handleOriginCountryChange = (countryId: string) => {
    if (countryId === 'CURRENT') {
      detectCurrentLocation();
    } else {
      setCurrentLocation(null);
    }
    setFormData(prev => ({ ...prev, originCountry: countryId }));
    
    // Notify parent component immediately
    if (onOriginCountryChange) {
      onOriginCountryChange(countryId);
    }
  };

  const isFormComplete = () => {
    const hasBasicInfo = formData.commodity && formData.originCountry && formData.originCountry !== '';
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

  const handleSubmit = () => {
    if (!isFormComplete()) {
      alert('Please complete all required fields');
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
          : { name: formData.destinationName, lat: formData.destinationLat, lng: formData.destinationLng },
      currentLocation: formData.originCountry === 'CURRENT' ? currentLocation : null,
    };
    onRunSimulation(simulationData);
  };

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

  const selectedCommodity = commodities.find(c => c.id === formData.commodity);

  return (
    <div className="simulation-panel">
      <style>{`
        .simulation-panel {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 16px;
          box-shadow: none;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: rgb(17, 24, 39);
        }

        .header-subtitle {
          color: rgb(107, 114, 128);
          font-size: 14px;
          margin: 4px 0 0 0;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid rgb(220, 38, 127);
          border-radius: 8px;
          color: rgb(220, 38, 127);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .reset-button:hover {
          background: rgb(254, 242, 242);
        }

        .section {
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: rgb(17, 24, 39);
          margin: 0;
        }

        .section-badge {
          padding: 2px 6px;
          background: rgba(34, 197, 94, 0.15);
          color: rgb(34, 197, 94);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .commodities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .commodity-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .commodity-card:hover {
          border-color: rgb(156, 163, 175);
        }

        .commodity-card.selected {
          border-color: var(--commodity-color);
          background: var(--commodity-bg);
        }

        .commodity-icon {
          font-size: 24px;
        }

        .commodity-name {
          font-size: 14px;
          font-weight: 500;
          color: rgb(55, 65, 81);
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: rgb(55, 65, 81);
        }

        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: white;
          border: 1px solid rgb(209, 213, 219);
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .select-trigger:hover {
          border-color: rgb(156, 163, 175);
        }

        .select-trigger:focus {
          outline: none;
          border-color: rgb(34, 197, 94);
          box-shadow: none;
        }

        .select-icon {
          transition: transform 0.2s;
        }

        .select-trigger[data-state="open"] .select-icon {
          transform: rotate(180deg);
        }

        .select-content {
          background: white;
          border: 1px solid rgb(229, 231, 235);
          border-radius: 8px;
          padding: 4px;
          box-shadow: none;
          z-index: 50;
        }

        .select-viewport {
          padding: 4px;
        }

        .select-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: rgb(55, 65, 81);
          transition: all 0.2s;
        }

        .select-item:hover {
          background: rgb(243, 244, 246);
        }

        .select-item[data-highlighted] {
          background: rgb(34, 197, 94);
          color: white;
          outline: none;
        }

        .select-item[data-state="checked"] {
          background: rgb(239, 246, 255);
          color: rgb(34, 197, 94);
        }

        .select-item-indicator {
          display: flex;
          align-items: center;
        }

        .input-field {
          padding: 12px;
          background: white;
          border: 1px solid rgb(209, 213, 219);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: rgb(34, 197, 94);
          box-shadow: none;
        }

        .destination-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .destination-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          min-height: 140px;
        }

        .destination-card:hover {
          border-color: rgb(156, 163, 175);
        }

        .destination-card.selected {
          border-color: rgb(34, 197, 94);
          background: rgb(239, 246, 255);
        }

        .destination-icon {
          font-size: 32px;
        }

        .destination-title {
          font-size: 16px;
          font-weight: 600;
          color: rgb(17, 24, 39);
          margin: 0;
        }

        .destination-subtitle {
          font-size: 12px;
          color: rgb(107, 114, 128);
          margin: 0;
        }

        .destination-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .destination-card-body {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .destination-card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 18px;
        }

        .transport-modes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .transport-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .transport-card:hover {
          border-color: rgb(156, 163, 175);
        }

        .transport-card.selected {
          border-color: var(--transport-color);
          background: var(--transport-bg);
        }

        .transport-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .transport-icon {
          padding: 8px;
          border-radius: 8px;
          background: var(--transport-bg, rgb(243, 244, 246));
          color: var(--transport-color, rgb(107, 114, 128));
        }

        .transport-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: rgb(17, 24, 39);
        }

        .transport-info p {
          margin: 0;
          font-size: 12px;
          color: rgb(107, 114, 128);
        }

        .transport-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .benefit-tag {
          padding: 4px 8px;
          background: rgba(34, 197, 94, 0.1);
          color: rgb(34, 197, 94);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
        }

        .estimates-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 32px 0;
          padding: 24px;
          background: linear-gradient(135deg, rgb(249, 250, 251) 0%, rgb(243, 244, 246) 100%);
          border-radius: 12px;
          border: 1px solid rgb(229, 231, 235);
        }

        .estimate-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 12px;
          box-shadow: none;
        }

        .estimate-icon {
          padding: 12px;
          border-radius: 12px;
          color: white;
        }

        .estimate-label {
          font-size: 14px;
          color: rgb(107, 114, 128);
          margin: 0;
        }

        .estimate-value {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .cost-estimate .estimate-icon {
          background: rgb(34, 197, 94);
        }

        .cost-estimate .estimate-value {
          color: rgb(34, 197, 94);
        }

        .time-estimate .estimate-icon {
          background: rgb(59, 130, 246);
        }

        .time-estimate .estimate-value {
          color: rgb(59, 130, 246);
        }

        .collapsible-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgb(249, 250, 251);
          border: 1px solid rgb(229, 231, 235);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: rgb(55, 65, 81);
          transition: all 0.2s;
          width: 100%;
          text-align: left;
        }

        .collapsible-trigger:hover {
          background: rgb(243, 244, 246);
        }

        .collapsible-icon {
          transition: transform 0.2s;
        }

        .collapsible-trigger[data-state="open"] .collapsible-icon {
          transform: rotate(90deg);
        }

        .collapsible-content {
          padding: 20px;
          background: white;
          border: 1px solid rgb(229, 231, 235);
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px;
          background: rgb(34, 197, 94) !important;
          color: white !important;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 24px;
        }

        .submit-button:hover:not(:disabled) {
          background: rgb(22, 163, 74) !important;
        }

        .submit-button:disabled {
          background: rgb(156, 163, 175);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .results-section {
          padding: 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          margin-top: 24px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .result-item {
          text-align: center;
        }

        .result-label {
          font-size: 12px;
          color: rgb(107, 114, 128);
          margin: 0 0 4px 0;
        }

        .result-value {
          font-size: 14px;
          font-weight: 600;
          color: rgb(17, 24, 39);
          margin: 0;
        }

        .done-label {
          background: rgba(34, 197, 94, 0.15);
          color: rgb(34, 197, 94);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .done-label-overlay {
          position: absolute;
          top: 6px;
          right: 6px;
          pointer-events: none;
        }

        .info-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: rgb(107, 114, 128);
          gap: 8px;
          font-size: 14px;
        }

        /* Hidden variant keeps layout while hiding content */
        .info-box.hidden {
          visibility: hidden;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .destination-options {
            grid-template-columns: 1fr;
          }
          
          .transport-modes {
            grid-template-columns: 1fr;
          }
          
          .estimates-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="panel-header">
        <div>
          <div className="header-title">
            <FiPackage size={24} color="rgb(34, 197, 94)" />
            <h2>Trade Simulation</h2>
          </div>
          <p className="header-subtitle">Configure your trade parameters with our streamlined interface</p>
        </div>
        {simulationResults && (
          <button className="reset-button" onClick={onResetSimulation}>
            <FiRefreshCw size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Step 1: Commodity & Origin */}
      <div className="section">
        <div className="section-header">
          <FiShoppingCart size={20} color="rgb(34, 197, 94)" />
          <h3 className="section-title">Trade Setup</h3>
          {selectedCommodity && <span className="section-badge">Done</span>}
        </div>
        
        <div className="commodities-grid">
          {commodities.map((commodity) => (
            <div
              key={commodity.id}
              className={`commodity-card ${formData.commodity === commodity.id ? 'selected' : ''}`}
              style={{
                '--commodity-color': commodity.color,
                '--commodity-bg': commodity.bgColor,
              } as React.CSSProperties}
              onClick={() => setFormData(prev => ({ ...prev, commodity: commodity.id }))}
            >
              <span 
                className="done-label-overlay done-label"
                style={{ opacity: formData.commodity === commodity.id ? 1 : 0 }}
              >Done</span>
              <div className="commodity-icon">{commodity.icon}</div>
              <p className="commodity-name">{commodity.name}</p>
            </div>
          ))}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Origin Country</label>
                          <CustomSelect
                  value={formData.originCountry}
                              onValueChange={handleOriginCountryChange}
              placeholder="Select origin country"
                >
                  {originCountries.map((country) => (
                <Select.Item key={country.id} value={country.id} className="select-item">
                  <Select.ItemText>
                      {country.id === 'CURRENT' && isDetectingLocation 
                        ? '🔄 Detecting...' 
                        : country.id === 'CURRENT'
                          ? `${country.flag} ${country.name}`
                          : `${country.flag} ${country.name}`
                      }
                  </Select.ItemText>
                  <Select.ItemIndicator className="select-item-indicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </CustomSelect>
          </div>
          
          <div className="form-group">
            <label className="form-label">Volume (units)</label>
            <input
              type="number"
              className="input-field"
              value={formData.volume}
              onChange={(e) => setFormData(prev => ({ ...prev, volume: parseInt(e.target.value) || 0 }))}
              min={1}
              max={10000}
            />
          </div>
        </div>
      </div>

      {/* Step 2: Destination */}
      <div className="section">
        <div className="section-header">
          <FiMapPin size={20} color="rgb(34, 197, 94)" />
          <h3 className="section-title">Destination</h3>
          {(selectedCountry || formData.dropdownDestinationId || (formData.destinationMode === 'custom' && formData.destinationName)) && 
            <span className="section-badge">Done</span>
          }
        </div>

        <div className="destination-options">
          <div
            className={`destination-card ${formData.destinationMode === 'map' ? 'selected' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, destinationMode: 'map' }))}
          >
            <div className="destination-card-header">
              <div className="destination-icon"><FiGlobe size={28} /></div>
              <h4 className="destination-title">Select on Map</h4>
            </div>
            <div className="destination-card-body">
              <p className="destination-subtitle">Click any country above</p>
            </div>
            <div className="destination-card-footer">
              {formData.destinationMode === 'map' && selectedCountry ? (
                <span style={{ color: 'rgb(59, 130, 246)', fontSize: '12px', fontWeight: '600' }}>
                  {selectedCountry.name}
                </span>
              ) : (
                <span style={{ opacity: 0, fontSize: '12px' }}>placeholder</span>
              )}
            </div>
          </div>

          <div
            className={`destination-card ${formData.destinationMode === 'dropdown' ? 'selected' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, destinationMode: 'dropdown' }))}
          >
            <div className="destination-card-header">
              <div className="destination-icon"><FiList size={28} /></div>
              <h4 className="destination-title">Choose from List</h4>
            </div>
            <div className="destination-card-body">
              <p className="destination-subtitle">Popular destinations</p>
            </div>
            <div className="destination-card-footer">
              {formData.destinationMode === 'dropdown' && formData.dropdownDestinationId ? (
                <span style={{ color: 'rgb(59, 130, 246)', fontSize: '12px', fontWeight: '600' }}>
                  {formData.destinationName}
                </span>
              ) : (
                <span style={{ opacity: 0, fontSize: '12px' }}>placeholder</span>
              )}
            </div>
          </div>

          <div
            className={`destination-card ${formData.destinationMode === 'custom' ? 'selected' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, destinationMode: 'custom' }))}
          >
            <div className="destination-card-header">
              <div className="destination-icon"><FiMapPin size={28} /></div>
              <h4 className="destination-title">Custom Location</h4>
            </div>
            <div className="destination-card-body">
              <p className="destination-subtitle">Enter coordinates</p>
            </div>
            <div className="destination-card-footer">
              {formData.destinationMode === 'custom' && formData.destinationName ? (
                <span style={{ color: 'rgb(59, 130, 246)', fontSize: '12px', fontWeight: '600' }}>
                  {formData.destinationName}
                </span>
              ) : (
                <span style={{ opacity: 0, fontSize: '12px' }}>placeholder</span>
              )}
            </div>
          </div>
        </div>

        {formData.destinationMode === 'dropdown' && (
              <CountryDropdown
                type="destination"
                value={formData.dropdownDestinationId || undefined}
                onChange={handleDestinationDropdownChange}
                placeholder="Select destination country"
              />
        )}

        {formData.destinationMode === 'custom' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Destination Name</label>
              <input
                type="text"
                className="input-field"
                      placeholder="e.g., Port of Rotterdam"
                      value={formData.destinationName}
                onChange={(e) => setFormData(prev => ({ ...prev, destinationName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                className="input-field"
                      placeholder="e.g., 51.9498"
                value={formData.destinationLat || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, destinationLat: parseFloat(e.target.value) || null }))}
              />
            </div>
          </div>
        )}

        {/* Always render info-box to preserve layout; hide content when not needed */}
        <div
          className={`info-box ${
            formData.destinationMode === 'map' && !selectedCountry ? '' : 'hidden'
          }`}
        >
          <InfoCircledIcon />
          <span>Select a destination country by clicking on the map.</span>
        </div>
      </div>

      {/* Step 3: Transport Mode */}
      <div className="section">
        <div className="section-header">
          <FiTruck size={20} color="rgb(147, 51, 234)" />
          <h3 className="section-title">Transport Method</h3>
          <span className="section-badge">Done</span>
        </div>

        <div className="transport-modes">
          {Object.entries(transportModes).map(([key, mode]) => (
            <div
                  key={key}
              className={`transport-card ${formData.transportMode === key ? 'selected' : ''}`}
                  style={{
                '--transport-color': mode.color,
                '--transport-bg': mode.bgColor,
              } as React.CSSProperties}
              onClick={() => setFormData(prev => ({ ...prev, transportMode: key }))}
            >
              <div className="transport-header">
                <div className="transport-icon">{mode.icon}</div>
                <div className="transport-info">
                  <h4>{mode.name}</h4>
                  <p>{mode.description}</p>
                </div>
              </div>
              <div className="transport-benefits">
                {mode.benefits.map((benefit, index) => (
                  <span key={index} className="benefit-tag">{benefit}</span>
                ))}
              </div>
              <span 
                className="done-label-overlay done-label"
                style={{ opacity: formData.transportMode === key ? 1 : 0 }}
              >Done</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Estimates */}
      {isFormComplete() && (
        <div className="estimates-section">
          <div className="estimate-card cost-estimate">
            <div className="estimate-icon">
              <FiDollarSign size={20} />
            </div>
            <p className="estimate-label">Total Cost</p>
            <h3 className="estimate-value">${estimates.cost.toLocaleString()}</h3>
          </div>
          <div className="estimate-card time-estimate">
            <div className="estimate-icon">
              <FiClock size={20} />
            </div>
            <p className="estimate-label">Delivery Time</p>
            <h3 className="estimate-value">{estimates.time} days</h3>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      <Collapsible.Root open={showAdvanced} onOpenChange={setShowAdvanced}>
        <Collapsible.Trigger className="collapsible-trigger">
          <ChevronRightIcon className="collapsible-icon" />
          <GearIcon />
          <span>Advanced Settings</span>
          <InfoCircledIcon style={{ marginLeft: 'auto', color: 'rgb(34, 197, 94)' }} />
        </Collapsible.Trigger>
        <Collapsible.Content className="collapsible-content">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Base Item Price (per unit)</label>
              <input
                type="number"
                className="input-field"
                  value={formData.customFields.price}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customFields: { ...prev.customFields, price: parseFloat(e.target.value) || 0 }
                }))}
                  min={0}
                />
            </div>
            <div className="form-group">
              <label className="form-label">Item Weight (kg per unit)</label>
              <input
                type="number"
                className="input-field"
                  value={formData.customFields.weight}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customFields: { ...prev.customFields, weight: parseFloat(e.target.value) || 0 }
                }))}
                  min={0}
                />
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* Submit Button */}
      <button
        className="submit-button"
              onClick={handleSubmit}
        disabled={!isFormComplete() || isSimulating}
      >
        <RocketIcon />
        {isSimulating ? 'Running Simulation...' : 'Run Trade Simulation'}
      </button>

      {/* Results */}
      {simulationResults && (
        <div className="results-section">
          <div className="section-header">
            <CheckIcon style={{ color: 'rgb(34, 197, 94)' }} />
            <h3 className="section-title">Simulation Results</h3>
          </div>
          <div className="results-grid">
            <div className="result-item">
              <p className="result-label">Commodity</p>
              <p className="result-value">{commodities.find(c => c.id === simulationResults.commodity)?.name}</p>
            </div>
            <div className="result-item">
              <p className="result-label">Transport</p>
              <p className="result-value">{transportModes[simulationResults.transportMode]?.name}</p>
            </div>
            <div className="result-item">
              <p className="result-label">Origin</p>
              <p className="result-value">
                {simulationResults.originCountry === 'CURRENT' && simulationResults.currentLocation
                  ? simulationResults.currentLocation.name
                  : originCountries.find(c => c.id === simulationResults.originCountry)?.name
                }
              </p>
            </div>
            <div className="result-item">
              <p className="result-label">Destination</p>
              <p className="result-value">{simulationResults.destination?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;