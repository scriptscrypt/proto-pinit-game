// src/providers/providers.tsx
"use client";

import React, { ReactNode } from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { envDynamicID } from "@/services/env/envConfig";

interface ProvidersProps {
  children?: ReactNode;
}

// const walletConfig = {
//   autoConnect: false,
//   env: "mainnet-beta" as const,
//   metadata: {
//     name: "UnifiedWallet",
//     description: "UnifiedWallet",
//     url: "https://jup.ag",
//     iconUrls: ["https://jup.ag/favicon.ico"],
//   },
//   walletlistExplanation: {
//     href: "https://station.jup.ag/docs/additional-topics/wallet-list",
//   },
//   theme: "jupiter" as const,
//   lang: "en" as const,
// };

export const Providers = ({ children }: ProvidersProps) => {
  return (
    // <UnifiedWalletProvider wallets={[]} config={walletConfig}>
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: envDynamicID as string,
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
    // </UnifiedWalletProvider>
  );
};

export default Providers;
