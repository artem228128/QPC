import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader, ConnectedHeader } from '../components/layout';
import {
  HeroSection,
  StatsPanel,
  LiveActivationsTable,
  GameInfoSections,
  FAQSection,
} from '../components/landing';
import { AccountLookup } from '../components/landing/AccountLookup';
import { useWallet } from '../hooks/useWallet';
// Removed unused toast import

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState } = useWallet();

  const handleConnectWallet = useCallback(() => {
    navigate('/wallet');
  }, [navigate]);

  const handleStartGame = useCallback(async () => {
    // If wallet connected, go to activation page first
    navigate('/activate');
  }, [navigate]);

  const handleHelpMe = useCallback(() => {
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Dynamic Header based on wallet connection */}
      {walletState.isConnected ? <ConnectedHeader /> : <LandingHeader />}

      {/* Hero Section */}
      <HeroSection
        onStartGame={walletState.isConnected ? handleStartGame : handleConnectWallet}
        onEnterWithReferral={handleHelpMe}
        isWalletConnected={walletState.isConnected}
      />

      {/* Stats Panel */}
      <StatsPanel />

      {/* Game Information Sections */}
      <GameInfoSections />

      {/* Account Lookup */}
      <AccountLookup />

      {/* Live Activations Table */}
      <LiveActivationsTable />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;
