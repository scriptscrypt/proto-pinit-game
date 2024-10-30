"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HowToPlayModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-[#1a1a1a]"
        >
          How to play
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-[#0a0a0a] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono">How to play?</DialogTitle>
          {/* <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button> */}
        </DialogHeader>
        <div className="flex gap-6">
          <div className="w-64 space-y-2">
            <div className="bg-[#87CEEB]/20 rounded-lg p-3">
              <div className="font-mono">Step 1 Map ⭐</div>
              {/* <div className="text-sm text-gray-400">26/06/2024</div> */}
            </div>

            <div className="rounded-lg p-3 hover:bg-gray-800/50">
              <div className="font-mono">Step 2 Earn Points🔒</div>
              <div className="text-sm text-gray-400">22/01/2024</div>
            </div>

            <div className="rounded-lg p-3 hover:bg-gray-800/50">
              <div className="font-mono">Referrals 🤝</div>
              <div className="text-sm text-gray-400">28/11/2023</div>
            </div>

            <div className="rounded-lg p-3 hover:bg-gray-800/50">
              <div className="font-mono">Inscriptions ✍️</div>
              <div className="text-sm text-gray-400">23/11/2023</div>
            </div>

            {/* <div className="bg-[#87CEEB]/20 rounded-lg p-3">
              <div className="font-mono">YOLO Buy 🎯</div>
              <div className="text-sm text-gray-400">27/10/2023</div>
            </div>

            <div className="rounded-lg p-3 hover:bg-gray-800/50">
              <div className="font-mono">Trait Bids 🎯</div>
              <div className="text-sm text-gray-400">24/10/2023</div>
            </div>

            <div className="rounded-lg p-3 hover:bg-gray-800/50">
              <div className="font-mono">New Offer System 🎮</div>
              <div className="text-sm text-gray-400">06/10/2023</div>
            </div>

            <div className="rounded-lg p-3 hover:bg-gray-800/50">
              <div className="font-mono">New Alert Types 🔔</div>
              <div className="text-sm text-gray-400">06/10/2023</div>
            </div> */}
          </div>

          <ScrollArea className="flex-1 h-[600px]">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold font-mono">
                  Proto Mappers Leaderboard is{" "}
                  <span className="text-[#87CEEB]">LIVE!</span>
                </h2>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl font-bold font-mono text-white">
                      proto
                    </div>
                    <div className="absolute bottom-0 text-4xl font-mono text-white">
                      UPDATE
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-[#87CEEB]/20 rounded-lg"></div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="w-16 h-16 bg-[#87CEEB]/20 rounded-lg"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 font-mono">
                <p className="flex items-center gap-2">
                  🎮 Proto &apos; s Map to Earn is now Live
                </p>
                <p className="flex items-center gap-2">
                  ⭐ Continue earning points by mapping, referring and playing Maps.fun!
                </p>
                <p className="flex items-center gap-2">
                  🏆 Check out the{" "}
                  <span className="text-[#87CEEB]">new Leaderboard</span>
                </p>
                <p className="flex items-center gap-2">
                  📖 Read more about Proto mapathons{" "}
                  <span className="text-[#87CEEB]">over here</span>
                </p>
              </div>

              <Button className="w-full bg-[#87CEEB] hover:bg-[#87CEEB]/80 text-black font-mono">
               Start Playing 🚀
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
