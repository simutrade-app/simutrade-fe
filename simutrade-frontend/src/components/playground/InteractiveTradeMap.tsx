import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Spin, Button, Tooltip, message } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  AimOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// Custom icons for transport mode
const ShipOutlined = () => <span style={{ fontSize: '16px' }}>🚢</span>;
const RiseOutlined = () => <span style={{ fontSize: '16px' }}>✈️</span>;
const CarOutlined = () => <span style={{ fontSize: '16px' }}>🚚</span>;

// Extend the Default interface to include _getIconUrl
declare module 'leaflet' {
  namespace Icon {
    interface Default {
      _getIconUrl?: string;
    }
  }
}

// Needed to fix Leaflet icons in production builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Zoom Controls Component
const CustomZoomControl = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 7, {
            animate: true,
            duration: 1.5,
          });

          // Add a marker for current location
          const currentLocationIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color:#1890ff;width:12px;height:12px;border-radius:50%;border:3px solid white;"></div>',
            iconSize: [18, 18],
          });

          // Remove existing marker if any
          map.eachLayer((layer: L.Layer) => {
            if ((layer as any)._currentLocation) {
              map.removeLayer(layer);
            }
          });

          const marker = L.marker([latitude, longitude], {
            icon: currentLocationIcon,
          });
          (marker as any)._currentLocation = true;
          marker.addTo(map).bindPopup('Your current location').openPopup();
        },
        (error) => {
          message.error('Unable to retrieve your location: ' + error.message);
        }
      );
    } else {
      message.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div
      className="custom-zoom-controls"
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Tooltip title="Zoom in" placement="right">
        <Button
          icon={<ZoomInOutlined />}
          onClick={handleZoomIn}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
          }}
        />
      </Tooltip>
      <Tooltip title="Zoom out" placement="right">
        <Button
          icon={<ZoomOutOutlined />}
          onClick={handleZoomOut}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
          }}
        />
      </Tooltip>
      <Tooltip title="Your location" placement="right">
        <Button
          icon={<AimOutlined />}
          onClick={handleLocateMe}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
          }}
        />
      </Tooltip>
    </div>
  );
};

