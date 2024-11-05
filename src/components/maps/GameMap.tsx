// // components/Map/Map.tsx
// "use client";

// import { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import { LatLng, divIcon } from "leaflet";
// import { renderToStaticMarkup } from "react-dom/server";
// import { Flag, Navigation } from "lucide-react";
// import "leaflet/dist/leaflet.css";

// interface Location {
//   lat: number;
//   lng: number;
//   name: string;
//   hint: string;
//   url?: string;
// }

// interface MapProps {
//   center: [number, number];
//   zoom: number;
//   onMapClick: (latlng: LatLng) => void;
//   selectedPosition: LatLng | null;
//   showScore: boolean;
//   guessedLocation: LatLng | null;
//   currentLocation: Location | null;
//   className?: string;
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

// const MapClickHandler: React.FC<{ onMapClick: (latlng: LatLng) => void }> = ({ onMapClick }) => {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e.latlng);
//     },
//   });
//   return null;
// };

// const Map = ({
//   center,
//   zoom,
//   onMapClick,
//   selectedPosition,
//   showScore,
//   guessedLocation,
//   currentLocation,
//   className = "w-full h-full"
// }: MapProps) => {
//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       className={className}
//       style={{ background: "#1a1a1a" }}
//     >
//       <TileLayer
//         attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <MapClickHandler onMapClick={onMapClick} />

//       {selectedPosition && !showScore && (
//         <CustomMarker
//           position={selectedPosition}
//           icon={Navigation}
//           color="text-blue-500"
//           label="Your guess"
//           className="animate-bounce"
//         />
//       )}

//       {showScore && guessedLocation && (
//         <>
//           <CustomMarker
//             position={guessedLocation}
//             icon={Navigation}
//             color="text-blue-500"
//             label="Your guess"
//           />
//           {currentLocation && (
//             <CustomMarker
//               position={new LatLng(currentLocation.lat, currentLocation.lng)}
//               icon={Flag}
//               color="text-green-500"
//               label={currentLocation.name}
//             />
//           )}
//         </>
//       )}
//     </MapContainer>
//   );
// };

// export default Map;

// components/Map/GameMap.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L, { LatLng, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "@/components/GameLayout/GameLayoutMobile";

interface GameMapProps {
  center: [number, number];
  zoom: number;
  onMapClick: (latlng: LatLng) => void;
  selectedPosition: LatLng | null;
  showScore: boolean;
  guessedLocation: LatLng | null;
  currentLocation: Location | null;
}

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: LatLng) => void;
}) => {
  useMapEvents({
    click: (e) => onClick(e.latlng),
  });
  return null;
};

export default function GameMap({
  center,
  zoom,
  onMapClick,
  selectedPosition,
  showScore,
  guessedLocation,
  currentLocation,
}: GameMapProps) {
  useEffect(() => {
    // Fix Leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "leaflet/marker-icon.png",
      iconRetinaUrl: "leaflet/marker-icon-2x.png",
      shadowUrl: "leaflet/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapClickHandler onClick={onMapClick} />

      {selectedPosition && !showScore && (
        <Marker position={selectedPosition}>
          <Popup>Your guess</Popup>
        </Marker>
      )}

      {showScore && guessedLocation && currentLocation && (
        <>
          <Marker position={guessedLocation}>
            <Popup>Your guess</Popup>
          </Marker>
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>Actual location</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
