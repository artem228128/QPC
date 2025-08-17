import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Copy,
  ExternalLink,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Activity,
  Shield,
} from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { useNotifications, AppNotification } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { useMobileMenuContext } from '../../contexts/MobileMenuContext';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface ConnectedHeaderProps {
  className?: string;
}

// ===========================================
// 🎮 QUANTUM LOGO COMPONENT (REUSABLE)
// ===========================================

const QuantumLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <motion.button
      className={`flex items-center select-none cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={handleLogoClick}
    >
      <div className="flex flex-col items-start select-none">
        <motion.span
          className="text-2xl lg:text-3xl font-bold font-cyberpunk bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent select-none"
          animate={{
            textShadow: ['0 0 10px #00FFFF60', '0 0 20px #00FFFF80', '0 0 10px #00FFFF60'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          QUANTUM
        </motion.span>
        <span className="text-sm lg:text-base font-terminal text-neon-green opacity-90 tracking-wider select-none">
          PROFIT.CHAIN
        </span>
      </div>
    </motion.button>
  );
};

// ===========================================
// 🔔 NOTIFICATIONS COMPONENT
// ===========================================

const NotificationsButton: React.FC = () => {
  const { notifications, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.notifications-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return undefined;
  }, [isOpen]);

  return (
    <div className="relative notifications-dropdown">
      <motion.button
        className="relative p-3 bg-black/40 border border-blue-400/50 rounded-lg hover:border-blue-400 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-blue-400" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-80 bg-black/90 border border-white/20 rounded-lg shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="p-4">
              <h3 className="text-white font-bold mb-4">Notifications</h3>
              <div className="max-h-40 overflow-y-auto space-y-3 pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#3b82f6 #1f2937'
              }}>
                {notifications.length === 0 ? (
                  <div className="text-center text-gray-400 py-4">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-500/10 border border-green-400/20' :
                        notification.type === 'error' ? 'bg-red-500/10 border border-red-400/20' :
                        notification.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-400/20' :
                        'bg-blue-500/10 border border-blue-400/20'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        notification.type === 'success' ? 'text-green-400' :
                        notification.type === 'error' ? 'text-red-400' :
                        notification.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {notification.title}
                      </div>
                      <div className="text-gray-300 text-xs">
                        {notification.message}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {(() => {
                          const now = new Date();
                          const diff = now.getTime() - notification.timestamp.getTime();
                          const minutes = Math.floor(diff / (1000 * 60));
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          
                          if (minutes < 1) return 'Just now';
                          if (minutes < 60) return `${minutes}m ago`;
                          if (hours < 24) return `${hours}h ago`;
                          return notification.timestamp.toLocaleDateString();
                        })()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// 📱 MOBILE MENU BUTTON COMPONENT
// ===========================================

const MobileMenuButton: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenuContext();

  return (
    <motion.button
      className="md:hidden p-3 bg-black/40 border border-cyan-400/50 rounded-lg hover:border-cyan-400 transition-all duration-200"
      onClick={toggleMobileMenu}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Menu"
    >
      {isMobileMenuOpen ? (
        <X className="w-5 h-5 text-cyan-400" />
      ) : (
        <Menu className="w-5 h-5 text-cyan-400" />
      )}
    </motion.button>
  );
};

// ===========================================
// 🚪 LOGOUT COMPONENT
// ===========================================

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you would typically clear wallet connection, user data, etc.
    // For now, just navigate to home
    navigate('/');
  };

  return (
    <motion.button
      className="p-3 bg-black/40 border border-red-400/50 rounded-lg hover:border-red-400 transition-all duration-200 group"
      onClick={handleLogout}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Logout"
    >
      <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
    </motion.button>
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
        className="flex items-center space-x-2 md:space-x-3 bg-black/40 border border-green-400/50 rounded-lg px-2 md:px-4 py-2 hover:border-green-400 transition-all duration-200"
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
        <div className="hidden lg:flex items-center space-x-1 bg-white/10 rounded-full px-2 py-1">
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
      {/* Full width container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <QuantumLogo />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Mobile Menu Button */}
            <MobileMenuButton />

            {/* Notifications */}
            <NotificationsButton />

            {/* Wallet Info - Compact */}
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
