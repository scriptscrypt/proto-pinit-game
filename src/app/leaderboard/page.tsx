"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Loader, Search, Trophy } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import {
  LeaderboardEntry,
  leaderboardService,
} from "@/services/apis/be/leaderboardService";


export default function LeaderboardPage() {
  const { signedInEmail } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRank, setUserRank] = useState<number | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [ref, inView] = useInView();

  const loadLeaderboardData = async (
    pageNum: number,
    fresh: boolean = false
  ) => {
    try {
      setLoading(true);
      const { entries, hasMore: more } =
        await leaderboardService.getLeaderboard(pageNum, 10, debouncedSearch);

      setLeaderboardData((prev) => (fresh ? entries : [...prev, ...entries]));
      setHasMore(more);
      setPage(pageNum);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRank = async () => {
    if (signedInEmail) {
      try {
        const rankData = await leaderboardService.getUserRank(signedInEmail);
        if (rankData) {
          setUserRank(rankData.rank);
        }
      } catch (error) {
        console.error("Error loading user rank:", error);
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadLeaderboardData(0, true);
  }, [debouncedSearch]);

  // Load more when scrolling
  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadLeaderboardData(page + 1);
    }
  }, [inView]);

  // Scroll to user's position
  const scrollToUserRank = async () => {
    if (!signedInEmail) return;

    try {
      setLoading(true);
      const rankData = await leaderboardService.getUserRank(signedInEmail);
      if (rankData) {
        // Calculate which page the user's rank would be on
        const userPage = Math.floor((rankData.rank - 1) / 10);
        // Load up to that page
        for (let i = 0; i <= userPage; i++) {
          const { entries } = await leaderboardService.getLeaderboard(i, 10);
          setLeaderboardData((prev) =>
            i === 0 ? entries : [...prev, ...entries]
          );
        }
        setPage(userPage);

        // Scroll to the user's row
        const userRow = document.getElementById(`player-${signedInEmail}`);
        userRow?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (error) {
      console.error("Error scrolling to user rank:", error);
    } finally {
      setLoading(false);
    }

    return (
      <div className="container mx-auto p-6 bg-[#0a0a0a] text-white">
        <h1 className="text-4xl font-bold mb-6 font-mono text-center">
          Game Leaderboard
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1a1a1a] text-white border-gray-700 focus:ring-[#87CEEB] focus:border-[#87CEEB]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button
            className="bg-[#87CEEB] hover:bg-[#87CEEB]/80 text-black font-mono"
            onClick={scrollToUserRank}
            disabled={!signedInEmail}
          >
            My Ranking {userRank ? `(#${userRank})` : ""}
          </Button>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-[#87CEEB]">Rank</TableHead>
                <TableHead className="text-[#87CEEB]">Player</TableHead>
                <TableHead className="text-[#87CEEB]">
                  <Button
                    variant="ghost"
                    className="text-[#87CEEB] hover:text-white p-0"
                  >
                    Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-[#87CEEB]">Games</TableHead>
                <TableHead className="text-[#87CEEB]">Avg Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow
                  key={player.playerEmail}
                  id={`player-${player.playerEmail}`}
                  className={`border-b border-gray-700 transition-colors hover:bg-[#2a2a2a] 
                  ${
                    player.playerEmail === signedInEmail
                      ? "bg-[#2a2a2a]/50"
                      : ""
                  }`}
                >
                  <TableCell className="font-mono">
                    {player.rank === 1 && (
                      <Trophy className="inline-block mr-2 text-yellow-500" />
                    )}
                    {player.rank === 2 && (
                      <Trophy className="inline-block mr-2 text-gray-400" />
                    )}
                    {player.rank === 3 && (
                      <Trophy className="inline-block mr-2 text-amber-600" />
                    )}
                    {player.rank}
                  </TableCell>
                  <TableCell className="font-mono">
                    {player.playerEmail}
                  </TableCell>
                  <TableCell className="font-mono">
                    {player.totalScore.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono">
                    {player.gamesPlayed}
                  </TableCell>
                  <TableCell className="font-mono">
                    {player.averageScore.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div ref={ref} className="mt-4 text-center text-gray-500">
          {loading && (
            <div className="flex justify-center items-center gap-2">
              <Loader className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}
          {!hasMore && !loading && <p>No more results</p>}
        </div>
      </div>
    );
  };
}
