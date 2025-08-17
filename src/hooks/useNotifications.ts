import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  txHash?: string;
  amount?: number;
  level?: number;
}

// Extend Window interface
declare global {
  interface Window {
    addNotification?: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  }
}

// Global error notification function
export const notifyError = (title: string, message: string) => {
  // This will be set by the main component
  if (window.addNotification) {
    window.addNotification({
      type: 'error',
      title,
      message,
    });
  }
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set());
  const { walletState, contractInfo, userLevels } = useWallet();

  // Add new notification with deduplication
  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    // Skip if this transaction hash was already processed
    if (notification.txHash && processedTxHashes.has(notification.txHash)) {
      return;
    }

    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications

    // Mark transaction hash as processed
    if (notification.txHash) {
      setProcessedTxHashes(prev => new Set([...prev, notification.txHash!]));
    }

    // Auto-remove after 60 seconds for success notifications
    if (notification.type === 'success') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 60000);
    }
  }, [processedTxHashes]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove specific notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Listen for wallet connection changes
  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      addNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: `Connected to ${walletState.provider || 'Web3 Wallet'}`,
      });
    }
  }, [walletState.isConnected, walletState.address, addNotification]);

  // Listen for contract registration
  useEffect(() => {
    if (contractInfo?.id && contractInfo.id > 0) {
      addNotification({
        type: 'success',
        title: 'Registration Complete',
        message: `Welcome! Your ID is #${contractInfo.id}`,
      });
    }
  }, [contractInfo?.id, addNotification]);

  // Listen for level activations
  useEffect(() => {
    if (userLevels?.active) {
      const activeCount = userLevels.active.filter(Boolean).length;
      const prevActiveCount = parseInt(localStorage.getItem('prevActiveCount') || '0');
      
      if (activeCount > prevActiveCount) {
        const newLevels = activeCount - prevActiveCount;
        addNotification({
          type: 'success',
          title: 'Level Activated',
          message: `${newLevels} new level${newLevels > 1 ? 's' : ''} activated!`,
        });
      }
      
      localStorage.setItem('prevActiveCount', activeCount.toString());
    }
  }, [userLevels?.active, addNotification]);

  // Listen for real contract events
  useEffect(() => {
    if (!walletState.isConnected || !walletState.address) return;

    const checkRecentEvents = async () => {
      try {
        const { getQpcContract } = await import('../utils/contract');
        const contract: any = await getQpcContract(false);
        if (!contract) return;

        const blockNumber = await contract.provider?.getBlockNumber();
        if (!blockNumber) return;

        // Check last 100 blocks (~5 minutes on BSC)
        const fromBlock = Math.max(0, blockNumber - 100);
        const address = walletState.address;

        // Listen for LevelPayout events (real payouts)
        try {
          const payoutFilter = contract.filters.LevelPayout(address);
          const payoutEvents = await contract.queryFilter(payoutFilter, fromBlock, blockNumber);
          
          payoutEvents.forEach((event: any) => {
            const amount = Number(event.args?.rewardValue || 0) / 1e18;
            const level = Number(event.args?.level || 0);
            
            if (amount > 0) {
              addNotification({
                type: 'success',
                title: 'Matrix Payout Received',
                message: `You received ${amount.toFixed(4)} BNB from Level ${level}`,
                amount,
                level,
                txHash: event.transactionHash,
              });
            }
          });
        } catch (error) {
          console.log('Error fetching payout events:', error);
        }

        // Listen for ReferralPayout events (real referral bonuses)
        try {
          const referralFilter = contract.filters.ReferralPayout(address);
          const referralEvents = await contract.queryFilter(referralFilter, fromBlock, blockNumber);
          
          referralEvents.forEach((event: any) => {
            const amount = Number(event.args?.rewardValue || 0) / 1e18;
            const level = Number(event.args?.level || 0);
            
            if (amount > 0) {
              addNotification({
                type: 'success',
                title: 'Referral Bonus Received',
                message: `You earned ${amount.toFixed(4)} BNB referral bonus from Level ${level}`,
                amount,
                level,
                txHash: event.transactionHash,
              });
            }
          });
        } catch (error) {
          console.log('Error fetching referral events:', error);
        }

        // Listen for UserRegistration events (new referrals)
        try {
          const registrationFilter = contract.filters.UserRegistration(null, null, address);
          const registrationEvents = await contract.queryFilter(registrationFilter, fromBlock, blockNumber);
          
          registrationEvents.forEach((event: any) => {
            const newUserId = Number(event.args?.userId || 0);
            
            if (newUserId > 0) {
              addNotification({
                type: 'info',
                title: 'New Referral Registered',
                message: `User #${newUserId} joined with your referral link`,
                txHash: event.transactionHash,
              });
            }
          });
        } catch (error) {
          console.log('Error fetching registration events:', error);
        }

        // Listen for BuyLevel events (level activations)
        try {
          const buyLevelFilter = contract.filters.BuyLevel(address);
          const buyLevelEvents = await contract.queryFilter(buyLevelFilter, fromBlock, blockNumber);
          
          buyLevelEvents.forEach((event: any) => {
            const level = Number(event.args?.level || 0);
            
            if (level > 0) {
              addNotification({
                type: 'success',
                title: 'Level Activated',
                message: `Level ${level} successfully activated`,
                level,
                txHash: event.transactionHash,
              });
            }
          });
        } catch (error) {
          console.log('Error fetching level activation events:', error);
        }

      } catch (error) {
        console.log('Error checking recent events:', error);
      }
    };

    // Check events immediately and then every 30 seconds
    checkRecentEvents();
    const interval = setInterval(checkRecentEvents, 30000);

    return () => clearInterval(interval);
  }, [walletState.isConnected, walletState.address, addNotification]);

  // Make addNotification globally available for error handling
  useEffect(() => {
    (window as any).addNotification = addNotification;
    return () => {
      delete (window as any).addNotification;
    };
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
  };
};
