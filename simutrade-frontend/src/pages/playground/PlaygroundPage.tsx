import React, { useState } from 'react';
import { Card, Row, Col, Typography, Spin, Layout } from 'antd';
import InteractiveTradeMap from '../../components/playground/InteractiveTradeMap';
import SimulationPanel from '../../components/playground/SimulationPanel';
import ResultsDisplay from '../../components/playground/ResultsDisplay';

const { Title, Text } = Typography;
const { Content } = Layout;

// Function to get coordinates for a country by ID
const getCountryCoordinates = (countryId: string) => {
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

  const handleCountrySelect = (countryData: any) => {
    setSelectedCountry(countryData);
  };

  const runSimulation = async (formData: any) => {
    const destination = formData.destination || selectedCountry;

    if ((!destination && !formData.customDestination) || !formData.commodity) {
      return;
    }

    setSimulating(true);

    try {
      // Simulasi API call ke backend
      // Dalam implementasi sebenarnya, ini akan memanggil API ke backend
      // POST /api/simulation/run
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Get estimated cost and time from form data if available
          const costEstimate = formData.estimatedCost || 24500;
          const timeEstimate = formData.estimatedTime || 14;

          // Get origin coordinates based on selected origin country
          const originCoords = getCountryCoordinates(formData.originCountry);
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
            // Sea route with major ports (in a real app, these would be calculated)
            optimalRoute = [
              originCoords, // Origin
              { lat: 1.3521, lng: 103.8198 }, // Singapore
              { lat: 22.3193, lng: 114.1694 }, // Hong Kong
              { lat: 35.6762, lng: 139.6503 }, // Tokyo
              destinationCoords, // Destination
            ];
          }

          resolve({
            tradeEfficiencyScore: 87,
            costEstimate: costEstimate,
            timeEstimate: timeEstimate,
            transportMode: formData.transportMode,
            originCountry: formData.originCountry,
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
                height: '500px',
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
            />
          </Col>
        </Row>

        {results && (
          <Row gutter={[0, 24]}>
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
