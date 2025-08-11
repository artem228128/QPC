import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '../types';
import { Web3Provider } from '../types/web3';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    network: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is available
  const isWalletAvailable = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum;
  }, []);

  // Get provider
  const getProvider = useCallback((): Web3Provider | null => {
    if (!isWalletAvailable()) return null;
    return window.ethereum as Web3Provider;
  }, [isWalletAvailable]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setError('No wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];

      // Get balance
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      // Convert balance from wei to ether
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      // Get network
      const chainId = await provider.request({
        method: 'eth_chainId',
      });

      const networkMap: { [key: string]: string } = {
        '0x1': 'ethereum',
        '0x3': 'ropsten',
        '0x4': 'rinkeby',
        '0x5': 'goerli',
        '0x89': 'polygon',
        '0xa86a': 'avalanche',
        '0x38': 'bsc',
      };

      const network = networkMap[chainId] || 'unknown';

      setWalletState({
        isConnected: true,
        address,
        balance: balanceInEth,
        network,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getProvider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: 0,
      network: null,
    });
    setError(null);
  }, []);

  // Update balance
  const updateBalance = useCallback(async () => {
    const provider = getProvider();
    if (!provider || !walletState.address) return;

    try {
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [walletState.address, 'latest'],
      });

      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      setWalletState((prev) => ({
        ...prev,
        balance: balanceInEth,
      }));
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  }, [getProvider, walletState.address]);

  // Listen for account changes
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      connectWallet();
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [getProvider, walletState.address, connectWallet, disconnectWallet]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const provider = getProvider();
      if (!provider) return;

      try {
        const accounts = await provider.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error('Auto-connect failed:', err);
      }
    };

    autoConnect();
  }, [getProvider, connectWallet]);

  return {
    walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    updateBalance,
    isWalletAvailable: isWalletAvailable(),
  };
};
