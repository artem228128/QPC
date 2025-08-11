import React from 'react';
import { GlassCard, GlassButton } from '../glass';

interface HeaderProps {
  isWalletConnected?: boolean;
  walletAddress?: string;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isWalletConnected = false,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">Quantum Profit Chain</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#game" className="glass-nav-item">
              Game
            </a>
            <a href="#levels" className="glass-nav-item">
              Levels
            </a>
            <a href="#statistics" className="glass-nav-item">
              Statistics
            </a>
            <a href="#referrals" className="glass-nav-item">
              Referrals
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isWalletConnected ? (
              <div className="flex items-center space-x-2">
                <GlassCard className="px-3 py-2">
                  <span className="text-sm text-cyan-400">
                    {walletAddress ? truncateAddress(walletAddress) : 'Connected'}
                  </span>
                </GlassCard>
                <GlassButton variant="secondary" size="sm" onClick={onDisconnectWallet}>
                  Disconnect
                </GlassButton>
              </div>
            ) : (
              <GlassButton variant="primary" size="md" glow onClick={onConnectWallet}>
                Connect Wallet
              </GlassButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
