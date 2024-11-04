// // "use client";

// // import GoogleLoginButton from "@/components/auth/GoogleLoginBtn";
// // import { HowToPlayModal } from "@/components/HowToPlayModal";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Search } from "lucide-react";
// // import { useRouter } from "next/navigation";

// // export function NavbarComp() {
// //   const router = useRouter();

// //   const handleLeaderboardClick = () => {
// //     router.push("/leaderboard");
// //   };

// //   return (
// //     <header className="flex justify-between items-center p-4 bg-[#0a0a0a]">
// //       <div className="text-2xl font-bold text-white">proto</div>
// //       <nav className="space-x-4">
// //         <Button
// //           variant="ghost"
// //           className="text-white hover:text-white hover:bg-[#1a1a1a]"
// //         >
// //           Profile
// //         </Button>
// //         <HowToPlayModal />
// //         <Button
// //           variant="ghost"
// //           className="text-white hover:text-white hover:bg-[#1a1a1a]"
// //           onClick={handleLeaderboardClick}
// //         >
// //           Leaderboard
// //         </Button>
// //       </nav>
// //       <div className="flex items-center space-x-4">
// //         <div className="relative">
// //           <Input
// //             type="text"
// //             placeholder="Maps, Mappers & More"
// //             className="pl-8 bg-[#1a1a1a] text-white border-none focus:ring-1 focus:ring-[#87CEEB]"
// //           />
// //           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
// //         </div>
// //         {/* <DynamicWidget /> */}
// //         <GoogleLoginButton />
// //       </div>
// //     </header>
// //   );
// // }

// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Menu, Search, X } from 'lucide-react'
// import GoogleLoginButton from '@/components/auth/GoogleLoginBtn'
// import { HowToPlayModal } from '@/components/HowToPlayModal'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet'

// export function NavbarComp() {
//   const router = useRouter()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   const handleLeaderboardClick = () => {
//     router.push('/leaderboard')
//     setIsMenuOpen(false)
//   }

//   return (
//     <header className="flex justify-between items-center p-4 bg-[#0a0a0a]">
//       <div className="text-2xl font-bold text-white">proto</div>
//       <div className="flex items-center space-x-4">
//         <GoogleLoginButton />
//         <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="lg:hidden">
//               <Menu className="h-6 w-6 text-white" />
//               <span className="sr-only">Toggle menu</span>
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#0a0a0a] text-white">
//             <SheetHeader>
//               <SheetTitle className="text-white">Menu</SheetTitle>
//             </SheetHeader>
//             <nav className="flex flex-col space-y-4 mt-4">
//               <Button
//                 variant="ghost"
//                 className="justify-start text-white hover:text-white hover:bg-[#1a1a1a]"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Profile
//               </Button>
//               <HowToPlayModal />
//               <Button
//                 variant="ghost"
//                 className="justify-start text-white hover:text-white hover:bg-[#1a1a1a]"
//                 onClick={handleLeaderboardClick}
//               >
//                 Leaderboard
//               </Button>
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Maps, Mappers & More"
//                   className="pl-8 bg-[#1a1a1a] text-white border-none focus:ring-1 focus:ring-[#87CEEB]"
//                 />
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//               </div>
//             </nav>
//           </SheetContent>
//         </Sheet>
//       </div>
//     </header>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search } from 'lucide-react'
import GoogleLoginButton from '@/components/auth/GoogleLoginBtn'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function NavbarComp() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLeaderboardClick = () => {
    router.push('/leaderboard')
    setIsMenuOpen(false)
  }

  return (
    <header className="flex justify-between items-center p-4 bg-[#0a0a0a]">
      <div className="text-2xl font-bold text-white">proto</div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-[#1a1a1a]"
        >
          Profile
        </Button>
        <HowToPlayModal />
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-[#1a1a1a]"
          onClick={handleLeaderboardClick}
        >
          Leaderboard
        </Button>
        <div className="relative">
          <Input
            type="text"
            placeholder="Maps, Mappers & More"
            className="pl-8 bg-[#1a1a1a] text-white border-none focus:ring-1 focus:ring-[#87CEEB]"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </nav>

      <div className="flex items-center space-x-4">
        <GoogleLoginButton />
        
        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6 text-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#0a0a0a] text-white lg:hidden">
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-4">
              <Button
                variant="ghost"
                className="justify-start text-white hover:text-white hover:bg-[#1a1a1a]"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Button>
              <HowToPlayModal />
              <Button
                variant="ghost"
                className="justify-start text-white hover:text-white hover:bg-[#1a1a1a]"
                onClick={handleLeaderboardClick}
              >
                Leaderboard
              </Button>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Maps, Mappers & More"
                  className="pl-8 bg-[#1a1a1a] text-white border-none focus:ring-1 focus:ring-[#87CEEB]"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}