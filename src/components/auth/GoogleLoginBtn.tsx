import { Button } from "@/components/ui/button";
import { useState } from "react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";
import { authService } from "@/services/apis/be/authService";
import { tokenStorage } from "@/services/local/tokenStorage";
import { useRouter } from "next/navigation";

const GoogleLoginButton = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // Initialize Firebase Auth provider
      const provider = new GoogleAuthProvider();

      // Trigger Google popup sign in
      const result = await signInWithPopup(auth, provider);

      // Get ID token
      const idToken = await result.user.getIdToken();

      // Store it in Backend
      const authRes = await authService.apiSignIn(idToken);

      // Store tokens and user email
      tokenStorage.setAccessToken(authRes.access_token);
      tokenStorage.setUserEmail(result.user.email || "");

      // Get user details
      const userDetails = await authService.apiGetUserDetails();
      console.log("userDetails", userDetails);

      // Redirect to game or dashboard
      router.push("/game");

      return idToken;
    } catch (err: any) {
      setError(err?.message.toString());
      console.error("Login error:", err);
      tokenStorage.clearTokens(); // Clear any partial data on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center gap-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>

      {/* {error && <>{error}</>} */}
    </div>
  );
};

export default GoogleLoginButton;