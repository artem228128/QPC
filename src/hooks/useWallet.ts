import { useState, useEffect, useCallback } from 'react';
import { WalletState, NetworkConfig, ContractUserInfo, ContractGlobalStats, ContractUserLevelsData } from '../types';
import { Web3Provider } from '../types/web3';
import { parseEther } from 'ethers';
import { toast } from 'react-hot-toast';
import { ACTIVE_NETWORK, getQpcContract } from '../utils/contract';

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

  // Load contract user info from-chain
  const loadContractInfo = useCallback(
    async (address: string) => {
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
              referralPayoutSum: Array.from(lv?.referralPayoutSum ?? []).map((v: any) => Number(v) / 1e18),
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
            });
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load contract info:', err);
      }
    },
    []
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
      } catch {
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
        setError(err.message || 'Registration failed');
        toast.error(err?.message || 'Registration failed');
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
        setError(err?.message || 'Activation failed');
        toast.error(err?.message || 'Activation failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getProvider, walletState.address, walletState.network, switchToBSC, isUserRegistered, loadContractInfo]
  );

  return {
    walletState,
    isLoading,
    error,
    contractInfo,
    globalStats,
    userLevels,
    connectWallet,
    disconnectWallet,
    updateBalance,
    switchToBSC,
    isUserRegistered,
    registerUser,
    buyLevel,
    loadContractInfo,
    isWalletAvailable: isWalletAvailable(),
    BSC_NETWORK,
  };
};
