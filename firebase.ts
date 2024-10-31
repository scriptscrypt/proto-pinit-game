// firebase.js or firebase.config.js
import {
  envFirebaseAPIKey,
  envFirebaseAppID,
  envFirebaseAuthDomain,
  envFirebaseMessagingSenderId,
  envFirebaseProjectID,
  envFirebaseStorageBucket,
} from "@/services/env/envConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: envFirebaseAPIKey,
  authDomain: envFirebaseAuthDomain,
  projectId: envFirebaseProjectID,
  storageBucket: envFirebaseStorageBucket,
  messagingSenderId: envFirebaseMessagingSenderId,
  appId: envFirebaseAppID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
