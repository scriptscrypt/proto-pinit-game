// src/providers/providers.tsx
"use client";

import React, { ReactNode } from 'react';
import {
  UnifiedWalletButton,
  UnifiedWalletProvider,
} from "@jup-ag/wallet-adapter";

interface ProvidersProps {
  children?: ReactNode;
}

const walletConfig = {
  autoConnect: false,
  env: "mainnet-beta" as const,
  metadata: {
    name: "UnifiedWallet",
    description: "UnifiedWallet",
    url: "https://jup.ag",
    iconUrls: ["https://jup.ag/favicon.ico"],
  },
  walletlistExplanation: {
    href: "https://station.jup.ag/docs/additional-topics/wallet-list",
  },
  theme: "jupiter" as const,
  lang: "en" as const,
};

export const WalletButton = () => {
  return <UnifiedWalletButton />;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <UnifiedWalletProvider wallets={[]} config={walletConfig}>
      {children}
    </UnifiedWalletProvider>
  );
};

export default Providers;