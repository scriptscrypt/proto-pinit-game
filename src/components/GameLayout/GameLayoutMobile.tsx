// // components/GameLayoutMobile.tsx
// "use client";

// import { Flag, Loader, MapPin, Navigation, RefreshCw, X } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";
// import { divIcon, LatLng } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { renderToStaticMarkup } from "react-dom/server";
// import {
//   MapContainer,
//   Marker,
//   Polyline,
//   Popup,
//   TileLayer,
//   useMapEvents,
// } from "react-leaflet";
// import { useAuth } from "@/hooks/useAuth";
// import { useGame } from "@/hooks/useGame";
// import { Button } from "@/components/ui/button";
// import { mapService } from "@/services/apis/be/mapService";
// import dynamic from "next/dynamic";

// // Dynamically import Leaflet components
// const MapDynamic = dynamic(
//   () => import("@/components/maps/Map"), // We'll create this wrapper component
//   { ssr: false }
// );

// interface Location {
//   lat: number;
//   lng: number;
//   name: string;
//   hint: string;
//   url?: string;
// }

// interface GameState {
//   score: number;
//   round: number;
//   totalRounds: number;
//   gameOver: boolean;
//   currentLocation: Location | null;
//   guessedLocation: LatLng | null;
//   showScore: boolean;
//   loading: boolean;
//   error: string | null;
// }

// interface HowToPlayModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface MapClickHandlerProps {
//   onMapClick: (latlng: LatLng) => void;
// }

// interface CustomMarkerProps {
//   position: LatLng;
//   icon: React.FC<any>;
//   color: string;
//   label?: string;
//   className?: string;
// }

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

// const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e.latlng);
//     },
//   });
//   return null;
// };

