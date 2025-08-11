import { useState, useEffect, useCallback } from 'react';
import { GameState, Level, Matrix, Transaction, User } from '../types';

export const useGame = (userAddress?: string) => {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    levels: [],
    matrices: [],
    transactions: [],
    isLoading: false,
    error: null,
  });

  // Initialize game data
  const initializeGame = useCallback(async () => {
    if (!userAddress) return;

    setGameState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock data - would come from smart contract queries
      const mockUser: User = {
        id: userAddress,
        walletAddress: userAddress,
        username: 'Player1',
        level: 2,
        earnings: 0.17,
        referralCode: 'REF123456',
        joinedAt: new Date('2024-01-15'),
      };

      const mockLevels: Level[] = [
        { number: 1, price: 0.1, maxPositions: 3, isUnlocked: true, earnings: 0.05 },
        { number: 2, price: 0.2, maxPositions: 9, isUnlocked: true, earnings: 0.12 },
        { number: 3, price: 0.4, maxPositions: 27, isUnlocked: false, earnings: 0 },
        { number: 4, price: 0.8, maxPositions: 81, isUnlocked: false, earnings: 0 },
        { number: 5, price: 1.6, maxPositions: 243, isUnlocked: false, earnings: 0 },
        { number: 6, price: 3.2, maxPositions: 729, isUnlocked: false, earnings: 0 },
        { number: 7, price: 6.4, maxPositions: 2187, isUnlocked: false, earnings: 0 },
        { number: 8, price: 12.8, maxPositions: 6561, isUnlocked: false, earnings: 0 },
      ];

      const mockMatrices: Matrix[] = [
        {
          id: '1',
          level: 1,
          position: 1,
          userId: userAddress,
          isActive: true,
          earnings: 0.025,
          uplineId: undefined,
          downlineIds: [],
        },
        {
          id: '2',
          level: 1,
          position: 2,
          userId: 'other1',
          isActive: true,
          earnings: 0.025,
          uplineId: '1',
          downlineIds: [],
        },
        {
          id: '3',
          level: 2,
          position: 1,
          userId: userAddress,
          isActive: true,
          earnings: 0.06,
          uplineId: undefined,
          downlineIds: [],
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: 'tx1',
          type: 'activation',
          amount: 0.1,
          from: userAddress,
          to: 'contract',
          timestamp: new Date('2024-01-15T10:00:00Z'),
          status: 'completed',
        },
        {
          id: 'tx2',
          type: 'earning',
          amount: 0.05,
          from: 'contract',
          to: userAddress,
          timestamp: new Date('2024-01-16T14:30:00Z'),
          status: 'completed',
        },
      ];

      setGameState({
        user: mockUser,
        levels: mockLevels,
        matrices: mockMatrices,
        transactions: mockTransactions,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load game data',
      }));
    }
  }, [userAddress]);

  // Activate level
  const activateLevel = useCallback(
    async (levelNumber: number) => {
      if (!userAddress) return;

      setGameState((prev) => ({ ...prev, isLoading: true }));

      try {
        // Mock level activation - would interact with smart contract
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setGameState((prev) => ({
          ...prev,
          levels: prev.levels.map((level) =>
            level.number === levelNumber ? { ...level, isUnlocked: true } : level
          ),
          isLoading: false,
        }));
      } catch (error: any) {
        setGameState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to activate level',
        }));
      }
    },
    [userAddress]
  );

  // Register user
  const registerUser = useCallback(
    async (username: string, _referralCode?: string) => {
      if (!userAddress) return;

      setGameState((prev) => ({ ...prev, isLoading: true }));

      try {
        // Mock user registration - would interact with smart contract
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newUser: User = {
          id: userAddress,
          walletAddress: userAddress,
          username,
          level: 1,
          earnings: 0,
          referralCode: generateReferralCode(),
          joinedAt: new Date(),
        };

        setGameState((prev) => ({
          ...prev,
          user: newUser,
          isLoading: false,
        }));
      } catch (error: any) {
        setGameState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to register user',
        }));
      }
    },
    [userAddress]
  );

  // Generate referral code
  const generateReferralCode = (): string => {
    return 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // Get user statistics
  const getUserStats = useCallback(() => {
    if (!gameState.user) return null;

    const activeMatrices = gameState.matrices.filter(
      (m) => m.userId === userAddress && m.isActive
    ).length;

    const totalEarnings = gameState.levels.reduce((sum, level) => sum + level.earnings, 0);

    const currentLevel = Math.max(
      ...gameState.levels.filter((l) => l.isUnlocked).map((l) => l.number),
      1
    );

    return {
      activeMatrices,
      totalEarnings,
      currentLevel,
      totalTransactions: gameState.transactions.length,
    };
  }, [gameState, userAddress]);

  // Initialize when address changes
  useEffect(() => {
    if (userAddress) {
      initializeGame();
    }
  }, [userAddress, initializeGame]);

  return {
    gameState,
    activateLevel,
    registerUser,
    getUserStats,
    refreshData: initializeGame,
  };
};
