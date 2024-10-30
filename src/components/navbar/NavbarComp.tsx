"use client";

import { HowToPlayModal } from "@/components/HowToPlayModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavbarComp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLeaderboardClick = () => {
    router.push("/leaderboard");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-[#0a0a0a]">
      <div className="text-2xl font-bold text-white">proto</div>
      <nav className="space-x-4">
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
        <DynamicWidget />
      </div>
    </header>
  );
}
