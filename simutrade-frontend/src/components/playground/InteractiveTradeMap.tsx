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
  routePoints: Array<{lat: number; lng: number; name?: string; transportMode?: string; error?: string; message?: string}>;
  transportMode: string;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!routePoints || routePoints.length < 2) return;

    // Check if route contains error points (like LAND_IMPOSSIBLE)
    const hasErrorPoint = routePoints.some(point => point.error === 'LAND_IMPOSSIBLE');
    
    if (hasErrorPoint) {
      // Display error route with red X markers instead of animation
      const errorPoint = routePoints.find(point => point.error === 'LAND_IMPOSSIBLE');
      
      if (errorPoint) {
        // Create error marker with message
        const errorIcon = L.divIcon({
          className: '',
          html: '<div style="font-size:32px; color: #ff4444; background: none; border: none; outline: none; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">❌</div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        
        const errorMarker = L.marker([errorPoint.lat, errorPoint.lng], { 
          icon: errorIcon 
        }).addTo(map);
        
        errorMarker.bindPopup(
          `<div style="text-align: center; padding: 10px;">
            <strong style="color: #ff4444;">❌ Route Impossible</strong><br/>
            <span style="font-size: 12px;">${errorPoint.message || 'Land transport cannot cross ocean barriers.'}</span>
          </div>`,
          { closeButton: true, autoClose: false }
        ).openPopup();

        // Draw dashed red line to show impossible route
        const errorPolyline = L.polyline(routePoints, {
          color: '#ff4444',
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(map);

        // Cleanup function
        return () => {
          map.removeLayer(errorMarker);
          map.removeLayer(errorPolyline);
        };
      }
      return;
    }

    const layers: L.Layer[] = [];

    if (transportMode === 'multimodal') {
      // Enhanced multimodal route with sequential animation
      const segmentLayers: L.Layer[] = [];
      let animatedMarker: L.Marker | null = null;
      let currentSegmentIndex = 0;
      let animationInterval: NodeJS.Timeout | null = null;
      
      // Create all route segments with different styles
      for (let i = 0; i < routePoints.length - 1; i++) {
        const currentPoint = routePoints[i];
        const nextPoint = routePoints[i + 1];
        const segmentMode = nextPoint.transportMode || currentPoint.transportMode || 'land';
        
        // Create segment polyline with appropriate style
        const segmentStyle = (() => {
          switch (segmentMode) {
            case 'air':
              return { color: '#1890ff', weight: 3, opacity: 0.6, dashArray: '5, 10' };
            case 'sea':
              return { color: '#4CAF50', weight: 3, opacity: 0.6, dashArray: '10, 10' };
            case 'land':
              return { color: '#FF9800', weight: 4, opacity: 0.6, dashArray: undefined };
            default:
              return { color: '#666', weight: 3, opacity: 0.6 };
          }
        })();

        const segmentPolyline = L.polyline([currentPoint, nextPoint], segmentStyle).addTo(map);
        segmentLayers.push(segmentPolyline);
      }
      
      // Create initial animated marker
      const createMarkerIcon = (mode: string, isActive: boolean = false) => {
        const opacity = isActive ? '1.0' : '0.7';
        const size = isActive ? '32' : '24';
        const shadow = isActive ? '3px 3px 6px rgba(0,0,0,0.4)' : '1px 1px 3px rgba(0,0,0,0.3)';
        
        switch (mode) {
          case 'air':
            return L.divIcon({
              className: '',
              html: `<div style="font-size:${size}px; opacity:${opacity}; text-shadow: ${shadow}; background: none; border: none; outline: none;">✈️</div>`,
              iconSize: [parseInt(size), parseInt(size)],
              iconAnchor: [parseInt(size)/2, parseInt(size)/2],
            });
          case 'sea':
            return L.divIcon({
              className: '',
              html: `<div style="font-size:${size}px; opacity:${opacity}; text-shadow: ${shadow}; background: none; border: none; outline: none;">🚢</div>`,
              iconSize: [parseInt(size), parseInt(size)],
              iconAnchor: [parseInt(size)/2, parseInt(size)/2],
            });
          case 'land':
            return L.divIcon({
              className: '',
              html: `<div style="font-size:${size}px; opacity:${opacity}; text-shadow: ${shadow}; background: none; border: none; outline: none;">🚚</div>`,
              iconSize: [parseInt(size), parseInt(size)],
              iconAnchor: [parseInt(size)/2, parseInt(size)/2],
            });
          default:
            return L.divIcon({
              className: '',
              html: `<div style="font-size:${size}px; opacity:${opacity}; text-shadow: ${shadow}; background: none; border: none; outline: none;">🚚</div>`,
              iconSize: [parseInt(size), parseInt(size)],
              iconAnchor: [parseInt(size)/2, parseInt(size)/2],
            });
        }
      };
      
      // Start with first segment
      const initialMode = routePoints[1]?.transportMode || routePoints[0]?.transportMode || 'land';
      animatedMarker = L.marker(routePoints[0], { 
        icon: createMarkerIcon(initialMode, true)
      }).addTo(map);
      
      // Animation function for multimodal route
      let step = 0;
      const stepsPerSegment = 20; // Reduced from 50 for faster transitions
      
      const animateMultimodal = () => {
        if (currentSegmentIndex >= routePoints.length - 1) {
          // Animation complete - restart from beginning
          currentSegmentIndex = 0;
          step = 0;
        }
        
        const currentPoint = routePoints[currentSegmentIndex];
        const nextPoint = routePoints[currentSegmentIndex + 1];
        const segmentMode = nextPoint?.transportMode || currentPoint?.transportMode || 'land';
        
        if (step === 0) {
          // Instant icon change - no delay
          if (animatedMarker) {
            animatedMarker.setIcon(createMarkerIcon(segmentMode, true));
          }
          
          // Highlight current segment instantly
          segmentLayers.forEach((layer, index) => {
            if (layer instanceof L.Polyline) {
              const isCurrentSegment = index === currentSegmentIndex;
              const segmentStyle = isCurrentSegment 
                ? { opacity: 1.0, weight: 5 } 
                : { opacity: 0.4, weight: 3 };
              layer.setStyle(segmentStyle);
            }
          });

          // Update interval speed for current transport mode (dynamic speed)
          if (animationInterval) {
            clearInterval(animationInterval);
            const currentSpeed = getAnimationSpeed(segmentMode);
            animationInterval = setInterval(animateMultimodal, currentSpeed);
          }
        }
        
        // Calculate position within current segment
        const progress = step / stepsPerSegment;
        const lat = currentPoint.lat + (nextPoint.lat - currentPoint.lat) * progress;
        const lng = currentPoint.lng + (nextPoint.lng - currentPoint.lng) * progress;
        
        if (animatedMarker) {
          animatedMarker.setLatLng([lat, lng]);
        }
        
        step++;
        
        if (step >= stepsPerSegment) {
          // Move to next segment immediately
          currentSegmentIndex++;
          step = 0;
        }
      };
      
      // Faster animation speeds for smooth transitions
      const getAnimationSpeed = (mode: string) => {
        switch (mode) {
          case 'air': return 30;   // Faster: was 50ms
          case 'sea': return 50;   // Faster: was 120ms  
          case 'land': return 40;  // Faster: was 80ms
          default: return 40;
        }
      };
      
      animationInterval = setInterval(animateMultimodal, getAnimationSpeed(initialMode));
      
      // Store references for cleanup
      layers.push(...segmentLayers);
      if (animatedMarker) layers.push(animatedMarker);
      
      // Store interval for cleanup
      if (animatedMarker && animationInterval) {
        (animatedMarker as any)._animationInterval = animationInterval;
      }
    } else {
      // For single transport modes, apply intelligent routing constraints
      let adjustedRoutePoints = [...routePoints];
      
      if (transportMode === 'sea') {
        // Sea freight should stop at coastal points and switch to land
        adjustedRoutePoints = [];
        for (let i = 0; i < routePoints.length; i++) {
          const point = routePoints[i];
          
          // Check if this is a landlocked area that sea freight cannot reach
          const isLandlocked = (lat: number, lng: number) => {
            // Simple landlocked detection - enhance as needed
            // Central Asia, landlocked countries
            if (lat > 35 && lat < 55 && lng > 40 && lng < 80) return true;
            // Central Africa
            if (lat > -10 && lat < 20 && lng > 10 && lng < 40) return true;
            return false;
          };
          
          if (isLandlocked(point.lat, point.lng)) {
            // Find nearest coastal point for sea routes
            const nearestCoast = findNearestCoastalPoint(point);
            adjustedRoutePoints.push(nearestCoast);
            break; // Stop sea route here
          } else {
            adjustedRoutePoints.push(point);
          }
        }
      }

      // Create single-mode route
      const routeStyle = (() => {
        switch (transportMode) {
          case 'air':
            return { color: '#1890ff', weight: 3, opacity: 0.7, dashArray: '5, 10' };
          case 'sea':
            return { color: '#4CAF50', weight: 3, opacity: 0.8, dashArray: '10, 10' };
          case 'land':
            return { color: '#FF9800', weight: 4, opacity: 0.8, dashArray: undefined };
          default:
            return { color: '#4CAF50', weight: 3, opacity: 0.8, dashArray: '10, 10' };
        }
      })();

      const polyline = L.polyline(adjustedRoutePoints, routeStyle).addTo(map);
      layers.push(polyline);

      // Single animated icon for the route
      const transportIcon = (() => {
        switch (transportMode) {
          case 'air':
            return L.divIcon({
              className: '',
              html: '<div style="font-size:28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); background: none; border: none; outline: none;">✈️</div>',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
          case 'land':
            return L.divIcon({
              className: '',
              html: '<div style="font-size:28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); background: none; border: none; outline: none;">🚚</div>',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
          case 'sea':
            return L.divIcon({
              className: '',
              html: '<div style="font-size:28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); background: none; border: none; outline: none;">🚢</div>',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
          default:
            return L.divIcon({
              className: '',
              html: '<div style="font-size:28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); background: none; border: none; outline: none;">🚢</div>',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
        }
      })();

      const animatedMarker = L.marker(adjustedRoutePoints[0], { icon: transportIcon }).addTo(map);
      layers.push(animatedMarker);

      // Animation for single transport mode
      let step = 0;
      const totalSteps = 80; // Reduced from 100 for faster completion
      const getAnimationSpeed = () => {
        switch (transportMode) {
          case 'air': return 30;   // Consistent with multimodal
          case 'sea': return 50;   // Consistent with multimodal
          case 'land': return 40;  // Consistent with multimodal
          default: return 40;
        }
      };

      const interval = setInterval(() => {
        if (step >= totalSteps) step = 0;

        const progress = step / totalSteps;
        const routeIndex = Math.floor(progress * (adjustedRoutePoints.length - 1));
        const nextRouteIndex = Math.min(routeIndex + 1, adjustedRoutePoints.length - 1);
        const subProgress = (progress * (adjustedRoutePoints.length - 1)) % 1;

        const currentPos = adjustedRoutePoints[routeIndex];
        const nextPos = adjustedRoutePoints[nextRouteIndex];

        const lat = currentPos.lat + (nextPos.lat - currentPos.lat) * subProgress;
        const lng = currentPos.lng + (nextPos.lng - currentPos.lng) * subProgress;

        animatedMarker.setLatLng([lat, lng]);
        step++;
      }, getAnimationSpeed());

      // Store interval for cleanup
      (animatedMarker as any)._animationInterval = interval;
    }

    // Helper function to find nearest coastal point
    function findNearestCoastalPoint(point: {lat: number; lng: number}) {
      // Simplified coastal points - can be enhanced with real coastal data
      const coastalPoints = [
        { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
        { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
        { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
        { lat: 51.9579, lng: 4.1178, name: 'Rotterdam' },
        { lat: 33.7701, lng: -118.1937, name: 'Los Angeles' },
      ];
      
      let nearest = coastalPoints[0];
      let minDistance = Number.MAX_VALUE;
      
      coastalPoints.forEach(coast => {
        const distance = Math.sqrt(
          Math.pow(coast.lat - point.lat, 2) + 
          Math.pow(coast.lng - point.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = coast;
        }
      });
      
      return nearest;
    }

    // Add start/end markers
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

    const startMarker = L.marker(routePoints[0], { icon: startIcon }).addTo(map);
    const endMarker = L.marker(routePoints[routePoints.length - 1], { icon: endIcon }).addTo(map);
    layers.push(startMarker, endMarker);

    // Fit bounds to show the entire route
    const allPoints = routePoints.map(p => [p.lat, p.lng]) as L.LatLngTuple[];
    map.fitBounds(allPoints, { padding: [80, 80] });

    return () => {
      // Cleanup all layers and intervals
      layers.forEach(layer => {
        if ((layer as any)._animationInterval) {
          clearInterval((layer as any)._animationInterval);
        }
        map.removeLayer(layer);
      });
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
    // Removed debug logging to prevent console spam

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

    // Removed detailed debug logging to prevent console spam

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
        // Allow clicking on all countries including Indonesia
        onCountrySelect({
          name: displayName,
          iso: countryCode || 'N/A',
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    });
  };

  // Removed debug logging to reduce console noise

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
