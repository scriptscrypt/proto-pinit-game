// hooks/useGame.ts
import { useState, useCallback } from "react";

import { LatLng } from "leaflet";
import { gameService } from "@/services/apis/be/gameService";

export const useGame = (email: string) => {
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const fnStartNewGame = useCallback(async () => {
    if (!email) return null;
    const game = await gameService.apiCreateGame({ email });
    setCurrentGameId(game.id);
    return game;
  }, [email]);

  const fnSubmitGuess = useCallback(
    async (params: {
      roundNumber: number;
      guessLocation: LatLng;
      targetLocation: { lat: number; lng: number; name: string };
      score: number;
      distance: number;
    }) => {
      if (!currentGameId) return null;

      return gameService.apiSubmitGuess({
        gameId: currentGameId,
        ...params,
      });
    },
    [currentGameId]
  );

  const fnCompleteGame = useCallback(async () => {
    if (!currentGameId) return null;

    const game = await gameService.apiCompleteGame(currentGameId);
    setCurrentGameId(null);
    return game;
  }, [currentGameId]);

  return {
    currentGameId,
    fnStartNewGame,
    fnSubmitGuess,
    fnCompleteGame,
  };
};
