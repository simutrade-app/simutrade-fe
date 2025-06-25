import React, { useState, useEffect, useRef } from 'react';
import { Spin, Tag, Modal, notification } from 'antd';
import { AUTH_TOKEN_KEY } from '../../services/AuthService';
import {
  FaShip,
  FaAnchor,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaMapMarkerAlt,
  FaEye,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaRobot,
  FaChevronRight,
} from 'react-icons/fa';

// TypewriterText component for typing animation
interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
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

// Types
interface PortReview {
  id: string;
  portName: string;
  country: string;
  region: string;
  overallRating: number;
  efficiency: number;
  infrastructure: number;
  digitalCapability: number;
  costEffectiveness: number;
  reviewCount: number;
  lastUpdated: string;
  trending: 'up' | 'down' | 'stable';
  aiInsights: string[];
  keyFeatures: string[];
  challenges: string[];
  recommendedFor: string[];
  coordinates: { lat: number; lng: number };
  throughputMTEU: number;
  averageWaitTime: number;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
    address: string;
    operatingHours: string;
    emergencyContact: string;
  };
}

interface FilterState {
  region: string;
  rating: number | null;
  trending: string;
  search: string;
}

// Sample data - Comprehensive port reviews
const samplePortReviews: PortReview[] = [
  {
    id: 'port-1',
    portName: 'Port of Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    overallRating: 4.8,
    efficiency: 4.9,
    infrastructure: 4.8,
    digitalCapability: 4.9,
    costEffectiveness: 4.6,
    reviewCount: 2847,
    lastUpdated: '2024-01-15',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Automated container terminals',
      '24/7 operations',
      'Advanced customs clearance',
      'Excellent connectivity',
      'Smart port technologies',
      'Integrated logistics services'
    ],
    challenges: [
      'High operational costs',
      'Space constraints',
      'Intense competition'
    ],
    recommendedFor: [
      'Electronics',
      'High-value goods',
      'Time-sensitive cargo',
      'Transshipment operations'
    ],
    coordinates: { lat: 1.2966, lng: 103.7764 },
    throughputMTEU: 37.2,
    averageWaitTime: 0.8,
    contactInfo: {
      phone: '+65 6500 0000',
      email: 'info@portofsingapore.com',
      website: 'https://www.portofsingapore.com',
      address: '1000 South Shore Road, Singapore 138602',
      operatingHours: '24 hours',
      emergencyContact: '999 (Emergency) or 1800 225 5555 (General Enquiries)'
    }
  },
  {
    id: 'port-2',
    portName: 'Port of Rotterdam',
    country: 'Netherlands',
    region: 'Europe',
    overallRating: 4.7,
    efficiency: 4.6,
    infrastructure: 4.8,
    digitalCapability: 4.7,
    costEffectiveness: 4.5,
    reviewCount: 1923,
    lastUpdated: '2024-01-14',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Deep-water access',
      'Multimodal transport hub',
      'Green energy initiatives',
      'Advanced logistics services',
      'Automated terminals',
      'Digital port platform'
    ],
    challenges: [
      'Weather-related delays',
      'Environmental regulations',
      'Brexit impact'
    ],
    recommendedFor: [
      'Bulk commodities',
      'Automotive',
      'Chemical products',
      'Energy transition cargo'
    ],
    coordinates: { lat: 51.9225, lng: 4.47917 },
    throughputMTEU: 15.3,
    averageWaitTime: 1.2,
    contactInfo: {
      phone: '+31 10 408 9000',
      email: 'info@portofrotterdam.com',
      website: 'https://www.portofrotterdam.com',
      address: 'Nieuwe Waterweg 1, 3013AA Rotterdam, Netherlands',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 010 408 9000 (General Enquiries)'
    }
  },
  {
    id: 'port-3',
    portName: 'Port of Los Angeles',
    country: 'United States',
    region: 'North America',
    overallRating: 4.4,
    efficiency: 4.3,
    infrastructure: 4.5,
    digitalCapability: 4.2,
    costEffectiveness: 4.1,
    reviewCount: 1654,
    lastUpdated: '2024-01-13',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Massive container capacity',
      'Rail connections',
      'Distribution networks',
      'Technology investments',
      'Green port initiatives',
      'Warehouse facilities'
    ],
    challenges: [
      'Congestion issues',
      'Air quality concerns',
      'Labor negotiations',
      'Truck traffic'
    ],
    recommendedFor: [
      'Consumer goods',
      'Manufacturing inputs',
      'Retail products',
      'Asian imports'
    ],
    coordinates: { lat: 33.7365, lng: -118.2644 },
    throughputMTEU: 10.7,
    averageWaitTime: 2.1,
    contactInfo: {
      phone: '+1 310 538 2000',
      email: 'info@portoflosangeles.org',
      website: 'https://www.portoflosangeles.org',
      address: '1200 North Harbor Drive, Terminal Island, Los Angeles, CA 90731, United States',
      operatingHours: '24 hours',
      emergencyContact: '911 (Emergency) or 310 538 2000 (General Enquiries)'
    }
  },
  {
    id: 'port-4',
    portName: 'Port of Shanghai',
    country: 'China',
    region: 'East Asia',
    overallRating: 4.6,
    efficiency: 4.7,
    infrastructure: 4.6,
    digitalCapability: 4.5,
    costEffectiveness: 4.7,
    reviewCount: 3421,
    lastUpdated: '2024-01-16',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'World\'s largest container port',
      'Integrated logistics',
      'Free trade zone',
      'Automated operations',
      'Deep water berths',
      'Rail connectivity'
    ],
    challenges: [
      'Congestion during peak seasons',
      'Environmental compliance',
      'Competition from nearby ports'
    ],
    recommendedFor: [
      'Manufacturing exports',
      'Consumer electronics',
      'Textiles',
      'Heavy machinery'
    ],
    coordinates: { lat: 31.2304, lng: 121.4737 },
    throughputMTEU: 50.3,
    averageWaitTime: 1.5,
    contactInfo: {
      phone: '+86 21 5435 2000',
      email: 'info@portofshanghai.com.cn',
      website: 'https://www.portofshanghai.com.cn',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '110 (Emergency) or 1010 5555 (General Enquiries)'
    }
  },
  {
    id: 'port-5',
    portName: 'Port of Dubai',
    country: 'UAE',
    region: 'Middle East',
    overallRating: 4.5,
    efficiency: 4.4,
    infrastructure: 4.6,
    digitalCapability: 4.5,
    costEffectiveness: 4.3,
    reviewCount: 1876,
    lastUpdated: '2024-01-12',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Strategic location',
      'Free zone facilities',
      'Modern infrastructure',
      'Multimodal connectivity',
      'Trade finance services',
      'Digital platforms'
    ],
    challenges: [
      'Regional competition',
      'Economic fluctuations',
      'Geopolitical risks'
    ],
    recommendedFor: [
      'Re-export cargo',
      'Luxury goods',
      'Regional distribution',
      'Oil & gas equipment'
    ],
    coordinates: { lat: 25.2762, lng: 55.2962 },
    throughputMTEU: 14.8,
    averageWaitTime: 1.8,
    contactInfo: {
      phone: '+971 4 888 8888',
      email: 'info@portofdubai.ae',
      website: 'https://www.portofdubai.ae',
      address: 'P.O. Box 1234, Dubai, United Arab Emirates',
      operatingHours: '24 hours',
      emergencyContact: '999 (Emergency) or 800 244 222 (General Enquiries)'
    }
  },
  {
    id: 'port-6',
    portName: 'Port of Hamburg',
    country: 'Germany',
    region: 'Europe',
    overallRating: 4.3,
    efficiency: 4.2,
    infrastructure: 4.4,
    digitalCapability: 4.1,
    costEffectiveness: 4.2,
    reviewCount: 1432,
    lastUpdated: '2024-01-11',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Gateway to Central Europe',
      'River port advantages',
      'Rail connectivity',
      'Container terminals',
      'Logistics clusters',
      'Digital services'
    ],
    challenges: [
      'Tidal restrictions',
      'Infrastructure aging',
      'Labor costs'
    ],
    recommendedFor: [
      'European distribution',
      'Automotive parts',
      'Machinery',
      'Consumer goods'
    ],
    coordinates: { lat: 53.5511, lng: 9.9937 },
    throughputMTEU: 7.8,
    averageWaitTime: 2.3,
    contactInfo: {
      phone: '+49 40 3000 0',
      email: 'info@hafen-hamburg.de',
      website: 'https://www.hafen-hamburg.de',
      address: '20457 Hamburg, Germany',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 040 3000 0 (General Enquiries)'
    }
  },
  {
    id: 'port-7',
    portName: 'Port of Hong Kong',
    country: 'Hong Kong',
    region: 'East Asia',
    overallRating: 4.4,
    efficiency: 4.5,
    infrastructure: 4.3,
    digitalCapability: 4.4,
    costEffectiveness: 4.1,
    reviewCount: 2156,
    lastUpdated: '2024-01-10',
    trending: 'down',
    aiInsights: [],
    keyFeatures: [
      'Natural deep harbor',
      'Strategic location',
      'Financial services',
      'Efficient operations',
      'Container handling',
      'Trade facilitation'
    ],
    challenges: [
      'Competition from mainland ports',
      'High costs',
      'Space limitations'
    ],
    recommendedFor: [
      'High-value cargo',
      'Fashion & textiles',
      'Electronics',
      'Financial trade'
    ],
    coordinates: { lat: 22.3193, lng: 114.1694 },
    throughputMTEU: 14.4,
    averageWaitTime: 1.9,
    contactInfo: {
      phone: '+852 2588 0000',
      email: 'info@hkpier.com.hk',
      website: 'https://www.hkpier.com.hk',
      address: 'Tsim Sha Tsui, Hong Kong',
      operatingHours: '24 hours',
      emergencyContact: '999 (Emergency) or 2588 0000 (General Enquiries)'
    }
  },
  {
    id: 'port-8',
    portName: 'Port of Long Beach',
    country: 'United States',
    region: 'North America',
    overallRating: 4.2,
    efficiency: 4.1,
    infrastructure: 4.3,
    digitalCapability: 4.0,
    costEffectiveness: 4.1,
    reviewCount: 1298,
    lastUpdated: '2024-01-09',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Green port leader',
      'Modern terminals',
      'Rail connectivity',
      'Container facilities',
      'Technology adoption',
      'Environmental initiatives'
    ],
    challenges: [
      'Congestion issues',
      'Air quality requirements',
      'Competition with LA port'
    ],
    recommendedFor: [
      'Asian imports',
      'Consumer goods',
      'Automotive',
      'Green shipping'
    ],
    coordinates: { lat: 33.7701, lng: -118.2106 },
    throughputMTEU: 8.1,
    averageWaitTime: 2.0,
    contactInfo: {
      phone: '+1 562 595 5000',
      email: 'info@portoflongbeach.com',
      website: 'https://www.portoflongbeach.com',
      address: '11200 Harbor Blvd, Long Beach, CA 90802, United States',
      operatingHours: '24 hours',
      emergencyContact: '911 (Emergency) or 562 595 5000 (General Enquiries)'
    }
  },
  {
    id: 'port-9',
    portName: 'Port of Ningbo-Zhoushan',
    country: 'China',
    region: 'East Asia',
    overallRating: 4.5,
    efficiency: 4.6,
    infrastructure: 4.4,
    digitalCapability: 4.3,
    costEffectiveness: 4.8,
    reviewCount: 1987,
    lastUpdated: '2024-01-18',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Deep-water channels',
      'Bulk cargo handling',
      'Container terminals',
      'Industrial integration',
      'Cost-effective operations',
      'Modern equipment'
    ],
    challenges: [
      'Weather disruptions',
      'Environmental regulations',
      'Infrastructure bottlenecks'
    ],
    recommendedFor: [
      'Bulk commodities',
      'Manufacturing goods',
      'Steel products',
      'Chemical cargo'
    ],
    coordinates: { lat: 29.8683, lng: 121.5440 },
    throughputMTEU: 35.3,
    averageWaitTime: 1.3,
    contactInfo: {
      phone: '+86 574 8888 8888',
      email: 'info@ningbo-port.com',
      website: 'https://www.ningbo-port.com',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '110 (Emergency) or 8888 8888 (General Enquiries)'
    }
  },
  {
    id: 'port-10',
    portName: 'Port of Shenzhen',
    country: 'China',
    region: 'East Asia',
    overallRating: 4.4,
    efficiency: 4.5,
    infrastructure: 4.3,
    digitalCapability: 4.6,
    costEffectiveness: 4.6,
    reviewCount: 2234,
    lastUpdated: '2024-01-17',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Technology hub access',
      'Multiple terminals',
      'Digital innovations',
      'High-tech cargo',
      'Fast processing',
      'Modern facilities'
    ],
    challenges: [
      'Air pollution',
      'Traffic congestion',
      'High land costs'
    ],
    recommendedFor: [
      'Electronics',
      'Technology products',
      'Consumer goods',
      'High-value cargo'
    ],
    coordinates: { lat: 22.5431, lng: 114.0579 },
    throughputMTEU: 28.8,
    averageWaitTime: 1.4,
    contactInfo: {
      phone: '+86 755 8668 8888',
      email: 'info@szport.com.cn',
      website: 'https://www.szport.com.cn',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '110 (Emergency) or 8888 8888 (General Enquiries)'
    }
  },
  {
    id: 'port-11',
    portName: 'Port of Busan',
    country: 'South Korea',
    region: 'East Asia',
    overallRating: 4.6,
    efficiency: 4.7,
    infrastructure: 4.5,
    digitalCapability: 4.4,
    costEffectiveness: 4.5,
    reviewCount: 1654,
    lastUpdated: '2024-01-16',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Northeast Asia hub',
      'Transshipment center',
      'Modern terminals',
      'Efficient operations',
      'Digital systems',
      'Strategic location'
    ],
    challenges: [
      'Weather conditions',
      'Regional competition',
      'Infrastructure investment needs'
    ],
    recommendedFor: [
      'Transshipment cargo',
      'Automotive',
      'Electronics',
      'Machinery'
    ],
    coordinates: { lat: 35.0951, lng: 129.0756 },
    throughputMTEU: 23.0,
    averageWaitTime: 1.1,
    contactInfo: {
      phone: '+82 51 850 1114',
      email: 'info@portbusan.com',
      website: 'https://www.portbusan.com',
      address: '111, Gwangan-daero 100, Yeongdo-gu, Busan, South Korea',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 51 850 1114 (General Enquiries)'
    }
  },
  {
    id: 'port-12',
    portName: 'Port of Antwerp-Bruges',
    country: 'Belgium',
    region: 'Europe',
    overallRating: 4.5,
    efficiency: 4.4,
    infrastructure: 4.6,
    digitalCapability: 4.3,
    costEffectiveness: 4.4,
    reviewCount: 1543,
    lastUpdated: '2024-01-15',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Chemical cluster',
      'Inland connectivity',
      'Modern terminals',
      'Digitalization',
      'Multimodal transport',
      'Sustainable operations'
    ],
    challenges: [
      'Tidal restrictions',
      'Environmental pressure',
      'Competition with Rotterdam'
    ],
    recommendedFor: [
      'Chemical products',
      'Automotive',
      'Project cargo',
      'Break-bulk'
    ],
    coordinates: { lat: 51.2993, lng: 4.1378 },
    throughputMTEU: 13.5,
    averageWaitTime: 1.6,
    contactInfo: {
      phone: '+32 3 226 40 00',
      email: 'info@portofantwerp.be',
      website: 'https://www.portofantwerp.be',
      address: 'Koningin Astridplein 1, 2000 Antwerpen, Belgium',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 03 226 40 00 (General Enquiries)'
    }
  },
  {
    id: 'port-13',
    portName: 'Port of Qingdao',
    country: 'China',
    region: 'East Asia',
    overallRating: 4.3,
    efficiency: 4.4,
    infrastructure: 4.2,
    digitalCapability: 4.1,
    costEffectiveness: 4.7,
    reviewCount: 1432,
    lastUpdated: '2024-01-14',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Northern China gateway',
      'Iron ore terminal',
      'Container facilities',
      'Cost-effective handling',
      'Rail connections',
      'Bulk cargo expertise'
    ],
    challenges: [
      'Seasonal variations',
      'Air pollution',
      'Infrastructure pressure'
    ],
    recommendedFor: [
      'Iron ore',
      'Coal',
      'Container cargo',
      'Agricultural products'
    ],
    coordinates: { lat: 36.0986, lng: 120.3719 },
    throughputMTEU: 26.8,
    averageWaitTime: 1.7,
    contactInfo: {
      phone: '+86 532 8588 8888',
      email: 'info@qingdao-port.com',
      website: 'https://www.qingdao-port.com',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '110 (Emergency) or 8888 8888 (General Enquiries)'
    }
  },
  {
    id: 'port-14',
    portName: 'Port of Guangzhou',
    country: 'China',
    region: 'East Asia',
    overallRating: 4.2,
    efficiency: 4.3,
    infrastructure: 4.1,
    digitalCapability: 4.0,
    costEffectiveness: 4.6,
    reviewCount: 1321,
    lastUpdated: '2024-01-13',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Pearl River access',
      'Manufacturing hub',
      'Auto terminals',
      'Container handling',
      'Inland connectivity',
      'Trade facilitation'
    ],
    challenges: [
      'River navigation',
      'Air quality',
      'Competition from neighbors'
    ],
    recommendedFor: [
      'Automotive',
      'Manufacturing goods',
      'Consumer products',
      'Textiles'
    ],
    coordinates: { lat: 23.1291, lng: 113.2644 },
    throughputMTEU: 22.3,
    averageWaitTime: 1.8,
    contactInfo: {
      phone: '+86 20 8221 8888',
      email: 'info@gzport.com.cn',
      website: 'https://www.gzport.com.cn',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '110 (Emergency) or 8221 8888 (General Enquiries)'
    }
  },
  {
    id: 'port-15',
    portName: 'Port of Tianjin',
    country: 'China',
    region: 'East Asia',
    overallRating: 4.1,
    efficiency: 4.2,
    infrastructure: 4.0,
    digitalCapability: 3.9,
    costEffectiveness: 4.5,
    reviewCount: 1198,
    lastUpdated: '2024-01-12',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Beijing gateway',
      'Artificial deep port',
      'Container terminals',
      'Bulk facilities',
      'Free trade zone',
      'Logistics services'
    ],
    challenges: [
      'Air pollution',
      'Congestion',
      'Environmental compliance'
    ],
    recommendedFor: [
      'Capital region cargo',
      'Bulk commodities',
      'Containers',
      'Project cargo'
    ],
    coordinates: { lat: 39.0458, lng: 117.7219 },
    throughputMTEU: 20.2,
    averageWaitTime: 2.1,
    contactInfo: {
      phone: '+86 22 5891 8888',
      email: 'info@tianjin-port.com',
      website: 'https://www.tianjin-port.com',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '110 (Emergency) or 5891 8888 (General Enquiries)'
    }
  },
  {
    id: 'port-16',
    portName: 'Port Klang',
    country: 'Malaysia',
    region: 'Southeast Asia',
    overallRating: 4.4,
    efficiency: 4.3,
    infrastructure: 4.5,
    digitalCapability: 4.2,
    costEffectiveness: 4.6,
    reviewCount: 1387,
    lastUpdated: '2024-01-11',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Natural deep harbor',
      'Transshipment hub',
      'Modern terminals',
      'Strategic location',
      'Cost-effective',
      'Digital services'
    ],
    challenges: [
      'Congestion',
      'Competition from Singapore',
      'Infrastructure investment'
    ],
    recommendedFor: [
      'Transshipment',
      'Palm oil',
      'Electronics',
      'Regional distribution'
    ],
    coordinates: { lat: 3.0048, lng: 101.3974 },
    throughputMTEU: 14.1,
    averageWaitTime: 1.5,
    contactInfo: {
      phone: '+60 3 3166 8888',
      email: 'info@portklang.com.my',
      website: 'https://www.portklang.com.my',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 33166 8888 (General Enquiries)'
    }
  },
  {
    id: 'port-17',
    portName: 'Port of Laem Chabang',
    country: 'Thailand',
    region: 'Southeast Asia',
    overallRating: 4.1,
    efficiency: 4.0,
    infrastructure: 4.2,
    digitalCapability: 3.8,
    costEffectiveness: 4.4,
    reviewCount: 976,
    lastUpdated: '2024-01-10',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Deep-sea port',
      'Gateway to Thailand',
      'Container terminals',
      'Automotive hub',
      'Industrial connectivity',
      'Free zone'
    ],
    challenges: [
      'Limited land',
      'Traffic congestion',
      'Seasonal weather'
    ],
    recommendedFor: [
      'Automotive',
      'Consumer goods',
      'Agricultural products',
      'Industrial materials'
    ],
    coordinates: { lat: 13.0827, lng: 100.8833 },
    throughputMTEU: 8.9,
    averageWaitTime: 2.2,
    contactInfo: {
      phone: '+66 32 515 555',
      email: 'info@laemchabangport.com',
      website: 'https://www.laemchabangport.com',
      address: 'Laem Chabang, Chonburi, Thailand',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 515 5555 (General Enquiries)'
    }
  },
  {
    id: 'port-18',
    portName: 'Port of Valencia',
    country: 'Spain',
    region: 'Europe',
    overallRating: 4.3,
    efficiency: 4.2,
    infrastructure: 4.4,
    digitalCapability: 4.1,
    costEffectiveness: 4.3,
    reviewCount: 1234,
    lastUpdated: '2024-01-09',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Mediterranean leader',
      'Intermodal connectivity',
      'Citrus exports',
      'Container facilities',
      'Digital port',
      'Sustainable operations'
    ],
    challenges: [
      'Labor disputes',
      'Infrastructure capacity',
      'Environmental requirements'
    ],
    recommendedFor: [
      'Citrus fruits',
      'Containers',
      'Automotive',
      'Mediterranean trade'
    ],
    coordinates: { lat: 39.4699, lng: -0.3763 },
    throughputMTEU: 5.6,
    averageWaitTime: 1.9,
    contactInfo: {
      phone: '+34 96 350 0000',
      email: 'info@portvalencia.es',
      website: 'https://www.portvalencia.es',
      address: 'Puerto de Valencia, Valencia, Spain',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 96 350 0000 (General Enquiries)'
    }
  },
  {
    id: 'port-19',
    portName: 'Port of New York & New Jersey',
    country: 'United States',
    region: 'North America',
    overallRating: 4.2,
    efficiency: 4.1,
    infrastructure: 4.3,
    digitalCapability: 4.0,
    costEffectiveness: 3.9,
    reviewCount: 1567,
    lastUpdated: '2024-01-08',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'East Coast leader',
      'Dense population access',
      'Modern terminals',
      'Rail connectivity',
      'Distribution networks',
      'Technology upgrades'
    ],
    challenges: [
      'High costs',
      'Traffic congestion',
      'Labor relations'
    ],
    recommendedFor: [
      'Consumer goods',
      'Fashion',
      'Food products',
      'High-value cargo'
    ],
    coordinates: { lat: 40.6892, lng: -74.0445 },
    throughputMTEU: 7.8,
    averageWaitTime: 2.3,
    contactInfo: {
      phone: '+1 212 435 5000',
      email: 'info@portauthority.com',
      website: 'https://www.portauthority.com',
      address: '80 Park Row, New York, NY 10038, United States',
      operatingHours: '24 hours',
      emergencyContact: '911 (Emergency) or 212 435 5000 (General Enquiries)'
    }
  },
  {
    id: 'port-20',
    portName: 'Port of Savannah',
    country: 'United States',
    region: 'North America',
    overallRating: 4.4,
    efficiency: 4.5,
    infrastructure: 4.3,
    digitalCapability: 4.2,
    costEffectiveness: 4.4,
    reviewCount: 1123,
    lastUpdated: '2024-01-07',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Fastest-growing US port',
      'Deep-water access',
      'Inland connectivity',
      'Modern equipment',
      'Efficient operations',
      'Expansion projects'
    ],
    challenges: [
      'Capacity constraints',
      'Environmental concerns',
      'Infrastructure investment'
    ],
    recommendedFor: [
      'Retail goods',
      'Automotive',
      'Forest products',
      'Food & beverages'
    ],
    coordinates: { lat: 32.1343, lng: -81.1456 },
    throughputMTEU: 5.9,
    averageWaitTime: 1.7,
    contactInfo: {
      phone: '+1 912 233 5000',
      email: 'info@portofsavannah.com',
      website: 'https://www.portofsavannah.com',
      address: '1221 Martin Luther King Jr Blvd, Savannah, GA 31401, United States',
      operatingHours: '24 hours',
      emergencyContact: '911 (Emergency) or 912 233 5000 (General Enquiries)'
    }
  },
  {
    id: 'port-21',
    portName: 'Port of Tanger Med',
    country: 'Morocco',
    region: 'Africa',
    overallRating: 4.5,
    efficiency: 4.6,
    infrastructure: 4.4,
    digitalCapability: 4.3,
    costEffectiveness: 4.7,
    reviewCount: 892,
    lastUpdated: '2024-01-06',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Africa\'s leading port',
      'Strategic location',
      'Modern facilities',
      'Automotive hub',
      'Transshipment center',
      'Free zone'
    ],
    challenges: [
      'Political stability',
      'Skills shortage',
      'Regional competition'
    ],
    recommendedFor: [
      'Automotive',
      'Transshipment',
      'Textiles',
      'Africa-Europe trade'
    ],
    coordinates: { lat: 35.7595, lng: -5.8207 },
    throughputMTEU: 8.6,
    averageWaitTime: 1.4,
    contactInfo: {
      phone: '+212 528 888 888',
      email: 'info@portotanger.com',
      website: 'https://www.portotanger.com',
      address: 'Rue de la Porte de France, Tanger, Morocco',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 528 888 888 (General Enquiries)'
    }
  },
  {
    id: 'port-22',
    portName: 'Port of Felixstowe',
    country: 'United Kingdom',
    region: 'Europe',
    overallRating: 4.1,
    efficiency: 4.0,
    infrastructure: 4.2,
    digitalCapability: 3.9,
    costEffectiveness: 4.0,
    reviewCount: 1034,
    lastUpdated: '2024-01-05',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'UK\'s largest port',
      'Deep-water access',
      'Rail connections',
      'Container expertise',
      'Logistics services',
      'Digital systems'
    ],
    challenges: [
      'Brexit impact',
      'Congestion',
      'Environmental regulations'
    ],
    recommendedFor: [
      'Consumer goods',
      'Retail products',
      'Food imports',
      'UK distribution'
    ],
    coordinates: { lat: 51.9513, lng: 1.3284 },
    throughputMTEU: 3.7,
    averageWaitTime: 2.4,
    contactInfo: {
      phone: '+44 1394 242 424',
      email: 'info@portfelixstowe.co.uk',
      website: 'https://www.portfelixstowe.co.uk',
      address: 'Felixstowe, Suffolk, United Kingdom',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 01394 242 424 (General Enquiries)'
    }
  },
  {
    id: 'port-23',
    portName: 'Port of Jawaharlal Nehru',
    country: 'India',
    region: 'South Asia',
    overallRating: 4.0,
    efficiency: 3.9,
    infrastructure: 4.1,
    digitalCapability: 3.7,
    costEffectiveness: 4.2,
    reviewCount: 867,
    lastUpdated: '2024-01-04',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'India\'s premier port',
      'Mumbai access',
      'Container terminals',
      'SEZ connectivity',
      'Digital initiatives',
      'Expansion plans'
    ],
    challenges: [
      'Congestion',
      'Infrastructure bottlenecks',
      'Bureaucracy'
    ],
    recommendedFor: [
      'Textiles',
      'Pharmaceuticals',
      'Engineering goods',
      'Consumer products'
    ],
    coordinates: { lat: 18.9388, lng: 72.9354 },
    throughputMTEU: 6.4,
    averageWaitTime: 2.8,
    contactInfo: {
      phone: '+91 22 2499 1000',
      email: 'info@mumbaiport.com',
      website: 'https://www.mumbaiport.com',
      address: 'Mumbai, Maharashtra, India',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 22 2499 1000 (General Enquiries)'
    }
  },
  {
    id: 'port-24',
    portName: 'Port of Ho Chi Minh City',
    country: 'Vietnam',
    region: 'Southeast Asia',
    overallRating: 3.9,
    efficiency: 3.8,
    infrastructure: 4.0,
    digitalCapability: 3.6,
    costEffectiveness: 4.3,
    reviewCount: 743,
    lastUpdated: '2024-01-03',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Vietnam\'s largest port',
      'Manufacturing hub access',
      'Cost-effective',
      'Growing capacity',
      'Regional gateway',
      'Development potential'
    ],
    challenges: [
      'River depth limitations',
      'Infrastructure development',
      'Capacity constraints'
    ],
    recommendedFor: [
      'Textiles',
      'Electronics',
      'Footwear',
      'Agricultural products'
    ],
    coordinates: { lat: 10.7769, lng: 106.7009 },
    throughputMTEU: 7.4,
    averageWaitTime: 2.6,
    contactInfo: {
      phone: '+84 28 3822 2222',
      email: 'info@hcmport.com.vn',
      website: 'https://www.hcmport.com.vn',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 28 3822 2222 (General Enquiries)'
    }
  },
  {
    id: 'port-25',
    portName: 'Port of Barcelona',
    country: 'Spain',
    region: 'Europe',
    overallRating: 4.2,
    efficiency: 4.1,
    infrastructure: 4.3,
    digitalCapability: 4.0,
    costEffectiveness: 4.2,
    reviewCount: 956,
    lastUpdated: '2024-01-02',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Mediterranean hub',
      'Cruise terminal',
      'Intermodal transport',
      'Logistics platform',
      'Smart port',
      'Sustainable practices'
    ],
    challenges: [
      'Space limitations',
      'Environmental pressure',
      'Competition'
    ],
    recommendedFor: [
      'Short-sea shipping',
      'Automotive',
      'Containers',
      'Cruise operations'
    ],
    coordinates: { lat: 41.3851, lng: 2.1734 },
    throughputMTEU: 3.3,
    averageWaitTime: 2.0,
    contactInfo: {
      phone: '+34 93 288 0000',
      email: 'info@portbarcelona.es',
      website: 'https://www.portbarcelona.es',
      address: 'Passeig Marítim de la Barceloneta, 38-40, 08003 Barcelona, Spain',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 93 288 0000 (General Enquiries)'
    }
  },
  {
    id: 'port-26',
    portName: 'Port of Piraeus',
    country: 'Greece',
    region: 'Europe',
    overallRating: 4.1,
    efficiency: 4.2,
    infrastructure: 4.0,
    digitalCapability: 3.8,
    costEffectiveness: 4.3,
    reviewCount: 678,
    lastUpdated: '2024-01-01',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Gateway to Balkans',
      'Chinese investment',
      'Container growth',
      'Strategic location',
      'Modernization',
      'Transshipment'
    ],
    challenges: [
      'Political instability',
      'Economic challenges',
      'Competition'
    ],
    recommendedFor: [
      'Transshipment',
      'Balkan trade',
      'Consumer goods',
      'China-Europe corridor'
    ],
    coordinates: { lat: 37.9364, lng: 23.6458 },
    throughputMTEU: 5.1,
    averageWaitTime: 2.1,
    contactInfo: {
      phone: '+30 210 411 1000',
      email: 'info@portpiraeus.gr',
      website: 'https://www.portpiraeus.gr',
      address: 'Piraeus, Attiki, Greece',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 210 411 1000 (General Enquiries)'
    }
  },
  {
    id: 'port-27',
    portName: 'Port of Colombo',
    country: 'Sri Lanka',
    region: 'South Asia',
    overallRating: 4.3,
    efficiency: 4.4,
    infrastructure: 4.2,
    digitalCapability: 4.1,
    costEffectiveness: 4.5,
    reviewCount: 785,
    lastUpdated: '2023-12-31',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'South Asian hub',
      'Transshipment center',
      'Strategic location',
      'Deep-water port',
      'Efficient operations',
      'Competitive rates'
    ],
    challenges: [
      'Political stability',
      'Economic crisis',
      'Infrastructure funding'
    ],
    recommendedFor: [
      'Transshipment',
      'Tea exports',
      'Garments',
      'Indian subcontinent trade'
    ],
    coordinates: { lat: 6.9595, lng: 79.8422 },
    throughputMTEU: 6.9,
    averageWaitTime: 1.6,
    contactInfo: {
      phone: '+94 11 242 2424',
      email: 'info@portcolombo.com',
      website: 'https://www.portcolombo.com',
      address: 'Colombo, Sri Lanka',
      operatingHours: '24 hours',
      emergencyContact: '112 (Emergency) or 11 242 2424 (General Enquiries)'
    }
  },
  {
    id: 'port-28',
    portName: 'Port of Kaohsiung',
    country: 'Taiwan',
    region: 'East Asia',
    overallRating: 4.2,
    efficiency: 4.3,
    infrastructure: 4.1,
    digitalCapability: 4.2,
    costEffectiveness: 4.0,
    reviewCount: 654,
    lastUpdated: '2023-12-30',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Taiwan\'s largest port',
      'Transshipment hub',
      'Industrial integration',
      'Technology sector',
      'Modern facilities',
      'Efficient operations'
    ],
    challenges: [
      'Typhoon risks',
      'Competition from mainland',
      'Space constraints'
    ],
    recommendedFor: [
      'Electronics',
      'Petrochemicals',
      'Steel products',
      'Transshipment'
    ],
    coordinates: { lat: 22.6273, lng: 120.2605 },
    throughputMTEU: 8.8,
    averageWaitTime: 1.8,
    contactInfo: {
      phone: '+886 7 585 2000',
      email: 'info@kport.com.tw',
      website: 'https://www.kport.com.tw',
      address: 'No. 1888, Yan An Road, Shanghai, China',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 7 585 2000 (General Enquiries)'
    }
  },
  {
    id: 'port-29',
    portName: 'Port of Manila',
    country: 'Philippines',
    region: 'Southeast Asia',
    overallRating: 3.8,
    efficiency: 3.7,
    infrastructure: 3.9,
    digitalCapability: 3.5,
    costEffectiveness: 4.1,
    reviewCount: 567,
    lastUpdated: '2023-12-29',
    trending: 'stable',
    aiInsights: [],
    keyFeatures: [
      'Philippines gateway',
      'Island logistics',
      'Growing market',
      'Government support',
      'Infrastructure development',
      'Regional connectivity'
    ],
    challenges: [
      'Congestion',
      'Infrastructure gaps',
      'Bureaucracy'
    ],
    recommendedFor: [
      'Consumer goods',
      'Electronics',
      'Food products',
      'Island distribution'
    ],
    coordinates: { lat: 14.5995, lng: 120.9842 },
    throughputMTEU: 5.2,
    averageWaitTime: 3.1,
    contactInfo: {
      phone: '+63 2 8777 7777',
      email: 'info@portmanila.com.ph',
      website: 'https://www.portmanila.com.ph',
      address: 'Port Area, Manila, Philippines',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 8777 7777 (General Enquiries)'
    }
  },
  {
    id: 'port-30',
    portName: 'Port of Santos',
    country: 'Brazil',
    region: 'South America',
    overallRating: 4.0,
    efficiency: 3.9,
    infrastructure: 4.1,
    digitalCapability: 3.7,
    costEffectiveness: 4.2,
    reviewCount: 743,
    lastUpdated: '2023-12-28',
    trending: 'up',
    aiInsights: [],
    keyFeatures: [
      'Latin America\'s largest',
      'Coffee exports',
      'Container terminals',
      'Industrial access',
      'Modern equipment',
      'Sugar terminal'
    ],
    challenges: [
      'Congestion',
      'Infrastructure investment',
      'Environmental issues'
    ],
    recommendedFor: [
      'Coffee',
      'Sugar',
      'Soybeans',
      'Containers'
    ],
    coordinates: { lat: -23.9607, lng: -46.3100 },
    throughputMTEU: 4.8,
    averageWaitTime: 2.5,
    contactInfo: {
      phone: '+55 13 3222 2222',
      email: 'info@portosantos.com.br',
      website: 'https://www.portosantos.com.br',
      address: 'Avenida Brasil, 1234, Santos, São Paulo, Brazil',
      operatingHours: '24 hours',
      emergencyContact: '119 (Emergency) or 13 3222 2222 (General Enquiries)'
    }
      },
    // ASIA PACIFIC EXPANSION
    {
      id: 'port-31',
      portName: 'Port of Tokyo',
      country: 'Japan',
      region: 'East Asia',
      overallRating: 4.6,
      efficiency: 4.7,
      infrastructure: 4.8,
      digitalCapability: 4.5,
      costEffectiveness: 4.4,
      reviewCount: 1834,
      lastUpdated: '2024-01-17',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Advanced automation',
        'Earthquake-resistant infrastructure',
        'Efficient customs',
        'Rail connectivity',
        'Cold storage facilities'
      ],
      challenges: [
        'Limited expansion space',
        'High operational costs',
        'Natural disaster risks'
      ],
      recommendedFor: [
        'Automotive',
        'High-tech electronics',
        'Precision machinery',
        'Refrigerated cargo'
      ],
      coordinates: { lat: 35.6762, lng: 139.6503 },
      throughputMTEU: 4.9,
      averageWaitTime: 1.7,
      contactInfo: {
        phone: '+81 3 5500 1234',
        email: 'info@port.metro.tokyo.lg.jp',
        website: 'https://www.port.metro.tokyo.lg.jp',
        address: '2-1-1 Tsukiji, Chuo City, Tokyo 104-0045, Japan',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 03 5500 1234 (General Enquiries)'
      }
    },
    {
      id: 'port-32',
      portName: 'Port of Yokohama',
      country: 'Japan',
      region: 'East Asia',
      overallRating: 4.4,
      efficiency: 4.5,
      infrastructure: 4.6,
      digitalCapability: 4.3,
      costEffectiveness: 4.2,
      reviewCount: 1456,
      lastUpdated: '2024-01-16',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Historic trading port',
        'Automotive terminals',
        'Container handling',
        'Cruise ship facilities',
        'Green port initiatives'
      ],
      challenges: [
        'Space constraints',
        'Aging infrastructure',
        'Competition from neighboring ports'
      ],
      recommendedFor: [
        'Automotive exports',
        'General cargo',
        'Passenger services',
        'Steel products'
      ],
      coordinates: { lat: 35.4437, lng: 139.6380 },
      throughputMTEU: 3.0,
      averageWaitTime: 2.1,
      contactInfo: {
        phone: '+81 45 671 7000',
        email: 'info@city.yokohama.lg.jp',
        website: 'https://www.city.yokohama.lg.jp/port',
        address: '1-1 Minato-cho, Naka Ward, Yokohama, Kanagawa 231-0017, Japan',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 045 671 7000 (General Enquiries)'
      }
    },
    {
      id: 'port-33',
      portName: 'Port of Melbourne',
      country: 'Australia',
      region: 'Australia & Oceania',
      overallRating: 4.3,
      efficiency: 4.4,
      infrastructure: 4.5,
      digitalCapability: 4.2,
      costEffectiveness: 4.1,
      reviewCount: 1187,
      lastUpdated: '2024-01-15',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Australia\'s largest container port',
        'Multimodal connections',
        'Automotive terminals',
        'Supply chain services',
        'Sustainable operations'
      ],
      challenges: [
        'Urban development pressure',
        'Traffic congestion',
        'Environmental concerns'
      ],
      recommendedFor: [
        'Consumer goods',
        'Automotive',
        'Food and beverages',
        'Retail imports'
      ],
      coordinates: { lat: -37.8136, lng: 144.9631 },
      throughputMTEU: 3.1,
      averageWaitTime: 1.8,
      contactInfo: {
        phone: '+61 3 9655 4000',
        email: 'info@portofmelbourne.com',
        website: 'https://www.portofmelbourne.com',
        address: '101 Flinders Street, Melbourne VIC 3000, Australia',
        operatingHours: '24 hours',
        emergencyContact: '000 (Emergency) or 03 9655 4000 (General Enquiries)'
      }
    },
    {
      id: 'port-34',
      portName: 'Port of Sydney',
      country: 'Australia',
      region: 'Australia & Oceania',
      overallRating: 4.2,
      efficiency: 4.1,
      infrastructure: 4.4,
      digitalCapability: 4.0,
      costEffectiveness: 3.9,
      reviewCount: 987,
      lastUpdated: '2024-01-14',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Premium location',
        'Cruise terminals',
        'Container handling',
        'Bulk cargo facilities',
        'Historic significance'
      ],
      challenges: [
        'Limited capacity',
        'Urban constraints',
        'High costs'
      ],
      recommendedFor: [
        'High-value cargo',
        'Cruise operations',
        'Specialized freight',
        'Time-sensitive goods'
      ],
      coordinates: { lat: -33.8688, lng: 151.2093 },
      throughputMTEU: 2.6,
      averageWaitTime: 2.2,
      contactInfo: {
        phone: '+61 2 9296 4999',
        email: 'info@sydneyports.com.au',
        website: 'https://www.sydneyports.com.au',
        address: 'Level 3, 20 Windmill Street, Walsh Bay NSW 2000, Australia',
        operatingHours: '24 hours',
        emergencyContact: '000 (Emergency) or 02 9296 4999 (General Enquiries)'
      }
    },
    {
      id: 'port-35',
      portName: 'Port of Jakarta',
      country: 'Indonesia',
      region: 'Southeast Asia',
      overallRating: 4.0,
      efficiency: 3.9,
      infrastructure: 4.1,
      digitalCapability: 3.8,
      costEffectiveness: 4.3,
      reviewCount: 1456,
      lastUpdated: '2024-01-13',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Major Indonesian gateway',
        'Growing container volumes',
        'Industrial connectivity',
        'Regional distribution hub',
        'Competitive pricing'
      ],
      challenges: [
        'Infrastructure development needs',
        'Traffic congestion',
        'Regulatory complexity'
      ],
      recommendedFor: [
        'Regional distribution',
        'Manufacturing inputs',
        'Palm oil exports',
        'Consumer goods'
      ],
      coordinates: { lat: -6.2088, lng: 106.8456 },
      throughputMTEU: 7.2,
      averageWaitTime: 2.8,
      contactInfo: {
        phone: '+62 21 8778 8888',
        email: 'info@pelindo.co.id',
        website: 'https://www.pelindo.co.id',
        address: 'Jalan Tanjung Priok No. 1, Jakarta Utara 14310, Indonesia',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 021 8778 8888 (General Enquiries)'
      }
    },
    {
      id: 'port-36',
      portName: 'Port of Auckland',
      country: 'New Zealand',
      region: 'Australia & Oceania',
      overallRating: 4.1,
      efficiency: 4.2,
      infrastructure: 4.3,
      digitalCapability: 4.0,
      costEffectiveness: 3.8,
      reviewCount: 768,
      lastUpdated: '2024-01-12',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'New Zealand\'s largest port',
        'Automated container handling',
        'Cruise ship terminals',
        'Fresh produce facilities',
        'Sustainable practices'
      ],
      challenges: [
        'Limited capacity',
        'Urban development pressure',
        'Weather dependencies'
      ],
      recommendedFor: [
        'Fresh produce',
        'Consumer goods',
        'Tourism operations',
        'Pacific trade'
      ],
      coordinates: { lat: -36.8485, lng: 174.7633 },
      throughputMTEU: 1.1,
      averageWaitTime: 1.9,
      contactInfo: {
        phone: '+64 9 909 9000',
        email: 'info@poal.co.nz',
        website: 'https://www.poal.co.nz',
        address: 'Level 4, 111 Customs Street West, Auckland 1010, New Zealand',
        operatingHours: '24 hours',
        emergencyContact: '111 (Emergency) or 09 909 9000 (General Enquiries)'
      }
    },
    {
      id: 'port-37',
      portName: 'Port of Incheon',
      country: 'South Korea',
      region: 'East Asia',
      overallRating: 4.5,
      efficiency: 4.6,
      infrastructure: 4.7,
      digitalCapability: 4.4,
      costEffectiveness: 4.3,
      reviewCount: 1634,
      lastUpdated: '2024-01-11',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Seoul metropolitan area gateway',
        'Free economic zone',
        'Advanced logistics',
        'International airport proximity',
        'Green port initiatives'
      ],
      challenges: [
        'Tidal restrictions',
        'Competition from Busan',
        'Environmental regulations'
      ],
      recommendedFor: [
        'High-tech products',
        'Time-sensitive cargo',
        'Air-sea transshipment',
        'Automotive parts'
      ],
      coordinates: { lat: 37.4563, lng: 126.7052 },
      throughputMTEU: 3.2,
      averageWaitTime: 1.6,
      contactInfo: {
        phone: '+82 32 880 1114',
        email: 'info@icp.or.kr',
        website: 'https://www.icp.or.kr',
        address: '4850, Songdo-dong, Yeonsu-gu, Incheon, South Korea',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 32 880 1114 (General Enquiries)'
      }
    },
    {
      id: 'port-38',
      portName: 'Port of Dalian',
      country: 'China',
      region: 'East Asia',
      overallRating: 4.3,
      efficiency: 4.4,
      infrastructure: 4.5,
      digitalCapability: 4.2,
      costEffectiveness: 4.4,
      reviewCount: 1987,
      lastUpdated: '2024-01-10',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Northeast China gateway',
        'Oil terminal facilities',
        'Container operations',
        'Rail connections to Russia',
        'Cold-weather operations'
      ],
      challenges: [
        'Seasonal ice conditions',
        'Environmental compliance',
        'Competition from other Chinese ports'
      ],
      recommendedFor: [
        'Petrochemicals',
        'Bulk commodities',
        'Russian trade',
        'Container transshipment'
      ],
      coordinates: { lat: 38.9140, lng: 121.6147 },
      throughputMTEU: 10.8,
      averageWaitTime: 1.9,
      contactInfo: {
        phone: '+86 411 8278 8888',
        email: 'info@dlport.com.cn',
        website: 'https://www.dlport.com.cn',
        address: 'No. 1 Gangwan Street, Dalian 116001, China',
        operatingHours: '24 hours',
        emergencyContact: '110 (Emergency) or 8278 8888 (General Enquiries)'
      }
    },
    {
      id: 'port-39',
      portName: 'Port of Kobe',
      country: 'Japan',
      region: 'East Asia',
      overallRating: 4.4,
      efficiency: 4.5,
      infrastructure: 4.6,
      digitalCapability: 4.3,
      costEffectiveness: 4.2,
      reviewCount: 1345,
      lastUpdated: '2024-01-09',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Historic international port',
        'Efficient operations',
        'Kansai region gateway',
        'Specialized terminals',
        'Quality services'
      ],
      challenges: [
        'Limited growth potential',
        'Competition from larger ports',
        'Earthquake vulnerability'
      ],
      recommendedFor: [
        'High-value goods',
        'Precision machinery',
        'Specialty chemicals',
        'Regional distribution'
      ],
      coordinates: { lat: 34.6937, lng: 135.5023 },
      throughputMTEU: 2.9,
      averageWaitTime: 1.8,
      contactInfo: {
        phone: '+81 78 331 8181',
        email: 'info@city.kobe.lg.jp',
        website: 'https://www.city.kobe.lg.jp/port',
        address: '6-1-1 Minatojima-nakamachi, Chuo-ku, Kobe, Hyogo 650-8570, Japan',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 078 331 8181 (General Enquiries)'
      }
    },
    {
      id: 'port-40',
      portName: 'Port of Nagoya',
      country: 'Japan',
      region: 'East Asia',
      overallRating: 4.5,
      efficiency: 4.6,
      infrastructure: 4.7,
      digitalCapability: 4.4,
      costEffectiveness: 4.3,
      reviewCount: 1567,
      lastUpdated: '2024-01-08',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Automotive export hub',
        'Industrial connectivity',
        'Efficient operations',
        'Modern facilities',
        'Central Japan gateway'
      ],
      challenges: [
        'Typhoon season impacts',
        'Limited expansion space',
        'Environmental regulations'
      ],
      recommendedFor: [
        'Automotive exports',
        'Machinery',
        'Steel products',
        'Industrial goods'
      ],
      coordinates: { lat: 35.1815, lng: 136.9066 },
      throughputMTEU: 2.8,
      averageWaitTime: 1.5,
      contactInfo: {
        phone: '+81 52 971 3111',
        email: 'info@city.nagoya.jp',
        website: 'https://www.city.nagoya.jp/port',
        address: '3-1-1 Sannomaru, Naka-ku, Nagoya, Aichi 460-8508, Japan',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 052 971 3111 (General Enquiries)'
      }
    },
    {
      id: 'port-41',
      portName: 'Port of Pusan New Port',
      country: 'South Korea',
      region: 'East Asia',
      overallRating: 4.7,
      efficiency: 4.8,
      infrastructure: 4.9,
      digitalCapability: 4.6,
      costEffectiveness: 4.5,
      reviewCount: 2134,
      lastUpdated: '2024-01-07',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Ultra-modern facilities',
        'Automated operations',
        'Deep-water berths',
        'Excellent connectivity',
        'Environmental sustainability'
      ],
      challenges: [
        'Construction ongoing',
        'Weather delays',
        'High investment costs'
      ],
      recommendedFor: [
        'Large vessels',
        'Container transshipment',
        'Manufacturing exports',
        'High-volume operations'
      ],
      coordinates: { lat: 35.0780, lng: 128.7967 },
      throughputMTEU: 9.2,
      averageWaitTime: 0.9,
      contactInfo: {
        phone: '+82 51 797 8000',
        email: 'info@pnp.co.kr',
        website: 'https://www.pnp.co.kr',
        address: '90, Sinho-ro, Nam-gu, Busan, South Korea',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 51 797 8000 (General Enquiries)'
      }
    },
    {
      id: 'port-42',
      portName: 'Port of Ulsan',
      country: 'South Korea',
      region: 'East Asia',
      overallRating: 4.2,
      efficiency: 4.3,
      infrastructure: 4.4,
      digitalCapability: 4.1,
      costEffectiveness: 4.2,
      reviewCount: 987,
      lastUpdated: '2024-01-06',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Petrochemical hub',
        'Industrial port',
        'Bulk cargo handling',
        'Hyundai connectivity',
        'Energy terminals'
      ],
      challenges: [
        'Industrial pollution concerns',
        'Limited passenger services',
        'Specialized cargo focus'
      ],
      recommendedFor: [
        'Petrochemicals',
        'Automotive',
        'Heavy machinery',
        'Energy products'
      ],
      coordinates: { lat: 35.5384, lng: 129.3114 },
      throughputMTEU: 2.1,
      averageWaitTime: 2.3,
      contactInfo: {
        phone: '+82 52 220 3000',
        email: 'info@upa.or.kr',
        website: 'https://www.upa.or.kr',
        address: '203, Jongga-ro, Jung-gu, Ulsan, South Korea',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 52 220 3000 (General Enquiries)'
      }
    },
    {
      id: 'port-43',
      portName: 'Port of Hakata',
      country: 'Japan',
      region: 'East Asia',
      overallRating: 4.1,
      efficiency: 4.2,
      infrastructure: 4.3,
      digitalCapability: 4.0,
      costEffectiveness: 4.1,
      reviewCount: 756,
      lastUpdated: '2024-01-05',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Kyushu gateway',
        'China trade corridor',
        'Cruise terminals',
        'Regional connectivity',
        'Efficient customs'
      ],
      challenges: [
        'Limited capacity',
        'Regional competition',
        'Weather impacts'
      ],
      recommendedFor: [
        'China trade',
        'Regional cargo',
        'Cruise operations',
        'Food products'
      ],
      coordinates: { lat: 33.5904, lng: 130.4017 },
      throughputMTEU: 1.0,
      averageWaitTime: 2.1,
      contactInfo: {
        phone: '+81 92 711 4111',
        email: 'info@city.fukuoka.lg.jp',
        website: 'https://www.city.fukuoka.lg.jp/port',
        address: '1-8-1 Tenjin, Chuo-ku, Fukuoka 810-8620, Japan',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 092 711 4111 (General Enquiries)'
      }
    },
    {
      id: 'port-44',
      portName: 'Port of Surabaya',
      country: 'Indonesia',
      region: 'Southeast Asia',
      overallRating: 3.9,
      efficiency: 3.8,
      infrastructure: 4.0,
      digitalCapability: 3.7,
      costEffectiveness: 4.2,
      reviewCount: 1234,
      lastUpdated: '2024-01-04',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Eastern Indonesia gateway',
        'Industrial connectivity',
        'Growing capacity',
        'Regional hub',
        'Cost-effective operations'
      ],
      challenges: [
        'Infrastructure modernization needs',
        'Bureaucratic processes',
        'Limited deep-water access'
      ],
      recommendedFor: [
        'Regional distribution',
        'Manufacturing goods',
        'Agricultural products',
        'Consumer items'
      ],
      coordinates: { lat: -7.2575, lng: 112.7521 },
      throughputMTEU: 3.4,
      averageWaitTime: 3.2,
      contactInfo: {
        phone: '+62 31 329 4811',
        email: 'info@pelindo3.co.id',
        website: 'https://www.pelindo3.co.id',
        address: 'Jalan Tanjung Perak Timur No. 610, Surabaya 60165, Indonesia',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 031 329 4811 (General Enquiries)'
      }
    },
    {
      id: 'port-45',
      portName: 'Port of Taichung',
      country: 'Taiwan',
      region: 'East Asia',
      overallRating: 4.3,
      efficiency: 4.4,
      infrastructure: 4.5,
      digitalCapability: 4.2,
      costEffectiveness: 4.1,
      reviewCount: 1098,
      lastUpdated: '2024-01-03',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Central Taiwan hub',
        'Industrial connectivity',
        'Modern facilities',
        'Technology focus',
        'Efficient operations'
      ],
      challenges: [
        'Limited capacity',
        'Typhoon season',
        'Cross-strait tensions'
      ],
      recommendedFor: [
        'High-tech products',
        'Manufacturing goods',
        'Semiconductor industry',
        'Precision instruments'
      ],
      coordinates: { lat: 24.2638, lng: 120.5444 },
      throughputMTEU: 1.6,
      averageWaitTime: 1.7,
      contactInfo: {
        phone: '+886 4 2657 2201',
        email: 'info@tchport.com.tw',
        website: 'https://www.tchport.com.tw',
        address: 'No. 1, Zhonggang Rd., Wuqi Dist., Taichung City 435, Taiwan',
        operatingHours: '24 hours',
        emergencyContact: '119 (Emergency) or 04 2657 2201 (General Enquiries)'
      }
    },
    // REMAINING GLOBAL PORTS
    {
      id: 'port-46',
      portName: 'Port of Chennai',
      country: 'India',
      region: 'South Asia',
      overallRating: 4.0,
      efficiency: 3.9,
      infrastructure: 4.1,
      digitalCapability: 3.8,
      costEffectiveness: 4.3,
      reviewCount: 1567,
      lastUpdated: '2024-01-02',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Southern India gateway',
        'Automotive hub',
        'IT corridor connectivity',
        'Growing capacity',
        'Cost advantages'
      ],
      challenges: [
        'Monsoon impacts',
        'Infrastructure upgrades needed',
        'Bureaucratic delays'
      ],
      recommendedFor: [
        'Automotive exports',
        'IT equipment',
        'Textiles',
        'Pharmaceuticals'
      ],
      coordinates: { lat: 13.0827, lng: 80.2707 },
      throughputMTEU: 2.1,
      averageWaitTime: 2.7,
      contactInfo: {
        phone: '+91 44 2881 1234',
        email: 'info@chennaiport.gov.in',
        website: 'https://www.chennaiport.gov.in',
        address: 'Rajaji Salai, Chennai Port, Tamil Nadu 600001, India',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 044 2881 1234 (General Enquiries)'
      }
    },
    {
      id: 'port-47',
      portName: 'Port of Jawaharlal Nehru (JNPT)',
      country: 'India',
      region: 'South Asia',
      overallRating: 4.2,
      efficiency: 4.1,
      infrastructure: 4.3,
      digitalCapability: 4.0,
      costEffectiveness: 4.4,
      reviewCount: 2134,
      lastUpdated: '2024-01-01',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'India\'s largest container port',
        'Modern terminals',
        'Mumbai connectivity',
        'Dedicated freight corridor',
        'Private operators'
      ],
      challenges: [
        'Congestion issues',
        'Land connectivity',
        'Seasonal variations'
      ],
      recommendedFor: [
        'Container cargo',
        'Export-import trade',
        'Automotive',
        'Pharmaceuticals'
      ],
      coordinates: { lat: 18.9620, lng: 72.9508 },
      throughputMTEU: 5.5,
      averageWaitTime: 2.4,
      contactInfo: {
        phone: '+91 22 2724 7200',
        email: 'info@jnport.gov.in',
        website: 'https://www.jnport.gov.in',
        address: 'Jawaharlal Nehru Port, Navsheva, Uran, Raigad, Maharashtra 400707, India',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 022 2724 7200 (General Enquiries)'
      }
    },
    {
      id: 'port-48',
      portName: 'Port of Chittagong',
      country: 'Bangladesh',
      region: 'South Asia',
      overallRating: 3.6,
      efficiency: 3.5,
      infrastructure: 3.7,
      digitalCapability: 3.4,
      costEffectiveness: 4.1,
      reviewCount: 876,
      lastUpdated: '2023-12-30',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Bangladesh\'s main port',
        'Regional gateway',
        'Growing volumes',
        'Textile industry support',
        'Bay of Bengal access'
      ],
      challenges: [
        'Infrastructure constraints',
        'Congestion problems',
        'Modernization needs'
      ],
      recommendedFor: [
        'Textile exports',
        'Garments',
        'Regional trade',
        'Agricultural products'
      ],
      coordinates: { lat: 22.3569, lng: 91.7832 },
      throughputMTEU: 3.1,
      averageWaitTime: 3.8,
      contactInfo: {
        phone: '+880 31 710 500',
        email: 'info@cpa.gov.bd',
        website: 'https://www.cpa.gov.bd',
        address: 'Bandar Bhaban, Sadarghat Road, Chittagong 4100, Bangladesh',
        operatingHours: '24 hours',
        emergencyContact: '999 (Emergency) or 031 710 500 (General Enquiries)'
      }
    },
    {
      id: 'port-49',
      portName: 'Port of Karachi',
      country: 'Pakistan',
      region: 'South Asia',
      overallRating: 3.4,
      efficiency: 3.3,
      infrastructure: 3.5,
      digitalCapability: 3.2,
      costEffectiveness: 3.9,
      reviewCount: 654,
      lastUpdated: '2023-12-29',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Pakistan\'s largest port',
        'Natural deep harbor',
        'Regional connectivity',
        'CPEC corridor',
        'Growing trade volumes'
      ],
      challenges: [
        'Security concerns',
        'Infrastructure bottlenecks',
        'Operational inefficiencies'
      ],
      recommendedFor: [
        'Regional trade',
        'Bulk commodities',
        'Textiles',
        'Agricultural exports'
      ],
      coordinates: { lat: 24.8607, lng: 67.0011 },
      throughputMTEU: 2.4,
      averageWaitTime: 4.1,
      contactInfo: {
        phone: '+92 21 9921 1000',
        email: 'info@kpt.gov.pk',
        website: 'https://www.kpt.gov.pk',
        address: 'Native Jetty Bridge, Karachi Port Trust, Karachi 74000, Pakistan',
        operatingHours: '24 hours',
        emergencyContact: '15 (Emergency) or 021 9921 1000 (General Enquiries)'
      }
    },
    {
      id: 'port-50',
      portName: 'Port of Bandar Abbas',
      country: 'Iran',
      region: 'Middle East',
      overallRating: 3.8,
      efficiency: 3.7,
      infrastructure: 3.9,
      digitalCapability: 3.6,
      costEffectiveness: 4.0,
      reviewCount: 987,
      lastUpdated: '2023-12-28',
      trending: 'down',
      aiInsights: [],
      keyFeatures: [
        'Strategic location',
        'Regional hub',
        'Free trade zone',
        'Central Asia connectivity',
        'Oil terminal facilities'
      ],
      challenges: [
        'International sanctions',
        'Political instability',
        'Limited modernization'
      ],
      recommendedFor: [
        'Regional trade',
        'Energy products',
        'Central Asia corridor',
        'Transit cargo'
      ],
      coordinates: { lat: 27.1830, lng: 56.2808 },
      throughputMTEU: 3.2,
      averageWaitTime: 3.5,
      contactInfo: {
        phone: '+98 76 3355 5000',
        email: 'info@portbandarabbas.ir',
        website: 'https://www.portbandarabbas.ir',
        address: 'Shahid Rajaee Port Complex, Bandar Abbas, Iran',
        operatingHours: '24 hours',
        emergencyContact: '115 (Emergency) or 76 3355 5000 (General Enquiries)'
      }
    },
    {
      id: 'port-51',
      portName: 'Port of Dammam',
      country: 'Saudi Arabia',
      region: 'Middle East',
      overallRating: 4.1,
      efficiency: 4.0,
      infrastructure: 4.2,
      digitalCapability: 3.9,
      costEffectiveness: 4.0,
      reviewCount: 1234,
      lastUpdated: '2023-12-27',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Eastern Province gateway',
        'Petrochemical hub',
        'Container facilities',
        'Industrial connectivity',
        'Modern infrastructure'
      ],
      challenges: [
        'Limited diversification',
        'Regional competition',
        'Weather extremes'
      ],
      recommendedFor: [
        'Petrochemicals',
        'Industrial goods',
        'Container cargo',
        'Regional distribution'
      ],
      coordinates: { lat: 26.4207, lng: 50.1063 },
      throughputMTEU: 1.8,
      averageWaitTime: 2.2,
      contactInfo: {
        phone: '+966 13 857 4444',
        email: 'info@ports.gov.sa',
        website: 'https://www.ports.gov.sa',
        address: 'King Abdul Aziz Port, Dammam 31411, Saudi Arabia',
        operatingHours: '24 hours',
        emergencyContact: '999 (Emergency) or 13 857 4444 (General Enquiries)'
      }
    },
    {
      id: 'port-52',
      portName: 'Port of Sohar',
      country: 'Oman',
      region: 'Middle East',
      overallRating: 4.3,
      efficiency: 4.4,
      infrastructure: 4.5,
      digitalCapability: 4.2,
      costEffectiveness: 4.1,
      reviewCount: 876,
      lastUpdated: '2023-12-26',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Strategic location',
        'Deep-water access',
        'Industrial integration',
        'Free zone facilities',
        'Modern operations'
      ],
      challenges: [
        'Limited hinterland',
        'Competition from larger ports',
        'Scale constraints'
      ],
      recommendedFor: [
        'Transshipment',
        'Industrial cargo',
        'Regional distribution',
        'Project cargo'
      ],
      coordinates: { lat: 24.3480, lng: 56.7069 },
      throughputMTEU: 4.1,
      averageWaitTime: 1.6,
      contactInfo: {
        phone: '+968 2626 7777',
        email: 'info@portofsohar.com',
        website: 'https://www.portofsohar.com',
        address: 'Port of Sohar, P.O. Box 755, Sohar 311, Oman',
        operatingHours: '24 hours',
        emergencyContact: '9999 (Emergency) or 2626 7777 (General Enquiries)'
      }
    },
    {
      id: 'port-53',
      portName: 'Port of Salalah',
      country: 'Oman',
      region: 'Middle East',
      overallRating: 4.4,
      efficiency: 4.5,
      infrastructure: 4.6,
      digitalCapability: 4.3,
      costEffectiveness: 4.2,
      reviewCount: 1123,
      lastUpdated: '2023-12-25',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Strategic transshipment hub',
        'Natural deep harbor',
        'Feeder network',
        'Efficient operations',
        'Gateway to Arabian Sea'
      ],
      challenges: [
        'Limited local market',
        'Dependence on transshipment',
        'Remote location'
      ],
      recommendedFor: [
        'Transshipment operations',
        'Regional distribution',
        'Feeder services',
        'Arabian Peninsula trade'
      ],
      coordinates: { lat: 17.0194, lng: 54.0917 },
      throughputMTEU: 5.7,
      averageWaitTime: 1.3,
      contactInfo: {
        phone: '+968 2321 1234',
        email: 'info@salalahport.com',
        website: 'https://www.salalahport.com',
        address: 'Port of Salalah, P.O. Box 105, Salalah 211, Oman',
        operatingHours: '24 hours',
        emergencyContact: '9999 (Emergency) or 2321 1234 (General Enquiries)'
      }
    },
    {
      id: 'port-54',
      portName: 'Port of Jebel Ali',
      country: 'UAE',
      region: 'Middle East',
      overallRating: 4.6,
      efficiency: 4.7,
      infrastructure: 4.8,
      digitalCapability: 4.5,
      costEffectiveness: 4.4,
      reviewCount: 2345,
      lastUpdated: '2023-12-24',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'World\'s largest man-made harbor',
        'Major transshipment hub',
        'Free zone integration',
        'Advanced technology',
        'Excellent connectivity'
      ],
      challenges: [
        'High operational costs',
        'Intense competition',
        'Capacity constraints'
      ],
      recommendedFor: [
        'Transshipment',
        'High-value goods',
        'Regional distribution',
        'Re-export trade'
      ],
      coordinates: { lat: 25.0127, lng: 55.1113 },
      throughputMTEU: 15.3,
      averageWaitTime: 1.1,
      contactInfo: {
        phone: '+971 4 881 5555',
        email: 'info@dpworld.ae',
        website: 'https://www.dpworld.ae',
        address: 'P.O. Box 17000, Jebel Ali, Dubai, UAE',
        operatingHours: '24 hours',
        emergencyContact: '999 (Emergency) or 04 881 5555 (General Enquiries)'
      }
    },
    {
      id: 'port-55',
      portName: 'Port of Beirut',
      country: 'Lebanon',
      region: 'Middle East',
      overallRating: 3.2,
      efficiency: 3.1,
      infrastructure: 3.3,
      digitalCapability: 3.0,
      costEffectiveness: 3.5,
      reviewCount: 456,
      lastUpdated: '2023-12-23',
      trending: 'down',
      aiInsights: [],
      keyFeatures: [
        'Historic Mediterranean port',
        'Regional gateway',
        'Reconstruction efforts',
        'Cultural significance',
        'Lebanon\'s main port'
      ],
      challenges: [
        'Political instability',
        'Infrastructure damage',
        'Economic crisis'
      ],
      recommendedFor: [
        'Regional trade',
        'Reconstruction materials',
        'Humanitarian aid',
        'Traditional cargo'
      ],
      coordinates: { lat: 33.8938, lng: 35.5018 },
      throughputMTEU: 1.2,
      averageWaitTime: 4.5,
      contactInfo: {
        phone: '+961 1 580 380',
        email: 'info@portdebeyrouth.com',
        website: 'https://www.portdebeyrouth.com',
        address: 'Port of Beirut, Beirut Central District, Lebanon',
        operatingHours: '8 AM - 6 PM (Limited)',
        emergencyContact: '112 (Emergency) or 01 580 380 (General Enquiries)'
      }
    },
    {
      id: 'port-56',
      portName: 'Port of Izmir',
      country: 'Turkey',
      region: 'Europe',
      overallRating: 4.0,
      efficiency: 3.9,
      infrastructure: 4.1,
      digitalCapability: 3.8,
      costEffectiveness: 4.2,
      reviewCount: 987,
      lastUpdated: '2023-12-22',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Aegean Sea gateway',
        'Regional hub',
        'Growing capacity',
        'Industrial connectivity',
        'Tourism support'
      ],
      challenges: [
        'Seasonal fluctuations',
        'Regional competition',
        'Infrastructure modernization needs'
      ],
      recommendedFor: [
        'Regional trade',
        'Agricultural exports',
        'Manufactured goods',
        'Tourism-related cargo'
      ],
      coordinates: { lat: 38.4237, lng: 27.1428 },
      throughputMTEU: 1.4,
      averageWaitTime: 2.3,
      contactInfo: {
        phone: '+90 232 463 0000',
        email: 'info@portofizmir.com.tr',
        website: 'https://www.portofizmir.com.tr',
        address: 'Alsancak, 35220 Konak/İzmir, Turkey',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 232 463 0000 (General Enquiries)'
      }
    },
    {
      id: 'port-57',
      portName: 'Port of Istanbul',
      country: 'Turkey',
      region: 'Europe',
      overallRating: 4.1,
      efficiency: 4.0,
      infrastructure: 4.2,
      digitalCapability: 3.9,
      costEffectiveness: 4.0,
      reviewCount: 1345,
      lastUpdated: '2023-12-21',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Bosphorus location',
        'Europe-Asia bridge',
        'Historic significance',
        'Growing container volumes',
        'Strategic position'
      ],
      challenges: [
        'Traffic congestion',
        'Space limitations',
        'Environmental concerns'
      ],
      recommendedFor: [
        'Europe-Asia trade',
        'Regional distribution',
        'Container cargo',
        'Transit operations'
      ],
      coordinates: { lat: 41.0082, lng: 28.9784 },
      throughputMTEU: 1.9,
      averageWaitTime: 2.4,
      contactInfo: {
        phone: '+90 212 249 8000',
        email: 'info@portofistanbul.com',
        website: 'https://www.portofistanbul.com',
        address: 'Haydarpaşa, 34716 Kadıköy/İstanbul, Turkey',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 212 249 8000 (General Enquiries)'
      }
    },
    {
      id: 'port-58',
      portName: 'Port of Constanta',
      country: 'Romania',
      region: 'Europe',
      overallRating: 3.9,
      efficiency: 3.8,
      infrastructure: 4.0,
      digitalCapability: 3.7,
      costEffectiveness: 4.1,
      reviewCount: 678,
      lastUpdated: '2023-12-20',
      trending: 'up',
      aiInsights: [],
      keyFeatures: [
        'Black Sea\'s largest port',
        'Danube River access',
        'Rail connectivity',
        'EU gateway',
        'Bulk cargo handling'
      ],
      challenges: [
        'Infrastructure modernization',
        'Bureaucratic processes',
        'Seasonal ice conditions'
      ],
      recommendedFor: [
        'Bulk commodities',
        'Eastern European trade',
        'Grain exports',
        'Energy products'
      ],
      coordinates: { lat: 44.1598, lng: 28.6348 },
      throughputMTEU: 0.7,
      averageWaitTime: 2.8,
      contactInfo: {
        phone: '+40 241 639 000',
        email: 'info@portconstanta.com',
        website: 'https://www.portconstanta.com',
        address: 'Incinta Portului s/n, Constanta 900900, Romania',
        operatingHours: '24 hours',
        emergencyContact: '112 (Emergency) or 241 639 000 (General Enquiries)'
      }
    },
    {
      id: 'port-59',
      portName: 'Port of Odessa',
      country: 'Ukraine',
      region: 'Europe',
      overallRating: 3.5,
      efficiency: 3.4,
      infrastructure: 3.6,
      digitalCapability: 3.3,
      costEffectiveness: 3.8,
      reviewCount: 456,
      lastUpdated: '2023-12-19',
      trending: 'down',
      aiInsights: [],
      keyFeatures: [
        'Historic Black Sea port',
        'Grain export hub',
        'Regional significance',
        'Rail connections',
        'Strategic location'
      ],
      challenges: [
        'Political instability',
        'Infrastructure damage',
        'Security concerns'
      ],
      recommendedFor: [
        'Grain exports',
        'Regional trade',
        'Bulk commodities',
        'Traditional cargo'
      ],
      coordinates: { lat: 46.4825, lng: 30.7233 },
      throughputMTEU: 0.6,
      averageWaitTime: 3.9,
      contactInfo: {
        phone: '+380 48 728 3000',
        email: 'info@port.odessa.ua',
        website: 'https://www.port.odessa.ua',
        address: 'Primorskaya Street 6, Odessa 65026, Ukraine',
        operatingHours: 'Limited operations',
        emergencyContact: '112 (Emergency) or 048 728 3000 (General Enquiries)'
      }
    },
    {
      id: 'port-60',
      portName: 'Port of Darwin',
      country: 'Australia',
      region: 'Australia & Oceania',
      overallRating: 3.8,
      efficiency: 3.7,
      infrastructure: 3.9,
      digitalCapability: 3.6,
      costEffectiveness: 3.9,
      reviewCount: 345,
      lastUpdated: '2023-12-18',
      trending: 'stable',
      aiInsights: [],
      keyFeatures: [
        'Northern Australia gateway',
        'Asia proximity',
        'Natural harbor',
        'Growing trade volumes',
        'Resource exports'
      ],
      challenges: [
        'Limited scale',
        'Seasonal weather',
        'Remote location'
      ],
      recommendedFor: [
        'Asia-Australia trade',
        'Resource exports',
        'Live cattle',
        'Regional cargo'
      ],
      coordinates: { lat: -12.4634, lng: 130.8456 },
      throughputMTEU: 0.3,
      averageWaitTime: 2.1,
      contactInfo: {
        phone: '+61 8 8922 0000',
        email: 'info@darwinport.com.au',
        website: 'https://www.darwinport.com.au',
        address: 'Port of Darwin, Frances Bay, Darwin NT 0800, Australia',
        operatingHours: '24 hours',
        emergencyContact: '000 (Emergency) or 08 8922 0000 (General Enquiries)'
      }
    }
  ];

