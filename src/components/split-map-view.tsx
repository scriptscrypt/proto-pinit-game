"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { StreetViewPanorama } from "@react-google-maps/api";
import "leaflet/dist/leaflet.css";

// You need to replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyDDIgxY-L-ajAxThfcHgkmbJf0Ys-aUPXU";

// Default coordinates (San Francisco)
const defaultPosition = { lat: 37.7749, lng: -122.4194 };

function StreetViewMap({ position }) {
  return (
    <StreetViewPanorama
      position={position}
      visible={true}
      options={{
        enableCloseButton: false,
        addressControl: false,
        fullscreenControl: false,
      }}
    />
  );
}

function MapSync({ position, onPositionChange }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  useEffect(() => {
    const updatePosition = () => {
      const center = map.getCenter();
      onPositionChange({ lat: center.lat, lng: center.lng });
    };
    map.on("move", updatePosition);
    return () => {
      map.off("move", updatePosition);
    };
  }, [map, onPositionChange]);

  return null;
}

export function SplitMapView() {
  const [position, setPosition] = useState(defaultPosition);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[position.lat, position.lng]} />
          <MapSync position={position} onPositionChange={setPosition} />
        </MapContainer>
      </div>
      <div className="w-1/2 h-full">
        <StreetViewMap position={position} />
      </div>
    </div>
  );
}