// const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-end touch-none">
//       <div className="bg-[#1a1a1a] w-full rounded-t-3xl p-6 text-white animate-slide-up">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Points</h2>
//           <button onClick={onClose} className="p-2">
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-[#2a2a2a] rounded-xl p-4">
//               <div className="relative h-32">
//                 <div className="absolute inset-0 bg-gray-800 rounded-lg overflow-hidden">
//                   <div className="h-full w-full bg-gray-700" />
//                 </div>
//                 <div className="absolute bottom-2 left-2 bg-[#FFB800] text-black rounded-full px-3 py-1 text-sm font-medium">
//                   + 100 points
//                 </div>
//                 <div className="absolute bottom-2 right-2 bg-green-500/20 rounded-full p-2">
//                   <div className="w-4 h-4 bg-green-500 rounded-full" />
//                 </div>
//                 <div className="absolute top-2 left-2 text-sm font-medium">
//                   50km
//                 </div>
//               </div>
//             </div>
//             <div className="bg-[#2a2a2a] rounded-xl p-4">
//               <div className="relative h-32">
//                 <div className="absolute inset-0 bg-gray-800 rounded-lg overflow-hidden">
//                   <div className="h-full w-full bg-gray-700" />
//                 </div>
//                 <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-medium">
//                   - 100 points
//                 </div>
//                 <div className="absolute bottom-2 right-2 bg-red-500/20 rounded-full p-2">
//                   <div className="w-4 h-4 bg-red-500 rounded-full" />
//                 </div>
//                 <div className="absolute top-2 left-2 text-sm font-medium">
//                   120km
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-start gap-3">
//               <div className="rounded-full bg-green-500/20 p-2 mt-1">
//                 <div className="w-3 h-3 bg-green-500 rounded-full" />
//               </div>
//               <p className="text-gray-400">
//                 Each correct guess within 100km gives you 100 points.
//               </p>
//             </div>
//             <div className="flex items-start gap-3">
//               <div className="rounded-full bg-red-500/20 p-2 mt-1">
//                 <div className="w-3 h-3 bg-red-500 rounded-full" />
//               </div>
//               <p className="text-gray-400">
//                 For each wrong guess beyond 100km, you lose 100 points.
//               </p>
//             </div>
//           </div>

//           <div>
//             <p className="text-[#FFB800]">Are you ready?</p>
//             <button
//               onClick={onClose}
//               className="w-full bg-[#00A3FF] text-white rounded-lg py-4 mt-4 font-medium"
//             >
//               Start
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export function GameLayoutMobile(): JSX.Element {
//   const [showHowToPlay, setShowHowToPlay] = useState(true);
//   const { signedInEmail, setSignedInEmail } = useAuth();
//   const { currentGameId, fnStartNewGame, fnSubmitGuess, fnCompleteGame } =
//     useGame(signedInEmail || "");

//   const [gameState, setGameState] = useState<GameState>({
//     score: 0,
//     round: 1,
//     totalRounds: 5,
//     gameOver: false,
//     currentLocation: null,
//     guessedLocation: null,
//     showScore: false,
//     loading: true,
//     error: null,
//   });

//   const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);

//   const getRandomLocation = async () => {
//     try {
//       setGameState((prev) => ({ ...prev, loading: true, error: null }));

//       // Generate random coordinates
//       const lat = Math.random() * 180 - 90;
//       const lng = Math.random() * 360 - 180;

//       const response = await mapService.apiGetFrames(lat, lng);

//       return {
//         lat: response.location.latitude,
//         lng: response.location.longitude,
//         name: "Location",
//         hint: "Where is this?",
//         url: response.url,
//       };
//     } catch (error) {
//       console.error("Failed to fetch location", error);
//       setGameState((prev) => ({
//         ...prev,
//         error: "Failed to load location",
//         loading: false,
//       }));
//       return null;
//     }
//   };

//   // Initialize game
//   useEffect(() => {
//     const initGame = async () => {
//       const email = localStorage.getItem("userEmail");
//       if (email) {
//         setSignedInEmail(email);
//         await fnStartNewGame();

//         const location = await getRandomLocation();
//         if (location) {
//           setGameState((prev) => ({
//             ...prev,
//             currentLocation: location,
//             loading: false,
//           }));
//         }
//       }
//     };

//     initGame();
//   }, [fnStartNewGame, setSignedInEmail]);

//   const calculateDistance = useCallback(
//     (guess: LatLng, actual: Location): number => {
//       const R = 6371;
//       const dLat = ((actual.lat - guess.lat) * Math.PI) / 180;
//       const dLon = ((actual.lng - guess.lng) * Math.PI) / 180;
//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos((guess.lat * Math.PI) / 180) *
//           Math.cos((actual.lat * Math.PI) / 180) *
//           Math.sin(dLon / 2) *
//           Math.sin(dLon / 2);
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       return R * c;
//     },
//     []
//   );

//   const handleMapClick = useCallback(
//     (latlng: LatLng): void => {
//       if (!gameState.showScore) {
//         setSelectedPosition(latlng);
//       }
//     },
//     [gameState.showScore]
//   );

//   const handleGuess = useCallback(async (): Promise<void> => {
//     if (!selectedPosition || !gameState.currentLocation) return;

//     const distance = calculateDistance(
//       selectedPosition,
//       gameState.currentLocation
//     );
//     const points = Math.max(5000 - Math.floor(distance * 2), 0);

//     await fnSubmitGuess({
//       roundNumber: gameState.round,
//       guessLocation: selectedPosition,
//       targetLocation: {
//         lat: gameState.currentLocation.lat,
//         lng: gameState.currentLocation.lng,
//         name: gameState.currentLocation.name,
//       },
//       score: points,
//       distance,
//     });

//     setGameState((prev) => ({
//       ...prev,
//       score: prev.score + points,
//       guessedLocation: selectedPosition,
//       showScore: true,
//       gameOver: prev.round >= prev.totalRounds,
//     }));
//   }, [selectedPosition, gameState, fnSubmitGuess, calculateDistance]);

//   const nextRound = useCallback(async (): Promise<void> => {
//     const newLocation = await getRandomLocation();
//     if (newLocation) {
//       setGameState((prev) => ({
//         ...prev,
//         round: prev.round + 1,
//         currentLocation: newLocation,
//         guessedLocation: null,
//         showScore: false,
//         loading: false,
//       }));
//       setSelectedPosition(null);
//     }
//   }, []);

//   const restartGame = useCallback(async (): Promise<void> => {
//     const firstLocation = await getRandomLocation();
//     if (firstLocation) {
//       setGameState({
//         score: 0,
//         round: 1,
//         totalRounds: 5,
//         gameOver: false,
//         currentLocation: firstLocation,
//         guessedLocation: null,
//         showScore: false,
//         loading: false,
//         error: null,
//       });
//       setSelectedPosition(null);
//     }
//   }, []);

//   if (gameState.loading) {
//     return (
//       <div className="h-screen bg-black flex items-center justify-center">
//         <Loader className="animate-spin text-white" />
//       </div>
//     );
//   }

//   if (gameState.error) {
//     return (
//       <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
//         <p className="text-red-500 mb-4">{gameState.error}</p>
//         <Button onClick={restartGame}>Try Again</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-screen bg-black">
//       {/* Game Image */}
//       <div className="h-1/2">
//         {gameState.currentLocation?.url ? (
//           <img
//             src={gameState.currentLocation.url}
//             alt="Location to guess"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-white">
//             Loading location...
//           </div>
//         )}
//       </div>

//       {/* Map Section */}
//       <div className="h-1/2 relative">
//         {/* Round and Score Overlay */}
//         <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
//           <div className="bg-white rounded-full px-3 py-1 text-sm font-medium">
//             {gameState.round}/5
//           </div>
//           <div className="bg-[#FFB800] rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
//             <span className="text-xs">+</span> {gameState.score}
//           </div>
//         </div>

//         {/* Map Container
//         <MapContainer
//           center={[20, 0]}
//           zoom={2}
//           className="w-full h-full"
//           style={{ background: "#1a1a1a" }}
//         >
//           <TileLayer
//             attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <MapClickHandler onMapClick={handleMapClick} />

//           {selectedPosition && !gameState.showScore && (
//             <CustomMarker
//               position={selectedPosition}
//               icon={Navigation}
//               color="text-blue-500"
//               label="Your guess"
//               className="animate-bounce"
//             />
//           )}

//           {gameState.showScore && gameState.guessedLocation && (
//             <>
//               <CustomMarker
//                 position={gameState.guessedLocation}
//                 icon={Navigation}
//                 color="text-blue-500"
//                 label="Your guess"
//               />
//               {gameState.currentLocation && (
//                 <CustomMarker
//                   position={
//                     new LatLng(
//                       gameState.currentLocation.lat,
//                       gameState.currentLocation.lng
//                     )
//                   }
//                   icon={Flag}
//                   color="text-green-500"
//                   label={gameState.currentLocation.name}
//                 />
//               )}
//             </>
//           )}
//         </MapContainer> */}

//         <MapDynamic
//           center={[20, 0]}
//           zoom={2}
//           onMapClick={handleMapClick}
//           selectedPosition={selectedPosition}
//           showScore={gameState.showScore}
//           guessedLocation={gameState.guessedLocation}
//           currentLocation={gameState.currentLocation}
//         />
//         {/* Bottom Button */}
//         <div className="absolute bottom-8 left-4 right-4">
//           {!gameState.showScore && !gameState.gameOver && (
//             <button
//               onClick={handleGuess}
//               disabled={!selectedPosition}
//               className="w-full bg-black text-white rounded-xl py-4 font-medium disabled:opacity-50"
//             >
//               <MapPin className="inline-block mr-2 h-5 w-5" />
//               Pin It!
//             </button>
//           )}

//           {gameState.showScore && !gameState.gameOver && (
//             <ResultsModal
//               isVisible={true}
//               distance={
//                 gameState.guessedLocation && gameState.currentLocation
//                   ? calculateDistance(
//                       gameState.guessedLocation,
//                       gameState.currentLocation
//                     )
//                   : 0
//               }
//               points={
//                 gameState.guessedLocation && gameState.currentLocation
//                   ? Math.max(
//                       5000 -
//                         Math.floor(
//                           calculateDistance(
//                             gameState.guessedLocation,
//                             gameState.currentLocation
//                           ) * 2
//                         ),
//                       0
//                     )
//                   : 0
//               }
//               onNextRound={nextRound}
//               guessLocation={gameState.guessedLocation}
//               actualLocation={gameState.currentLocation}
//             />
//           )}

//           {gameState.gameOver && (
//             <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
//               <div className="bg-[#1a1a1a] w-full max-w-md rounded-3xl p-6 animate-slide-up">
//                 <h2 className="text-2xl font-bold text-white text-center mb-4">
//                   Game Over!
//                 </h2>
//                 <div className="space-y-4 mb-6">
//                   <div className="bg-[#2a2a2a] rounded-xl p-4">
//                     <p className="text-white text-center">
//                       Final Score:{" "}
//                       <span className="text-[#FFB800] font-bold">
//                         {gameState.score}
//                       </span>
//                     </p>
//                     <p className="text-gray-400 text-center text-sm mt-2">
//                       Average Score:{" "}
//                       {Math.round(gameState.score / gameState.totalRounds)}{" "}
//                       points per round
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={restartGame}
//                   className="w-full bg-[#00A3FF] text-white rounded-xl py-4 font-medium text-lg flex items-center justify-center gap-2"
//                 >
//                   <RefreshCw className="h-5 w-5" />
//                   Play Again
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* How to Play Modal */}
//       <HowToPlayModal
//         isOpen={showHowToPlay}
//         onClose={() => setShowHowToPlay(false)}
//       />

//       {/* Loading Overlay */}
//       {gameState.loading && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
//           <div className="flex flex-col items-center gap-4">
//             <Loader className="h-8 w-8 animate-spin text-[#00A3FF]" />
//             <p className="text-white">Loading next location...</p>
//           </div>
//         </div>
//       )}

//       {/* Error Overlay */}
//       {gameState.error && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
//           <div className="bg-[#1a1a1a] w-full max-w-md rounded-3xl p-6">
//             <p className="text-red-500 text-center mb-4">{gameState.error}</p>
//             <button
//               onClick={restartGame}
//               className="w-full bg-[#00A3FF] text-white rounded-xl py-4 font-medium"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// interface ResultsModalProps {
//   isVisible: boolean;
//   distance: number;
//   points: number;
//   onNextRound: () => void;
//   guessLocation: LatLng | null;
//   actualLocation: Location | null;
// }

// const ResultsModal: React.FC<ResultsModalProps> = ({
//   isVisible,
//   distance,
//   points,
//   onNextRound,
//   guessLocation,
//   actualLocation,
// }) => {
//   if (!isVisible || !guessLocation || !actualLocation) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60">
//       <div className="bg-[#1a1a1a] w-full max-w-md rounded-3xl overflow-hidden animate-slide-up">
//         {/* Map Result */}
//         <div className="h-[200px] relative">
//           <MapContainer
//             center={[
//               (guessLocation.lat + actualLocation.lat) / 2,
//               (guessLocation.lng + actualLocation.lng) / 2,
//             ]}
//             zoom={5}
//             className="w-full h-full"
//             zoomControl={false}
//             attributionControl={false}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             {/* Your guess marker */}
//             <CustomMarker
//               position={guessLocation}
//               icon={Navigation}
//               color="text-red-500"
//             />
//             {/* Actual location marker */}
//             <CustomMarker
//               position={new LatLng(actualLocation.lat, actualLocation.lng)}
//               icon={Flag}
//               color="text-blue-500"
//             />
//             {/* Line between markers */}
//             <Polyline
//               positions={[
//                 [guessLocation.lat, guessLocation.lng],
//                 [actualLocation.lat, actualLocation.lng],
//               ]}
//               dashArray={[10, 10]}
//               color="#fff"
//               weight={2}
//             />
//           </MapContainer>
//         </div>

//         {/* Results Content */}
//         <div className="p-6 space-y-6">
//           {/* Distance */}
//           <div className="text-center">
//             <p className="text-white text-lg">
//               You were{" "}
//               <span
//                 className={distance <= 100 ? "text-green-400" : "text-red-400"}
//               >
//                 {Math.round(distance)} km away
//               </span>{" "}
//               from the spot.
//             </p>
//           </div>

//           {/* Points */}
//           <div className="text-center space-y-2">
//             <p className="text-white text-lg">You earned</p>
//             <div className="inline-block bg-[#FFB800] rounded-full px-4 py-1.5">
//               <div className="flex items-center gap-1">
//                 <span className="text-xs">+</span>
//                 <span className="font-medium">{points} points</span>
//               </div>
//             </div>
//           </div>

//           {/* Next Round Button */}
//           <button
//             onClick={onNextRound}
//             className="w-full bg-[#00A3FF] text-white rounded-xl py-4 font-medium text-lg"
//           >
//             Next Round
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameLayoutMobile;


// components/GameLayout/GameLayoutMobile.tsx
"use client";

import { Flag, Loader, MapPin, Navigation, RefreshCw, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { LatLng } from "leaflet";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";

import dynamic from "next/dynamic";
import { mapService } from "@/services/apis/be/mapService";

// Dynamically import map with loading state
const GameMap = dynamic(
  () => import("@/components/maps/GameMap"), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
        <Loader className="animate-spin text-white" />
      </div>
    )
  }
);

