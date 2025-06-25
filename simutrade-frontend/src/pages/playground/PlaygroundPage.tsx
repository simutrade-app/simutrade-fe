import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, Layout } from 'antd';
import InteractiveTradeMap from '../../components/playground/InteractiveTradeMap';
import SimulationPanel from '../../components/playground/SimulationPanel';
import ResultsDisplay from '../../components/playground/ResultsDisplay';
import AIThinkingProcess from '../../components/playground/AIThinkingProcess';

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

const PlaygroundPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [simulationData, setSimulationData] = useState<Record<string, any>>({});
  const [authToken, setAuthToken] = useState<string>(
    'simutrade-demo-token-123'
  ); // Initialize with default demo token
  const [currentOriginLocation, setCurrentOriginLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [selectedOriginCountry, setSelectedOriginCountry] = useState<string>('');

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

    setSimulating(true);
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
      // Simulate API call to backend
      // In a real implementation, this would call an API to the backend
      // POST /api/simulation/run
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Get estimated cost and time from form data if available
          const costEstimate = formData.estimatedCost || 24500;
          const timeEstimate = formData.estimatedTime || 14;

          // Get origin coordinates based on selected origin country
          const originCoords = getCountryCoordinates(formData.originCountry, formData.currentLocation);
          const destinationCoords = {
            lat: destination?.lat || formData.destinationLat,
            lng: destination?.lng || formData.destinationLng,
          };

          // Adjust the routes based on transport mode
          let optimalRoute;
          if (formData.transportMode === 'air') {
            // Direct route for air freight (shorter path)
            optimalRoute = [
              originCoords, // Origin
              destinationCoords, // Destination
            ];
          } else if (formData.transportMode === 'land') {
            // Land route with more waypoints (in a real app, these would be calculated)
            optimalRoute = [
              originCoords, // Origin
              { lat: 13.7563, lng: 100.5018 }, // Bangkok
              { lat: 22.3193, lng: 114.1694 }, // Hong Kong
              { lat: 39.9042, lng: 116.4074 }, // Beijing
              { lat: 55.7558, lng: 37.6173 }, // Moscow
              { lat: 52.52, lng: 13.405 }, // Berlin
              { lat: 48.8566, lng: 2.3522 }, // Paris
              destinationCoords, // Destination
            ];
          } else {
            // Advanced Sea Route Algorithm with comprehensive global coverage
            const getAdvancedSeaRoute = (origin: any, destination: any, commodity: any, volume: number) => {
              const destLat = destination.lat;
              const destLng = destination.lng;
              
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
                
                // Africa
                durban: { lat: -29.8587, lng: 31.0218, name: 'Durban', importance: 6 },
                capetown: { lat: -33.9249, lng: 18.4241, name: 'Cape Town', importance: 6 },
                
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
                  if (lat >= 15) return 'north_africa';
                  if (lng <= 25) return 'west_africa';
                  return 'east_africa';
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
              
              const region = getDestinationRegion(destLat, destLng);
              const isBulkCargo = volume > 1000; // Determine cargo type based on volume
              const isHighValue = commodity && [1, 5, 7].includes(commodity); // Electronics, Pharma, Jewelry
              
              // Route calculation based on region and cargo characteristics
              let route = [origin];
              
              switch (region) {
                case 'north_america_west':
                  if (isBulkCargo) {
                    // Bulk cargo - more direct Pacific route
                    route.push(majorPorts.singapore, majorPorts.hongkong, majorPorts.honolulu, majorPorts.losangeles);
                  } else {
                    // Container cargo - hub route
                    route.push(majorPorts.singapore, majorPorts.shanghai, majorPorts.honolulu, majorPorts.longbeach);
                  }
                  break;
                  
                case 'north_america_east':
                  if (isHighValue) {
                    // High-value cargo - Suez route for security
                    route.push(majorPorts.singapore, majorPorts.suez, majorPorts.gibraltar, majorPorts.newyork);
                  } else {
                    // Standard cargo - Panama route
                    route.push(majorPorts.singapore, majorPorts.hongkong, majorPorts.panama, majorPorts.newyork);
                  }
                  break;
                  
                case 'northern_europe':
                case 'western_europe':
                  // Traditional Suez-Mediterranean route
                  route.push(majorPorts.singapore, majorPorts.mumbai, majorPorts.suez, majorPorts.rotterdam);
                  break;
                  
                case 'mediterranean':
                  route.push(majorPorts.singapore, majorPorts.dubai, majorPorts.suez, majorPorts.piraeus);
                  break;
                  
                case 'eastern_europe':
                  route.push(majorPorts.singapore, majorPorts.suez, majorPorts.hamburg);
                  break;
                  
                case 'east_asia':
                  if (destLat >= 35) {
                    // Japan/Korea route
                    route.push(majorPorts.singapore, majorPorts.hongkong, majorPorts.busan);
                  } else {
                    // China route
                    route.push(majorPorts.singapore, majorPorts.hongkong, majorPorts.shanghai);
                  }
                  break;
                  
                case 'south_asia':
                  route.push(majorPorts.singapore, majorPorts.mumbai);
                  break;
                  
                case 'southeast_asia':
                  // Direct route within region
                  route.push(majorPorts.singapore);
                  break;
                  
                case 'middle_east':
                  route.push(majorPorts.singapore, majorPorts.dubai);
                  break;
                  
                case 'oceania':
                  if (destLat >= -25) {
                    // Pacific islands
                    route.push(majorPorts.singapore, majorPorts.sydney);
                  } else {
                    // Australia/New Zealand
                    route.push(majorPorts.singapore, majorPorts.sydney, majorPorts.melbourne);
                  }
                  break;
                  
                case 'south_america_west':
                  // Pacific route to west coast
                  route.push(majorPorts.singapore, majorPorts.hongkong, majorPorts.panama, majorPorts.callao);
                  break;
                  
                case 'south_america_east':
                  // Atlantic route to east coast
                  route.push(majorPorts.singapore, majorPorts.suez, majorPorts.capetown, majorPorts.santos);
                  break;
                  
                case 'central_america_caribbean':
                  route.push(majorPorts.singapore, majorPorts.panama);
                  break;
                  
                case 'west_africa':
                  route.push(majorPorts.singapore, majorPorts.suez, majorPorts.gibraltar);
                  break;
                  
                case 'east_africa':
                  route.push(majorPorts.singapore, majorPorts.dubai, majorPorts.durban);
                  break;
                  
                case 'north_africa':
                  route.push(majorPorts.singapore, majorPorts.suez);
                  break;
                  
                default:
                  // Fallback route
                  route.push(majorPorts.singapore);
              }
              
              // Add final destination
              route.push(destination);
              
              // Remove duplicates and ensure logical progression
              const uniqueRoute = route.filter((point, index, arr) => {
                if (index === 0 || index === arr.length - 1) return true;
                return arr.findIndex(p => p.lat === point.lat && p.lng === point.lng) === index;
              });
              
              return uniqueRoute;
            };
            
            optimalRoute = getAdvancedSeaRoute(
              originCoords, 
              destinationCoords, 
              formData.commodity, 
              formData.volume
            );
          }

          resolve({
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
          });
        }, 2000);
      });

      setResults(response);
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setSimulating(false);
    }
  };

  const resetSimulation = () => {
    setResults(null);
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
                  simulationResults={results}
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
              isSimulating={simulating}
              simulationResults={results}
              onOriginCountryChange={handleOriginCountryChange}
              onCurrentLocationDetected={handleCurrentLocationDetected}
              externalOriginCountry={selectedOriginCountry}
            />
          </Col>
        </Row>

        {/* AI Thinking Process - Shows after simulation runs */}
        {results && (
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <AIThinkingProcess
                simulationData={simulationData}
                simulationResults={results}
                isSimulating={simulating}
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
