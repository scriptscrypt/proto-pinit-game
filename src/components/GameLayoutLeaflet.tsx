// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, MapPin, RefreshCw, Navigation, Flag } from "lucide-react";
// import {
//   MapContainer,
//   TileLayer,
//   Popup,
//   useMap,
//   useMapEvents,
//   Marker,
// } from "react-leaflet";
// import { divIcon, LatLng } from "leaflet";
// import { renderToStaticMarkup } from "react-dom/server";
// import "leaflet/dist/leaflet.css";

// // Types and Interfaces
// interface Location {
//   lat: number;
//   lng: number;
//   name: string;
//   hint: string;
// }

// interface GameState {
//   score: number;
//   round: number;
//   totalRounds: number;
//   gameOver: boolean;
//   currentLocation: Location | null;
//   guessedLocation: LatLng | null;
//   showScore: boolean;
// }

// interface CustomMarkerProps {
//   position: LatLng;
//   icon: React.FC<any>;
//   color: string;
//   label?: string;
//   className?: string;
// }

// interface MapClickHandlerProps {
//   onMapClick: (latlng: LatLng) => void;
// }

// interface MapCenterHandlerProps {
//   center: {
//     lat: number;
//     lng: number;
//   };
// }

// interface DistanceCalculationParams {
//   guess: LatLng;
//   actual: Location;
// }

// // Custom Marker Component
// const CustomMarker: React.FC<CustomMarkerProps> = ({
//   position,
//   icon: IconComponent,
//   color,
//   label,
//   className,
// }) => {
//   const iconMarkup = renderToStaticMarkup(
//     <div className={`relative ${className}`}>
//       <IconComponent className={`w-8 h-8 ${color}`} />
//       {label && (
//         <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 text-black text-xs px-2 py-1 rounded-full">
//           {label}
//         </span>
//       )}
//     </div>
//   );

//   const customIcon = divIcon({
//     html: iconMarkup,
//     className: "custom-marker",
//     iconSize: [32, 32],
//     iconAnchor: [16, 32],
//     popupAnchor: [0, -32],
//   });

//   return (
//     <Marker position={position} icon={customIcon}>
//       {label && <Popup>{label}</Popup>}
//     </Marker>
//   );
// };

// // Map click handler component
// const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e.latlng);
//     },
//   });
//   return null;
// };

// // Map center handler component
// const MapCenterHandler: React.FC<MapCenterHandlerProps> = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, map.getZoom());
//   }, [center, map]);
//   return null;
// };

// export function GameLayoutLeaflet(): JSX.Element {
//   const [timer, setTimer] = useState<string>("01:15");
//   const [points, setPoints] = useState<number>(11111);

//   const [gameState, setGameState] = useState<GameState>({
//     score: 0,
//     round: 1,
//     totalRounds: 5,
//     gameOver: false,
//     currentLocation: null,
//     guessedLocation: null,
//     showScore: false,
//   });

//   const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);

//   // Sample locations
//   const locations: Location[] = [
//     { lat: 48.8584, lng: 2.2945, name: "Paris", hint: "City of Light" },
//     { lat: 40.7128, lng: -74.006, name: "New York", hint: "The Big Apple" },
//     { lat: -33.8688, lng: 151.2093, name: "Sydney", hint: "Harbor City" },
//     { lat: 35.6762, lng: 139.6503, name: "Tokyo", hint: "Rising Sun" },
//     { lat: 51.5074, lng: -0.1278, name: "London", hint: "Big Ben's Home" },
//   ];

//   useEffect(() => {
//     setGameState((prev) => ({
//       ...prev,
//       currentLocation: locations[0],
//     }));
//   }, []);

//   // Game logic
//   const calculateDistance = ({ guess, actual }: DistanceCalculationParams): number => {
//     const R = 6371; // Earth's radius in km
//     const dLat = ((actual.lat - guess.lat) * Math.PI) / 180;
//     const dLon = ((actual.lng - guess.lng) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((guess.lat * Math.PI) / 180) *
//         Math.cos((actual.lat * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const handleGuess = (): void => {
//     if (!selectedPosition || !gameState.currentLocation) return;

