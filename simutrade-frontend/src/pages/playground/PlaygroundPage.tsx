import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Typography, Spin, Layout } from 'antd';
import InteractiveTradeMap from '../../components/playground/InteractiveTradeMap';
import SimulationPanel from '../../components/playground/SimulationPanel';
import ResultsDisplay from '../../components/playground/ResultsDisplay';
import AIThinkingProcess from '../../components/playground/AIThinkingProcess';
import LegalProcessFlow from '../../components/playground/LegalProcessFlow';
import { message } from 'antd';

const { Title, Text } = Typography;
const { Content } = Layout;

// Function to get token from localStorage or other sources
const getAuthToken = () => {
  try {
    // Check localStorage first
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken && storedToken.trim() !== '') {
      return storedToken;
    }
    // Fallback token for demo purposes
    return 'simutrade-demo-token-123';
  } catch (error) {
    console.error('Error fetching token:', error);
    return 'simutrade-demo-token-123'; // Fallback token for demo
  }
};

// Function to get coordinates for a country by ID
const getCountryCoordinates = (countryId: string, currentLocation?: { lat: number; lng: number } | null) => {
  // Handle current location
  if (countryId === 'CURRENT' && currentLocation) {
    return currentLocation;
  }
  
  // In a real app, this would come from a database or API
  // For now, we'll hardcode a few countries for the demo
  const countryCoordinates: {
    [key: string]: { lat: number; lng: number };
    IDN: { lat: number; lng: number };
    MYS: { lat: number; lng: number };
    SGP: { lat: number; lng: number };
    THA: { lat: number; lng: number };
    VNM: { lat: number; lng: number };
    PHL: { lat: number; lng: number };
  } = {
    IDN: { lat: -6.2088, lng: 106.8456 }, // Jakarta, Indonesia
    MYS: { lat: 3.139, lng: 101.6869 }, // Kuala Lumpur, Malaysia
    SGP: { lat: 1.3521, lng: 103.8198 }, // Singapore
    THA: { lat: 13.7563, lng: 100.5018 }, // Bangkok, Thailand
    VNM: { lat: 21.0285, lng: 105.8542 }, // Hanoi, Vietnam
    PHL: { lat: 14.5995, lng: 120.9842 }, // Manila, Philippines
  };

  return countryCoordinates[countryId] || { lat: -6.2088, lng: 106.8456 }; // Default to Jakarta, Indonesia
};

// Commodities data for AI context
const commodities = [
  { id: 1, name: 'Electronics', icon: '📱', color: 'rgb(99, 102, 241)', bgColor: 'rgb(238, 242, 255)' },
  { id: 2, name: 'Textiles', icon: '🧵', color: 'rgb(34, 197, 94)', bgColor: 'rgb(240, 253, 244)' },
  { id: 3, name: 'Coffee', icon: '☕', color: 'rgb(245, 158, 11)', bgColor: 'rgb(255, 251, 235)' },
  { id: 4, name: 'Auto Parts', icon: '🚗', color: 'rgb(147, 51, 234)', bgColor: 'rgb(250, 245, 255)' },
  { id: 5, name: 'Pharmaceuticals', icon: '💊', color: 'rgb(236, 72, 153)', bgColor: 'rgb(253, 244, 255)' },
  { id: 6, name: 'Furniture', icon: '🪑', color: 'rgb(6, 182, 212)', bgColor: 'rgb(240, 253, 250)' },
  { id: 7, name: 'Jewelry', icon: '💎', color: 'rgb(251, 191, 36)', bgColor: 'rgb(255, 252, 240)' },
  { id: 8, name: 'Toys', icon: '🧸', color: 'rgb(239, 68, 68)', bgColor: 'rgb(254, 242, 242)' },
];

const PlaygroundPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    iso: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [simulationResults, setSimulationResults] = useState<{
    destination?: { lat: number; lng: number; name?: string };
    transportMode?: string;
    optimalRoute?: L.LatLngLiteral[];
  } | null>(null);
  const [loading] = useState(false);
  const [selectedOriginCountry, setSelectedOriginCountry] = useState<string>('');
  const [currentOriginLocation, setCurrentOriginLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [simulationData, setSimulationData] = useState<Record<string, unknown>>({});
  const [authToken, setAuthToken] = useState<string>('simutrade-demo-token-123');
  const [results, setResults] = useState<{
    tradeEfficiencyScore: number;
    costEstimate: number;
    timeEstimate: number;
    transportMode?: string;
    recommendations: string[];
    risks: { type: string; level: string; impact: string; }[];
    commodity?: string;
    originCountry?: string;
    destinationCountry?: string;
  } | null>(null);

  // Load auth token on component mount
  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);

    // Store the token in localStorage for demo
    if (token && token !== localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', token);
      console.log('Auth token saved to localStorage');
    }
  }, []);

  const handleCountrySelect = (countryData: any) => {
    setSelectedCountry(countryData);
  };

  const handleDestinationSelect = (destinationData: any) => {
    // Update selected country for map integration when using dropdown
    setSelectedCountry(destinationData);
  };

  const handleOriginCountryChange = (originCountryId: string) => {
    setSelectedOriginCountry(originCountryId);
    
    // Clear current location when switching to regular country
    if (originCountryId !== 'CURRENT') {
      setCurrentOriginLocation(null);
    }
  };

  const handleCurrentLocationDetected = (location: {lat: number, lng: number, name: string}) => {
    setCurrentOriginLocation(location);
    setSelectedOriginCountry('CURRENT');
  };

  const runSimulation = async (formData: any) => {
    const destination = formData.destination || selectedCountry;

    if ((!destination && !formData.customDestination) || !formData.commodity) {
      return;
    }

    setIsThinking(true);
    // Store the form data for AI analysis
    setSimulationData(formData);
    
    // Update origin country selection
    setSelectedOriginCountry(formData.originCountry);
    
    // Update current origin location if it's set
    if (formData.currentLocation) {
      setCurrentOriginLocation(formData.currentLocation);
    } else if (formData.originCountry !== 'CURRENT') {
      setCurrentOriginLocation(null);
    }

    try {
      // Dynamic cost calculation based on route and transport mode
      const calculateRouteCost = (route: any[], transportMode: string, volume: number = 100) => {
        if (!route || route.length < 2) return 24500;
        
        let totalCost = 0;
        let totalDistance = 0;
        
        // Base costs per km by transport mode (USD)
        const costPerKm = {
          land: 3.5,      // $3.50 per km - expensive but direct
          sea: 0.18,      // $0.18 per km - very cheap per km
          air: 12.0,      // $12.00 per km - very expensive
          multimodal: 0   // Will be calculated as combination
        };
        
        // Fixed costs (ports, airports, handling)
        const fixedCosts = {
          land: 200,      // Trucking setup and customs
          sea: 1200,      // Port fees and loading
          air: 800,       // Airport fees and handling
          multimodal: 300 // Transfer and coordination costs
        };
        
        if (transportMode === 'multimodal') {
          // Calculate multimodal cost segment by segment
          for (let i = 0; i < route.length - 1; i++) {
            const segmentDistance = calculateDistance(route[i], route[i + 1]);
            const segmentMode = route[i + 1].transportMode || 'land';
            
            totalDistance += segmentDistance;
            totalCost += segmentDistance * costPerKm[segmentMode as keyof typeof costPerKm];
            
            // Add fixed costs for mode changes
            if (i === 0 || route[i].transportMode !== segmentMode) {
              totalCost += fixedCosts[segmentMode as keyof typeof fixedCosts];
            }
          }
          
          // Multimodal efficiency bonus (10-20% cost reduction due to optimization)
          totalCost *= 0.85;
          
        } else {
          // Calculate single-mode cost
          for (let i = 0; i < route.length - 1; i++) {
            const segmentDistance = calculateDistance(route[i], route[i + 1]);
            totalDistance += segmentDistance;
            totalCost += segmentDistance * costPerKm[transportMode as keyof typeof costPerKm];
          }
          totalCost += fixedCosts[transportMode as keyof typeof fixedCosts];
        }
        
        // Volume factor (economies of scale)
        const volumeFactor = Math.max(0.7, 1 - (volume / 5000));
        totalCost *= volumeFactor;
        
        // Add complexity penalty for longer routes
        if (totalDistance > 10000) {
          totalCost *= 1.15; // 15% penalty for very long routes
        }
        
        return Math.round(totalCost);
      };
      
      const calculateRouteTime = (route: any[], transportMode: string) => {
        if (!route || route.length < 2) return 14;
        
        let totalTime = 0;
        
        // Speed by transport mode (km/day average including stops)
        const speedPerDay = {
          land: 600,      // 600 km/day for trucking
          sea: 800,       // 800 km/day for cargo ships
          air: 5000,      // 5000 km/day for air freight
          multimodal: 0   // Will be calculated
        };
        
        // Processing time (days)
        const processingTime = {
          land: 1,        // 1 day customs/loading
          sea: 2,         // 2 days port processing
          air: 0.5,       // 0.5 day airport processing
          multimodal: 1.5 // 1.5 days total coordination
        };
        
        if (transportMode === 'multimodal') {
          for (let i = 0; i < route.length - 1; i++) {
            const segmentDistance = calculateDistance(route[i], route[i + 1]);
            const segmentMode = route[i + 1].transportMode || 'land';
            
            totalTime += segmentDistance / speedPerDay[segmentMode as keyof typeof speedPerDay];
            
            // Add processing time for mode changes
            if (i === 0 || route[i].transportMode !== segmentMode) {
              totalTime += processingTime[segmentMode as keyof typeof processingTime];
            }
          }
        } else {
          let totalDistance = 0;
          for (let i = 0; i < route.length - 1; i++) {
            totalDistance += calculateDistance(route[i], route[i + 1]);
          }
          totalTime = totalDistance / speedPerDay[transportMode as keyof typeof speedPerDay] + 
                     processingTime[transportMode as keyof typeof processingTime];
        }
        
        return Math.max(1, Math.round(totalTime));
      };

      // Get origin coordinates based on selected origin country
      const originCoords = getCountryCoordinates(formData.originCountry, formData.currentLocation);
      const destinationCoords = {
        lat: destination?.lat || formData.destinationLat,
        lng: destination?.lng || formData.destinationLng,
      };

      // Enhanced intelligent route planning system
      let optimalRoute;
      
      // Calculate distance between two points
      const calculateDistance = (coord1: any, coord2: any) => {
        const R = 6371; // Earth's radius in km
        const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
        const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      };

      // AI-powered multimodal route calculation
      const calculateMultimodalRoute = async (origin: any, destination: any) => {
        const distance = calculateDistance(origin, destination);
        
        // Prepare context for AI decision making
        const routeContext = {
          origin: { lat: origin.lat, lng: origin.lng, name: origin.name || 'Origin' },
          destination: { lat: destination.lat, lng: destination.lng, name: destination.name || 'Destination' },
          distance: Math.round(distance),
          commodity: formData.commodity ? commodities.find(c => c.id === formData.commodity)?.name : 'general goods',
          volume: formData.volume,
          urgency: formData.urgency || 'normal'
        };
        
        // Create AI query for optimal transport route planning
        const aiQuery = `Plan the most realistic multimodal transport route for shipping ${routeContext.commodity} (${routeContext.volume} units) from ${routeContext.origin.name} (${routeContext.origin.lat}, ${routeContext.origin.lng}) to ${routeContext.destination.name} (${routeContext.destination.lat}, ${routeContext.destination.lng}). 
        
Distance: ${routeContext.distance}km
Urgency: ${routeContext.urgency}

For each segment of the journey, specify:
1. The waypoint coordinates (lat, lng)
2. The transport mode (land/sea/air)
3. The location name
4. Reason for choosing this transport mode

Consider:
- Geographic constraints (mountains, oceans, borders)
- Infrastructure availability (ports, airports, roads)  
- Cost efficiency vs speed based on urgency
- Cargo type and volume requirements
- Real-world shipping routes and hubs

Format response as JSON array:
[
  {"lat": number, "lng": number, "name": "Location Name", "transportMode": "land|sea|air", "reason": "brief reason"},
  ...
]

Be realistic about geography - ships need water routes, trucks need land connections, planes can fly direct but are expensive.`;

        try {
          const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('authToken') || 'demo-token';
          
          const response = await fetch('https://api.simutrade.app/service/ai-agent/vertex', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify({ query: aiQuery })
          });

          if (response.ok) {
            const data = await response.json();
            const aiResponse = data?.data?.response;
            
            if (aiResponse && Array.isArray(aiResponse) && aiResponse.length > 0) {
              const responseText = aiResponse.map((item: any) => item.text || item).join('\n');
              
              // Try to extract JSON from AI response
              const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
              if (jsonMatch) {
                try {
                  const aiRoute = JSON.parse(jsonMatch[0]);
                  if (Array.isArray(aiRoute) && aiRoute.length > 0) {
                    // Validate and use AI route
                    return aiRoute.map((point: any) => ({
                      lat: parseFloat(point.lat),
                      lng: parseFloat(point.lng),
                      name: point.name || `Waypoint`,
                      transportMode: point.transportMode || 'land'
                    }));
                  }
                } catch (parseError) {
                  console.log('Failed to parse AI route, using fallback');
                }
              }
            }
          }
        } catch (error) {
          console.log('AI route planning failed, using fallback logic');
        }
        
        // Enhanced fallback logic with proper multimodal segments
        const getRegion = (lat: number, lng: number) => {
          if (lng >= 95 && lng <= 140 && lat >= -10 && lat <= 25) return 'southeast_asia';
          if (lng >= -170 && lng <= -50 && lat >= 25 && lat <= 70) return 'north_america';
          if (lng >= -85 && lng <= -30 && lat >= -60 && lat <= 15) return 'south_america';
          if (lng >= -10 && lng <= 40 && lat >= 35 && lat <= 70) return 'europe';
          if (lng >= 110 && lng <= 180 && lat >= -50 && lat <= -10) return 'oceania';
          return 'other';
        };

        // Check if locations are island nations or separated by water
        const isIslandNation = (lat: number, lng: number) => {
          // Philippines
          if (lng >= 115 && lng <= 127 && lat >= 4 && lat <= 20) return true;
          // Indonesia
          if (lng >= 95 && lng <= 141 && lat >= -11 && lat <= 6) return true;
          // Japan
          if (lng >= 129 && lng <= 146 && lat >= 30 && lat <= 46) return true;
          // Madagascar
          if (lng >= 43 && lng <= 51 && lat >= -26 && lat <= -12) return true;
          // Sri Lanka
          if (lng >= 79 && lng <= 82 && lat >= 5 && lat <= 10) return true;
          // Taiwan
          if (lng >= 120 && lng <= 122 && lat >= 22 && lat <= 25) return true;
          // New Zealand
          if (lng >= 166 && lng <= 179 && lat >= -47 && lat <= -34) return true;
          // Australia (continent but isolated)
          if (lng >= 113 && lng <= 154 && lat >= -44 && lat <= -10) return true;
          // UK & Ireland
          if (lng >= -11 && lng <= 2 && lat >= 49 && lat <= 61) return true;
          return false;
        };

        // Check if route crosses major water barriers requiring sea transport
        const crossesWaterBarrier = (origin: any, destination: any) => {
          const origIsIsland = isIslandNation(origin.lat, origin.lng);
          const destIsIsland = isIslandNation(destination.lat, destination.lng);
          
          // If either is an island nation, sea transport is required
          if (origIsIsland || destIsIsland) return true;
          
          // Check for major straits and water bodies in Southeast Asia
          const originLng = origin.lng, originLat = origin.lat;
          const destLng = destination.lng, destLat = destination.lat;
          
          // Malacca Strait barrier (separates Malaysia/Thailand from Indonesia)
          if ((originLng < 104 && destLng > 104) || (originLng > 104 && destLng < 104)) {
            if (originLat >= -2 && originLat <= 8 && destLat >= -2 && destLat <= 8) return true;
          }
          
          // South China Sea barriers
          if (Math.abs(originLng - destLng) > 15 && Math.min(originLat, destLat) >= 0 && Math.max(originLat, destLat) <= 25) {
            // Between mainland and Philippines/Indonesia/Malaysia
            if ((originLng < 110 && destLng > 115) || (originLng > 115 && destLng < 110)) return true;
          }
          
          return false;
        };
        
        const originRegion = getRegion(origin.lat, origin.lng);
        const destRegion = getRegion(destination.lat, destination.lng);
        
        // For short distances, check if water barrier exists before using land
        if (distance < 500 && originRegion === destRegion) {
          if (!crossesWaterBarrier(origin, destination)) {
            // Safe to use land transport only
            return [
              { ...origin, transportMode: 'land', name: 'Origin' },
              { ...destination, transportMode: 'land', name: 'Destination' }
            ];
          } else {
            // Water barrier detected - use sea transport even for short distances
            return [
              { ...origin, transportMode: 'land', name: 'Origin - Start' },
              { 
                lat: (origin.lat + destination.lat) / 2, 
                lng: (origin.lng + destination.lng) / 2, 
                transportMode: 'sea', 
                name: 'Sea Crossing' 
              },
              { ...destination, transportMode: 'land', name: 'Destination - Final' }
            ];
          }
        }
        
        // For transcontinental routes, use intelligent multimodal combinations
        if (originRegion !== destRegion || crossesWaterBarrier(origin, destination)) {
          const route = [];
          
          // Major ports by region with accurate coastal locations
          const majorPorts = {
            'southeast_asia': { lat: 1.3521, lng: 103.8198, name: 'Singapore Port' },
            'north_america': { lat: 33.7701, lng: -118.1937, name: 'Los Angeles Port' },
            'europe': { lat: 51.9579, lng: 4.1178, name: 'Rotterdam Port' },
            'oceania': { lat: -33.8688, lng: 151.2093, name: 'Sydney Port' },
            'south_america': { lat: -23.9608, lng: -46.3331, name: 'Santos Port' },
            'other': { lat: 25.2048, lng: 55.2708, name: 'Dubai Port' }
          };

          // Specific ports for Southeast Asian island nations
          const islandPorts = {
            'philippines': { lat: 14.5832, lng: 120.9722, name: 'Manila Port' },
            'indonesia_west': { lat: -6.1944, lng: 106.8229, name: 'Jakarta Port' },
            'indonesia_east': { lat: -8.6500, lng: 115.2167, name: 'Benoa Port' },
            'malaysia': { lat: 3.0078, lng: 101.5243, name: 'Port Klang' },
            'singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore Port' }
          };

          // Determine if this is an intra-Southeast Asia island route
          const isPhilippines = (lat: number, lng: number) => lng >= 115 && lng <= 127 && lat >= 4 && lat <= 20;
          const isIndonesia = (lat: number, lng: number) => lng >= 95 && lng <= 141 && lat >= -11 && lat <= 6;
          const isMalaysia = (lat: number, lng: number) => lng >= 99 && lng <= 119 && lat >= 1 && lat <= 7;

          const originIsPhilippines = isPhilippines(origin.lat, origin.lng);
          const originIsIndonesia = isIndonesia(origin.lat, origin.lng);
          const originIsMalaysia = isMalaysia(origin.lat, origin.lng);

          const destIsPhilippines = isPhilippines(destination.lat, destination.lng);
          const destIsIndonesia = isIndonesia(destination.lat, destination.lng);
          const destIsMalaysia = isMalaysia(destination.lat, destination.lng);

          // Special handling for Philippines ↔ Indonesia routing
          if ((originIsPhilippines && destIsIndonesia) || (originIsIndonesia && destIsPhilippines)) {
            // Direct sea route between island nations
            route.push({ ...origin, transportMode: 'land', name: 'Origin - Local Transport' });
            
            if (originIsPhilippines) {
              route.push({ ...islandPorts.philippines, transportMode: 'land', name: 'Manila Port - Depart' });
              route.push({ ...islandPorts.philippines, transportMode: 'sea', name: 'Manila Port - Sea Departure' });
            } else {
              route.push({ ...islandPorts.indonesia_west, transportMode: 'land', name: 'Jakarta Port - Depart' });
              route.push({ ...islandPorts.indonesia_west, transportMode: 'sea', name: 'Jakarta Port - Sea Departure' });
            }

            // Sea crossing via Celebes Sea / Sulu Sea
            route.push({
              lat: (origin.lat + destination.lat) / 2,
              lng: (origin.lng + destination.lng) / 2,
              transportMode: 'sea',
              name: 'Celebes Sea Crossing'
            });

            if (destIsIndonesia) {
              route.push({ ...islandPorts.indonesia_west, transportMode: 'sea', name: 'Jakarta Port - Sea Arrival' });
              route.push({ ...islandPorts.indonesia_west, transportMode: 'land', name: 'Jakarta Port - Arrive' });
            } else {
              route.push({ ...islandPorts.philippines, transportMode: 'sea', name: 'Manila Port - Sea Arrival' });
              route.push({ ...islandPorts.philippines, transportMode: 'land', name: 'Manila Port - Arrive' });
            }
            
            route.push({ ...destination, transportMode: 'land', name: 'Destination - Final Delivery' });
            
            return route;
          }

          // For other island combinations or transcontinental routes
          const originPort = majorPorts[originRegion as keyof typeof majorPorts] || majorPorts['other'];
          const destPort = majorPorts[destRegion as keyof typeof majorPorts] || majorPorts['other'];
          
          // Intelligent transport mode selection based on distance and urgency
          const isUrgent = formData.urgency === 'high';
          const isLongDistance = distance > 3000;
          
          if (isUrgent && isLongDistance) {
            // Use air transport for urgent long-distance shipments
            // Step 1: Land to airport
            route.push({ ...origin, transportMode: 'land', name: 'Origin - Start Land Transport' });
            
            // Step 2: Air transport (direct or via hub)
            if (distance > 5000) {
              // Add air hub for very long distances
              const airHubs = {
                'southeast_asia': { lat: 1.3644, lng: 103.9915, name: 'Singapore Changi Airport' },
                'europe': { lat: 51.4700, lng: -0.4543, name: 'London Heathrow' },
                'north_america': { lat: 40.6413, lng: -73.7781, name: 'New York JFK' },
                'other': { lat: 25.2532, lng: 55.3657, name: 'Dubai International' }
              };
              
              const hubRegion = originRegion === 'southeast_asia' ? 'other' : 'southeast_asia'; // Use different hub
              const airHub = airHubs[hubRegion as keyof typeof airHubs] || airHubs['other'];
              
              route.push({ ...airHub, transportMode: 'air', name: airHub.name + ' - Transit Hub' });
            }
            
            route.push({ ...destination, transportMode: 'air', name: 'Destination - Air Arrival' });
            
            // Step 3: Land to final destination
            route.push({ ...destination, transportMode: 'land', name: 'Destination - Final Delivery' });
            
          } else {
            // Use land + sea + land for cost-effective multimodal
            
            // Step 1: Land transport to departure port
            route.push({ ...origin, transportMode: 'land', name: 'Origin - Start Land Transport' });
            
            // Only add port waypoint if significantly different from origin
            if (calculateDistance(origin, originPort) > 100) {
              route.push({ ...originPort, transportMode: 'land', name: originPort.name + ' - Arrive by Land' });
            }
            
            // Step 2: Sea transport between major ports
            route.push({ ...originPort, transportMode: 'sea', name: originPort.name + ' - Depart by Sea' });
            
            // Add maritime waypoints for realistic sea routes
            const seaRoute = createSeaRoute(originPort, destPort);
            seaRoute.slice(1, -1).forEach((point, index) => {
              route.push({ ...point, transportMode: 'sea', name: point.name || `Sea Waypoint ${index + 1}` });
            });
            
            route.push({ ...destPort, transportMode: 'sea', name: destPort.name + ' - Arrive by Sea' });
            
            // Step 3: Land transport from arrival port to destination
            if (calculateDistance(destPort, destination) > 100) {
              route.push({ ...destPort, transportMode: 'land', name: destPort.name + ' - Depart by Land' });
            }
            route.push({ ...destination, transportMode: 'land', name: 'Destination - Final Delivery' });
          }
          
          return route;
        }
        
        // Helper function to create realistic sea routes avoiding land
        function createSeaRoute(portA: any, portB: any) {
          const seaWaypoints = [];
          
          // Key maritime waypoints for realistic sea routes
          const maritimeWaypoints = {
            malaccaStrait: { lat: 2.5, lng: 102.5, name: 'Malacca Strait' },
            suezCanal: { lat: 29.9753, lng: 32.5834, name: 'Suez Canal' },
            gibraltar: { lat: 36.1408, lng: -5.3533, name: 'Gibraltar' },
            panamaCanal: { lat: 9.0, lng: -79.5, name: 'Panama Canal' },
            capeGoodHope: { lat: -34.3553, lng: 18.4697, name: 'Cape of Good Hope' },
            hornOfAfrica: { lat: 12.0, lng: 43.0, name: 'Horn of Africa' },
            arabianSea: { lat: 18.0, lng: 65.0, name: 'Arabian Sea' },
            southChinaSea: { lat: 15.0, lng: 115.0, name: 'South China Sea' }
          };
          
          // Add departure port
          seaWaypoints.push(portA);
          
          // Determine route based on departure and destination regions
          const originLat = portA.lat;
          const originLng = portA.lng;
          const destLat = portB.lat;
          const destLng = portB.lng;
          
          // Southeast Asia to Europe route
          if (originLng > 100 && destLng < 50 && destLat > 40) {
            seaWaypoints.push(maritimeWaypoints.malaccaStrait);
            seaWaypoints.push(maritimeWaypoints.arabianSea);
            seaWaypoints.push(maritimeWaypoints.hornOfAfrica);
            seaWaypoints.push(maritimeWaypoints.suezCanal);
          }
          
          // Southeast Asia to Americas route
          else if (originLng > 100 && destLng < -50) {
            if (destLat > 0) {
              // North America - Pacific route
              seaWaypoints.push(maritimeWaypoints.southChinaSea);
            } else {
              // South America - via Cape of Good Hope
              seaWaypoints.push(maritimeWaypoints.malaccaStrait);
              seaWaypoints.push(maritimeWaypoints.arabianSea);
              seaWaypoints.push(maritimeWaypoints.capeGoodHope);
            }
          }
          
          // Europe to Americas route
          else if (originLng < 50 && destLng < -50) {
            if (Math.abs(destLat - originLat) < 30) {
              // Atlantic crossing
              seaWaypoints.push({ lat: (originLat + destLat) / 2, lng: -30, name: 'Mid Atlantic' });
            }
          }
          
          // Add destination port
          seaWaypoints.push(portB);
          
          return seaWaypoints;
        }
        
        // Default to land transport for regional routes
        return [
          { ...origin, transportMode: 'land', name: 'Origin' },
          { ...destination, transportMode: 'land', name: 'Destination' }
        ];
      };

      if (formData.transportMode === 'multimodal') {
        // Multimodal transport - AI-powered route planning
        try {
          optimalRoute = await calculateMultimodalRoute(originCoords, destinationCoords);
        } catch (error) {
          console.log('AI route planning failed, using fallback');
          optimalRoute = [originCoords, destinationCoords];
        }
      } else {
        if (formData.transportMode === 'air') {
          // Enhanced Air routes - realistic flight paths with proper transit hubs
          const calculateAirRoute = (origin: any, destination: any) => {
            const distance = calculateDistance(origin, destination);
            
            // Get geographical regions for intelligent routing
            const getRegion = (lat: number, lng: number) => {
              if (lng >= 95 && lng <= 140 && lat >= -10 && lat <= 25) return 'southeast_asia';
              if (lng >= 70 && lng <= 95 && lat >= 5 && lat <= 35) return 'south_asia';
              if (lng >= 100 && lng <= 150 && lat >= 20 && lat <= 50) return 'east_asia';
              if (lng >= -10 && lng <= 40 && lat >= 35 && lat <= 70) return 'europe';
              if (lng >= 25 && lng <= 70 && lat >= 15 && lat <= 45) return 'middle_east';
              if (lng >= -170 && lng <= -50 && lat >= 25 && lat <= 70) return 'north_america';
              if (lng >= -85 && lng <= -30 && lat >= -60 && lat <= 15) return 'south_america';
              if (lng >= -20 && lng <= 55 && lat >= -40 && lat <= 35) return 'africa';
              if (lng >= 110 && lng <= 180 && lat >= -50 && lat <= -10) return 'oceania';
              if (lng >= 40 && lng <= 180 && lat >= 45 && lat <= 85) return 'north_asia';
              return 'other';
            };
            
            const originRegion = getRegion(origin.lat, origin.lng);
            const destRegion = getRegion(destination.lat, destination.lng);
            
            // For short distances (< 2000km), direct flight
            if (distance < 2000) {
              return [origin, destination];
            }
            
            // Major aviation hubs with strategic positioning
            const aviationHubs = [
              // Middle East Super Hubs
              { lat: 25.2532, lng: 55.3657, name: 'Dubai DXB', region: 'middle_east', importance: 10 },
              { lat: 25.2732, lng: 51.6078, name: 'Doha DOH', region: 'middle_east', importance: 9 },
              
              // Southeast Asia Hub
              { lat: 1.3521, lng: 103.8198, name: 'Singapore SIN', region: 'southeast_asia', importance: 10 },
              
              // Europe Hubs
              { lat: 51.4700, lng: -0.4543, name: 'London LHR', region: 'europe', importance: 9 },
              { lat: 50.1109, lng: 8.6821, name: 'Frankfurt FRA', region: 'europe', importance: 9 },
              { lat: 52.3676, lng: 4.9041, name: 'Amsterdam AMS', region: 'europe', importance: 8 },
              { lat: 49.0097, lng: 2.5479, name: 'Paris CDG', region: 'europe', importance: 8 },
              { lat: 41.2753, lng: 28.7519, name: 'Istanbul IST', region: 'europe', importance: 8 },
              
              // East Asia
              { lat: 22.3193, lng: 114.1694, name: 'Hong Kong HKG', region: 'east_asia', importance: 8 },
              { lat: 35.6762, lng: 139.6503, name: 'Tokyo NRT', region: 'east_asia', importance: 8 },
              { lat: 31.2304, lng: 121.4737, name: 'Shanghai PVG', region: 'east_asia', importance: 7 },
              
              // North America
              { lat: 40.6413, lng: -73.7781, name: 'New York JFK', region: 'north_america', importance: 9 },
              { lat: 33.9425, lng: -118.4081, name: 'Los Angeles LAX', region: 'north_america', importance: 8 },
              { lat: 33.6407, lng: -84.4277, name: 'Atlanta ATL', region: 'north_america', importance: 8 },
              { lat: 49.2827, lng: -123.1207, name: 'Vancouver YVR', region: 'north_america', importance: 6 },
              
              // Other Strategic Hubs
              { lat: -33.9399, lng: 151.1753, name: 'Sydney SYD', region: 'oceania', importance: 7 },
              { lat: 19.0896, lng: 72.8656, name: 'Mumbai BOM', region: 'south_asia', importance: 7 },
              { lat: -23.6320, lng: -46.6564, name: 'São Paulo GRU', region: 'south_america', importance: 7 },
              { lat: -26.1367, lng: 28.2411, name: 'Johannesburg JNB', region: 'africa', importance: 6 }
            ];
            
            // Smart routing based on regions and distance
            const createRealisticRoute = () => {
              const route = [origin];
              
              // Same region - check if hub is beneficial for long distances
              if (originRegion === destRegion && distance > 3000) {
                const regionalHubs = aviationHubs.filter(hub => hub.region === originRegion);
                if (regionalHubs.length > 0) {
                  const bestRegionalHub = regionalHubs.reduce((best, hub) => {
                    const toHub = calculateDistance(origin, hub);
                    const fromHub = calculateDistance(hub, destination);
                    const totalHub = toHub + fromHub;
                    
                    const toBest = calculateDistance(origin, best);
                    const fromBest = calculateDistance(best, destination);
                    const totalBest = toBest + fromBest;
                    
                    return totalHub < totalBest ? hub : best;
                  });
                  
                  // Only use hub if it's actually beneficial
                  const directDistance = calculateDistance(origin, destination);
                  const hubDistance = calculateDistance(origin, bestRegionalHub) + calculateDistance(bestRegionalHub, destination);
                  
                  if (hubDistance < directDistance * 1.15) {
                    route.push(bestRegionalHub);
                  }
                }
              }
              
              // Cross-continental routing with realistic transit points
              else if (originRegion !== destRegion) {
                
                // Asia to Europe - via Middle East
                if ((originRegion === 'southeast_asia' || originRegion === 'east_asia' || originRegion === 'south_asia') && destRegion === 'europe') {
                  const dubaiHub = aviationHubs.find(h => h.name === 'Dubai DXB');
                  route.push(dubaiHub);
                }
                
                // Europe to Asia - via Middle East
                else if (destRegion === 'europe' && (originRegion === 'southeast_asia' || originRegion === 'east_asia' || originRegion === 'south_asia')) {
                  const dubaiHub = aviationHubs.find(h => h.name === 'Dubai DXB');
                  route.push(dubaiHub);
                }
                
                // Asia to Americas - Trans-Pacific route
                else if ((originRegion === 'southeast_asia' || originRegion === 'east_asia') && 
                         (destRegion === 'north_america' || destRegion === 'south_america')) {
                  if (destRegion === 'north_america') {
                    // Via Tokyo to West Coast
                    const tokyoHub = aviationHubs.find(h => h.name === 'Tokyo NRT');
                    const laxHub = aviationHubs.find(h => h.name === 'Los Angeles LAX');
                    route.push(tokyoHub);
                    if (calculateDistance(destination, laxHub) < calculateDistance(destination, tokyoHub)) {
                      route.push(laxHub);
                    }
                  } else {
                    // To South America - via Singapore and Los Angeles
                    if (originRegion !== 'southeast_asia') {
                      const singaporeHub = aviationHubs.find(h => h.name === 'Singapore SIN');
                      route.push(singaporeHub);
                    }
                    const laxHub = aviationHubs.find(h => h.name === 'Los Angeles LAX');
                    const saoPauloHub = aviationHubs.find(h => h.name === 'São Paulo GRU');
                    route.push(laxHub);
                    route.push(saoPauloHub);
                  }
                }
                
                // Americas to Asia - reverse Trans-Pacific
                else if ((destRegion === 'southeast_asia' || destRegion === 'east_asia') && 
                         (originRegion === 'north_america' || originRegion === 'south_america')) {
                  if (originRegion === 'north_america') {
                    const laxHub = aviationHubs.find(h => h.name === 'Los Angeles LAX');
                    const tokyoHub = aviationHubs.find(h => h.name === 'Tokyo NRT');
                    route.push(laxHub);
                    route.push(tokyoHub);
                    if (destRegion === 'southeast_asia') {
                      const singaporeHub = aviationHubs.find(h => h.name === 'Singapore SIN');
                      route.push(singaporeHub);
                    }
                  } else {
                    // From South America
                    const saoPauloHub = aviationHubs.find(h => h.name === 'São Paulo GRU');
                    const laxHub = aviationHubs.find(h => h.name === 'Los Angeles LAX');
                    const tokyoHub = aviationHubs.find(h => h.name === 'Tokyo NRT');
                    route.push(saoPauloHub);
                    route.push(laxHub);
                    route.push(tokyoHub);
                  }
                }
                
                // Europe to Americas - Trans-Atlantic
                else if (originRegion === 'europe' && (destRegion === 'north_america' || destRegion === 'south_america')) {
                  if (destRegion === 'north_america') {
                    const londonHub = aviationHubs.find(h => h.name === 'London LHR');
                    const jfkHub = aviationHubs.find(h => h.name === 'New York JFK');
                    route.push(londonHub);
                    route.push(jfkHub);
                  } else {
                    const londonHub = aviationHubs.find(h => h.name === 'London LHR');
                    const saoPauloHub = aviationHubs.find(h => h.name === 'São Paulo GRU');
                    route.push(londonHub);
                    route.push(saoPauloHub);
                  }
                }
                
                // Americas to Europe - reverse Trans-Atlantic
                else if (destRegion === 'europe' && (originRegion === 'north_america' || originRegion === 'south_america')) {
                  if (originRegion === 'north_america') {
                    const jfkHub = aviationHubs.find(h => h.name === 'New York JFK');
                    const londonHub = aviationHubs.find(h => h.name === 'London LHR');
                    route.push(jfkHub);
                    route.push(londonHub);
                  } else {
                    const saoPauloHub = aviationHubs.find(h => h.name === 'São Paulo GRU');
                    const londonHub = aviationHubs.find(h => h.name === 'London LHR');
                    route.push(saoPauloHub);
                    route.push(londonHub);
                  }
                }
                
                // Oceania connections
                else if (originRegion === 'oceania' || destRegion === 'oceania') {
                  const sydneyHub = aviationHubs.find(h => h.name === 'Sydney SYD');
                  
                  if (originRegion === 'oceania') {
                    route.push(sydneyHub);
                    // From Oceania to other regions via Singapore
                    if (destRegion !== 'southeast_asia') {
                      const singaporeHub = aviationHubs.find(h => h.name === 'Singapore SIN');
                      route.push(singaporeHub);
                    }
                  } else {
                    // To Oceania via Singapore
                    if (originRegion !== 'southeast_asia') {
                      const singaporeHub = aviationHubs.find(h => h.name === 'Singapore SIN');
                      route.push(singaporeHub);
                    }
                    route.push(sydneyHub);
                  }
                }
                
                // Default: find best intermediate hub
                else {
                  const bestHub = aviationHubs.reduce((best, hub) => {
                    const currentBestDistance = calculateDistance(origin, best) + calculateDistance(best, destination);
                    const hubDistance = calculateDistance(origin, hub) + calculateDistance(hub, destination);
                    return hubDistance < currentBestDistance ? hub : best;
                  }, aviationHubs[0]);
                  
                  route.push(bestHub);
                }
              }
              
              route.push(destination);
              
              // Filter out undefined hubs and ensure no duplicates
              return route.filter((point, index, arr) => 
                point && point.lat && point.lng &&
                (index === 0 || 
                 calculateDistance(point, arr[index - 1]) > 100) // Minimum 100km between waypoints
              );
            };
            
            return createRealisticRoute();
          };
          
          optimalRoute = calculateAirRoute(originCoords, destinationCoords);
            
          } else if (formData.transportMode === 'land') {
            // Land routes - constrained to land masses only (no water crossings)
            const calculateLandRoute = (origin: any, destination: any) => {
              const distance = calculateDistance(origin, destination);
              
              // Enhanced ocean crossing detection with specific geographic barriers
              const crossesOcean = (orig: any, dest: any) => {
                const originRegion = getDetailedRegion(orig.lat, orig.lng);
                const destRegion = getDetailedRegion(dest.lat, dest.lng);
                
                // Check for island nations - land transport impossible
                const islandNations = (lat: number, lng: number) => {
                  // Philippines
                  if (lng >= 115 && lng <= 127 && lat >= 4 && lat <= 20) return 'philippines';
                  // Indonesia
                  if (lng >= 95 && lng <= 141 && lat >= -11 && lat <= 6) return 'indonesia';
                  // Japan
                  if (lng >= 129 && lng <= 146 && lat >= 30 && lat <= 46) return 'japan';
                  // Madagascar
                  if (lng >= 43 && lng <= 51 && lat >= -26 && lat <= -12) return 'madagascar';
                  // Sri Lanka
                  if (lng >= 79 && lng <= 82 && lat >= 5 && lat <= 10) return 'sri_lanka';
                  // Taiwan
                  if (lng >= 120 && lng <= 122 && lat >= 22 && lat <= 25) return 'taiwan';
                  // New Zealand
                  if (lng >= 166 && lng <= 179 && lat >= -47 && lat <= -34) return 'new_zealand';
                  // Australia (isolated continent)
                  if (lng >= 113 && lng <= 154 && lat >= -44 && lat <= -10) return 'australia';
                  // UK & Ireland
                  if (lng >= -11 && lng <= 2 && lat >= 49 && lat <= 61) return 'uk';
                  return null;
                };

                const originIsland = islandNations(orig.lat, orig.lng);
                const destIsland = islandNations(dest.lat, dest.lng);

                // If either origin or destination is an island, land transport is impossible
                // unless they are the same island/country
                if (originIsland || destIsland) {
                  if (originIsland !== destIsland) {
                    return true; // Different islands or mainland-to-island = impossible by land
                  }
                }

                // Define major continental barriers that make land transport impossible
                const impossibleCombinations = [
                  ['southeast_asia', 'north_africa'],  // Malaysia to Sudan
                  ['southeast_asia', 'west_africa'],   // Malaysia to Nigeria
                  ['southeast_asia', 'east_africa'],   // Malaysia to Kenya
                  ['southeast_asia', 'north_america'], // Asia to Americas
                  ['southeast_asia', 'south_america'],
                  ['europe', 'north_america'],
                  ['europe', 'south_america'],
                  ['africa', 'north_america'],
                  ['africa', 'south_america'],
                  ['asia', 'oceania'],
                  ['asia', 'north_america'],
                  ['asia', 'south_america']
                ];
                
                return impossibleCombinations.some(combo => 
                  (combo[0] === originRegion && combo[1] === destRegion) ||
                  (combo[1] === originRegion && combo[0] === destRegion)
                );
              };
              
              // More detailed regional classification for land connectivity
              const getDetailedRegion = (lat: number, lng: number) => {
                // Southeast Asia (Malaysia, Indonesia, Thailand, etc.)
                if (lng >= 95 && lng <= 140 && lat >= -10 && lat <= 25) return 'southeast_asia';
                
                // South Asia (India, Pakistan, etc.)
                if (lng >= 65 && lng <= 95 && lat >= 5 && lat <= 35) return 'south_asia';
                
                // East Asia (China, Japan, Korea)
                if (lng >= 100 && lng <= 150 && lat >= 20 && lat <= 50) return 'east_asia';
                
                // Europe
                if (lng >= -10 && lng <= 40 && lat >= 35 && lat <= 70) return 'europe';
                
                // Middle East
                if (lng >= 25 && lng <= 70 && lat >= 15 && lat <= 45) return 'middle_east';
                
                // Africa - subdivided
                if (lng >= -20 && lng <= 55 && lat >= -40 && lat <= 35) {
                  if (lat >= 10) return 'north_africa';    // Sudan, Egypt, Libya, Algeria, Morocco
                  if (lng <= 15) return 'west_africa';     // Nigeria, Ghana, Senegal, etc.
                  return 'east_africa';                    // Kenya, Tanzania, Ethiopia, etc.
                }
                
                // North America
                if (lng >= -170 && lng <= -50 && lat >= 25 && lat <= 70) return 'north_america';
                
                // South America
                if (lng >= -85 && lng <= -30 && lat >= -60 && lat <= 15) return 'south_america';
                
                // North Asia (Russia, Kazakhstan, etc.)
                if (lng >= 40 && lng <= 180 && lat >= 45 && lat <= 85) return 'north_asia';
                
                // Oceania (Australia, New Zealand, Pacific Islands)
                if (lng >= 110 && lng <= 180 && lat >= -50 && lat <= -10) return 'oceania';
                
                return 'other';
              };
              
              // If route crosses ocean, land transport is impossible
              if (crossesOcean(origin, destination)) {
                console.log('❌ Land transport impossible - route crosses major ocean barriers');
                return [
                  origin, 
                  { 
                    lat: origin.lat + (destination.lat - origin.lat) / 2, 
                    lng: origin.lng + (destination.lng - origin.lng) / 2, 
                    error: 'LAND_IMPOSSIBLE',
                    message: 'Land transport cannot cross ocean barriers. Please use Sea Freight or Multimodal transport.'
                  }, 
                  destination
                ];
              }
              
              const originRegion = getDetailedRegion(origin.lat, origin.lng);
              const destRegion = getDetailedRegion(destination.lat, destination.lng);
              
              // For very close destinations on same landmass (< 500km)
              if (distance < 500 && originRegion === destRegion) {
                return [origin, destination];
              }
              
              // Define ONLY truly land-connected regions (via actual land borders)
              const landConnectedRegions: { [key: string]: string[] } = {
                'southeast_asia': ['south_asia'], // Via Myanmar-India border
                'south_asia': ['southeast_asia', 'middle_east'], // Via Pakistan-Iran border
                'middle_east': ['south_asia', 'europe', 'north_africa'], // Via Turkey-Europe, Middle East-Africa
                'europe': ['middle_east', 'north_asia'], // Via Russia
                'north_asia': ['europe', 'east_asia'], // Via Mongolia-China border
                'east_asia': ['north_asia'], // Via China-Russia border
                'north_africa': ['middle_east'], // Via Egypt-Israel/Jordan border
                
                // Isolated regions with no land connections to other continents
                'north_america': [], // Isolated by Atlantic and Pacific
                'south_america': [], // Isolated by Atlantic and Pacific  
                'oceania': [], // Completely isolated
                'west_africa': [], // Isolated by ocean from other continents
                'east_africa': [], // Could theoretically connect to Middle East via Suez, but very limited
                'other': []
              };
              
              // Check if regions are truly connected by land
              const isLandConnected = originRegion === destRegion || 
                landConnectedRegions[originRegion]?.includes(destRegion) ||
                landConnectedRegions[destRegion]?.includes(originRegion);
              
              if (!isLandConnected) {
                console.log(`❌ No land connection between ${originRegion} and ${destRegion}`);
                return [
                  origin, 
                  { 
                    lat: origin.lat + (destination.lat - origin.lat) / 2, 
                    lng: origin.lng + (destination.lng - origin.lng) / 2, 
                    error: 'LAND_IMPOSSIBLE',
                    message: `No land bridge exists between ${originRegion} and ${destRegion}. Please use Sea Freight or Multimodal transport.`
                  }, 
                  destination
                ];
              }
              
              // Land hubs for ONLY connected regions
              const landHubs = {
                yangon: { lat: 16.8661, lng: 96.1951, name: 'Yangon' }, // Myanmar - Southeast Asia to South Asia gateway
                delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' }, // India - South Asia hub
                tehran: { lat: 35.6892, lng: 51.3890, name: 'Tehran' }, // Iran - Middle East hub
                istanbul: { lat: 41.0082, lng: 28.9784, name: 'Istanbul' }, // Turkey - Europe-Middle East gateway
                moscow: { lat: 55.7558, lng: 37.6173, name: 'Moscow' }, // Russia - Europe-North Asia gateway
                urumqi: { lat: 43.8256, lng: 87.6168, name: 'Urumqi' }, // China - East Asia-Central Asia gateway
              };
              
              const route = [origin];
              
              // Add realistic land corridor waypoints based on actual geography
              if (originRegion === 'southeast_asia' && destRegion === 'south_asia') {
                route.push(landHubs.yangon, landHubs.delhi);
              } else if (originRegion === 'south_asia' && destRegion === 'middle_east') {
                route.push(landHubs.delhi, landHubs.tehran);
              } else if (originRegion === 'middle_east' && destRegion === 'europe') {
                route.push(landHubs.tehran, landHubs.istanbul);
              } else if (originRegion === 'europe' && destRegion === 'north_asia') {
                route.push(landHubs.moscow);
              } else if (distance > 1000 && originRegion === destRegion) {
                // Add regional hub for longer same-region routes
                if (originRegion === 'southeast_asia') route.push(landHubs.yangon);
                else if (originRegion === 'south_asia') route.push(landHubs.delhi);
                else if (originRegion === 'middle_east') route.push(landHubs.tehran);
              }
              
              route.push(destination);
              return route;
            };
            
            optimalRoute = calculateLandRoute(originCoords, destinationCoords);
            
          } else {
            // Advanced Sea Route Algorithm with comprehensive global coverage and efficiency optimization
            const getAdvancedSeaRoute = (origin: any, destination: any, commodity: any, volume: number) => {
              const destLat = destination.lat;
              const destLng = destination.lng;
              const distance = calculateDistance(origin, destination);
              
              // Major world ports database with strategic importance
              const majorPorts = {
                // Southeast Asia Hub
                singapore: { lat: 1.3521, lng: 103.8198, name: 'Singapore', importance: 10 },
                
                // East Asia
                shanghai: { lat: 31.2304, lng: 121.4737, name: 'Shanghai', importance: 9 },
                hongkong: { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', importance: 8 },
                busan: { lat: 35.1796, lng: 129.0756, name: 'Busan', importance: 7 },
                tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', importance: 7 },
                
                // Europe
                rotterdam: { lat: 51.9579, lng: 4.1178, name: 'Rotterdam', importance: 9 },
                hamburg: { lat: 53.5511, lng: 9.9937, name: 'Hamburg', importance: 8 },
                antwerp: { lat: 51.2194, lng: 4.4025, name: 'Antwerp', importance: 8 },
                piraeus: { lat: 37.9755, lng: 23.6348, name: 'Piraeus', importance: 7 },
                valencia: { lat: 39.4699, lng: -0.3763, name: 'Valencia', importance: 6 },
                
                // Mediterranean & Strategic Points
                suez: { lat: 29.9753, lng: 32.5834, name: 'Suez Canal', importance: 10 },
                gibraltar: { lat: 36.1408, lng: 5.3533, name: 'Gibraltar', importance: 8 },
                
                // North America
                losangeles: { lat: 33.7701, lng: -118.1937, name: 'Los Angeles', importance: 9 },
                longbeach: { lat: 33.7701, lng: -118.1937, name: 'Long Beach', importance: 8 },
                newyork: { lat: 40.7128, lng: -74.0060, name: 'New York', importance: 8 },
                vancouver: { lat: 49.2827, lng: -123.1207, name: 'Vancouver', importance: 7 },
                
                // Pacific
                honolulu: { lat: 21.3099, lng: -157.8581, name: 'Honolulu', importance: 6 },
                
                // South America
                santos: { lat: -23.9608, lng: -46.3331, name: 'Santos', importance: 7 },
                callao: { lat: -12.0464, lng: -77.1428, name: 'Callao', importance: 6 },
                
                // Australia & Oceania
                sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney', importance: 8 },
                melbourne: { lat: -37.8136, lng: 144.9631, name: 'Melbourne', importance: 7 },
                
                // Middle East & India
                dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai', importance: 8 },
                mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai', importance: 7 },
                
                // Africa - improved coordinates
                durban: { lat: -29.8587, lng: 31.0218, name: 'Durban', importance: 6 },
                capetown: { lat: -33.9249, lng: 18.4241, name: 'Cape Town', importance: 6 },
                portsudan: { lat: 19.6158, lng: 37.2167, name: 'Port Sudan', importance: 5 },
                
                // Strategic Canals & Passages
                panama: { lat: 9.0821, lng: -79.6805, name: 'Panama Canal', importance: 10 },
              };
              
              // Determine destination region with much more granular classification
              const getDestinationRegion = (lat: number, lng: number) => {
                // North America
                if (lng >= -170 && lng <= -50 && lat >= 25 && lat <= 85) {
                  if (lng <= -95) return 'north_america_west';
                  return 'north_america_east';
                }
                
                // Central America & Caribbean
                if (lng >= -120 && lng <= -50 && lat >= 5 && lat <= 25) {
                  return 'central_america_caribbean';
                }
                
                // South America
                if (lng >= -85 && lng <= -30 && lat >= -60 && lat <= 15) {
                  if (lng <= -65 && lat >= -25) return 'south_america_west';
                  return 'south_america_east';
                }
                
                // Europe
                if (lng >= -25 && lng <= 70 && lat >= 35 && lat <= 75) {
                  if (lat >= 55) return 'northern_europe';
                  if (lng >= 15 && lng <= 30) return 'eastern_europe';
                  if (lat <= 45 && lng >= -10 && lng <= 25) return 'mediterranean';
                  return 'western_europe';
                }
                
                // Middle East
                if (lng >= 25 && lng <= 70 && lat >= 15 && lat <= 45) {
                  return 'middle_east';
                }
                
                // Africa
                if (lng >= -20 && lng <= 55 && lat >= -40 && lat <= 35) {
                  if (lat >= 10) return 'north_africa';    // Sudan, Egypt, Libya, Algeria, Morocco
                  if (lng <= 15) return 'west_africa';     // Nigeria, Ghana, Senegal, etc.
                  return 'east_africa';                    // Kenya, Tanzania, Ethiopia, etc.
                }
                
                // Asia
                if (lng >= 70 && lng <= 180 && lat >= -10 && lat <= 85) {
                  if (lng <= 100 && lat >= 5) return 'south_asia';
                  if (lng >= 100 && lng <= 150 && lat >= 20) return 'east_asia';
                  if (lng >= 95 && lng <= 140 && lat >= -10 && lat <= 25) return 'southeast_asia';
                  if (lat >= 45) return 'north_asia';
                  return 'central_asia';
                }
                
                // Oceania
                if ((lng >= 110 && lng <= 180 && lat >= -50 && lat <= -10) || 
                    (lng >= -180 && lng <= -120 && lat >= -30 && lat <= 30)) {
                  return 'oceania';
                }
                
                return 'other';
              };
              
                              const originRegion = getDestinationRegion(origin.lat, origin.lng) as any;
              const destRegion = getDestinationRegion(destLat, destLng) as any;
              const isBulkCargo = volume > 1000; // Determine cargo type based on volume
              const isHighValue = commodity && [1, 5, 7].includes(commodity); // Electronics, Pharma, Jewelry
              const isUrgent = formData.urgency === 'high'; // Check if urgent delivery is needed
              
              // For very close coastal destinations, use direct sea route
              if (distance < 1000 && originRegion === destRegion) {
                // Check if both points have sea access (coastal or island nations)
                const hasSeaAccess = (lat: number, lng: number) => {
                  // Island nations and coastal areas have sea access
                  return true; // Simplified - in reality, we'd check if location is coastal
                };
                
                if (hasSeaAccess(origin.lat, origin.lng) && hasSeaAccess(destination.lat, destination.lng)) {
                  return [origin, destination];
                }
                
                // If no sea access, sea transport impossible
                return [origin, { lat: origin.lat, lng: origin.lng, error: 'SEA_IMPOSSIBLE' }, destination];
              }
              
              // Smart route calculation based on multiple factors
              let route = [origin];
              
              // Add origin regional hub if not already at a major port
              const addOriginHub = () => {
                if (originRegion === 'southeast_asia' && 
                    calculateDistance(origin, majorPorts.singapore) > 100) {
                  route.push(majorPorts.singapore);
                } else if (originRegion === 'east_asia' && 
                           calculateDistance(origin, majorPorts.shanghai) > 100) {
                  route.push(majorPorts.shanghai);
                } else if (originRegion === 'south_asia' && 
                           calculateDistance(origin, majorPorts.mumbai) > 100) {
                  route.push(majorPorts.mumbai);
                }
              };
              
              addOriginHub();
              
              // Intelligent maritime routing following actual shipping lanes and avoiding land
              const getOptimalRoute = () => {
                // Define safe maritime waypoints that avoid land masses
                const maritimeWaypoints = {
                  // Around Southeast Asia
                  malaccaStrait: { lat: 1.4, lng: 103.0, name: 'Malacca Strait' },
                  southChinaSea: { lat: 10.0, lng: 112.0, name: 'South China Sea' },
                  
                  // Indian Ocean routes
                  arabianSea: { lat: 18.0, lng: 68.0, name: 'Arabian Sea' },
                  hornOfAfrica: { lat: 13.0, lng: 48.0, name: 'Horn of Africa' },
                  redSeaEntrance: { lat: 15.0, lng: 42.0, name: 'Red Sea Entrance' },
                  
                  // Around Africa - more accurate coordinates
                  capeOfGoodHope: { lat: -35.0, lng: 18.0, name: 'Cape of Good Hope' },
                  westAfricaCoast: { lat: 5.0, lng: 2.0, name: 'West Africa Coast' },
                  
                  // Pacific routes around land
                  pacificNorth: { lat: 35.0, lng: 140.0, name: 'North Pacific' },
                  pacificCentral: { lat: 20.0, lng: -150.0, name: 'Central Pacific' },
                  
                  // Around Americas
                  drakePassage: { lat: -57.0, lng: -65.0, name: 'Drake Passage' },
                  caribbeanSea: { lat: 15.0, lng: -75.0, name: 'Caribbean Sea' },
                  
                  // Through key straits and canals
                  bosporus: { lat: 41.0, lng: 29.0, name: 'Bosporus Strait' },
                  gibraltar: { lat: 36.1, lng: -5.3, name: 'Gibraltar Strait' }
                };
                
                switch (destRegion) {
                  case 'north_america_west':
                    // Pacific route - go around Southeast Asia properly
                    if (isUrgent) {
                      return [
                        maritimeWaypoints.southChinaSea,
                        maritimeWaypoints.pacificNorth,
                        majorPorts.losangeles
                      ];
                    } else if (isBulkCargo) {
                      return [
                        maritimeWaypoints.southChinaSea,
                        majorPorts.shanghai,
                        maritimeWaypoints.pacificCentral,
                        majorPorts.honolulu,
                        majorPorts.losangeles
                      ];
                    } else {
                      return [
                        maritimeWaypoints.southChinaSea,
                        majorPorts.shanghai,
                        maritimeWaypoints.pacificCentral,
                        majorPorts.longbeach
                      ];
                    }
                    
                  case 'north_america_east':
                    if (isHighValue || isUrgent) {
                      // Suez route - properly around India and through Red Sea
                      return [
                        maritimeWaypoints.malaccaStrait,
                        maritimeWaypoints.arabianSea,
                        majorPorts.mumbai,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.suez,
                        majorPorts.gibraltar,
                        maritimeWaypoints.caribbeanSea,
                        majorPorts.newyork
                      ];
                    } else {
                      // Panama route - across Pacific properly
                      return [
                        maritimeWaypoints.southChinaSea,
                        majorPorts.hongkong,
                        maritimeWaypoints.pacificCentral,
                        majorPorts.panama,
                        maritimeWaypoints.caribbeanSea,
                        majorPorts.newyork
                      ];
                    }
                    
                  case 'northern_europe':
                  case 'western_europe':
                    // Traditional Suez route - carefully around India and Africa
                    if (isUrgent) {
                      return [
                        maritimeWaypoints.malaccaStrait,
                        maritimeWaypoints.arabianSea,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.suez,
                        majorPorts.rotterdam
                      ];
                    } else {
                      return [
                        maritimeWaypoints.malaccaStrait,
                        maritimeWaypoints.arabianSea,
                        majorPorts.mumbai,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.suez,
                        majorPorts.rotterdam
                      ];
                    }
                    
                  case 'mediterranean':
                    return [
                      maritimeWaypoints.malaccaStrait,
                      maritimeWaypoints.arabianSea,
                      majorPorts.dubai,
                      maritimeWaypoints.hornOfAfrica,
                      majorPorts.suez,
                      majorPorts.piraeus
                    ];
                    
                  case 'eastern_europe':
                    return [
                      maritimeWaypoints.malaccaStrait,
                      maritimeWaypoints.arabianSea,
                      maritimeWaypoints.hornOfAfrica,
                      majorPorts.suez,
                      maritimeWaypoints.bosporus,
                      majorPorts.hamburg
                    ];
                    
                  case 'east_asia':
                    if (originRegion === 'southeast_asia') {
                      // Regional route through safe waters
                      if (destLat >= 35) {
                        return [
                          maritimeWaypoints.southChinaSea,
                          majorPorts.hongkong,
                          majorPorts.busan
                        ]; // Japan/Korea
                      } else {
                        return [
                          maritimeWaypoints.southChinaSea,
                          majorPorts.hongkong,
                          majorPorts.shanghai
                        ]; // China
                      }
                    } else {
                      return [maritimeWaypoints.southChinaSea, majorPorts.shanghai];
                    }
                    
                  case 'south_asia':
                    return [
                      maritimeWaypoints.malaccaStrait,
                      maritimeWaypoints.arabianSea,
                      majorPorts.mumbai
                    ];
                    
                  case 'southeast_asia':
                    // Regional route within Southeast Asia - use safe straits
                    return [maritimeWaypoints.malaccaStrait];
                    
                  case 'middle_east':
                    return [
                      maritimeWaypoints.malaccaStrait,
                      maritimeWaypoints.arabianSea,
                      majorPorts.dubai
                    ];
                    
                  case 'oceania':
                    // Pacific route avoiding Philippines and Indonesia
                    if (destLat >= -25) {
                      return [
                        maritimeWaypoints.southChinaSea,
                        maritimeWaypoints.pacificCentral,
                        majorPorts.sydney
                      ]; // Pacific islands
                    } else {
                      return [
                        maritimeWaypoints.southChinaSea,
                        maritimeWaypoints.pacificCentral,
                        majorPorts.sydney,
                        majorPorts.melbourne
                      ]; // Australia/NZ
                    }
                    
                  case 'south_america_west':
                    // Pacific route to west coast of South America
                    return [
                      maritimeWaypoints.southChinaSea,
                      maritimeWaypoints.pacificCentral,
                      majorPorts.panama,
                      majorPorts.callao
                    ];
                    
                  case 'south_america_east':
                    if (isUrgent) {
                      // Faster Atlantic route via Suez
                      return [
                        maritimeWaypoints.malaccaStrait,
                        maritimeWaypoints.arabianSea,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.suez,
                        majorPorts.gibraltar,
                        maritimeWaypoints.westAfricaCoast,
                        majorPorts.santos
                      ];
                    } else {
                      // Traditional route around Africa
                      return [
                        maritimeWaypoints.malaccaStrait,
                        maritimeWaypoints.arabianSea,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.suez,
                        majorPorts.gibraltar,
                        maritimeWaypoints.westAfricaCoast,
                        maritimeWaypoints.capeOfGoodHope,
                        majorPorts.santos
                      ];
                    }
                    
                  case 'central_america_caribbean':
                    return [
                      maritimeWaypoints.southChinaSea,
                      maritimeWaypoints.pacificCentral,
                      majorPorts.panama,
                      maritimeWaypoints.caribbeanSea
                    ];
                    
                  case 'west_africa':
                    return [
                      maritimeWaypoints.malaccaStrait,
                      maritimeWaypoints.arabianSea,
                      maritimeWaypoints.hornOfAfrica,
                      majorPorts.suez,
                      majorPorts.gibraltar,
                      maritimeWaypoints.westAfricaCoast
                    ];
                    
                  case 'east_africa':
                    // Direct route to East Africa via Indian Ocean
                    if (originRegion === 'southeast_asia') {
                      // Malaysia to East Africa (Ethiopia, Kenya, Tanzania)
                      return [
                        maritimeWaypoints.malaccaStrait,   // Exit Southeast Asia
                        maritimeWaypoints.arabianSea,      // Cross Indian Ocean
                        maritimeWaypoints.hornOfAfrica,    // Horn of Africa region
                        majorPorts.durban                  // South Africa as East Africa hub
                      ];
                    } else {
                      return [
                        maritimeWaypoints.arabianSea,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.durban
                      ];
                    }
                    
                  case 'north_africa':
                    // Direct efficient route to North Africa via Red Sea
                    if (originRegion === 'southeast_asia') {
                      // Malaysia to Sudan/Egypt - most efficient route
                      if (destLat >= 20) {
                        // For Egypt, Libya, Algeria - use Suez
                        return [
                          maritimeWaypoints.malaccaStrait,  // Exit Southeast Asia
                          maritimeWaypoints.arabianSea,     // Cross Indian Ocean
                          maritimeWaypoints.hornOfAfrica,   // Enter Red Sea
                          majorPorts.suez                   // Arrive at Suez
                        ];
                      } else {
                        // For Sudan - use Port Sudan (closer)
                        return [
                          maritimeWaypoints.malaccaStrait,  // Exit Southeast Asia
                          maritimeWaypoints.arabianSea,     // Cross Indian Ocean
                          maritimeWaypoints.redSeaEntrance, // Red Sea entrance
                          majorPorts.portsudan             // Arrive at Port Sudan
                        ];
                      }
                    } else {
                      // From other regions to North Africa
                      return [
                        maritimeWaypoints.arabianSea,
                        maritimeWaypoints.hornOfAfrica,
                        majorPorts.suez
                      ];
                    }
                    
                  default:
                    return [maritimeWaypoints.malaccaStrait]; // Fallback - stay in safe waters
                }
              };
              
              const optimalPorts = getOptimalRoute();
              route.push(...optimalPorts);
              
              // Add final destination
              route.push(destination);
              
              // Advanced route optimization and cleanup
              const optimizeRoute = (inputRoute: any[]) => {
                // Remove duplicates while preserving order
                const uniqueRoute = inputRoute.filter((point, index, arr) => {
                  if (index === 0 || index === arr.length - 1) return true;
                  return arr.findIndex(p => 
                    Math.abs(p.lat - point.lat) < 0.1 && Math.abs(p.lng - point.lng) < 0.1
                  ) === index;
                });
                
                // Remove unnecessary waypoints (if three consecutive points are roughly in a line)
                const streamlinedRoute = [uniqueRoute[0]];
                for (let i = 1; i < uniqueRoute.length - 1; i++) {
                  const prev = uniqueRoute[i - 1];
                  const current = uniqueRoute[i];
                  const next = uniqueRoute[i + 1];
                  
                  // Calculate if current point is necessary (not roughly on the line between prev and next)
                  const distanceDeviation = calculateDistance(current, {
                    lat: (prev.lat + next.lat) / 2,
                    lng: (prev.lng + next.lng) / 2
                  });
                  
                  // Keep waypoint if it deviates significantly from the direct path
                  if (distanceDeviation > 200) { // 200km threshold
                    streamlinedRoute.push(current);
                  }
                }
                streamlinedRoute.push(uniqueRoute[uniqueRoute.length - 1]);
                
                return streamlinedRoute;
              };
              
              return optimizeRoute(route);
            };
            
            optimalRoute = getAdvancedSeaRoute(
              originCoords, 
              destinationCoords, 
              formData.commodity, 
              formData.volume
            );
          }
        }

      // Calculate dynamic costs and time based on actual route
      const costEstimate = calculateRouteCost(optimalRoute, formData.transportMode, formData.volume || 100);
      const timeEstimate = calculateRouteTime(optimalRoute, formData.transportMode);

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = {
        tradeEfficiencyScore: 87,
        costEstimate: costEstimate,
        timeEstimate: timeEstimate,
        transportMode: formData.transportMode,
        originCountry: formData.originCountry,
        destination: {
          name: destination?.name || formData.customDestination || 'Selected Destination',
          lat: destination?.lat || formData.destinationLat,
          lng: destination?.lng || formData.destinationLng,
          country: destination?.country || formData.destinationCountry
        },
        optimalRoute: optimalRoute,
        recommendations: [
          'Consider air freight for time-sensitive partial shipments',
          'ASEAN-US trade agreement reduces tariffs by 12%',
          'Required certifications: FDA, UL for electronics',
        ],
        risks: [
          {
            type: 'Port Congestion',
            level: 'Medium',
            impact: 'Potential 2-day delay',
          },
          {
            type: 'Regulatory',
            level: 'Low',
            impact: 'Standard documentation required',
          },
          {
            type: 'Political',
            level: 'Very Low',
            impact: 'Stable trade relations',
          },
        ],
      };

      setSimulationResults(response);
      setResults(response); // Also set results for ResultsDisplay component
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    setSelectedCountry(null);
    setSimulationData({}); // Clear simulation data when reset
  };

  return (
    <Layout className="playground-layout" style={{ background: '#ffffff' }}>
      <Content
        className="playground-content"
        style={{ padding: '24px', minHeight: '100vh' }}
      >
        <div className="playground-header" style={{ marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0 }}>
            Simulation Playground
          </Title>
          <Text style={{ marginTop: '8px', display: 'block' }}>
            Explore global export opportunities and simulate trade routes with
            AI-powered insights
          </Text>
        </div>

        {/* Map Section - Full Width */}
        <Row gutter={[0, 24]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <div
              style={{
                height: '600px',
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              {loading ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f8f9fa',
                  }}
                >
                  <Spin
                    size="large"
                    tip="Loading world map..."
                    fullscreen={false}
                  />
                </div>
              ) : (
                <InteractiveTradeMap
                  onCountrySelect={handleCountrySelect}
                  selectedCountry={selectedCountry}
                  simulationResults={simulationResults}
                  currentOriginLocation={currentOriginLocation}
                  selectedOriginCountry={selectedOriginCountry}
                  onCurrentLocationDetected={handleCurrentLocationDetected}
                />
              )}
            </div>
          </Col>
        </Row>

        {/* Control Panel - Full Width */}
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <SimulationPanel
              selectedCountry={selectedCountry}
              onRunSimulation={runSimulation}
              onResetSimulation={resetSimulation}
              isSimulating={isThinking}
              simulationResults={simulationResults}
              onOriginCountryChange={handleOriginCountryChange}
              onCurrentLocationDetected={handleCurrentLocationDetected}
              onDestinationSelect={handleDestinationSelect}
              externalOriginCountry={selectedOriginCountry}
            />
          </Col>
        </Row>

        {/* AI Thinking Process - Shows after simulation runs */}
        {simulationResults && (
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <AIThinkingProcess
                simulationData={simulationData}
                simulationResults={simulationResults}
                isSimulating={isThinking}
                authToken={authToken}
              />
            </Col>
          </Row>
        )}

        {/* Results Display - Shows after simulation */}
        {results && (
          <Row gutter={[0, 24]} style={{ marginTop: '32px' }}>
            <Col span={24}>
              <ResultsDisplay results={results} />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default PlaygroundPage;
