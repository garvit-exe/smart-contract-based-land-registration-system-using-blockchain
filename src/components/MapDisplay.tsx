
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in Leaflet with React
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
  title?: string;
}

interface MapDisplayProps {
  center: Location;
  markers: Location[];
  zoom?: number;
  height?: string;
}

// Type declarations to help TypeScript understand react-leaflet props
declare module 'react-leaflet' {
  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    style?: React.CSSProperties;
  }

  export interface TileLayerProps {
    attribution: string;
    url: string;
  }

  export interface MarkerProps {
    position: LatLngExpression;
    icon?: any;
  }
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  center, 
  markers, 
  zoom = 13,
  height = "100%"
}) => {
  // Convert to LatLngExpression for react-leaflet
  const centerPosition: LatLngExpression = [center.lat, center.lng];
  
  return (
    <div style={{ height }}>
      <MapContainer
        center={centerPosition}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, index) => {
          // Convert marker position to LatLngExpression
          const position: LatLngExpression = [marker.lat, marker.lng];
          
          return (
            <Marker 
              key={index} 
              position={position} 
              icon={defaultIcon}
            >
              {marker.title && (
                <Popup>
                  {marker.title}
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
