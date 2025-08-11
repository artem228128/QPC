import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Copy,
  ChevronRight,
  LogOut,
  Check,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react';

// ===========================================
// 🌐 QUANTUM LOGO COMPONENT
// ===========================================

const QuantumLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`flex items-center space-x-3 ${className}`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="neural-logo"
      animate={{
        filter: [
          'drop-shadow(0 0 8px #00D4FF60)',
          'drop-shadow(0 0 16px #00D4FF80)',
          'drop-shadow(0 0 8px #00D4FF60)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="8" cy="8" r="2" fill="#00D4FF" opacity="0.8" />
      <circle cx="32" cy="8" r="2" fill="#7C3AED" opacity="0.8" />
      <circle cx="8" cy="32" r="2" fill="#06FFA5" opacity="0.8" />
      <circle cx="32" cy="32" r="2" fill="#FF6B6B" opacity="0.8" />
      <circle cx="20" cy="20" r="3" fill="#00D4FF" opacity="1" />

      <line x1="8" y1="8" x2="20" y2="20" stroke="#00D4FF" strokeWidth="0.5" opacity="0.6" />
      <line x1="32" y1="8" x2="20" y2="20" stroke="#7C3AED" strokeWidth="0.5" opacity="0.6" />
      <line x1="8" y1="32" x2="20" y2="20" stroke="#06FFA5" strokeWidth="0.5" opacity="0.6" />
      <line x1="32" y1="32" x2="20" y2="20" stroke="#FF6B6B" strokeWidth="0.5" opacity="0.6" />
    </motion.svg>

    <div className="flex flex-col">
      <span className="text-lg font-bold font-heading text-neural-cyan">Quantum</span>
      <span className="text-xs font-mono text-neural-purple opacity-80">Profit Chain</span>
    </div>
  </motion.div>
);

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface AuthHeaderProps {
  className?: string;
  userAddress?: string;
  bnbBalance?: number;
  notifications?: Notification[];
  breadcrumbs?: BreadcrumbItem[];
  onLogout?: () => void;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    label: string;
    href: string;
  };
}

// ===========================================
// 🔗 BSC NETWORK INDICATOR
// ===========================================

const BSCIndicator: React.FC = () => (
  <motion.div
    className="flex items-center space-x-2 glass-panel-secondary px-3 py-2 rounded-lg"
    whileHover={{ scale: 1.02 }}
  >
    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 animate-neural-pulse" />
    <span className="text-sm font-medium text-white">BSC</span>
  </motion.div>
);

// ===========================================
// 💰 WALLET INFO
// ===========================================

const WalletInfo: React.FC<{
  address?: string;
  balance?: number;
}> = ({ address = '0x1234...5678', balance = 0.0 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatAddress = (addr: string) => {
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(bal);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Wallet Address */}
      <motion.button
        className="glass-panel-secondary px-3 py-2 rounded-lg flex items-center space-x-2 hover:glass-panel-neural transition-all duration-200"
        onClick={handleCopy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-mono text-sm text-white">{formatAddress(address)}</span>
        <motion.div animate={{ rotate: copied ? 360 : 0 }} transition={{ duration: 0.3 }}>
          {copied ? (
            <Check size={14} className="text-neural-mint" />
          ) : (
            <Copy size={14} className="text-neural-cyan hover:text-white transition-colors" />
          )}
        </motion.div>
      </motion.button>

      {/* BNB Balance */}
      <div className="glass-panel-secondary px-3 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600" />
          <span className="font-mono text-sm text-white">{formatBalance(balance)} BNB</span>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// 🔔 NOTIFICATIONS DROPDOWN
// ===========================================

const NotificationsDropdown: React.FC<{
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}> = ({ notifications = [], onMarkAsRead = () => {}, onMarkAllAsRead = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = 'w-4 h-4';
    switch (type) {
      case 'success':
        return <Check className={`${iconClass} text-neural-mint`} />;
      case 'error':
        return <ExternalLink className={`${iconClass} text-neural-coral`} />;
      case 'warning':
        return <MoreHorizontal className={`${iconClass} text-yellow-400`} />;
      default:
        return <Bell className={`${iconClass} text-neural-cyan`} />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-neural-coral rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <span className="text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-80 glass-panel-primary rounded-xl border border-white/20 shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-neural-cyan hover:text-white transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No notifications yet</p>
                  <p className="text-sm text-white/40 mt-1">
                    You'll see updates about your activities here
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-neural-cyan/5' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white truncate">
                              {notification.title}
                            </p>
                            <span className="text-xs text-white/60 ml-2">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-white/70 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.action && (
                            <motion.a
                              href={notification.action.href}
                              className="inline-flex items-center space-x-1 text-xs text-neural-cyan hover:text-white transition-colors mt-2"
                              whileHover={{ x: 2 }}
                            >
                              <span>{notification.action.label}</span>
                              <ExternalLink size={12} />
                            </motion.a>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-neural-cyan rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <button className="w-full text-center text-sm text-neural-cyan hover:text-white transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// 🍞 BREADCRUMBS
// ===========================================

const Breadcrumbs: React.FC<{ items?: BreadcrumbItem[] }> = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className="text-white/40" />}
          {item.href && !item.isActive ? (
            <motion.a
              href={item.href}
              className="text-neural-cyan hover:text-white transition-colors"
              whileHover={{ y: -1 }}
            >
              {item.label}
            </motion.a>
          ) : (
            <span className={`${item.isActive ? 'text-white font-medium' : 'text-white/60'}`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ===========================================
// 🔐 MAIN AUTH HEADER COMPONENT
// ===========================================

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  className = '',
  userAddress,
  bnbBalance,
  notifications = [],
  breadcrumbs = [],
  onLogout = () => {},
}) => {
  return (
    <motion.header
      className={`glass-panel-primary border-b border-white/10 sticky top-0 z-30 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Breadcrumbs */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <motion.a href="/dashboard" className="flex-shrink-0" whileHover={{ scale: 1.02 }}>
              <QuantumLogo className="scale-90" />
            </motion.a>

            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Right Side - Network, Wallet, Notifications, Logout */}
          <div className="flex items-center space-x-4">
            {/* BSC Network Indicator */}
            <BSCIndicator />

            {/* Wallet Info */}
            <WalletInfo address={userAddress} balance={bnbBalance} />

            {/* Notifications */}
            <NotificationsDropdown notifications={notifications} />

            {/* Logout Button */}
            <motion.button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-white/10 text-white hover:text-neural-coral transition-colors"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AuthHeader;
