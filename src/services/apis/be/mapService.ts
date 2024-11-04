// services/apis/mapService.ts

import { axiosInstance } from "@/services/apis/config/axiosConfig";

interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface Frame {
  url: string;
  location: Location;
}

export const mapService = {
  /**
   * Fetches frames for a given location
   * @param latitude - The latitude coordinate
   * @param longitude - The longitude coordinate
   * @returns Promise<Frame> - The frame data if found
   */
  async apiGetFrames(latitude: number, longitude: number): Promise<Frame> {
    try {
      const response = await axiosInstance.post<Frame>("/v2/scene/get-frames", {
        latitude,
        longitude,
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch frames for location", {
        latitude,
        longitude,
        error,
      });
      throw error;
    }
  },
};
