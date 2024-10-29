"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, RefreshCw, Navigation, Flag } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMap,
  useMapEvents,
  Marker,
} from "react-leaflet";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

// Custom Marker Component
const CustomMarker = ({ position, icon, color, label, className }) => {
  const IconComponent = icon;
  const iconMarkup = renderToStaticMarkup(
    <div className={`relative ${className}`}>
      <IconComponent className={`w-8 h-8 ${color}`} />
      {label && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 text-black text-xs px-2 py-1 rounded-full">
          {label}
        </span>
      )}
    </div>
  );

  const customIcon = divIcon({
    html: iconMarkup,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <Marker position={position} icon={customIcon}>
      {label && <Popup>{label}</Popup>}
    </Marker>
  );
};

// Map click handler component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Map center handler component
function MapCenterHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function GameLayoutLeaflet() {
  const [timer, setTimer] = useState("01:15");
  const [points, setPoints] = useState(11111);

  const [gameState, setGameState] = useState({
    score: 0,
    round: 1,
    totalRounds: 5,
    gameOver: false,
    currentLocation: null,
    guessedLocation: null,
    showScore: false,
  });

  const [selectedPosition, setSelectedPosition] = useState(null);

  // Sample locations
  const locations = [
    { lat: 48.8584, lng: 2.2945, name: "Paris", hint: "City of Light" },
    { lat: 40.7128, lng: -74.006, name: "New York", hint: "The Big Apple" },
    { lat: -33.8688, lng: 151.2093, name: "Sydney", hint: "Harbor City" },
    { lat: 35.6762, lng: 139.6503, name: "Tokyo", hint: "Rising Sun" },
    { lat: 51.5074, lng: -0.1278, name: "London", hint: "Big Ben's Home" },
  ];

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      currentLocation: locations[0],
    }));
  }, []);

  // Game logic
  const calculateDistance = (guess, actual) => {
    const R = 6371;
    const dLat = ((actual.lat - guess.lat) * Math.PI) / 180;
    const dLon = ((actual.lng - guess.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((guess.lat * Math.PI) / 180) *
        Math.cos((actual.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGuess = () => {
    if (!selectedPosition) return;

    const distance = calculateDistance(
      selectedPosition,
      gameState.currentLocation
    );
    const points = Math.max(5000 - Math.floor(distance * 2), 0);

    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      guessedLocation: selectedPosition,
      showScore: true,
      gameOver: prev.round >= prev.totalRounds,
    }));
  };

  const nextRound = () => {
    setGameState((prev) => ({
      ...prev,
      round: prev.round + 1,
      currentLocation: locations[prev.round],
      guessedLocation: null,
      showScore: false,
    }));
    setSelectedPosition(null);
  };

  const restartGame = () => {
    setGameState({
      score: 0,
      round: 1,
      totalRounds: 5,
      gameOver: false,
      currentLocation: locations[0],
      guessedLocation: null,
      showScore: false,
    });
    setSelectedPosition(null);
  };

  const handleMapClick = (latlng) => {
    if (!gameState.showScore) {
      setSelectedPosition(latlng);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      <header className="flex justify-between items-center p-4 bg-[#0a0a0a]">
        <div className="text-2xl font-bold">proto</div>
        <nav className="space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-[#1a1a1a]"
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-[#1a1a1a]"
          >
            How to Play?
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-[#1a1a1a]"
          >
            Leaderboard
          </Button>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Maps, Mappers & More"
              className="pl-8 bg-[#1a1a1a] text-white border-none focus:ring-1 focus:ring-[#87CEEB]"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2 bg-[#1a1a1a] px-3 py-1 rounded-full">
            <span>{points} P</span>
            <div className="w-6 h-6 bg-[#87CEEB] rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="flex justify-between mb-4">
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">Guess Mode</div>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">{timer}</div>
          <div className="bg-white text-black px-4 py-2 rounded-lg">
            Round {gameState.round}/5
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-xl font-bold">
                {gameState.currentLocation?.hint || "Loading..."}
              </div>
            </div>
          </div>
          <div className="aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              className="w-full h-full"
              style={{ background: "#1a1a1a" }}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onMapClick={handleMapClick} />

              {selectedPosition && !gameState.showScore && (
                <CustomMarker
                  position={selectedPosition}
                  icon={Navigation}
                  color="text-blue-500"
                  label="Your guess"
                  className="animate-bounce"
                />
              )}

              {gameState.showScore && (
                <>
                  <CustomMarker
                    position={gameState.guessedLocation}
                    icon={Navigation}
                    color="text-blue-500"
                    label="Your guess"
                  />
                  <CustomMarker
                    position={[
                      gameState.currentLocation.lat,
                      gameState.currentLocation.lng,
                    ]}
                    icon={Flag}
                    color="text-green-500"
                    label={gameState.currentLocation.name}
                  />
                </>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Game Controls */}
        <div className="mt-4 flex justify-center">
          {!gameState.showScore && !gameState.gameOver && (
            <Button
              className="bg-[#87CEEB] hover:bg-[#5F9EA0] text-black hover:text-black px-8 py-2 rounded-lg text-lg font-bold"
              onClick={handleGuess}
              disabled={!selectedPosition}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Pin It!
            </Button>
          )}

          {gameState.showScore && !gameState.gameOver && (
            <Button
              onClick={nextRound}
              className="bg-[#87CEEB] hover:bg-[#5F9EA0] text-black hover:text-black px-8 py-2 rounded-lg text-lg font-bold"
            >
              Next Round
            </Button>
          )}

          {gameState.gameOver && (
            <Button
              onClick={restartGame}
              className="bg-[#87CEEB] hover:bg-[#5F9EA0] text-black hover:text-black px-8 py-2 rounded-lg text-lg font-bold"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          )}
        </div>

        <div className="mt-4 text-center text-gray-400">
          <p>Guess the location, and Pin it on the Map</p>
          <p className="mt-2">Play another round for 10 Points</p>
        </div>
      </main>
    </div>
  );
}

export default GameLayoutLeaflet;
