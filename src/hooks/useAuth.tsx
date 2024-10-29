import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";

const useAuth = () => {
  const [auth, setAuth] = useState(false);
  const [wallet, setWallet] = useState();
  const [signature, setSignature] = useState<any>();
  const { signMessage } = useWallet();

  const fnTriggerSignature = async (signInMessage: string) => {
    try {
      let signatureUint8, signatureBase58;
      if (signMessage) {
        signatureUint8 = await signMessage(
          new TextEncoder().encode(signInMessage)
        );
        console.log(`signatureUint8 is ${signatureUint8}`);
        signatureBase58 = signatureUint8 ? signatureUint8.toString() : null;
        console.log(`signatureBase58 is ${signatureBase58}`);
        setSignature(signatureUint8);
      }
      return signatureBase58;
    } catch (error) {
      console.log(`Error in fnTriggerSignature ${error}`);
      return null;
    }
  };

  return {
    auth,
    setAuth,
    wallet,
    setWallet,
    solSignature: signature,
    setSolSignature: setSignature,
    fnTriggerSignature,
  };
};

export default useAuth;
