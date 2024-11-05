// // app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Loader } from "lucide-react";

// const LoadingScreen = () => (
//   <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
//     <div className="flex flex-col items-center gap-4">
//       <Loader className="h-8 w-8 animate-spin text-white" />
//       <p className="text-white font-mono">Loading game...</p>
//     </div>
//   </div>
// );

// const GameLayoutDesktop = dynamic(
//   () => import("@/components/GameLayout/GameLayoutLeaflet"),
//   { 
//     ssr: false,
//     loading: () => <LoadingScreen />
//   }
// );

// const GameLayoutMobile = dynamic(
//   () => import("@/components/GameLayout/GameLayoutMobile"),
//   { 
//     ssr: false,
//     loading: () => <LoadingScreen />
//   }
// );

// export default function GamePage() {
//   const [mounted, setMounted] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const updateSize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     updateSize();
//     window.addEventListener('resize', updateSize);
//     return () => window.removeEventListener('resize', updateSize);
//   }, []);

//   if (!mounted) return <LoadingScreen />;

//   return isMobile ? <GameLayoutMobile /> : <GameLayoutDesktop />;
// }


// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <Loader className="animate-spin text-white" />
  </div>
);

// Only load what's needed based on screen size
export default function GamePage() {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    const loadComponent = async () => {
      const isMobile = window.innerWidth < 768;
      const mod = isMobile 
        ? await import("@/components/GameLayout/GameLayoutMobile")
        : await import("@/components/GameLayout/GameLayoutLeaflet");
      setComponent(() => mod.default);
    };

    loadComponent();
  }, []);

  if (!Component) return <LoadingScreen />;
  
  return <Component />;
}