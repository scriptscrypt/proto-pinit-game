// services/gameService.ts
import { prisma } from "@/services/db/prisma";
import { Game, GameRound } from "@prisma/client";
import { LatLng } from "leaflet";

interface CreateGameParams {
  email: string;
}

interface SubmitGuessParams {
  gameId: string;
  roundNumber: number;
  guessLocation: LatLng;
  targetLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  score: number;
  distance: number;
}

export const gameService = {
  async ensureUser(email: string) {
    // Create user if doesn't exist
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return user;
  },

  async apiCreateGame({ email }: CreateGameParams): Promise<Game> {
    return prisma.$transaction(async (tx) => {
      // Ensure user exists
      await this.ensureUser(email);

      // Check if there's an ongoing game
      const ongoingGame = await tx.game.findFirst({
        where: {
          playerEmail: email,
          status: "IN_PROGRESS",
        },
      });

      if (ongoingGame) {
        // Update status of ongoing game to ABANDONED
        await tx.game.update({
          where: { id: ongoingGame.id },
          data: { status: "ABANDONED" },
        });
      }

      // Create new game
      return tx.game.create({
        data: {
          playerEmail: email,
          status: "IN_PROGRESS",
        },
      });
    });
  },

  async apiSubmitGuess({
    gameId,
    roundNumber,
    guessLocation,
    targetLocation,
    score,
    distance,
  }: SubmitGuessParams): Promise<GameRound> {
    return prisma.$transaction(async (tx) => {
      // Create the round
      const gameRound = await tx.gameRound.create({
        data: {
          gameId,
          roundNumber,
          targetLat: targetLocation.lat,
          targetLng: targetLocation.lng,
          targetName: targetLocation.name,
          guessLat: guessLocation.lat,
          guessLng: guessLocation.lng,
          distance,
          score,
          completedAt: new Date(),
        },
      });

      // Update game score
      await tx.game.update({
        where: { id: gameId },
        data: {
          totalScore: {
            increment: score,
          },
        },
      });

      return gameRound;
    });
  },

  async apiCompleteGame(gameId: string): Promise<Game> {
    return prisma.game.update({
      where: { id: gameId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });
  },

  async apiGetUserStats(email: string) {
    await this.ensureUser(email);

    const [totalGames, completedGames, avgScore] = await Promise.all([
      prisma.game.count({
        where: { playerEmail: email },
      }),
      prisma.game.count({
        where: { playerEmail: email, status: "COMPLETED" },
      }),
      prisma.game.aggregate({
        where: { playerEmail: email, status: "COMPLETED" },
        _avg: {
          totalScore: true,
        },
      }),
    ]);

    return {
      totalGames,
      completedGames,
      averageScore: Math.round(avgScore?._avg?.totalScore || 0),
    };
  },

  async apiGetLeaderboard() {
    const leaderboard = await prisma.game.groupBy({
      by: ["playerEmail"],
      where: {
        status: "COMPLETED",
      },
      _avg: {
        totalScore: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _avg: {
          totalScore: "desc",
        },
      },
      take: 10,
    });

    return leaderboard.map((entry) => ({
      email: entry.playerEmail,
      averageScore: Math.round(entry._avg.totalScore || 0),
      gamesPlayed: entry._count.id,
    }));
  },
};
