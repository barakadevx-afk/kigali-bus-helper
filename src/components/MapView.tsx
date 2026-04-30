import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Route } from '../context/TransportContext';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  selectedRoute: Route | null;
}

const CenterMap: React.FC<{ coords: [number, number][] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ selectedRoute }) => {
  const kigaliCenter: [number, number] = [-1.944, 30.061];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={kigaliCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {selectedRoute && (
          <>
            <Polyline
              pathOptions={{ color: '#1976D2', weight: 6, opacity: 0.7, lineJoin: 'round' }}
              positions={selectedRoute.coordinates}
            />
            {selectedRoute.coordinates.map((coord, idx) => (
              <Marker key={`${selectedRoute.id}-${idx}`} position={coord}>
                <Popup>
                  <div className="font-medium">{selectedRoute.stops[idx]}</div>
                </Popup>
              </Marker>
            ))}
            <CenterMap coords={selectedRoute.coordinates} />
          </>
        )}
      </MapContainer>

      {!selectedRoute && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Explore Kigali Transport</p>
        </div>
      )}
    </div>
  );
};
