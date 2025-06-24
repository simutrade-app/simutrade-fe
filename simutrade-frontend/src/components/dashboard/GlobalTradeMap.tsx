import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface TradeHotspot {
  id: number;
  location: [number, number]; // lat, lng
  name: string;
  value: number;
}

const tradeHotspots: TradeHotspot[] = [
  { id: 1, location: [40.7128, -74.006], name: 'New York', value: 4200 },
  { id: 2, location: [51.5074, -0.1278], name: 'London', value: 3800 },
  { id: 3, location: [39.9042, 116.4074], name: 'Beijing', value: 3500 },
  { id: 4, location: [35.6762, 139.6503], name: 'Tokyo', value: 3200 },
  { id: 5, location: [-33.8688, 151.2093], name: 'Sydney', value: 2800 },
  { id: 6, location: [19.076, 72.8777], name: 'Mumbai', value: 2600 },
  { id: 7, location: [-23.5505, -46.6333], name: 'São Paulo', value: 2400 },
  { id: 8, location: [55.7558, 37.6173], name: 'Moscow', value: 2200 },
];

// Extend the Default interface to include _getIconUrl
declare module 'leaflet' {
  namespace Icon {
    interface Default {
      _getIconUrl?: string;
    }
  }
}

// Map initialization component
const MapInitializer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Ensure map is properly sized
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Set proper bounds to prevent shifting
    const bounds = L.latLngBounds([
      [-90, -180],
      [90, 180]
    ]);
    map.setMaxBounds(bounds);
  }, [map]);

  return null;
};

const GlobalTradeMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);

  // Fix for the Leaflet icon issue
  useEffect(() => {
    // This is a workaround for the Leaflet icon issue in production builds
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Global Trade Hotspots</h3>
      </div>
      
      <div className="relative flex-1 rounded-lg overflow-hidden">
        <MapContainer
          ref={mapRef}
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          worldCopyJump={true}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
            minZoom={1}
          />
          <MapInitializer />
          {tradeHotspots.map((hotspot) => (
            <CircleMarker
              key={`hotspot-${hotspot.id}`}
              center={[hotspot.location[0], hotspot.location[1]]}
              pathOptions={{
                fillOpacity: 0.7,
                fillColor: 'hsl(var(--primary))',
                color: '#fff',
                weight: 2,
              }}
              radius={Math.max(Math.sqrt(hotspot.value) / 10, 8)}
            >
              <Tooltip>
                <div>
                  <strong>{hotspot.name}</strong>
                  <div>Trade Volume: ${hotspot.value.toLocaleString()}M</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* Full overlay with trade statistics */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Trade Activity Overview</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">8</div>
                  <div className="text-xs text-gray-500">Active Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">$24.8B</div>
                  <div className="text-xs text-gray-500">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-emerald-600">+15%</div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTradeMap;
