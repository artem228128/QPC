import { useState, useEffect, useCallback } from 'react';
import { WalletState, NetworkConfig, ContractUserInfo, ContractGlobalStats } from '../types';
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
  const [contractInfo, setContractInfo] = useState<ContractUserInfo | null>(null);
  const [globalStats, setGlobalStats] = useState<ContractGlobalStats | null>(null);

  // Import contract configuration
  const BSC_NETWORK: NetworkConfig = {
    chainId: '0x38', // 56 in hex
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  };

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

      // Detect wallet provider
      let walletProvider = 'unknown';
      if ((window as any).ethereum?.isMetaMask) walletProvider = 'MetaMask';
      else if ((window as any).ethereum?.isTrust) walletProvider = 'Trust Wallet';
      else if ((window as any).ethereum?.isTokenPocket) walletProvider = 'TokenPocket';
      else if ((window as any).ethereum) walletProvider = 'Web3 Wallet';

      setWalletState({
        isConnected: true,
        address,
        balance: balanceInEth,
        network,
        provider: walletProvider,
      });

      // Load contract info if user is registered
      await loadContractInfo(address);
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

  // Load contract user info
  const loadContractInfo = useCallback(
    async (address: string) => {
      const provider = getProvider();
      if (!provider) return;

      try {
        // In a real implementation, you would use ethers.js or web3.js
        // For now, we'll simulate the contract call
        console.log('Loading contract info for:', address);

        // This would be replaced with actual contract calls
        // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        // const userInfo = await contract.getUser(address);
        // const globalStats = await contract.getGlobalStats();

        // Simulated response
        setContractInfo({
          id: 1,
          registrationTimestamp: Date.now(),
          referrerId: 0,
          referrer: '0x0000000000000000000000000000000000000000',
          referrals: 0,
          referralPayoutSum: 0,
          levelsRewardSum: 0,
          missedReferralPayoutSum: 0,
        });

        setGlobalStats({
          members: 1000,
          transactions: 5000,
          turnover: 500,
        });
      } catch (err) {
        console.error('Failed to load contract info:', err);
      }
    },
    [getProvider]
  );

  // Switch to BSC network
  const switchToBSC = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return false;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_NETWORK.chainId }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add BSC network:', addError);
          return false;
        }
      } else {
        console.error('Failed to switch to BSC:', switchError);
        return false;
      }
    }
  }, [getProvider]);

  // Check if user is registered in contract
  const isUserRegistered = useCallback(
    async (address?: string) => {
      const userAddress = address || walletState.address;
      if (!userAddress) return false;

      // In real implementation, check contract
      // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      // return await contract.isUserRegistered(userAddress);

      return contractInfo !== null;
    },
    [walletState.address, contractInfo]
  );

  // Register user in contract
  const registerUser = useCallback(
    async (_referrerAddress?: string) => {
      const provider = getProvider();
      if (!provider || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      if (walletState.network !== 'bsc') {
        const switched = await switchToBSC();
        if (!switched) {
          throw new Error('Please switch to BSC network');
        }
      }

      try {
        setIsLoading(true);

        // In real implementation:
        // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        // const tx = await contract.registerWithReferrer(referrerAddress || owner, {
        //   value: ethers.utils.parseEther('0.025')
        // });
        // await tx.wait();

        console.log('User registration simulated');
        await loadContractInfo(walletState.address);
      } catch (err: any) {
        setError(err.message || 'Registration failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getProvider, walletState.address, walletState.network, switchToBSC, loadContractInfo]
  );

  return {
    walletState,
    isLoading,
    error,
    contractInfo,
    globalStats,
    connectWallet,
    disconnectWallet,
    updateBalance,
    switchToBSC,
    isUserRegistered,
    registerUser,
    loadContractInfo,
    isWalletAvailable: isWalletAvailable(),
    BSC_NETWORK,
  };
};
