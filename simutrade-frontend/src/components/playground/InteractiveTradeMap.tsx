import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/leaflet-map.css';
import L from 'leaflet';
import { Spin, Button, Tooltip, message } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  AimOutlined,
} from '@ant-design/icons';

// Custom icons for transport mode

// Leaflet type extensions are no longer needed here with the revised icon setup.

// Needed to fix Leaflet icons in production builds
// delete L.Icon.Default.prototype._getIconUrl; // This line is often problematic with TypeScript
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ===============
// Custom Zoom Controls Component
// ===============

interface CustomZoomControlProps {
  onCurrentLocationDetected?: (location: { lat: number; lng: number; name: string }) => void;
}

const CustomZoomControl: React.FC<CustomZoomControlProps> = ({ onCurrentLocationDetected }) => {
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
            if (
              (layer as L.Marker & { _currentLocation?: boolean })
                ._currentLocation
            ) {
              map.removeLayer(layer);
            }
          });

          const marker = L.marker([latitude, longitude], {
            icon: currentLocationIcon,
          });
          (
            marker as L.Marker & { _currentLocation?: boolean }
          )._currentLocation = true;
          marker.addTo(map).bindPopup('Your current location').openPopup();

          // Notify parent component so that origin country can update
          if (onCurrentLocationDetected) {
            onCurrentLocationDetected({
              lat: latitude,
              lng: longitude,
              name: 'Current Location',
            });
          }
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
  currentOriginLocation?: { lat: number; lng: number; name: string } | null;
  selectedOriginCountry?: string;
}

const MapInitializer: React.FC<MapInitializerProps> = ({ destination, currentOriginLocation, selectedOriginCountry }) => {
  const map = useMap();

  // Country coordinates mapping
  const getOriginCountryCoordinates = (countryId: string) => {
    const countryCoordinates: { [key: string]: { lat: number; lng: number; name: string } } = {
      IDN: { lat: -6.2088, lng: 106.8456, name: 'Indonesia' },
      MYS: { lat: 3.139, lng: 101.6869, name: 'Malaysia' },
      SGP: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
      THA: { lat: 13.7563, lng: 100.5018, name: 'Thailand' },
      VNM: { lat: 21.0285, lng: 105.8542, name: 'Vietnam' },
      PHL: { lat: 14.5995, lng: 120.9842, name: 'Philippines' },
    };
    return countryCoordinates[countryId] || null;
  };

  useEffect(() => {
    // Fit the map to a reasonable view on initial load
    const southWest = L.latLng(-50, -170);
    const northEast = L.latLng(70, 170);
    const bounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(bounds, {
      padding: [0, 0],
      maxZoom: 3,
    });

    // Make sure the map is properly sized to the container after initial setup
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Remove explicit setView as fitBounds now handles the initial view.
    // map.setView([20, 0], 2);
  }, [map]);

  // Add marker and focus map when selected country changes (destination)
  useEffect(() => {
    if (destination && destination.lat && destination.lng) {
      const destinationIcon = L.divIcon({
        className: 'destination-icon',
        html: '<div style="background-color:#52c41a;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>',
        iconSize: [20, 20],
      });

      // Remove existing destination marker if any
      map.eachLayer((layer: L.Layer) => {
        if (
          (layer as L.Marker & { _destinationMarker?: boolean })
            ._destinationMarker
        ) {
          map.removeLayer(layer);
        }
      });

      const marker = L.marker([destination.lat, destination.lng], {
        icon: destinationIcon,
      });
      (
        marker as L.Marker & { _destinationMarker?: boolean }
      )._destinationMarker = true;
      marker
        .addTo(map)
        .bindPopup(`Destination: ${destination.name || 'Selected Location'}`);

      // Only focus map on destination if no origin is being shown
      if (!currentOriginLocation && (!selectedOriginCountry || selectedOriginCountry === 'CURRENT')) {
        map.flyTo([destination.lat, destination.lng], 4, {
          animate: true,
          duration: 1.5,
        });
        marker.openPopup();
      }
    }
  }, [destination, map, currentOriginLocation, selectedOriginCountry]);

  // Add marker and focus map when current origin location changes
  useEffect(() => {
    if (currentOriginLocation && currentOriginLocation.lat && currentOriginLocation.lng) {
      const originIcon = L.divIcon({
        className: 'origin-icon',
        html: '<div style="background-color:#1890ff;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>',
        iconSize: [20, 20],
      });

      // Remove existing origin marker if any
      map.eachLayer((layer: L.Layer) => {
        if (
          (layer as L.Marker & { _originMarker?: boolean })
            ._originMarker
        ) {
          map.removeLayer(layer);
        }
      });

      const marker = L.marker([currentOriginLocation.lat, currentOriginLocation.lng], {
        icon: originIcon,
      });
      (
        marker as L.Marker & { _originMarker?: boolean }
      )._originMarker = true;
      marker
        .addTo(map)
        .bindPopup(`Origin: ${currentOriginLocation.name}`)
        .openPopup();

      // Focus the map on the origin marker
      map.flyTo([currentOriginLocation.lat, currentOriginLocation.lng], 6, {
        animate: true,
        duration: 1.5,
      });
    } else {
      // Remove origin marker if no current location
      map.eachLayer((layer: L.Layer) => {
        if (
          (layer as L.Marker & { _originMarker?: boolean })
            ._originMarker
        ) {
          map.removeLayer(layer);
        }
      });
    }
  }, [currentOriginLocation, map]);

  // Add marker and focus map when regular origin country changes
  useEffect(() => {
    if (selectedOriginCountry && selectedOriginCountry !== 'CURRENT' && !currentOriginLocation) {
      const originCountryData = getOriginCountryCoordinates(selectedOriginCountry);
      
      if (originCountryData) {
        const originIcon = L.divIcon({
          className: 'origin-icon',
          html: '<div style="background-color:#1890ff;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>',
          iconSize: [20, 20],
        });

        // Remove existing origin marker if any
        map.eachLayer((layer: L.Layer) => {
          if (
            (layer as L.Marker & { _originMarker?: boolean })
              ._originMarker
          ) {
            map.removeLayer(layer);
          }
        });

        const marker = L.marker([originCountryData.lat, originCountryData.lng], {
          icon: originIcon,
        });
        (
          marker as L.Marker & { _originMarker?: boolean }
        )._originMarker = true;
        marker
          .addTo(map)
          .bindPopup(`Origin: ${originCountryData.name}`)
          .openPopup();

        // Focus the map on the origin marker
        map.flyTo([originCountryData.lat, originCountryData.lng], 6, {
          animate: true,
          duration: 1.5,
        });
      }
    } else if (!selectedOriginCountry || selectedOriginCountry === 'CURRENT') {
      // Remove origin marker if no regular country is selected or current location is selected
      if (!currentOriginLocation) {
        map.eachLayer((layer: L.Layer) => {
          if (
            (layer as L.Marker & { _originMarker?: boolean })
              ._originMarker
          ) {
            map.removeLayer(layer);
          }
        });
      }
    }
  }, [selectedOriginCountry, currentOriginLocation, map, getOriginCountryCoordinates]);

  return null;
};

