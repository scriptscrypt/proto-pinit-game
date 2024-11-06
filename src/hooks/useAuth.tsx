// import { useEffect, useState } from "react";

// const useAuth = () => {
//   const [auth, setAuth] = useState(false);
//   const [wallet, setWallet] = useState();
//   const [signature, setSignature] = useState<any>();
//   const [signedInEmail, setSignedInEmail] = useState<string>();
//   // const { signMessage, connected: solConnected } = useWallet();

//   // const fnTriggerSignature = async (signInMessage: string) => {
//   //   try {
//   //     let signatureUint8, signatureBase58;
//   //     if (signMessage) {
//   //       signatureUint8 = await signMessage(
//   //         new TextEncoder().encode(signInMessage)
//   //       );
//   //       console.log(`signatureUint8 is ${signatureUint8}`);
//   //       signatureBase58 = signatureUint8 ? signatureUint8.toString() : null;
//   //       console.log(`signatureBase58 is ${signatureBase58}`);
//   //       setSignature(signatureUint8);
//   //     }
//   //     return signatureBase58;
//   //   } catch (error) {
//   //     console.log(`Error in fnTriggerSignature ${error}`);
//   //     return null;
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (solConnected) {
//   //     fnTriggerSignature("Hello, Solana!");
//   //   }
//   // }, [solConnected]);

//   return {
//     auth,
//     setAuth,
//     wallet,
//     setWallet,
//     solSignature: signature,
//     setSolSignature: setSignature,
//     // fnTriggerSignature,
//     // solConnected,
//     signedInEmail,
//     setSignedInEmail,
//   };
// };

// export default useAuth;

// hooks/useAuth.ts
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { tokenStorage } from "@/services/local/tokenStorage";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const email = tokenStorage.getUserEmail();

    if (token && email) {
      setIsAuthenticated(true);
      setSignedInEmail(email);
    } else {
      setIsAuthenticated(false);
      setSignedInEmail(null);
    }
  }, []);

  const logout = () => {
    tokenStorage.clearTokens();
    setIsAuthenticated(false);
    setSignedInEmail(null);
    router.push("/");
  };

  const checkAuth = () => {
    const token = tokenStorage.getAccessToken();
    return !!token;
  };

  return {
    isAuthenticated,
    signedInEmail,
    setSignedInEmail,
    logout,
    checkAuth,
  };
};

// Optional: Add protected route wrapper
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return function ProtectedRoute(props: any) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // or loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};
