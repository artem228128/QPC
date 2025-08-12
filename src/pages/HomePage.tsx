import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader, HomeHeader } from '../components/layout';
import {
  HeroSection,
  StatsPanel,
  LiveActivationsTable,
  GameInfoSections,
  FAQSection,
} from '../components/landing';
import { AccountLookup } from '../components/landing/AccountLookup';
import { useWallet } from '../hooks/useWallet';
import { NeuralBackground } from '../components/neural';
// Removed unused toast import

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState } = useWallet();

  const handleConnectWallet = useCallback(() => {
    navigate('/wallet');
  }, [navigate]);

  const handleStartGame = useCallback(async () => {
    // Go to activation page
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
      {walletState.isConnected ? <HomeHeader /> : <LandingHeader />}

      {/* Neural Background */}
      <NeuralBackground intensity={0.8} particleCount={30} />

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