const regions = ['All Regions', 'Southeast Asia', 'Europe', 'North America', 'East Asia', 'Middle East'];
const trendingOptions = ['All', 'Trending Up', 'Stable', 'Trending Down'];

const ArenaPage: React.FC = () => {
  const [ports, setPorts] = useState<PortReview[]>(samplePortReviews);
  const [loading, setLoading] = useState(true);
  const [selectedPort, setSelectedPort] = useState<PortReview | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [currentTypingInsight, setCurrentTypingInsight] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [typingComplete, setTypingComplete] = useState<boolean>(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    region: 'All Regions',
    rating: null,
    trending: 'All',
    search: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const fetchAIInsights = async (port: PortReview) => {
    setInsightsLoading(true);
    setAiInsights([]);
    setCurrentTypingInsight('');
    setTypingIndex(0);
    setTypingComplete(false);
    
    // Clear any existing typing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    try {
      // Get auth token
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Using auth token:', token.substring(0, 15) + '...');

      const response = await fetch('https://api.simutrade.app/service/ai-agent/vertex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `Provide comprehensive AI insights for ${port.portName} in ${port.country}. 

Port Details:
- Country: ${port.country}
- Region: ${port.region}
- Overall Rating: ${port.overallRating}/5.0
- Efficiency Score: ${port.efficiency}/5.0
- Infrastructure Score: ${port.infrastructure}/5.0
- Digital Capability: ${port.digitalCapability}/5.0
- Annual Throughput: ${port.throughputMTEU}M TEU
- Average Wait Time: ${port.averageWaitTime} hours

Key Features: ${port.keyFeatures.join(', ')}
Main Challenges: ${port.challenges.join(', ')}
Recommended For: ${port.recommendedFor.join(', ')}

Please provide analysis of trade opportunities, logistics efficiency, market potential, and strategic recommendations for businesses considering this port for their operations.`
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch AI insights (${response.status})`);
      }

      const data = await response.json();
      
      // Extract insights from API response based on the actual format
      let insights = [];
      
      console.log('Full API response:', data); // Debug log
      
      if (data.status === 'success' && data.data && data.data.response && Array.isArray(data.data.response)) {
        // Handle the actual API format - extract text from response array
        console.log('Processing API response array:', data.data.response);
        
        insights = data.data.response
          .filter((item: any) => item && item.text && item.text.trim())
          .map((item: any) => item.text.trim());
          
        console.log('Extracted insights:', insights);
      } else {
        // Fallback for other formats (should not happen with correct API)
        console.log('Using fallback parsing');
        const rawInsights = data.insights || data.response || data.message || 'AI insights generated successfully';
        insights = Array.isArray(rawInsights) ? rawInsights : [rawInsights];
      }
      
      // Ensure we have at least one insight
      if (insights.length === 0) {
        console.log('No insights found, using fallback');
        insights = [`AI analysis for ${port.portName} completed successfully.`];
      }
      
      // Set insights and start typing animation
      setAiInsights(insights);
      startTypingAnimation(insights);
      
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      notification.error({
        message: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch AI insights. Please try again later.',
      });
      
      // Set fallback insights and start typing
      const fallbackInsights = [`Unable to fetch AI insights for ${port.portName} at this time. Please try again later.`];
      setAiInsights(fallbackInsights);
      startTypingAnimation(fallbackInsights);
    } finally {
      setInsightsLoading(false);
    }
  };

  const startTypingAnimation = (insights: string[]) => {
    if (insights.length === 0) return;
    
    setTypingIndex(0);
    setCurrentTypingInsight('');
    setTypingComplete(false);
    
    // Start typing the first insight
    const firstInsight = insights[0];
    let charIndex = 0;
    
    const typeNextChar = () => {
      if (charIndex < firstInsight.length) {
        setCurrentTypingInsight(prev => prev + firstInsight[charIndex]);
        charIndex++;
        typingTimerRef.current = setTimeout(typeNextChar, 30);
      } else {
        setTypingComplete(true);
      }
    };
    
    typeNextChar();
  };

  const handlePortClick = (port: PortReview) => {
    setSelectedPort(port);
    setIsModalVisible(true);
    fetchAIInsights(port);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPort(null);
    setAiInsights([]);
    setCurrentTypingInsight('');
    setTypingIndex(0);
    setTypingComplete(false);
    
    // Clear typing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
  };

  const filteredPorts = ports.filter(port => {
    const matchesRegion = filters.region === 'All Regions' || port.region === filters.region;
    const matchesRating = !filters.rating || port.overallRating >= filters.rating;
    const matchesTrending = filters.trending === 'All' || 
      (filters.trending === 'Trending Up' && port.trending === 'up') ||
      (filters.trending === 'Stable' && port.trending === 'stable') ||
      (filters.trending === 'Trending Down' && port.trending === 'down');
    const matchesSearch = !filters.search || 
      port.portName.toLowerCase().includes(filters.search.toLowerCase()) ||
      port.country.toLowerCase().includes(filters.search.toLowerCase());

    return matchesRegion && matchesRating && matchesTrending && matchesSearch;
  });

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'up':
        return <FaArrowUp className="text-green-500" />;
      case 'down':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <div className="w-4 h-1 bg-gray-400 rounded"></div>;
    }
  };

  const formatThroughput = (mteu: number) => {
    return `${mteu.toFixed(1)}M TEU`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading global trade hotspots...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section with Liquid Glass Effect */}
      <div className="relative bg-gradient-to-br from-primary via-emerald-700 to-emerald-500 text-white py-16 overflow-hidden">
        {/* Glass morphism background elements */}
                  <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-emerald-300 bg-opacity-15 rounded-full blur-xl"></div>
          </div>
        
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              <FaAnchor className="mr-4 text-emerald-200" />
              Global Trade Hotspots
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              AI-powered port reviews and insights to optimize your global trade routes
            </p>
          </div>

          {/* Stats Cards with Glass Effect */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{ports.length}</div>
              <div className="text-sm text-emerald-100 font-medium">Reviewed Ports</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">4.6</div>
              <div className="text-sm text-emerald-100 font-medium">Avg Rating</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">12K+</div>
              <div className="text-sm text-emerald-100 font-medium">AI Insights</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm text-emerald-100 font-medium">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8">
        {/* Filters Section with Glass Effect */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 border-opacity-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Ports</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by port or country..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-80 backdrop-blur-sm transition-all"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-80 backdrop-blur-sm transition-all"
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-80 backdrop-blur-sm transition-all"
                value={filters.rating || ''}
                onChange={(e) => setFilters({...filters, rating: e.target.value ? parseFloat(e.target.value) : null})}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Trending Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trending</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-80 backdrop-blur-sm transition-all"
                value={filters.trending}
                onChange={(e) => setFilters({...filters, trending: e.target.value})}
              >
                {trendingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Port Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPorts.map((port) => (
            <div
              key={port.id}
              className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 border-opacity-50 overflow-hidden group cursor-pointer"
              onClick={() => handlePortClick(port)}
            >
              {/* Card Header */}
              <div className="p-6 pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                      {port.portName}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1 text-sm" />
                      <span className="text-sm">{port.country}, {port.region}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendingIcon(port.trending)}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{port.overallRating}</div>
                      <div className="flex items-center space-x-1">
                        {renderRatingStars(port.overallRating)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-blue-800">{formatThroughput(port.throughputMTEU)}</div>
                    <div className="text-xs text-blue-600">Annual Throughput</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-green-800">{port.averageWaitTime}h</div>
                    <div className="text-xs text-green-600">Avg Wait Time</div>
                  </div>
                </div>

                {/* Recommended For Tags */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Recommended For:</div>
                  <div className="flex flex-wrap gap-1">
                    {port.recommendedFor.slice(0, 2).map((item, index) => (
                      <Tag key={index} color="blue" className="text-xs">
                        {item}
                      </Tag>
                    ))}
                    {port.recommendedFor.length > 2 && (
                      <Tag color="default" className="text-xs">
                        +{port.recommendedFor.length - 2} more
                      </Tag>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 bg-opacity-50 border-t border-gray-200 border-opacity-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaEye className="mr-1" />
                    <span>{port.reviewCount.toLocaleString()} reviews</span>
                  </div>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    <span>View Details</span>
                    <FaChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPorts.length === 0 && (
          <div className="text-center py-16">
            <FaShip className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No ports found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
            <button
              onClick={() => setFilters({region: 'All Regions', rating: null, trending: 'All', search: ''})}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* AI Insights Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <FaRobot className="text-blue-500 text-xl" />
            <span className="text-lg font-semibold">
              AI Insights for {selectedPort?.portName}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        className="ai-insights-modal"
      >
        {selectedPort && (
          <div className="space-y-6">
            {/* Port Header */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedPort.portName}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{selectedPort.country}, {selectedPort.region}</span>
                <span>•</span>
                <span>Rating: {selectedPort.overallRating}/5.0</span>
                <span>•</span>
                <span>{formatThroughput(selectedPort.throughputMTEU)} annual throughput</span>
              </div>
            </div>

            {/* AI Insights Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                AI-Generated Insights
              </h4>
              {insightsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spin size="large" />
                  <span className="ml-3 text-gray-600">Generating AI insights...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiInsights.length > 0 ? (
                    <>
                      {/* First insight with typing animation */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start space-x-2">
                          <FaRobot className="text-blue-500 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed">
                              {typingComplete ? aiInsights[0] : currentTypingInsight}
                              {!typingComplete && (
                                <span className="animate-pulse ml-1 text-blue-500">|</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Remaining insights (show only after typing is complete) */}
                      {typingComplete && aiInsights.slice(1).map((insight, index) => (
                        <div
                          key={index + 1}
                                                     className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm opacity-0"
                           style={{ 
                             animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.3}s forwards`
                           }}
                        >
                          <div className="flex items-start space-x-2">
                            <FaRobot className="text-blue-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-700 leading-relaxed">{insight}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No insights available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Port Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Features */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Key Features
                </h4>
                <div className="space-y-2">
                  {selectedPort.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Challenges
                </h4>
                <div className="space-y-2">
                  {selectedPort.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      {challenge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended For */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Recommended For
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPort.recommendedFor.map((item, index) => (
                  <Tag key={index} color="blue" className="mb-1">
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
             </Modal>
      </div>
    </>
  );
};

export default ArenaPage;
