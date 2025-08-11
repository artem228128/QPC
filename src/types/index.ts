import React from 'react';

export interface GlassComponentProps {
  blur?: number;
  opacity?: number;
  border?: boolean;
  glow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface Level {
  number: number;
  price: number;
  maxPositions: number;
  isUnlocked: boolean;
  earnings: number;
}

export interface Matrix {
  id: string;
  level: number;
  position: number;
  userId: string;
  isActive: boolean;
  earnings: number;
  uplineId?: string;
  downlineIds: string[];
}

export type TransactionType = 'activation' | 'earning' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  from: string;
  to: string;
  timestamp: Date;
  status: TransactionStatus;
}

export interface User {
  id: string;
  walletAddress: string;
  username: string;
  level: number;
  earnings: number;
  referralCode?: string;
  joinedAt: Date;
}

export interface GameState {
  user: User | null;
  levels: Level[];
  matrices: Matrix[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  network: string | null;
  provider?: string; // MetaMask, Trust Wallet, etc.
}

// Smart Contract Types
export interface ContractUserInfo {
  id: number;
  registrationTimestamp: number;
  referrerId: number;
  referrer: string;
  referrals: number;
  referralPayoutSum: number;
  levelsRewardSum: number;
  missedReferralPayoutSum: number;
}

export interface ContractLevelInfo {
  active: boolean;
  payouts: number;
  maxPayouts: number;
  activationTimes: number;
  rewardSum: number;
  referralPayoutSum: number;
}

export interface ContractGlobalStats {
  members: number;
  transactions: number;
  turnover: number;
}

// BSC Network configuration
export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}
