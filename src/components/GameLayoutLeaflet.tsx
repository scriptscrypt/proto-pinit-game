"use client";

import { Button } from "@/components/ui/button";
import { NavbarComp } from "@/components/navbar/NavbarComp";
import { divIcon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Flag, Loader, MapPin, Navigation, RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { mapService } from "@/services/apis/be/mapService";

// Types and Interfaces
interface Location {
  url: string | undefined;
  lat: number;
  lng: number;
  name: string;
  hint: string;
}

interface GameState {
  score: number;
  round: number;
  totalRounds: number;
  gameOver: boolean;
  currentLocation: Location | null;
  guessedLocation: LatLng | null;
  showScore: boolean;
}

interface CustomMarkerProps {
  position: LatLng;
  icon: React.FC<any>;
  color: string;
  label?: string;
  className?: string;
}

interface MapClickHandlerProps {
  onMapClick: (latlng: LatLng) => void;
}

interface DistanceCalculationParams {
  guess: LatLng;
  actual: Location;
}

// Custom Marker Component
const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  icon: IconComponent,
  color,
  label,
  className,
}) => {
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
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Previous Logic :
// Sample locations as a constant outside the component
const GAME_LOCATIONS: Location[] = [
  { lat: 48.8584, lng: 2.2945, name: "Paris", hint: "City of Light", url: "" },
  {
    lat: 40.7128,
    lng: -74.006,
    name: "New York",
    hint: "The Big Apple",
    url: "",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    name: "Sydney",
    hint: "Harbor City",
    url: "",
  },
  { lat: 35.6762, lng: 139.6503, name: "Tokyo", hint: "Rising Sun", url: "" },
  {
    lat: 51.5074,
    lng: -0.1278,
    name: "London",
    hint: "Big Ben's Home",
    url: "",
  },
];

export function GameLayoutLeaflet(): JSX.Element {
  const [isClient, setIsClient] = useState(false);
  // const { solSignature, fnTriggerSignature, solConnected } = useAuth();

  const { signedInEmail, setSignedInEmail } = useAuth(); // Get current user
  const { currentGameId, fnStartNewGame, fnSubmitGuess, fnCompleteGame } =
    useGame(signedInEmail || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get a random location
  // We might want to have an api for this / set static longitude and latitude for user to guess.
  const getRandomLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate random coordinates
      const lat = Math.random() * 180 - 90; // Random latitude between -90 and 90
      const lng = Math.random() * 360 - 180; // Random longitude between -180 and 180

      const response = await mapService.apiGetFrames(lat, lng);

      return {
        lat: response.location.latitude,
        lng: response.location.longitude,
        name: "Location", // You might want to add a way to get location names
        hint: "Where is this?", // You might want to add hints based on the location
        url: response.url,
      };
    } catch (error) {
      console.error("Failed to fetch location", error);
      setError("Failed to load location");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize game
  useEffect(() => {
    const initGame = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        setSignedInEmail(email);
        await fnStartNewGame();

        // Get initial location
        const location = await getRandomLocation();
        if (location) {
          setGameState((prev) => ({
            ...prev,
            currentLocation: location,
          }));
        }
      }
    };

    initGame();
  }, [fnStartNewGame, setSignedInEmail]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    round: 1,
    totalRounds: 5,
    gameOver: false,
    currentLocation: null,
    guessedLocation: null,
    showScore: false,
  });
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);

  // Modify game completion to save to database
  useEffect(() => {
    if (gameState.gameOver && currentGameId) {
      fnCompleteGame();
    }
  }, [gameState.gameOver, currentGameId, fnCompleteGame]);

  // Game logic
  const calculateDistance = useCallback(
    ({ guess, actual }: DistanceCalculationParams): number => {
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
    },
    []
  );

  const handleGuess = useCallback(async (): Promise<void> => {
    if (!selectedPosition || !gameState.currentLocation) return;

    const distance = calculateDistance({
      guess: selectedPosition,
      actual: gameState.currentLocation,
    });
    const points = Math.max(5000 - Math.floor(distance * 2), 0);

    // Save guess to database
    await {
      roundNumber: gameState.round,
      guessLocation: selectedPosition,
      targetLocation: {
        lat: gameState.currentLocation.lat,
        lng: gameState.currentLocation.lng,
        name: gameState.currentLocation.name,
      },
      score: points,
      distance,
    };

    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      guessedLocation: selectedPosition,
      showScore: true,
      gameOver: prev.round >= prev.totalRounds,
    }));
  }, [selectedPosition, gameState, fnSubmitGuess, calculateDistance]);

  // Modified nextRound to get new location from API
  const nextRound = useCallback(async (): Promise<void> => {
    const newLocation = await getRandomLocation();
    if (newLocation) {
      setGameState((prev) => ({
        ...prev,
        round: prev.round + 1,
        currentLocation: newLocation,
        guessedLocation: null,
        showScore: false,
      }));
      setSelectedPosition(null);
    }
  }, []);

  // Modified restartGame to get new location from API
  const restartGame = useCallback(async (): Promise<void> => {
    const firstLocation = await getRandomLocation();
    if (firstLocation) {
      setGameState({
        score: 0,
        round: 1,
        totalRounds: 5,
        gameOver: false,
        currentLocation: firstLocation,
        guessedLocation: null,
        showScore: false,
      });
      setSelectedPosition(null);
    }
  }, []);

  const handleMapClick = useCallback(
    (latlng: LatLng): void => {
      if (!gameState.showScore) {
        setSelectedPosition(latlng);
      }
    },
    [gameState.showScore]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />; // or a loading state
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      <NavbarComp />

      <main className="p-4">
        <div className="flex justify-between mb-4">
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">Guess Mode</div>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">01:15</div>
          <div className="bg-white text-black px-4 py-2 rounded-lg">
            Round {gameState.round}/5
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4"> */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-[48%] aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {gameState.currentLocation?.url ? (
                  <img
                    src={gameState.currentLocation.url}
                    alt="Guess this location"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl font-bold">
                    {gameState.currentLocation?.hint || "Loading..."}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="md:w-[48%] aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden z-30">
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

              {gameState.showScore && gameState.guessedLocation && (
                <>
                  <CustomMarker
                    position={gameState.guessedLocation}
                    icon={Navigation}
                    color="text-blue-500"
                    label="Your guess"
                  />
                  {gameState.currentLocation && (
                    <CustomMarker
                      position={
                        new LatLng(
                          gameState.currentLocation?.lat || 0,
                          gameState.currentLocation?.lng || 0
                        )
                      }
                      icon={Flag}
                      color="text-green-500"
                      label={gameState.currentLocation?.name}
                    />
                  )}
                </>
              )}
            </MapContainer>
          </div>
        </div>

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

        {gameState.showScore &&
          gameState.guessedLocation &&
          gameState.currentLocation && (
            <div className="mt-4 text-center bg-[#1a1a1a] p-4 rounded-lg animate-fadeIn">
              <p className="text-lg font-semibold mb-2">
                Distance:{" "}
                {calculateDistance({
                  guess: gameState.guessedLocation,
                  actual: gameState.currentLocation,
                }).toFixed(1)}{" "}
                km
              </p>
              <p className="text-xl font-bold">
                Points this round:{" "}
                {Math.max(
                  5000 -
                    Math.floor(
                      calculateDistance({
                        guess: gameState.guessedLocation,
                        actual: gameState.currentLocation,
                      }) * 2
                    ),
                  0
                )}
              </p>
            </div>
          )}

        {gameState.gameOver && (
          <div className="mt-4 text-center bg-[#1a1a1a] p-6 rounded-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Game Over!</h3>
            <p className="text-lg mb-2">Final Score: {gameState.score}</p>
            <p className="text-sm text-gray-400">
              Average Score:{" "}
              {Math.round(gameState.score / gameState.totalRounds)} points per
              round
            </p>
          </div>
        )}

        <div className="mt-4 text-center text-gray-400">
          <p>Guess the location, and Pin it on the Map</p>
          <p className="mt-2">Play another round for 10 Points</p>
        </div>
      </main>
    </div>
  );
}

export default GameLayoutLeaflet;
