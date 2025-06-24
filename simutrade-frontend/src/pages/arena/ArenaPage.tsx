import React, { useState, useEffect } from 'react';
import { Spin, Tag } from 'antd';
import {
  FaShip,
  FaAnchor,
  FaSearch,
  FaTrendingUp,
  FaTrendingDown,
  FaMapMarkerAlt,
  FaEye,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaRobot,
  FaChevronRight,
} from 'react-icons/fa';

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
}

interface FilterState {
  region: string;
  rating: number | null;
  trending: string;
  search: string;
}

// Sample data - AI-generated port reviews
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
    aiInsights: [
      'Leading digital transformation in port operations',
      'Exceptional container handling efficiency',
      'Strong connectivity to global shipping lanes'
    ],
    keyFeatures: [
      'Automated container terminals',
      '24/7 operations',
      'Advanced customs clearance',
      'Excellent connectivity'
    ],
    challenges: [
      'High operational costs',
      'Space constraints'
    ],
    recommendedFor: [
      'Electronics',
      'High-value goods',
      'Time-sensitive cargo'
    ],
    coordinates: { lat: 1.2966, lng: 103.7764 },
    throughputMTEU: 37.2,
    averageWaitTime: 0.8
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
    aiInsights: [
      'Gateway to European markets',
      'Sustainable port operations leader',
      'Excellent inland connectivity'
    ],
    keyFeatures: [
      'Deep-water access',
      'Multimodal transport hub',
      'Green energy initiatives',
      'Advanced logistics services'
    ],
    challenges: [
      'Weather-related delays',
      'Environmental regulations'
    ],
    recommendedFor: [
      'Bulk commodities',
      'Automotive',
      'Chemical products'
    ],
    coordinates: { lat: 51.9225, lng: 4.47917 },
    throughputMTEU: 15.3,
    averageWaitTime: 1.2
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
    aiInsights: [
      'Largest container port in the Americas',
      'Strong rail and truck connectivity',
      'Ongoing modernization efforts'
    ],
    keyFeatures: [
      'Massive container capacity',
      'Rail connections',
      'Distribution networks',
      'Technology investments'
    ],
    challenges: [
      'Congestion issues',
      'Air quality concerns',
      'Labor negotiations'
    ],
    recommendedFor: [
      'Consumer goods',
      'Manufacturing inputs',
      'Retail products'
    ],
    coordinates: { lat: 33.7365, lng: -118.2644 },
    throughputMTEU: 10.7,
    averageWaitTime: 2.1
  }
];

const regions = ['All Regions', 'Southeast Asia', 'Europe', 'North America', 'East Asia'];
const trendingOptions = ['All', 'Trending Up', 'Stable', 'Trending Down'];

const ArenaPage: React.FC = () => {
  const [ports, setPorts] = useState<PortReview[]>(samplePortReviews);
  const [loading, setLoading] = useState(true);
  const [selectedPort, setSelectedPort] = useState<PortReview | null>(null);
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
        return <FaTrendingUp className="text-green-500" />;
      case 'down':
        return <FaTrendingDown className="text-red-500" />;
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section with Liquid Glass Effect */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white py-16 overflow-hidden">
        {/* Glass morphism background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-300 bg-opacity-10 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              <FaAnchor className="mr-4 text-blue-200" />
              Global Trade Hotspots
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              AI-powered port reviews and insights to optimize your global trade routes
            </p>
          </div>

          {/* Stats Cards with Glass Effect */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{ports.length}</div>
              <div className="text-sm text-blue-100 font-medium">Reviewed Ports</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">4.6</div>
              <div className="text-sm text-blue-100 font-medium">Avg Rating</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">12K+</div>
              <div className="text-sm text-blue-100 font-medium">AI Insights</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm text-blue-100 font-medium">Accuracy Rate</div>
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
              onClick={() => setSelectedPort(port)}
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

                {/* AI Insights Preview */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaRobot className="text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">AI Insights</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      {port.aiInsights[0]}
                    </p>
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
    </div>
  );
};

export default ArenaPage;
