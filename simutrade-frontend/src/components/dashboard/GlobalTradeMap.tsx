import React, { useEffect } from 'react';
import { Card } from 'antd';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
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

const GlobalTradeMap: React.FC = () => {
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
    <Card
      title="Global Trade Hotspots"
      style={{ height: '100%', width: '100%' }}
      styles={{ body: { height: 'calc(100% - 48px)', padding: '0' } }}
    >
      <div style={{ height: '100%', width: '100%', minHeight: '350px' }}>
        <MapContainer
          center={L.latLng(20, 0)}
          zoom={2}
          style={{ height: '100%', width: '100%', minHeight: '350px' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {tradeHotspots.map((hotspot) => (
            <CircleMarker
              key={hotspot.id}
              center={L.latLng(hotspot.location[0], hotspot.location[1])}
              pathOptions={{
                fillOpacity: 0.7,
                fillColor: '#1890ff',
                color: '#fff',
                weight: 1,
              }}
              radius={Math.sqrt(hotspot.value) / 10}
            >
              <Tooltip>
                <div>
                  <strong>{hotspot.name}</strong>
                  <div>Trade Volume: ${hotspot.value.toLocaleString()}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default GlobalTradeMap;