export interface Location {
  lat: number;
  lng: number;
  name: string;
  hint: string;
  url?: string;
}

export interface GameState {
  score: number;
  round: number;
  totalRounds: number;
  gameOver: boolean;
  currentLocation: Location | null;
  guessedLocation: LatLng | null;
  showScore: boolean;
  loading: boolean;
  error: string | null;
}

export default function GameLayoutMobile() {
  const { signedInEmail } = useAuth();
  const { currentGameId, fnStartNewGame, fnSubmitGuess, fnCompleteGame } = useGame(signedInEmail || "");
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    round: 1,
    totalRounds: 5,
    gameOver: false,
    currentLocation: null,
    guessedLocation: null,
    showScore: false,
    loading: true,
    error: null,
  });

  const initGame = useCallback(async () => {
    try {
      if (signedInEmail) {
        await fnStartNewGame();
        const lat = Math.random() * 180 - 90;
        const lng = Math.random() * 360 - 180;
        const response = await mapService.apiGetFrames(lat, lng);
        
        setGameState(prev => ({
          ...prev,
          currentLocation: {
            lat: response.location.latitude,
            lng: response.location.longitude,
            name: "Location",
            hint: "Where is this?",
            url: response.url
          },
          loading: false
        }));
      }
    } catch (error) {
      console.error("Failed to initialize game:", error);
      setGameState(prev => ({
        ...prev,
        error: "Failed to load location",
        loading: false
      }));
    }
  }, [signedInEmail, fnStartNewGame]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleMapClick = useCallback((latlng: LatLng) => {
    if (!gameState.showScore) {
      setSelectedPosition(latlng);
    }
  }, [gameState.showScore]);

  const handleGuess = useCallback(async () => {
    if (!selectedPosition || !gameState.currentLocation) return;

    // Calculate distance and points
    const R = 6371; // Earth's radius in km
    const dLat = ((gameState.currentLocation.lat - selectedPosition.lat) * Math.PI) / 180;
    const dLon = ((gameState.currentLocation.lng - selectedPosition.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((selectedPosition.lat * Math.PI) / 180) *
      Math.cos((gameState.currentLocation.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const points = Math.max(5000 - Math.floor(distance * 2), 0);

    // Update state
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      guessedLocation: selectedPosition,
      showScore: true,
      gameOver: prev.round >= prev.totalRounds
    }));

    // Save to backend
    await fnSubmitGuess({
      roundNumber: gameState.round,
      guessLocation: selectedPosition,
      targetLocation: {
        lat: gameState.currentLocation.lat,
        lng: gameState.currentLocation.lng,
        name: gameState.currentLocation.name,
      },
      score: points,
      distance,
    });
  }, [selectedPosition, gameState, fnSubmitGuess]);

  const handleNextRound = useCallback(async () => {
    try {
      setGameState(prev => ({ ...prev, loading: true }));
      const lat = Math.random() * 180 - 90;
      const lng = Math.random() * 360 - 180;
      const response = await mapService.apiGetFrames(lat, lng);
      
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
        currentLocation: {
          lat: response.location.latitude,
          lng: response.location.longitude,
          name: "Location",
          hint: "Where is this?",
          url: response.url
        },
        guessedLocation: null,
        showScore: false,
        loading: false
      }));
      setSelectedPosition(null);
    } catch (error) {
      console.error("Failed to load next round:", error);
      setGameState(prev => ({
        ...prev,
        error: "Failed to load next location",
        loading: false
      }));
    }
  }, []);

  const handleRestart = useCallback(async () => {
    await fnCompleteGame();
    initGame();
  }, [fnCompleteGame, initGame]);

  if (gameState.loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      {/* Image Section */}
      <div className="h-1/2 relative">
        {gameState.currentLocation?.url ? (
          <img
            src={gameState.currentLocation.url}
            alt="Guess the location"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <p className="text-white">Loading location...</p>
          </div>
        )}
        
        {/* Score Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="bg-white rounded-full px-3 py-1 text-sm font-medium">
            {gameState.round}/5
          </div>
          <div className="bg-[#FFB800] rounded-full px-3 py-1 text-sm font-medium">
            {gameState.score} pts
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-1/2 relative">
        <GameMap
          center={[20, 0]}
          zoom={2}
          onMapClick={handleMapClick}
          selectedPosition={selectedPosition}
          showScore={gameState.showScore}
          guessedLocation={gameState.guessedLocation}
          currentLocation={gameState.currentLocation}
        />

        {/* Action Button */}
        <div className="absolute bottom-8 left-4 right-4">
          {!gameState.showScore && !gameState.gameOver && (
            <button
              onClick={handleGuess}
              disabled={!selectedPosition}
              className="w-full bg-black text-white rounded-xl py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pin it!
            </button>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {gameState.showScore && !gameState.gameOver && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="bg-[#1a1a1a] w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="space-y-6">
              <button
                onClick={handleNextRound}
                className="w-full bg-[#00A3FF] text-white rounded-xl py-4 font-medium"
              >
                Next Round
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState.gameOver && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] w-full max-w-md rounded-3xl p-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Game Over!
            </h2>
            <p className="text-white text-center mb-6">
              Final Score: {gameState.score}
            </p>
            <button
              onClick={handleRestart}
              className="w-full bg-[#00A3FF] text-white rounded-xl py-4 font-medium"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="bg-[#1a1a1a] w-full rounded-t-3xl p-6 animate-slide-up">
            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full bg-[#00A3FF] text-white rounded-xl py-4 font-medium"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}