// Animation component for Route
const RouteAnimation = ({
  routePoints,
  transportMode,
}: {
  routePoints: L.LatLngLiteral[];
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
            dashArray: undefined,
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
  onCountrySelect: (countryData: {
    name: string;
    iso: string;
    lat: number;
    lng: number;
  }) => void;
  selectedCountry: {
    name: string;
    iso: string;
    lat: number;
    lng: number;
  } | null;
  simulationResults: {
    destination?: { lat: number; lng: number; name?: string };
    transportMode?: string;
    optimalRoute?: L.LatLngLiteral[];
  } | null;
  currentOriginLocation?: { lat: number; lng: number; name: string } | null;
  selectedOriginCountry?: string;
  onCurrentLocationDetected?: (location: { lat: number; lng: number; name: string }) => void;
}

const InteractiveTradeMap: React.FC<InteractiveTradeMapProps> = ({
  onCountrySelect,
  selectedCountry,
  simulationResults,
  currentOriginLocation,
  selectedOriginCountry,
  onCurrentLocationDetected,
}) => {
  const [countriesGeoJSON, setCountriesGeoJSON] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [transportMode, setTransportMode] = useState<string>('sea');

  // Determine the destination for the MapInitializer component (marker and map focus).
  // Priority is given to the currently selected country by the user, as this represents
  // the destination being configured for a potential new trade simulation.
  // If no country is actively selected, it falls back to the destination
  // from any existing simulation results.
  const destination = selectedCountry
    ? {
        name: selectedCountry.name,
        lat: selectedCountry.lat,
        lng: selectedCountry.lng,
      }
    : simulationResults?.destination
      ? {
          // Ensure the object structure matches MapInitializerProps.destination
          name: simulationResults.destination.name,
          lat: simulationResults.destination.lat,
          lng: simulationResults.destination.lng,
        }
      : null;

  // Extract transport mode from simulation results if available
  useEffect(() => {
    if (simulationResults && simulationResults.transportMode) {
      setTransportMode(simulationResults.transportMode);
    }
  }, [simulationResults]);

  useEffect(() => {
    // Fetch GeoJSON data of countries
    console.log('[Debug Map] Attempting to fetch GeoJSON data...'); // Log: Start fetch
    fetch(
      'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('[Debug Map] GeoJSON data fetched successfully:', data); // Log: Fetch success + data
        setCountriesGeoJSON(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('[Debug Map] Error loading GeoJSON:', error); // Log: Fetch error
        setLoading(false);
      });
  }, []);

  // Define style for each country based on import needs (simulated data)
  const getCountryStyle = (
    feature?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
  ): L.PathOptions => {
    // This would be based on real data from API in production
    // GET /api/countries/import-needs
    const importNeeds = Math.random() * 5; // Simulated data on a 0-5 scale

    const isSelected =
      selectedCountry && feature?.properties?.ISO_A3 === selectedCountry.iso;

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

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    // Conditional logging for problematic features
    if (
      feature &&
      feature.properties &&
      feature.properties.ADMIN === undefined &&
      feature.properties.ISO_A3 === undefined
    ) {
      console.log(
        '[Debug Problematic Feature Props]:',
        JSON.parse(JSON.stringify(feature.properties))
      );
    }

    const countryName =
      feature.properties?.name || // Correct property name from GeoJSON
      feature.properties?.ADMIN ||
      feature.properties?.NAME ||
      feature.properties?.SOVEREIGNT ||
      feature.properties?.['name:en'] || // OSM common tag for English name
      feature.properties?.int_name || // OSM common tag for international name
      feature.properties?.official_name || // Try official_name (often long)
      feature.properties?.['official_name:en']; // Try official_name:en (often long)

    const countryCode = 
      feature.properties?.['ISO3166-1-Alpha-3'] || // Correct property name from GeoJSON
      feature.properties?.ISO_A3;
    const countryCodeA2 = 
      feature.properties?.['ISO3166-1-Alpha-2'] || // Correct property name from GeoJSON
      feature.properties?.ISO_A2;

    let displayName = 'Unknown Region';
    if (countryName && String(countryName).trim() !== '') {
      displayName = String(countryName).trim();
    } else if (countryCode && String(countryCode).trim() !== '') {
      displayName = `Region (${String(countryCode).trim()})`;
    } else if (countryCodeA2 && String(countryCodeA2).trim() !== '') {
      displayName = `Region (${String(countryCodeA2).trim()})`;
    } else {
      // This else block means all specific name properties and ISO codes were falsy or empty strings
      // displayName remains 'Unknown Region'
      // The initial log of feature.properties should cover the debugging need here.
    }

    // Conditional detailed log for problematic features
    if (
      feature &&
      feature.properties &&
      feature.properties.ADMIN === undefined &&
      feature.properties.ISO_A3 === undefined
    ) {
      console.log('[Debug Name Decision for Problematic Feature]:', {
        rawAdmin: feature.properties?.ADMIN,
        rawName: feature.properties?.NAME,
        rawSovereignt: feature.properties?.SOVEREIGNT,
        rawNameEn: feature.properties?.['name:en'],
        rawIntName: feature.properties?.int_name,
        rawOfficialName: feature.properties?.official_name,
        rawOfficialNameEn: feature.properties?.['official_name:en'],
        derivedCountryName: countryName,
        countryCodeA3: countryCode,
        countryCodeA2: countryCodeA2,
        finalDisplayName: displayName,
      });
    }

    // Remove any residual popup binding first to avoid duplicates
    (layer as L.Path).unbindPopup?.();

    // Add proper hover tooltip functionality
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 3,
          color: '#FF4081',
          dashArray: '',
          fillOpacity: 0.8
        });
        
        // Create tooltip
        const tooltip = L.tooltip({
          permanent: false,
          direction: 'auto',
          className: 'country-tooltip'
        })
        .setContent(displayName)
        .setLatLng(e.latlng);
        
        target.bindTooltip(tooltip).openTooltip();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle(getCountryStyle(feature));
        target.closeTooltip();
      },
      click: (e: L.LeafletMouseEvent) => {
        // Skip click handler for Indonesia (origin country) but still allow tooltip
        if (countryCode !== 'IDN') {
          onCountrySelect({
            name: displayName,
            iso: countryCode || 'N/A',
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          });
        }
      }
    });
  };

  // Log component state before rendering
  console.log(
    '[Debug Map] Rendering. Loading:',
    loading,
    'GeoJSON Data:',
    countriesGeoJSON ? 'Data Loaded' : 'No Data'
  );

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
    <div
      style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
    >
      <MapContainer
        center={L.latLng(20, 0)}
        zoom={3}
        style={{
          height: '100%',
          width: '100%',
          minHeight: '550px',
          borderRadius: '12px',
        }}
        zoomControl={false}
        attributionControl={false}
        minZoom={3}
        maxZoom={7}
        worldCopyJump={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {countriesGeoJSON && (
          <GeoJSON
            data={countriesGeoJSON}
            style={
              getCountryStyle as L.StyleFunction<GeoJSON.GeoJsonProperties>
            }
            onEachFeature={onEachFeature}
          />
        )}

        {simulationResults && simulationResults.optimalRoute && (
          <RouteAnimation
            routePoints={simulationResults.optimalRoute}
            transportMode={transportMode}
          />
        )}

        <CustomZoomControl onCurrentLocationDetected={onCurrentLocationDetected} />
                    <MapInitializer destination={destination} currentOriginLocation={currentOriginLocation} selectedOriginCountry={selectedOriginCountry} />
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
          zIndex: 999,
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
