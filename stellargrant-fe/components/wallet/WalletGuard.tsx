/**
 * WalletGuard Component
 *
 * Wrapper component that renders children only when a wallet is connected.
 * Shows a connect prompt otherwise.
 */

"use client";

import React from "react";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnect } from "./WalletConnect";

interface WalletGuardProps {
  children: React.ReactNode;
  requiredRole?: "any" | "reviewer" | "contributor" | "owner";
}

export function WalletGuard({ children, requiredRole: _requiredRole = "any" }: WalletGuardProps) {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="wallet-guard-prompt">
        <p className="wallet-guard-message">Please connect your wallet to continue</p>
        <WalletConnect />
      </div>
    );
  }

  return <>{children}</>;
}
