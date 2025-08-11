import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Wallet, Copy, ExternalLink, Shield, Activity } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface ConnectedHeaderProps {
  className?: string;
}

// ===========================================
// 🎮 QUANTUM LOGO COMPONENT (REUSABLE)
// ===========================================

const QuantumLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`flex items-center space-x-4 ${className}`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div className="relative">
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        animate={{
          filter: [
            'drop-shadow(0 0 15px #00FFFF80) drop-shadow(0 0 30px #FF00FF40)',
            'drop-shadow(0 0 25px #00FFFF60) drop-shadow(0 0 40px #FF00FF60)',
            'drop-shadow(0 0 15px #00FFFF80) drop-shadow(0 0 30px #FF00FF40)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Main Hexagon */}
        <path
          d="M24 2L36 10V26L24 34L12 26V10L24 2Z"
          fill="none"
          stroke="url(#hexGradient)"
          strokeWidth="2"
        />

        {/* Inner Matrix */}
        <path d="M24 8L32 12V24L24 28L16 24V12L24 8Z" fill="url(#matrixGradient)" opacity="0.6" />

        {/* Center Core */}
        <circle cx="24" cy="18" r="6" fill="url(#coreGradient)" />

        {/* Gaming UI Elements */}
        <rect x="10" y="6" width="4" height="1" fill="#00FFFF" opacity="0.8" />
        <rect x="34" y="6" width="4" height="1" fill="#FF00FF" opacity="0.8" />
        <rect x="10" y="40" width="4" height="1" fill="#00FF00" opacity="0.8" />
        <rect x="34" y="40" width="4" height="1" fill="#FFFF00" opacity="0.8" />

        {/* Scanlines */}
        <line x1="2" y1="12" x2="46" y2="12" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="24" x2="46" y2="24" stroke="#FF00FF" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="36" x2="46" y2="36" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" />

        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#FF00FF" />
            <stop offset="100%" stopColor="#00FFFF" />
          </linearGradient>
          <radialGradient id="matrixGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </radialGradient>
        </defs>
      </motion.svg>
    </motion.div>

    <div className="flex flex-col">
      <motion.span
        className="text-2xl font-bold font-cyberpunk bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent"
        animate={{
          textShadow: ['0 0 10px #00FFFF60', '0 0 20px #00FFFF80', '0 0 10px #00FFFF60'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        QUANTUM
      </motion.span>
      <span className="text-sm font-terminal text-neon-green opacity-90 tracking-wider">
        PROFIT.CHAIN
      </span>
    </div>
  </motion.div>
);

// ===========================================
// 🌍 LANGUAGE SELECTOR
// ===========================================

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English', flag: '🇺🇸' },
    { code: 'RU', label: 'Русский', flag: '🇷🇺' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'ZH', label: '中文', flag: '🇨🇳' },
  ];

  return (
    <div className="relative">
      <motion.button
        className="glass-panel-secondary px-3 py-2 rounded-lg flex items-center space-x-2 text-sm hover:glass-panel-neural transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe size={16} className="text-neural-cyan" />
        <span className="text-white font-medium">{selectedLang}</span>
        <ChevronDown
          size={14}
          className={`text-neural-cyan transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-40 glass-panel-primary rounded-lg border border-white/20 shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                onClick={() => {
                  setSelectedLang(lang.code);
                  setIsOpen(false);
                }}
                whileHover={{ x: 4 }}
              >
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="text-white font-medium text-sm">{lang.code}</div>
                  <div className="text-neural-cyan text-xs opacity-80">{lang.label}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// 💰 WALLET INFO COMPONENT
// ===========================================

const WalletInfo: React.FC = () => {
  const { walletState, contractInfo, updateBalance } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (walletState.address) {
      await navigator.clipboard.writeText(walletState.address);
      // You could add a toast notification here
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get network indicator color
  const getNetworkColor = () => {
    switch (walletState.network) {
      case 'bsc':
        return 'text-yellow-400';
      case 'ethereum':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative">
      <motion.button
        className="flex items-center space-x-3 bg-black/40 border border-green-400/50 rounded-lg px-4 py-2 hover:border-green-400 transition-all duration-200"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Wallet Icon */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>

          {/* Wallet Info */}
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono text-sm">
                {walletState.address ? formatAddress(walletState.address) : '—'}
              </span>
              <div className={`w-2 h-2 rounded-full ${getNetworkColor()} animate-pulse`} />
            </div>
            <div className="text-green-400 text-xs font-mono">
              {walletState.balance.toFixed(4)} BNB
            </div>
          </div>
        </div>

        {/* Provider Badge */}
        <div className="hidden md:flex items-center space-x-1 bg-white/10 rounded-full px-2 py-1">
          <span className="text-xs text-gray-300">{walletState.provider}</span>
        </div>

        <ChevronDown
          size={16}
          className={`text-green-400 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-80 bg-black/90 border border-white/20 rounded-lg shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Wallet Connected</div>
                    <div className="text-gray-400 text-sm">{walletState.provider}</div>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getNetworkColor()} animate-pulse`} />
              </div>
            </div>

            {/* Wallet Details */}
            <div className="p-4 space-y-4">
              {/* Address */}
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Address</div>
                  <div className="text-white font-mono text-sm">
                    {walletState.address ? formatAddress(walletState.address) : '—'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    title="Copy Address"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() =>
                      window.open(`https://bscscan.com/address/${walletState.address}`, '_blank')
                    }
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    title="View on BscScan"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Balance</div>
                  <div className="text-green-400 font-mono text-lg font-bold">
                    {walletState.balance.toFixed(4)} BNB
                  </div>
                </div>
                <button
                  onClick={updateBalance}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  title="Refresh Balance"
                >
                  <Activity className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Network */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">Network</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getNetworkColor()} animate-pulse`} />
                  <span className="text-white font-medium">
                    {walletState.network === 'bsc'
                      ? 'BNB Smart Chain'
                      : walletState.network?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Contract Status */}
              {contractInfo && (
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                    Game Status
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Registered</span>
                    <span className="text-gray-400 text-sm">ID: #{contractInfo.id}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// 🏠 MAIN CONNECTED HEADER COMPONENT
// ===========================================

export const ConnectedHeader: React.FC<ConnectedHeaderProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-30 ${className}`}
      style={{
        background: isScrolled
          ? 'linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(20, 0, 40, 0.95))'
          : 'linear-gradient(135deg, rgba(0, 20, 40, 0.8), rgba(20, 0, 40, 0.8))',
        backdropFilter: 'blur(15px)',
        borderBottom: isScrolled
          ? '1px solid rgba(0, 255, 255, 0.4)'
          : '1px solid rgba(0, 255, 255, 0.2)',
        boxShadow: isScrolled
          ? '0 4px 32px rgba(0, 255, 255, 0.2)'
          : '0 2px 20px rgba(0, 0, 0, 0.3)',
      }}
      animate={{
        y: isScrolled ? 0 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Compact for mobile */}
          <div className="flex-shrink-0">
            <QuantumLogo className="scale-75 sm:scale-100" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Language Selector - Hidden on very small screens */}
            <div className="hidden xs:block">
              <LanguageSelector />
            </div>

            {/* Wallet Info */}
            <WalletInfo />
          </div>
        </div>

        {/* Scanline Effect */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60"
          animate={{
            scaleX: [0, 1, 0],
            x: ['-100%', '0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.header>
  );
};

export default ConnectedHeader;