// Map Initializer component to set center, zoom limits, etc.
interface MapInitializerProps {
  destination: { lat: number; lng: number; name?: string } | null;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ destination }) => {
  const map = useMap();

  useEffect(() => {
    // Set proper zoom level constraints
    map.setMinZoom(2);
    map.setMaxZoom(7);

    // Restrict panning to avoid seeing the blank area
    // Use smaller bounds to prevent white space at poles
    const southWest = L.latLng(-65, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);

    // Handle bounds on drag events
    map.on('drag', () => {
      map.panInsideBounds(bounds, { animate: false });
    });

    // Make sure the map is properly sized to the container
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Set initial view
    map.setView([20, 0], 2);
  }, [map]);

  // Add marker and focus map when selected country changes
  useEffect(() => {
    if (destination && destination.lat && destination.lng) {
      const destinationIcon = L.divIcon({
        className: 'destination-icon',
        html: '<div style="background-color:#52c41a;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>',
        iconSize: [20, 20],
      });

      // Remove existing destination marker if any
      map.eachLayer((layer: L.Layer) => {
        if ((layer as any)._destinationMarker) {
          map.removeLayer(layer);
        }
      });

      const marker = L.marker([destination.lat, destination.lng], {
        icon: destinationIcon,
      });
      (marker as any)._destinationMarker = true;
      marker
        .addTo(map)
        .bindPopup(`Destination: ${destination.name || 'Selected Location'}`)
        .openPopup();

      // Focus the map on the marker
      map.flyTo([destination.lat, destination.lng], 4, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [destination, map]);

  return null;
};

// Animation component for Route
const RouteAnimation = ({
  routePoints,
  transportMode,
}: {
  routePoints: any[];
  transportMode: string;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!routePoints || routePoints.length < 2) return;

    // Different styles for different transport modes
    const getRouteStyle = () => {
      switch (transportMode) {
        case 'air':
          return {
            color: '#1890ff', // Blue for air
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10',
          };
        case 'sea':
          return {
            color: '#4CAF50', // Green for sea
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 10',
          };
        case 'land':
          return {
            color: '#FF9800', // Orange for land
            weight: 4,
            opacity: 0.8,
            dashArray: null,
          };
        default:
          return {
            color: '#4CAF50',
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 10',
          };
      }
    };

    // Create route polyline with appropriate style
    const polyline = L.polyline(routePoints, getRouteStyle()).addTo(map);

    // Add markers for start and end points
    const startIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color:#1890ff;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>',
      iconSize: [20, 20],
    });

    const endIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color:#f44336;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>',
      iconSize: [20, 20],
    });

    const startMarker = L.marker(routePoints[0], { icon: startIcon }).addTo(
      map
    );
    const endMarker = L.marker(routePoints[routePoints.length - 1], {
      icon: endIcon,
    }).addTo(map);

    // Add animated marker based on transport mode
    let markerIcon;
    if (transportMode === 'air') {
      markerIcon = L.divIcon({
        className: 'airplane-icon',
        html: '<div style="font-size:28px">✈️</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    } else if (transportMode === 'land') {
      markerIcon = L.divIcon({
        className: 'truck-icon',
        html: '<div style="font-size:28px">🚚</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    } else {
      markerIcon = L.divIcon({
        className: 'ship-icon',
        html: '<div style="font-size:28px">🚢</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    }

    const animatedMarker = L.marker(routePoints[0], { icon: markerIcon }).addTo(
      map
    );

    // Animation speed based on transport mode
    const getAnimationSpeed = () => {
      switch (transportMode) {
        case 'air':
          return 60; // Faster for air
        case 'sea':
          return 100; // Normal for sea
        case 'land':
          return 80; // Medium for land
        default:
          return 100;
      }
    };

    // Simple animation using setInterval
    let step = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
      if (step >= totalSteps) {
        step = 0; // Reset the animation
      }

      const progress = step / totalSteps;
      const routeIndex = Math.floor(progress * (routePoints.length - 1));
      const nextRouteIndex = Math.min(routeIndex + 1, routePoints.length - 1);
      const subProgress = (progress * (routePoints.length - 1)) % 1;

      const currentPos = routePoints[routeIndex];
      const nextPos = routePoints[nextRouteIndex];

      const lat = currentPos.lat + (nextPos.lat - currentPos.lat) * subProgress;
      const lng = currentPos.lng + (nextPos.lng - currentPos.lng) * subProgress;

      animatedMarker.setLatLng([lat, lng]);

      step++;
    }, getAnimationSpeed());

    // Fit bounds to show the entire route with better padding
    map.fitBounds(polyline.getBounds(), { padding: [80, 80] });

    return () => {
      clearInterval(interval);
      map.removeLayer(polyline);
      map.removeLayer(startMarker);
      map.removeLayer(endMarker);
      map.removeLayer(animatedMarker);
    };
  }, [routePoints, map, transportMode]);

  return null;
};

interface InteractiveTradeMapProps {
  onCountrySelect: (countryData: any) => void;
  selectedCountry: any;
  simulationResults: any;
}

const InteractiveTradeMap: React.FC<InteractiveTradeMapProps> = ({
  onCountrySelect,
  selectedCountry,
  simulationResults,
}) => {
  const [countriesGeoJSON, setCountriesGeoJSON] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [transportMode, setTransportMode] = useState<string>('sea');

  // Extract destination from custom destination in simulationResults if available
  const destination =
    simulationResults?.destination ||
    (selectedCountry
      ? {
          name: selectedCountry.name,
          lat: selectedCountry.lat,
          lng: selectedCountry.lng,
        }
      : null);

  // Extract transport mode from simulation results if available
  useEffect(() => {
    if (simulationResults && simulationResults.transportMode) {
      setTransportMode(simulationResults.transportMode);
    }
  }, [simulationResults]);

  useEffect(() => {
    // Fetch GeoJSON data of countries
    fetch(
      'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
    )
      .then((response) => response.json())
      .then((data) => {
        setCountriesGeoJSON(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
        setLoading(false);
      });
  }, []);

  // Define style for each country based on import needs (simulated data)
  const getCountryStyle = (feature: any) => {
    // This would be based on real data from API in production
    // GET /api/countries/import-needs
    const importNeeds = Math.random() * 5; // Simulated data on a 0-5 scale

    const isSelected =
      selectedCountry && feature.properties.ISO_A3 === selectedCountry.iso;

    return {
      fillColor:
        importNeeds > 4
          ? '#2e7d32'
          : importNeeds > 3
            ? '#4caf50'
            : importNeeds > 2
              ? '#8bc34a'
              : importNeeds > 1
                ? '#cddc39'
                : '#ffeb3b',
      weight: isSelected ? 3 : 1,
      opacity: 0.7,
      color: isSelected ? '#FF4081' : 'white',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.8 : 0.6,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const countryName = feature.properties.ADMIN;
    const countryCode = feature.properties.ISO_A3;

    // Skip for Indonesia (origin country)
    if (countryCode === 'IDN') {
      return;
    }

    // Add tooltips
    layer.bindTooltip(countryName, {
      permanent: false,
      direction: 'center',
      className: 'country-tooltip',
    });

    // Add click event
    layer.on({
      click: () => {
        // Get country centroid for placing markers
        const bounds = layer.getBounds();
        const center = bounds.getCenter();

        onCountrySelect({
          name: countryName,
          iso: countryCode,
          lat: center.lat,
          lng: center.lng,
        });
      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9,
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(getCountryStyle(feature));
      },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ffffff',
          minHeight: '500px',
          width: '100%',
        }}
      >
        <Spin size="large" tip="Loading map data..." fullscreen={false} />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={L.latLng(20, 0)}
        zoom={2}
        style={{
          height: '100%',
          width: '100%',
          minHeight: '550px',
          background: '#f8f9fa',
          borderRadius: '12px',
        }}
        zoomControl={false}
        attributionControl={false}
        minZoom={2}
        maxZoom={7}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />

        {countriesGeoJSON && (
          <GeoJSON
            data={countriesGeoJSON}
            style={getCountryStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {simulationResults && simulationResults.optimalRoute && (
          <RouteAnimation
            routePoints={simulationResults.optimalRoute}
            transportMode={transportMode}
          />
        )}

        <CustomZoomControl />
        <MapInitializer destination={destination} />
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          fontSize: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Import Needs
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#2e7d32',
              marginRight: '8px',
              borderRadius: '3px',
            }}
          ></span>
          <span>Very High</span>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#4caf50',
              marginRight: '8px',
              borderRadius: '3px',
            }}
          ></span>
          <span>High</span>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#8bc34a',
              marginRight: '8px',
              borderRadius: '3px',
            }}
          ></span>
          <span>Medium</span>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#cddc39',
              marginRight: '8px',
              borderRadius: '3px',
            }}
          ></span>
          <span>Low</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#ffeb3b',
              marginRight: '8px',
              borderRadius: '3px',
            }}
          ></span>
          <span>Very Low</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTradeMap;
