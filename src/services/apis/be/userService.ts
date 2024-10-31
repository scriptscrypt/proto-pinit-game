import { axiosInstance } from "@/services/apis/config/axiosConfig";

export type LeaderboardFilter = 'city' | 'referral' | 'overall';

interface LeaderboardResponse {
  leaderboard: any[]; // Replace 'any' with your specific leaderboard item type
  currentUser: any;
  position: number;
  positionPercentage: string;
}

export const userService = {
  // Fetch leaderboard with optional filter
  async apiGetLeaderboard(filter: LeaderboardFilter = 'overall'): Promise<LeaderboardResponse> {
    try {
      const response = await axiosInstance.get<LeaderboardResponse>('/v2/users/leaderboard', {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
      throw error;
    }
  },

  // Add bonus points
  async apiAddBonusPoints(userId: string, bonusPoints: number): Promise<string> {
    try {
      const response = await axiosInstance.post<string>('/v2/users/add-bonus-points', {
        userId,
        bonusPoints
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add bonus points', error);
      throw error;
    }
  },

  // Redeem points
  async apiAddRedeemedPoints(userId: string, redeemedPoints: number): Promise<string> {
    try {
      const response = await axiosInstance.post<string>('/v2/users/add-redeemed-points', {
        userId,
        redeemedPoints
      });
      return response.data;
    } catch (error) {
      console.error('Failed to redeem points', error);
      throw error;
    }
  }
};
