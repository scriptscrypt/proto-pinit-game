
import { prisma } from "@/services/db/prisma";

export interface LeaderboardEntry {
  rank?: number;
  playerEmail: string;
  totalScore: number;
  gamesPlayed: number;
  averageScore: number;
  change?: number; // Will be calculated based on previous rankings
}

export const leaderboardService = {
  async getLeaderboard(page: number = 0, pageSize: number = 10, search?: string) {
    // Get current leaderboard
    const skip = page * pageSize;
    
    // Build where clause for search
    const whereClause = search ? {
      playerEmail: {
        contains: search,
        mode: 'insensitive'
      }
    } : {};

    const leaderboard = await prisma.game.groupBy({
      by: ['playerEmail'],
      where: {
        status: 'COMPLETED',
        ...(search ? { playerEmail: { contains: search, mode: 'insensitive' } } : {})
      },
      _sum: {
        totalScore: true,
      },
      _count: {
        id: true, // Count of games played
      },
      orderBy: {
        _sum: {
          totalScore: 'desc'
        }
      },
      skip,
      take: pageSize,
    });

    // Transform the data
    const entries: LeaderboardEntry[] = leaderboard.map((entry, index) => ({
      rank: skip + index + 1,
      playerEmail: entry.playerEmail,
      totalScore: entry._sum.totalScore || 0,
      gamesPlayed: entry._count.id,
      averageScore: Math.round((entry._sum.totalScore || 0) / entry._count.id),
      change: 0 // You could implement historical ranking comparison here
    }));

    // Get total count for pagination
    const totalCount = await prisma.game.groupBy({
      by: ['playerEmail'],
      where: {
        status: 'COMPLETED',
        ...(search ? { playerEmail: { contains: search, mode: 'insensitive' } } : {})
      },
      _count: true,
    });

    return {
      entries,
      totalCount: totalCount.length,
      hasMore: (skip + pageSize) < totalCount.length
    };
  },

  async getUserRank(email: string): Promise<{ rank: number; totalScore: number; } | null> {
    // Get all completed games grouped by email and ordered by total score
    const rankings = await prisma.game.groupBy({
      by: ['playerEmail'],
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        totalScore: true,
      },
      orderBy: {
        _sum: {
          totalScore: 'desc'
        }
      },
    });

    // Find the user's position
    const userRank = rankings.findIndex(r => r.playerEmail === email) + 1;
    const userScore = rankings.find(r => r.playerEmail === email)?._sum.totalScore || 0;

    return userRank ? { rank: userRank, totalScore: userScore } : null;
  }
};