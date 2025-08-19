import { useState, useEffect, useCallback } from 'react';
import {
  WalletState,
  NetworkConfig,
  ContractUserInfo,
  ContractGlobalStats,
  ContractUserLevelsData,
} from '../types';
import { Web3Provider } from '../types/web3';
import { parseEther } from 'ethers';
import { toast } from 'react-hot-toast';
import { ACTIVE_NETWORK, getQpcContract } from '../utils/contract';
import {
  connectWalletConnect,
  disconnectWalletConnect,
  setupWalletConnectListeners,
  removeWalletConnectListeners,
  isWalletConnectSupported,
} from '../utils/walletconnect';
// import { notifyError } from './useNotifications';

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
  const [userLevels, setUserLevels] = useState<ContractUserLevelsData | null>(null);
  const [walletProvider, setWalletProvider] = useState<'metamask' | 'walletconnect' | null>(null);

  // Import contract configuration
  const BSC_NETWORK: NetworkConfig = {
    chainId: ACTIVE_NETWORK === 'mainnet' ? '0x38' : '0x61',
    chainName: ACTIVE_NETWORK === 'mainnet' ? 'BNB Smart Chain' : 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: ACTIVE_NETWORK === 'mainnet' ? 'BNB' : 'tBNB',
      symbol: ACTIVE_NETWORK === 'mainnet' ? 'BNB' : 'tBNB',
      decimals: 18,
    },
    rpcUrls: [
      ACTIVE_NETWORK === 'mainnet'
        ? 'https://bsc-dataseed.binance.org/'
        : 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    ],
    blockExplorerUrls: [
      ACTIVE_NETWORK === 'mainnet' ? 'https://bscscan.com/' : 'https://testnet.bscscan.com/',
    ],
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
      const chainIdRaw = await provider.request({
        method: 'eth_chainId',
      });
      const chainIdStr = String(chainIdRaw).toLowerCase();

      const networkMap: { [key: string]: string } = {
        '0x1': 'ethereum',
        '0x3': 'ropsten',
        '0x4': 'rinkeby',
        '0x5': 'goerli',
        '0x89': 'polygon',
        '0xa86a': 'avalanche',
        '0x38': 'bsc',
        '0x61': 'bsc',
      };

      let network = networkMap[chainIdStr] || 'unknown';
      if (network === 'unknown') {
        if (chainIdStr === '0x61' || chainIdStr === '0x38') {
          network = 'bsc';
        } else if (/^\d+$/.test(chainIdStr)) {
          const chainNum = parseInt(chainIdStr, 10);
          if (chainNum === 97 || chainNum === 56) network = 'bsc';
        }
      }

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
        chainIdHex: chainIdStr,
        provider: walletProvider,
      });

      // Clear manual disconnect flag on successful connect
      localStorage.removeItem('wallet_manually_disconnected');

      // Load contract info if user is registered
      await loadContractInfo(address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getProvider]);

  // Connect WalletConnect
  const connectWalletConnectWallet = useCallback(async (): Promise<boolean> => {
    if (!isWalletConnectSupported()) {
      setError('WalletConnect is not properly configured');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { provider, accounts } = await connectWalletConnect();

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];
      setWalletProvider('walletconnect');

      // For simple WalletConnect demo - just show modal and handle error
      // In real implementation, you would get actual wallet connection data
      
      setWalletState({
        isConnected: false, // Keep as false since this is demo
        address: null,
        balance: 0,
        network: null,
      });

      // Set up WalletConnect listeners (no-op for demo)
      setupWalletConnectListeners();

      // Contract info will be loaded automatically by useEffect when walletState changes

      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('WalletConnect connection error:', err);
      setError(err.message || 'Failed to connect with WalletConnect');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      // If using WalletConnect, disconnect from WalletConnect
      if (walletProvider === 'walletconnect') {
        await disconnectWalletConnect();
        removeWalletConnectListeners();
      }

      // Clear wallet state immediately
      setWalletState({
        isConnected: false,
        address: null,
        balance: 0,
        network: null,
      });
      setWalletProvider(null);
      setError(null);
      setContractInfo(null);
      setUserLevels(null);

      // Clear localStorage to prevent auto-reconnect
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
      localStorage.removeItem('wallet_connected');

      // Mark as manually disconnected to prevent auto-reconnect
      localStorage.setItem('wallet_manually_disconnected', 'true');

      // Show success message
      toast.success('Disconnected from app (wallet remains connected in browser)');
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect from app');
    }
  }, [walletProvider]);

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

  // Auto-connect if previously connected (but not manually disconnected)
  useEffect(() => {
    const autoConnect = async () => {
      const provider = getProvider();
      if (!provider) return;

      // Check if user manually disconnected
      const manuallyDisconnected = localStorage.getItem('wallet_manually_disconnected');
      if (manuallyDisconnected === 'true') {
        console.log('Auto-connect skipped: wallet was manually disconnected');
        return;
      }

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



  // Load contract user info from-chain
  const loadContractInfo = useCallback(async (address: string) => {
    try {
      const contract: any = await getQpcContract(false);

      // Safely check registration (some builds may not expose this method)
      let registered = false;
      if (typeof contract.isUserRegistered === 'function') {
        try {
          registered = await contract.isUserRegistered(address);
        } catch {
          registered = false;
        }
      }

      if (!registered) {
        setContractInfo(null);

        // Global stats are optional; attempt to load but ignore errors or missing method
        if (typeof contract.getGlobalStats === 'function') {
          try {
            const gs = await contract.getGlobalStats();
            setGlobalStats({
              members: Number(gs?.members ?? 0),
              transactions: Number(gs?.transactions ?? 0),
              turnover: Number(gs?.turnover ?? 0),
              totalParticipants: Number(gs?.members ?? 0),
              totalContractBalance: 0,
              activeLevelsCount: 16,
              gameStartDate: 'Unknown',
              dailyNewPlayers: 0,
              dailyVolumeChange: 0,
            });
          } catch {}
        }
        return;
      }

      // Load user info if method exists
      if (typeof contract.getUser === 'function') {
        try {
          const ui = await contract.getUser(address);
          setContractInfo({
            id: Number(ui?.id ?? 0),
            registrationTimestamp: Number(ui?.registrationTimestamp ?? 0) * 1000,
            referrerId: Number(ui?.referrerId ?? 0),
            referrer: String(ui?.referrer ?? '0x0000000000000000000000000000000000000000'),
            referrals: Number(ui?.referrals ?? 0),
            // values from contract are in wei; convert to BNB
            referralPayoutSum: Number(ui?.referralPayoutSum ?? 0) / 1e18,
            levelsRewardSum: Number(ui?.levelsRewardSum ?? 0) / 1e18,
            missedReferralPayoutSum: Number(ui?.missedReferralPayoutSum ?? 0) / 1e18,
          });
        } catch {}
      }

      // Load levels if method exists
      if (typeof contract.getUserLevels === 'function') {
        try {
          const lv = await contract.getUserLevels(address);
          setUserLevels({
            active: Array.from(lv?.active ?? []).map(Boolean),
            payouts: Array.from(lv?.payouts ?? []).map((v: any) => Number(v)),
            maxPayouts: Array.from(lv?.maxPayouts ?? []).map((v: any) => Number(v)),
            activationTimes: Array.from(lv?.activationTimes ?? []).map((v: any) => Number(v)),
            rewardSum: Array.from(lv?.rewardSum ?? []).map((v: any) => Number(v) / 1e18),
            referralPayoutSum: Array.from(lv?.referralPayoutSum ?? []).map(
              (v: any) => Number(v) / 1e18
            ),
          });
        } catch {}
      }

      // Optional global stats
      if (typeof contract.getGlobalStats === 'function') {
        try {
          const gs = await contract.getGlobalStats();
          setGlobalStats({
            members: Number(gs?.members ?? 0),
            transactions: Number(gs?.transactions ?? 0),
            turnover: Number(gs?.turnover ?? 0),
            totalParticipants: Number(gs?.members ?? 0),
            totalContractBalance: 0,
            activeLevelsCount: 16,
            gameStartDate: 'Unknown',
            dailyNewPlayers: 0,
            dailyVolumeChange: 0,
          });
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load contract info:', err);
    }
  }, []);

  // Load contract info when wallet is connected
  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      loadContractInfo(walletState.address);
    }
  }, [walletState.isConnected, walletState.address, loadContractInfo]);

  // Switch to BSC network
  const switchToBSC = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return false;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_NETWORK.chainId }],
      });
      toast.success('Switched to BNB Smart Chain');
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_NETWORK],
          });
          toast.success('BNB Smart Chain added and selected');
          return true;
        } catch (addError) {
          console.error('Failed to add BSC network:', addError);
          toast.error('Failed to add BNB Smart Chain. Please add/select it in your wallet.');
          return false;
        }
      } else {
        console.error('Failed to switch to BSC:', switchError);
        toast.error('Please switch your wallet to BNB Smart Chain (BSC).');
        return false;
      }
    }
  }, [getProvider]);

  // Check if user is registered in contract
  const isUserRegistered = useCallback(
    async (address?: string) => {
      const userAddress = address || walletState.address;
      if (!userAddress) return false;
      try {
        const contract: any = await getQpcContract(false);
        return await contract.isUserRegistered(userAddress);
      } catch (error) {
        console.error('Error checking user registration:', error);
        return false;
      }
    },
    [walletState.address]
  );

  // Register user in contract
  const registerUser = useCallback(
    async (_referrerAddress?: string) => {
      const provider = getProvider();
      if (!provider || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // Ensure exact target chain (mainnet 0x38 or testnet 0x61)
      if ((walletState.chainIdHex || '').toLowerCase() !== BSC_NETWORK.chainId.toLowerCase()) {
        const switched = await switchToBSC();
        if (!switched) {
          toast.error('Please switch to BNB Smart Chain (BSC)');
          throw new Error('Please switch to BSC network');
        }
      }

      try {
        setIsLoading(true);
        const contract: any = await getQpcContract(true);
        const price = await contract.REGISTRATION_PRICE();
        const tx = await (_referrerAddress
          ? contract.registerWithReferrer(_referrerAddress, { value: price })
          : contract.register({ value: price }));
        await tx.wait();
        await loadContractInfo(walletState.address);
        toast.success('Registration confirmed');
      } catch (err: any) {
        // Handle user rejection gracefully
        if (
          err.code === 'ACTION_REJECTED' ||
          err.message?.includes('User denied') ||
          err.message?.includes('user rejected')
        ) {
          setError('Registration was cancelled');
          toast.error('Registration cancelled');
        } else {
          setError(err.message || 'Registration failed');
          toast.error(err?.message || 'Registration failed');
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getProvider, walletState.address, walletState.network, switchToBSC, loadContractInfo]
  );

  const buyLevel = useCallback(
    async (level: number, valueBnb: number) => {
      const provider = getProvider();
      if (!provider || !walletState.address) throw new Error('Wallet not connected');
      // Ensure exact target chain (mainnet 0x38 or testnet 0x61)
      if ((walletState.chainIdHex || '').toLowerCase() !== BSC_NETWORK.chainId.toLowerCase()) {
        const switched = await switchToBSC();
        if (!switched) {
          toast.error('Please switch to BNB Smart Chain (BSC)');
          throw new Error('Please switch to BSC network');
        }
      }
      // Ensure user is registered before attempting level purchase
      const registered = await isUserRegistered();
      if (!registered) {
        toast.error('Not registered. Please register before buying a level.');
        throw new Error('Not registered: please register before buying a level');
      }
      setIsLoading(true);

      // Check balance before transaction
      if (walletState.balance < valueBnb) {
        setIsLoading(false);
        const insufficientError = new Error('Insufficient funds');
        (insufficientError as any).code = 'INSUFFICIENT_FUNDS';
        throw insufficientError;
      }
      try {
        const contract: any = await getQpcContract(true);
        const tx = await contract.buyLevel(level, { value: parseEther(String(valueBnb)) });
        await tx.wait();
        // Refresh on-chain user info and levels after successful purchase
        if (walletState.address) {
          await loadContractInfo(walletState.address);
        }
        toast.success(`Level ${level} activated`);
      } catch (err: any) {
        console.error('Buy level error:', err);
        
        // Handle specific error types
        if (
          err.code === 'ACTION_REJECTED' ||
          err.message?.includes('User denied') ||
          err.message?.includes('user rejected')
        ) {
          setError('Transaction was cancelled');
          toast.error('Transaction cancelled');
        } else if (
          err.code === 'INSUFFICIENT_FUNDS' ||
          err.message?.includes('insufficient funds') ||
          err.message?.includes('insufficient balance') ||
          err.reason?.includes('insufficient funds')
        ) {
          setError('Insufficient funds to activate this level');
          // Don't show toast here - let ProgramViewPage handle it with custom toast
        } else if (
          err.message?.includes('Invalid BNB amount') ||
          err.message?.includes('Incorrect BNB amount')
        ) {
          setError('Incorrect amount sent');
          toast.error(`Incorrect amount! Level ${level} requires exactly ${valueBnb} BNB`);
        } else if (err.message?.includes('Already active')) {
          setError('Level already activated');
          toast.error(`Level ${level} is already activated`);
        } else {
          const errorMsg = err?.reason || err?.message || 'Activation failed';
          setError(errorMsg);
          toast.error(errorMsg);
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      getProvider,
      walletState.address,
      walletState.network,
      switchToBSC,
      isUserRegistered,
      loadContractInfo,
    ]
  );

  // Get today's statistics from contract events
  const getTodayStats = useCallback(async (): Promise<{
    todayEarnings: number;
    todayReferrals: number;
    todayActivations: number;
  }> => {
    const contract: any = await getQpcContract(false);
    const address = walletState.address;

    if (!contract || !address) return { todayEarnings: 0, todayReferrals: 0, todayActivations: 0 };

    try {
      const now = Math.floor(Date.now() / 1000);
      const oneDayAgo = now - 24 * 60 * 60; // 24 hours ago
      const blockNumber = await contract.provider?.getBlockNumber();
      if (!blockNumber) return { todayEarnings: 0, todayReferrals: 0, todayActivations: 0 };

      // Estimate blocks per day (BSC has ~3 second blocks)
      const blocksPerDay = Math.floor((24 * 60 * 60) / 3);
      const fromBlock = Math.max(0, blockNumber - blocksPerDay);

      let todayEarnings = 0;
      let todayReferrals = 0;
      let todayActivations = 0;

      // Get LevelPayout events for today's earnings
      try {
        const payoutFilter = contract.filters.LevelPayout(address);
        const payoutEvents = await contract.queryFilter(payoutFilter, fromBlock, blockNumber);

        for (const event of payoutEvents) {
          const block = await contract.provider?.getBlock(event.blockNumber);
          if (block && block.timestamp >= oneDayAgo) {
            todayEarnings += Number(event.args?.rewardValue || 0) / 1e18;
          }
        }
      } catch (error) {
        console.log('Error fetching payout events:', error);
      }

      // Get ReferralPayout events for today's referral earnings
      try {
        const referralFilter = contract.filters.ReferralPayout(address);
        const referralEvents = await contract.queryFilter(referralFilter, fromBlock, blockNumber);

        for (const event of referralEvents) {
          const block = await contract.provider?.getBlock(event.blockNumber);
          if (block && block.timestamp >= oneDayAgo) {
            todayEarnings += Number(event.args?.rewardValue || 0) / 1e18;
          }
        }
      } catch (error) {
        console.log('Error fetching referral events:', error);
      }

      // Get BuyLevel events for today's activations
      try {
        // Try to get all BuyLevel events first, then filter by address
        const buyLevelFilter = contract.filters.BuyLevel();
        const buyLevelEvents = await contract.queryFilter(buyLevelFilter, fromBlock, blockNumber);

        // Filter events for this specific address
        const userBuyLevelEvents = buyLevelEvents.filter(
          (event: any) => event.args && event.args[0] && event.args[0].toString() === address
        );

        console.log('Total BuyLevel events found:', buyLevelEvents.length);
        console.log('User BuyLevel events found:', userBuyLevelEvents.length);
        console.log('From block:', fromBlock, 'To block:', blockNumber);
        console.log('One day ago timestamp:', oneDayAgo);

        for (const event of userBuyLevelEvents) {
          const block = await contract.provider?.getBlock(event.blockNumber);
          console.log('Event block:', event.blockNumber, 'Block timestamp:', block?.timestamp);
          if (block && block.timestamp >= oneDayAgo) {
            todayActivations++;
            console.log('Today activation found! Total:', todayActivations);
          }
        }
      } catch (error) {
        console.log('Error fetching buy level events:', error);
      }

      // Get UserRegistration events for today's referrals
      try {
        const registrationFilter = contract.filters.UserRegistration(null, null, address);
        const registrationEvents = await contract.queryFilter(
          registrationFilter,
          fromBlock,
          blockNumber
        );

        for (const event of registrationEvents) {
          const block = await contract.provider?.getBlock(event.blockNumber);
          if (block && block.timestamp >= oneDayAgo) {
            todayReferrals++;
          }
        }
      } catch (error) {
        console.log('Error fetching registration events:', error);
      }

      console.log('Today stats result:', { todayEarnings, todayReferrals, todayActivations });
      return { todayEarnings, todayReferrals, todayActivations };
    } catch (error) {
      console.log('Error getting today stats:', error);
      return { todayEarnings: 0, todayReferrals: 0, todayActivations: 0 };
    }
  }, [walletState.address]);

  // Get global game statistics with daily changes
  const getGlobalStats = useCallback(async (): Promise<{
    totalParticipants: number;
    totalContractBalance: number;
    activeLevelsCount: number;
    gameStartDate: string;
    dailyNewPlayers: number;
    dailyVolumeChange: number;
  }> => {
    try {
      const contract: any = await getQpcContract(false);
      if (!contract)
        return {
          totalParticipants: 0,
          totalContractBalance: 0,
          activeLevelsCount: 0,
          gameStartDate: 'Unknown',
          dailyNewPlayers: 0,
          dailyVolumeChange: 0,
        };

      // Get total participants from global stats
      let totalParticipants = 0;
      try {
        if (typeof contract.getGlobalStats === 'function') {
          const stats = await contract.getGlobalStats();
          totalParticipants = Number(stats[0] || 0); // members is first returned value
          console.log('Global stats:', stats);
        }
      } catch (error) {
        console.log('Error fetching global stats:', error);
      }

      // Get contract balance or calculate total volume from activations
      let totalContractBalance = 0;
      try {
        if (typeof contract.getContractBalance === 'function') {
          const balance = await contract.getContractBalance();
          totalContractBalance = Number(balance || 0) / 1e18;
          console.log('Contract balance raw:', balance);
          console.log('Contract balance parsed:', totalContractBalance);
        } else {
          console.log('getContractBalance method not found on contract');
        }
      } catch (error) {
        console.log('Error fetching contract balance:', error);
      }

      // If contract balance is 0 (typical for test networks), calculate total volume from level prices and participants
      if (totalContractBalance === 0 && totalParticipants > 0) {
        // Estimate total volume: participants * average level cost (rough calculation)
        // Level 1 = 0.1, Level 2 = 0.2, etc. Average of first few levels
        const estimatedVolume = totalParticipants * 0.15; // Conservative estimate
        totalContractBalance = estimatedVolume;
        console.log(
          'Using estimated volume:',
          estimatedVolume,
          'for',
          totalParticipants,
          'participants'
        );
      }

      // Calculate active levels (levels that have been purchased by anyone)
      let activeLevelsCount = 16; // Assume all levels are available for now

      // Get game start date - use previous working logic
      let gameStartDate = 'January 2025';
      if (contractInfo?.registrationTimestamp) {
        const date = new Date(contractInfo.registrationTimestamp);
        gameStartDate = date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
      }

      // Calculate daily changes
      let dailyNewPlayers = 0;
      let dailyVolumeChange = 0;

      try {
        const blockNumber = await contract.provider?.getBlockNumber();
        if (blockNumber) {
          const now = Math.floor(Date.now() / 1000);
          const oneDayAgo = now - 24 * 60 * 60;
          const blocksPerDay = Math.floor((24 * 60 * 60) / 3); // BSC ~3 sec blocks
          const fromBlock = Math.max(0, blockNumber - blocksPerDay);

          // Count new registrations in last 24 hours
          try {
            const registrationFilter = contract.filters.UserRegistration();
            const registrationEvents = await contract.queryFilter(
              registrationFilter,
              fromBlock,
              blockNumber
            );

            for (const event of registrationEvents) {
              const block = await contract.provider?.getBlock(event.blockNumber);
              if (block && block.timestamp >= oneDayAgo) {
                dailyNewPlayers++;
              }
            }
          } catch (error) {
            console.log('Error counting daily registrations:', error);
          }

          // Calculate daily volume from BuyLevel events
          try {
            const buyLevelFilter = contract.filters.BuyLevel();
            const buyLevelEvents = await contract.queryFilter(
              buyLevelFilter,
              fromBlock,
              blockNumber
            );

            for (const event of buyLevelEvents) {
              const block = await contract.provider?.getBlock(event.blockNumber);
              if (block && block.timestamp >= oneDayAgo) {
                const level = Number(event.args?.level || 0);
                // Level prices: 0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4, 12.8, 25.6, 51.2, 102.4, 204.8, 409.6, 819.2, 1638.4, 3276.8
                const price = 0.1 * Math.pow(2, level - 1);
                dailyVolumeChange += price;
              }
            }
          } catch (error) {
            console.log('Error calculating daily volume:', error);
          }
        }
      } catch (error) {
        console.log('Error calculating daily changes:', error);
      }

      return {
        totalParticipants,
        totalContractBalance,
        activeLevelsCount,
        gameStartDate,
        dailyNewPlayers,
        dailyVolumeChange,
      };
    } catch (error) {
      console.log('Error getting global stats:', error);
      return {
        totalParticipants: 0,
        totalContractBalance: 0,
        activeLevelsCount: 0,
        gameStartDate: 'Unknown',
        dailyNewPlayers: 0,
        dailyVolumeChange: 0,
      };
    }
  }, [contractInfo]);

  return {
    walletState,
    isLoading,
    error,
    contractInfo,
    globalStats,
    userLevels,
    connectWallet,
    connectWalletConnectWallet,
    disconnectWallet,
    updateBalance,
    switchToBSC,
    isUserRegistered,
    registerUser,
    buyLevel,
    loadContractInfo,
    isWalletAvailable: isWalletAvailable(),
    BSC_NETWORK,
    getTodayStats,
    getGlobalStats,
    walletProvider,
    isWalletConnectSupported: isWalletConnectSupported(),
  };
};
