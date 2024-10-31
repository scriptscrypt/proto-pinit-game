import { axiosInstance } from "@/services/apis/config/axiosConfig";

// Types for better type safety
interface SignInResponse {
  access_token: string;
  refresh_token: string;
}

interface UserDetails {
  id: string;
  username: string;
  total_points: number;
  // TBD : Add other user fields as needed
}

export const authService = {
  // Sign in with Firebase ID token
  async apiSignIn(idToken: string): Promise<SignInResponse> {
    try {
      const response = await axiosInstance.post<SignInResponse>(
        "/v2/auth/signin",
        {
          idToken,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    }
  },

  // Get user details using access token
  async apiGetUserDetails(): Promise<UserDetails> {
    try {
      const response = await axiosInstance.get<UserDetails>(
        "/v2/auth/get-user"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user details", error);
      throw error;
    }
  },
};