//     const distance = calculateDistance({
//       guess: selectedPosition,
//       actual: gameState.currentLocation,
//     });
//     const points = Math.max(5000 - Math.floor(distance * 2), 0);

//     setGameState((prev) => ({
//       ...prev,
//       score: prev.score + points,
//       guessedLocation: selectedPosition,
//       showScore: true,
//       gameOver: prev.round >= prev.totalRounds,
//     }));
//   };

//   const nextRound = (): void => {
//     setGameState((prev) => ({
//       ...prev,
//       round: prev.round + 1,
//       currentLocation: locations[prev.round],
//       guessedLocation: null,
//       showScore: false,
//     }));
//     setSelectedPosition(null);
//   };

//   const restartGame = (): void => {
//     setGameState({
//       score: 0,
//       round: 1,
//       totalRounds: 5,
//       gameOver: false,
//       currentLocation: locations[0],
//       guessedLocation: null,
//       showScore: false,
//     });
//     setSelectedPosition(null);
//   };

//   const handleMapClick = (latlng: LatLng): void => {
//     if (!gameState.showScore) {
//       setSelectedPosition(latlng);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
//       <header className="flex justify-between items-center p-4 bg-[#0a0a0a]">
//         <div className="text-2xl font-bold">proto</div>
//         <nav className="space-x-4">
//           <Button
//             variant="ghost"
//             className="text-white hover:text-white hover:bg-[#1a1a1a]"
//           >
//             Profile
//           </Button>
//           <Button
//             variant="ghost"
//             className="text-white hover:text-white hover:bg-[#1a1a1a]"
//           >
//             How to Play?
//           </Button>
//           <Button
//             variant="ghost"
//             className="text-white hover:text-white hover:bg-[#1a1a1a]"
//           >
//             Leaderboard
//           </Button>
//         </nav>
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <Input
//               type="text"
//               placeholder="Maps, Mappers & More"
//               className="pl-8 bg-[#1a1a1a] text-white border-none focus:ring-1 focus:ring-[#87CEEB]"
//             />
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//           </div>
//           <div className="flex items-center space-x-2 bg-[#1a1a1a] px-3 py-1 rounded-full">
//             <span>{points} P</span>
//             <div className="w-6 h-6 bg-[#87CEEB] rounded-full"></div>
//           </div>
//         </div>
//       </header>

//       <main className="p-4">
//         <div className="flex justify-between mb-4">
//           <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">Guess Mode</div>
//           <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">{timer}</div>
//           <div className="bg-white text-black px-4 py-2 rounded-lg">
//             Round {gameState.round}/5
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
//             <div className="w-full h-full flex items-center justify-center">
//               <div className="text-xl font-bold">
//                 {gameState.currentLocation?.hint || "Loading..."}
//               </div>
//             </div>
//           </div>
//           <div className="aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
//             <MapContainer
//               center={[20, 0]}
//               zoom={2}
//               className="w-full h-full"
//               style={{ background: "#1a1a1a" }}
//             >
//               <TileLayer
//                 attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <MapClickHandler onMapClick={handleMapClick} />

//               {selectedPosition && !gameState.showScore && (
//                 <CustomMarker
//                   position={selectedPosition}
//                   icon={Navigation}
//                   color="text-blue-500"
//                   label="Your guess"
//                   className="animate-bounce"
//                 />
//               )}

//               {gameState.showScore && (
//                 <>
//                   <CustomMarker
//                     position={gameState?.guessedLocation as LatLng}
//                     icon={Navigation}
//                     color="text-blue-500"
//                     label="Your guess"
//                   />
//                   <CustomMarker
//                     position={new LatLng(
//                       gameState.currentLocation?.lat || 0,
//                       gameState.currentLocation?.lng || 0
//                     )}
//                     icon={Flag}
//                     color="text-green-500"
//                     label={gameState.currentLocation?.name}
//                   />
//                 </>
//               )}
//             </MapContainer>
//           </div>
//         </div>

