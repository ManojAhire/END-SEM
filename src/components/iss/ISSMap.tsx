import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ISSData } from '../../types';
import { useTheme } from '../../context/ThemeContext';

// Custom ISS SVG marker
const issIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#00d4ff,#8b5cf6);
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 16px 4px rgba(0,212,255,0.6);
    border:2px solid rgba(255,255,255,0.4);
    font-size:18px;
  ">🛸</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function FlyToISS({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current && lat !== 0) {
      map.setView([lat, lng], 3);
      firstRef.current = false;
    }
  }, [lat, lng, map]);
  return null;
}

interface ISSMapProps {
  data: ISSData;
}

export function ISSMap({ data }: ISSMapProps) {
  const { theme } = useTheme();
  const { position, trajectory } = data;

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const pathPoints = trajectory.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-cyan-500/5">
      <MapContainer
        center={[position.lat || 20, position.lng || 0]}
        zoom={3}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
        />
        <FlyToISS lat={position.lat} lng={position.lng} />
        {/* Trajectory path */}
        {pathPoints.length > 1 && (
          <Polyline
            positions={pathPoints}
            pathOptions={{
              color: '#00d4ff',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '6 4',
            }}
          />
        )}
        {/* ISS marker */}
        {position.lat !== 0 && (
          <Marker position={[position.lat, position.lng]} icon={issIcon}>
            <Popup>
              <div className="text-sm font-medium">
                <p>🛸 <strong>ISS Position</strong></p>
                <p>Lat: {position.lat.toFixed(4)}°</p>
                <p>Lng: {position.lng.toFixed(4)}°</p>
                <p>Speed: {data.speed.toFixed(0)} km/h</p>
                <p>Location: {data.locationName}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
