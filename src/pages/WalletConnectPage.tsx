import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

// ===========================================
// 🎮 WALLET PROVIDERS CONFIGURATION
// ===========================================

interface WalletProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  downloadUrl?: string;
}

const WALLET_PROVIDERS: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect using browser extension',
    icon: '🦊',
    downloadUrl: 'https://metamask.io/download/',
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    description: 'Secure mobile-first wallet',
    icon: '🛡️',
    downloadUrl: 'https://trustwallet.com/',
  },
  {
    id: 'tokenpocket',
    name: 'TokenPocket',
    description: 'Multi-chain wallet solution',
    icon: '🎯',
    downloadUrl: 'https://www.tokenpocket.pro/',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Scan with WalletConnect',
    icon: '🔗',
  },
];

// BSC Network Configuration
const BSC_NETWORK = {
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

// ===========================================
// 🎮 WALLET CONNECT PAGE
// ===========================================

const WalletConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    connectWallet, 
    connectWalletConnectWallet, 
    walletState, 
    error, 
    isWalletConnectSupported 
  } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectionStep, setConnectionStep] = useState<
    'select' | 'connecting' | 'network-check' | 'success'
  >('select');

  // Check if specific wallet is available
  const isWalletAvailable = useCallback((walletId: string): boolean => {
    if (typeof window === 'undefined') return false;

    switch (walletId) {
      case 'metamask':
        return !!(window as any).ethereum?.isMetaMask;
      case 'trust':
        return !!(window as any).ethereum?.isTrust;
      case 'tokenpocket':
        return !!(window as any).ethereum?.isTokenPocket;
      case 'walletconnect':
        return isWalletConnectSupported;
      default:
        return !!(window as any).ethereum;
    }
  }, [isWalletConnectSupported]);

  // Connect to specific wallet
  const handleWalletConnect = useCallback(
    async (walletId: string) => {
      setSelectedWallet(walletId);
      setConnectionStep('connecting');

      try {
        // Handle WalletConnect
        if (walletId === 'walletconnect') {
          if (!isWalletConnectSupported) {
            throw new Error('WalletConnect is not configured. Please check your setup.');
          }
          
          // Connect via WalletConnect
          const success = await connectWalletConnectWallet();
          if (!success) {
            throw new Error('Failed to connect via WalletConnect');
          }
        } else {
          // Check if wallet is available
          if (!isWalletAvailable(walletId)) {
            // If wallet is not installed, redirect to download
            const provider = WALLET_PROVIDERS.find((p) => p.id === walletId);
            if (provider?.downloadUrl) {
              window.open(provider.downloadUrl, '_blank');
              setConnectionStep('select');
              setSelectedWallet(null);
              return;
            }
            throw new Error(`${provider?.name} is not installed`);
          }

          // Connect regular wallet (MetaMask, etc.)
          await connectWallet();
        }

        setConnectionStep('network-check');

        // Check if we're on BSC network (skip for WalletConnect as it handles this)
        if (walletId !== 'walletconnect') {
          const chainId = await (window as any).ethereum.request({
            method: 'eth_chainId',
          });

          if (chainId !== BSC_NETWORK.chainId) {
            // Try to switch to BSC network
            try {
              await (window as any).ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_NETWORK.chainId }],
              });
            } catch (switchError: any) {
              // If network doesn't exist, add it
              if (switchError.code === 4902) {
                await (window as any).ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [BSC_NETWORK],
                });
              } else {
                throw switchError;
              }
            }
          }
        }

        setConnectionStep('success');

        // Redirect to home page after successful connection
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err: any) {
        console.error('Wallet connection error:', err);
        setConnectionStep('select');
        setSelectedWallet(null);
      }
    },
    [connectWallet, navigate, isWalletAvailable]
  );

  // Render connection steps
  const renderConnectionSteps = (): JSX.Element => {
    if (connectionStep === 'select') {
      return (
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3">
            {WALLET_PROVIDERS.map((provider, index) => {
              const isAvailable = isWalletAvailable(provider.id);

              return (
                <motion.button
                  key={provider.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => handleWalletConnect(provider.id)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{provider.icon}</div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">{provider.name}</h3>
                        <p className="text-gray-400 text-sm">{provider.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isAvailable && provider.downloadUrl && (
                        <div className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                          Install
                        </div>
                      )}
                      {isAvailable && (
                        <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          Ready
                        </div>
                      )}
                      <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-white transition-colors" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-400 bg-black/20 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span>Secure connection via BSC network</span>
            </div>
          </div>
        </motion.div>
      );
    }

    if (connectionStep === 'connecting') {
      return (
        <motion.div
          className="text-center max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Connecting...</h3>
            <p className="text-gray-400 text-sm">
              Confirm the connection in your{' '}
              {WALLET_PROVIDERS.find((p) => p.id === selectedWallet)?.name} wallet
            </p>
          </div>
        </motion.div>
      );
    }

    if (connectionStep === 'network-check') {
      return (
        <motion.div
          className="text-center max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="w-12 h-12 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Checking Network...</h3>
            <p className="text-gray-400 text-sm">Switching to BNB Smart Chain</p>
          </div>
        </motion.div>
      );
    }

    if (connectionStep === 'success') {
      return (
        <motion.div
          className="text-center max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="text-white w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Connected!</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your wallet is now connected to Quantum Profit Chain
            </p>
            <div className="bg-black/20 rounded-lg p-3 text-sm">
              <div className="text-green-400 font-mono">
                {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
              </div>
              <div className="text-gray-400 text-xs mt-1">{walletState.balance.toFixed(4)} BNB</div>
            </div>
            <p className="text-cyan-400 text-sm mt-4">Redirecting...</p>
          </div>
        </motion.div>
      );
    }

    return <div />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="relative pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Choose how you'd like to connect to Quantum Profit Chain.
                <br />
                We support the most popular and secure wallets.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="max-w-md mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Connection Error</span>
                </div>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet Selection */}
        {renderConnectionSteps()}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>BNB Smart Chain</span>
              </div>
              <div className="w-px h-4 bg-gray-600" />
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure Connection</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Need help?{' '}
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPage;