//         {/* Game Controls */}
//         <div className="mt-4 flex justify-center">
//           {!gameState.showScore && !gameState.gameOver && (
//             <Button
//               className="bg-[#87CEEB] hover:bg-[#5F9EA0] text-black hover:text-black px-8 py-2 rounded-lg text-lg font-bold"
//               onClick={handleGuess}
//               disabled={!selectedPosition}
//             >
//               <MapPin className="mr-2 h-5 w-5" />
//               Pin It!
//             </Button>
//           )}

//           {gameState.showScore && !gameState.gameOver && (
//             <Button
//               onClick={nextRound}
//               className="bg-[#87CEEB] hover:bg-[#5F9EA0] text-black hover:text-black px-8 py-2 rounded-lg text-lg font-bold"
//             >
//               Next Round
//             </Button>
//           )}

//           {gameState.gameOver && (
//             <Button
//               onClick={restartGame}
//               className="bg-[#87CEEB] hover:bg-[#5F9EA0] text-black hover:text-black px-8 py-2 rounded-lg text-lg font-bold"
//             >
//               <RefreshCw className="mr-2 h-5 w-5" />
//               Play Again
//             </Button>
//           )}
//         </div>

//         <div className="mt-4 text-center text-gray-400">
//           <p>Guess the location, and Pin it on the Map</p>
//           <p className="mt-2">Play another round for 10 Points</p>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default GameLayoutLeaflet;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import { divIcon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Flag,
  Loader,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

// Types and Interfaces
interface Location {
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

// Sample locations as a constant outside the component
const GAME_LOCATIONS: Location[] = [
  { lat: 48.8584, lng: 2.2945, name: "Paris", hint: "City of Light" },
  { lat: 40.7128, lng: -74.006, name: "New York", hint: "The Big Apple" },
  { lat: -33.8688, lng: 151.2093, name: "Sydney", hint: "Harbor City" },
  { lat: 35.6762, lng: 139.6503, name: "Tokyo", hint: "Rising Sun" },
  { lat: 51.5074, lng: -0.1278, name: "London", hint: "Big Ben's Home" },
];

export function GameLayoutLeaflet(): JSX.Element {
  const [isClient, setIsClient] = useState(false);
  const { solSignature, fnTriggerSignature } = useAuth();

  // Removed unused state
  const [points] = useState<number>(11111);

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

  // Initialize game
  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      currentLocation: GAME_LOCATIONS[0],
    }));
  }, []); // Empty dependency array as GAME_LOCATIONS is constant

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

  const handleGuess = useCallback((): void => {
    if (!selectedPosition || !gameState.currentLocation) return;

    const distance = calculateDistance({
      guess: selectedPosition,
      actual: gameState.currentLocation,
    });
    const points = Math.max(5000 - Math.floor(distance * 2), 0);

    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      guessedLocation: selectedPosition,
      showScore: true,
      gameOver: prev.round >= prev.totalRounds,
    }));
  }, [
    selectedPosition,
    gameState.currentLocation,
    // gameState.round,
    calculateDistance,
  ]);

  const nextRound = useCallback((): void => {
    setGameState((prev) => ({
      ...prev,
      round: prev.round + 1,
      currentLocation: GAME_LOCATIONS[prev.round],
      guessedLocation: null,
      showScore: false,
    }));
    setSelectedPosition(null);
  }, []);

  const restartGame = useCallback((): void => {
    setGameState({
      score: 0,
      round: 1,
      totalRounds: 5,
      gameOver: false,
      currentLocation: GAME_LOCATIONS[0],
      guessedLocation: null,
      showScore: false,
    });
    setSelectedPosition(null);
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
          {!solSignature && <UnifiedWalletButton />}
          {!solSignature && (
            <Button onClick={() => fnTriggerSignature("Test Login")}>
              Login
            </Button>
          )}
          {solSignature && (
            <>
              <div className="flex items-center space-x-2 bg-[#1a1a1a] px-3 py-1 rounded-full">
                <span>{points} P</span>
                <div className="w-6 h-6 bg-[#87CEEB] rounded-full"></div>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="p-4">
        <div className="flex justify-between mb-4">
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">Guess Mode</div>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg">01:15</div>
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
